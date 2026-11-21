using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Hardware;

namespace Backend.Controllers
{
    // Comunicación con básculas y cámaras a través del Device Connector (hoy simulado).
    [Route("api/[controller]")]
    [ApiController]
    public class HardwareController : ControllerBase
    {
        // Valores de los datos de sistema (t_TipoOrden, t_TipoPesada).
        private const byte TipoOrdenDescarga = 2;   // 1 = Orden de Entrega, 2 = Autorización de Descarga
        private const byte PesadaTara = 1;

        private readonly AppDbContext _context;
        private readonly IDeviceConnector _conector;

        public HardwareController(AppDbContext context, IDeviceConnector conector)
        {
            _context = context;
            _conector = conector;
        }

        // GET: api/Hardware/estado  (Estado de Hardware del Panel de Control)
        [HttpGet("estado")]
        public async Task<ActionResult<object>> GetEstado()
        {
            var basculas = await _context.Basculas.AsNoTracking()
                .Where(b => b.Activo).OrderBy(b => b.Id_Bascula).ToListAsync();
            var dispositivos = await _context.DispositivosDetectores.AsNoTracking()
                .Where(d => d.Activo).OrderBy(d => d.Id_DispositivoDetector).ToListAsync();

            return Ok(new
            {
                modo = _conector.Modo,
                basculas = basculas.Select(b => new { b.Id_Bascula, b.Descripcion, b.IP, estado = _conector.EstadoBascula(b) }),
                dispositivos = dispositivos.Select(d => new { d.Id_DispositivoDetector, d.Descripcion, d.IP, estado = _conector.EstadoDispositivo(d) })
            });
        }

        // GET: api/Hardware/basculas/1/peso?idPlanificacion=5&desvioPorc=0
        // Devuelve la lectura de la báscula para el camión de la orden indicada.
        // desvioPorc permite simular una carga distinta de la planificada (para probar la tolerancia).
        [HttpGet("basculas/{idBascula}/peso")]
        public async Task<ActionResult<object>> LeerPeso(int idBascula, [FromQuery] long idPlanificacion, [FromQuery] decimal desvioPorc = 0)
        {
            var bascula = await _context.Basculas.AsNoTracking().FirstOrDefaultAsync(b => b.Id_Bascula == idBascula && b.Activo);
            if (bascula == null) return NotFound("La báscula no existe o está dada de baja.");

            var estado = _conector.EstadoBascula(bascula);
            if (estado != EstadoEquipo.Online)
                return BadRequest($"La báscula \"{bascula.Descripcion}\" no está operativa ({estado}). Use otra báscula o ingreso manual.");

            var planificacion = await _context.Planificaciones.AsNoTracking()
                .Include(p => p.OrdenTransporte).ThenInclude(ot => ot!.Vehiculo)
                .Include(p => p.OrdenTransporte).ThenInclude(ot => ot!.OrdenDetalle).ThenInclude(od => od!.Orden)
                .FirstOrDefaultAsync(p => p.Id_Planificacion == idPlanificacion);
            if (planificacion?.OrdenTransporte?.Vehiculo == null)
                return BadRequest("Seleccione una orden de transporte válida para leer la báscula.");

            var tipoOrden = planificacion.OrdenTransporte.OrdenDetalle?.Orden?.Id_TipoOrden;
            var cargaKg = planificacion.CantidadKG * (1 + desvioPorc / 100m);
            var taraVehiculo = planificacion.OrdenTransporte.Vehiculo.PesoSinCargas;

            var previas = await _context.Pesadas.AsNoTracking()
                .Where(p => p.Id_Planificacion == idPlanificacion).ToListAsync();
            if (previas.Count >= 2)
                return BadRequest("La orden ya tiene sus pesadas completas (TARA y BRUTO).");

            decimal esperado, ruido;
            if (previas.Count == 0)
            {
                // Primera pesada: en una descarga el camión entra cargado; en una entrega, vacío.
                esperado = tipoOrden == TipoOrdenDescarga ? taraVehiculo + cargaKg : taraVehiculo;
                ruido = 10m;
            }
            else
            {
                // Segunda pesada: parte de la primera, y suma o resta la carga.
                var previa = previas[0];
                esperado = previa.Id_TipoPesada == PesadaTara ? previa.Cantidad + cargaKg : previa.Cantidad - cargaKg;
                // Ruido chico respecto de la carga, para que el neto quede dentro de la tolerancia del producto.
                ruido = Math.Max(1m, planificacion.CantidadKG * 0.0005m);
            }

            var lectura = await _conector.LeerPesoAsync(bascula, esperado, ruido);
            return Ok(new { pesoKg = lectura.PesoKg, estable = lectura.Estable, fecha = lectura.Fecha, origen = lectura.Origen, modo = _conector.Modo });
        }

        // POST: api/Hardware/dispositivos/1/detectar
        // La cámara "ve" un camión con una orden pendiente de pesaje.
        [HttpPost("dispositivos/{idDispositivo}/detectar")]
        public async Task<ActionResult<object>> DetectarPatente(int idDispositivo)
        {
            var dispositivo = await _context.DispositivosDetectores.AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id_DispositivoDetector == idDispositivo && d.Activo);
            if (dispositivo == null) return NotFound("El dispositivo no existe o está dado de baja.");

            var pendientes = await _context.Planificaciones.AsNoTracking()
                .Include(p => p.OrdenTransporte).ThenInclude(ot => ot!.Vehiculo)
                .Where(p => p.OrdenTransporte!.Activo
                    && p.OrdenTransporte.OrdenDetalle!.Orden!.Activo
                    && _context.Pesadas.Count(x => x.Id_Planificacion == p.Id_Planificacion) < 2)
                .OrderBy(p => p.OrdenTransporte!.FechaPlanificacion)
                .Take(3)
                .ToListAsync();

            if (pendientes.Count == 0)
                return NotFound("No hay camiones con órdenes pendientes de pesaje.");

            // Entre los primeros pendientes, la cámara detecta uno cualquiera.
            var elegido = pendientes[Random.Shared.Next(pendientes.Count)];
            var patente = elegido.OrdenTransporte!.Vehiculo!.PatenteChasis;

            var deteccion = await _conector.DetectarPatenteAsync(dispositivo, patente);
            return Ok(new
            {
                patente = deteccion.Patente,
                confianza = deteccion.Confianza,
                fecha = deteccion.Fecha,
                origen = deteccion.Origen,
                modo = _conector.Modo,
                elegido.Id_OrdenTransporte
            });
        }
    }
}