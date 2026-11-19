using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PesadasController : ControllerBase
    {
        // Valores de los datos de sistema (t_TipoOrden, t_TipoPesada, t_EstadoOrdenTransporte).
        private const byte TipoOrdenDescarga = 2;   // 1 = Orden de Entrega, 2 = Autorización de Descarga
        private const byte PesadaTara = 1;
        private const byte PesadaBruto = 2;
        private const byte OtEnEjecucion = 3;
        private const byte OtEjecutado = 5;

        private readonly AppDbContext _context;
        private readonly ILogger<PesadasController> _logger;

        public PesadasController(AppDbContext context, ILogger<PesadasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Pesadas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pesada>>> GetPesadas()
        {
            return await _context.Pesadas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pesada>> GetPesada(long id)
        {
            var pesada = await _context.Pesadas.FindAsync(id);
            if (pesada == null)
            {
                return NotFound();
            }
            return pesada;
        }

        // POST: api/Pesadas
        // CU78: Registrar Pesada de Transporte
        //  - Entrega (despacho): el camión entra vacío (1.ª pesada = TARA) y sale cargado (2.ª = BRUTO).
        //  - Descarga (recepción): el camión entra cargado (1.ª pesada = BRUTO) y sale vacío (2.ª = TARA).
        // Al completarse las dos pesadas se calcula el neto, se valida la tolerancia del producto
        // y se cierra la orden. Si algo no cumple, no se guarda nada.
        [HttpPost]
        public async Task<ActionResult<object>> PostPesada(Pesada pesada)
        {
            if (pesada.Cantidad <= 0)
            {
                return BadRequest("El peso debe ser mayor a cero.");
            }

            // 1. Validar que la Planificacion (Orden de Transporte) exista
            var planificacion = await _context.Planificaciones
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.OrdenDetalle)
                        .ThenInclude(od => od!.Orden)
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.OrdenDetalle)
                        .ThenInclude(od => od!.Producto)
                .FirstOrDefaultAsync(pl => pl.Id_Planificacion == pesada.Id_Planificacion);

            if (planificacion == null)
            {
                return BadRequest("La Planificación (Orden de Transporte) no existe.");
            }

            // 2. Validar que la Orden esté abierta
            var ot = planificacion.OrdenTransporte;
            var orden = ot?.OrdenDetalle?.Orden;
            var producto = ot?.OrdenDetalle?.Producto;
            if (ot == null || orden == null || !orden.Activo || !ot.Activo)
            {
                return BadRequest("La orden no está abierta (ya fue cerrada o cancelada).");
            }

            // 3. Validar pesajes pendientes
            var pesadasPrevias = await _context.Pesadas
                .AsNoTracking()
                .Where(p => p.Id_Planificacion == pesada.Id_Planificacion)
                .ToListAsync();

            if (pesadasPrevias.Count >= 2)
            {
                return BadRequest("La orden ya tiene sus pesadas completas (TARA y BRUTO).");
            }

            // 4. Determinar el tipo de pesada según el tipo de orden
            byte tipo;
            if (pesadasPrevias.Count == 0)
            {
                tipo = orden.Id_TipoOrden == TipoOrdenDescarga ? PesadaBruto : PesadaTara;
            }
            else
            {
                tipo = pesadasPrevias[0].Id_TipoPesada == PesadaTara ? PesadaBruto : PesadaTara;
            }

            // 5. Si es la segunda pesada: calcular neto y validar (antes de guardar nada)
            decimal? pesoNeto = null;
            if (pesadasPrevias.Count == 1)
            {
                var previa = pesadasPrevias[0];
                var pesoTara = tipo == PesadaTara ? pesada.Cantidad : previa.Cantidad;
                var pesoBruto = tipo == PesadaBruto ? pesada.Cantidad : previa.Cantidad;
                pesoNeto = pesoBruto - pesoTara;

                if (pesoNeto <= 0)
                {
                    return BadRequest($"El peso Bruto ({pesoBruto:N2} kg) debe ser mayor que la Tara ({pesoTara:N2} kg).");
                }

                // Regla de tolerancia: el neto debe estar dentro del margen del producto
                // respecto de la cantidad planificada.
                if (producto != null && planificacion.CantidadKG > 0)
                {
                    decimal diferenciaPct = Math.Abs((pesoNeto.Value - planificacion.CantidadKG) / planificacion.CantidadKG * 100m);
                    if (diferenciaPct > producto.ToleranciaPorc)
                    {
                        return BadRequest(
                            $"Peso fuera de tolerancia: neto {pesoNeto.Value:N2} kg contra {planificacion.CantidadKG:N2} kg planificados " +
                            $"(diferencia {diferenciaPct:N2} %, tolerancia del producto {producto.ToleranciaPorc:N2} %). La pesada no fue registrada.");
                    }
                }
            }

            // 6. Registrar la pesada y actualizar el estado de la orden en una única operación
            var ahora = DateTime.Now;
            pesada.Id_Pesada = 0;
            pesada.Id_TipoPesada = tipo;
            pesada.Fecha = ahora;
            _context.Pesadas.Add(pesada);

            if (pesadasPrevias.Count == 0)
            {
                ot.Id_EstadoOrdenTransporte = OtEnEjecucion;
                ot.FechaInicioEjecucion ??= ahora;
            }
            else
            {
                ot.Id_EstadoOrdenTransporte = OtEjecutado;
                ot.FechaFinEjecucion = ahora;
                orden.Activo = false;
                orden.FechaCierre = ahora;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar la pesada de la planificación {Id}", pesada.Id_Planificacion);
                return StatusCode(500, "No se pudo registrar la pesada. Intente nuevamente.");
            }

            if (pesoNeto == null)
            {
                return CreatedAtAction("GetPesada", new { id = pesada.Id_Pesada }, pesada);
            }

            return CreatedAtAction("GetPesada", new { id = pesada.Id_Pesada }, new
            {
                pesada.Id_Pesada,
                pesada.Id_Planificacion,
                pesada.Id_TipoPesada,
                pesada.Fecha,
                pesada.Cantidad,
                pesada.EsIngresoManual,
                pesada.MotivoIngresoManual,
                pesada.Id_Bascula,
                pesoNeto,
                dentroTolerancia = true,
                warning = (string?)null
            });
        }

        [HttpGet("ByPlanificacion/{idPlanificacion}")]
        public async Task<ActionResult<IEnumerable<Pesada>>> GetPesadasByPlanificacion(long idPlanificacion)
        {
            return await _context.Pesadas.Where(p => p.Id_Planificacion == idPlanificacion).ToListAsync();
        }

        [HttpGet("ByOrdenTransporte/{idOrdenTransporte}")]
        public async Task<ActionResult<IEnumerable<Pesada>>> GetPesadasByOrdenTransporte(long idOrdenTransporte)
        {
            // Join via Planificacion
            return await _context.Pesadas
                .Include(p => p.Planificacion)
                .Where(p => p.Planificacion!.Id_OrdenTransporte == idOrdenTransporte)
                .ToListAsync();
        }

        // GET: api/Pesadas/Ticket/{idPlanificacion}
        // CU79: Emitir Ticket de Pesada
        [HttpGet("Ticket/{idPlanificacion}")]
        public async Task<ActionResult<object>> GetTicket(long idPlanificacion)
        {
            var planificacion = await _context.Planificaciones
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.OrdenDetalle)
                        .ThenInclude(od => od!.Producto)
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.OrdenDetalle)
                        .ThenInclude(od => od!.Orden)
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.Vehiculo)
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.Conductor)
                .Include(pl => pl.OrdenTransporte)
                    .ThenInclude(ot => ot!.RazonSocialTransportista)
                .FirstOrDefaultAsync(pl => pl.Id_Planificacion == idPlanificacion);

            if (planificacion == null)
                return NotFound(new { message = "Planificación no encontrada." });

            var pesadas = await _context.Pesadas
                .Where(p => p.Id_Planificacion == idPlanificacion)
                .OrderBy(p => p.Id_TipoPesada)
                .ToListAsync();

            if (pesadas.Count < 2)
                return BadRequest(new { message = "La planificación aún no tiene las dos pesadas completas (TARA y BRUTO)." });

            var tara = pesadas.FirstOrDefault(p => p.Id_TipoPesada == 1);
            var bruto = pesadas.FirstOrDefault(p => p.Id_TipoPesada == 2);
            decimal pesoNeto = (bruto?.Cantidad ?? 0) - (tara?.Cantidad ?? 0);

            var ot = planificacion.OrdenTransporte;
            var producto = ot?.OrdenDetalle?.Producto;
            bool dentroTolerancia = true;
            if (producto != null && planificacion.CantidadKG > 0)
            {
                decimal diferenciaPct = Math.Abs((pesoNeto - planificacion.CantidadKG) / planificacion.CantidadKG * 100m);
                dentroTolerancia = diferenciaPct <= producto.ToleranciaPorc;
            }

            var conductor = ot?.Conductor;
            string conductorNombre = conductor != null
                ? $"{conductor.Apellido}, {conductor.Nombre}"
                : "N/A";

            return Ok(new
            {
                idPlanificacion = planificacion.Id_Planificacion,
                idOrdenTransporte = ot?.Id_OrdenTransporte,
                nroRemito = ot?.OrdenDetalle?.NroRemito,
                producto = producto?.Descripcion ?? "N/A",
                vehiculo = ot?.Vehiculo?.PatenteChasis ?? "N/A",
                conductor = conductorNombre,
                transportista = ot?.RazonSocialTransportista?.Descripcion ?? "N/A",
                pesadaTara = tara == null ? null : new
                {
                    fecha = tara.Fecha,
                    cantidad = tara.Cantidad,
                    bascula = tara.Id_Bascula
                },
                pesadaBruto = bruto == null ? null : new
                {
                    fecha = bruto.Fecha,
                    cantidad = bruto.Cantidad,
                    bascula = bruto.Id_Bascula
                },
                pesoNeto,
                cantidadPlanificada = planificacion.CantidadKG,
                dentroTolerancia,
                fechaEmision = DateTime.Now
            });
        }
    }
}