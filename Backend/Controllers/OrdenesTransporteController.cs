using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenesTransporteController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Ids fijos cargados por los scripts sysdata del proyecto Database.
        private const byte EstadoOrdenBorrador = 1;
        private const byte TipoOrdenEntrega = 1;
        private const byte TipoOrdenDescarga = 2;   // t_TipoOrden: 1 = Orden de Entrega, 2 = Autorización de Descarga
        private const byte UnidadKilos = 1;
        private const byte UnidadLitros = 3;

        public OrdenesTransporteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrdenTransporte>>> Get()
        {
            return await _context.OrdenTransportes
                .Include(ot => ot.OrdenDetalle).ThenInclude(od => od.Producto)
                .Include(ot => ot.OrdenDetalle).ThenInclude(od => od.Orden)
                .Include(ot => ot.Vehiculo)
                .Include(ot => ot.Conductor)
                .Include(ot => ot.RazonSocialTransportista)
                .ToListAsync();
        }

        [HttpGet("ByPatente/{patente}")]
        public async Task<ActionResult<OrdenTransporte>> GetByPatente(string patente)
        {
            var item = await _context.OrdenTransportes
                .Include(ot => ot.OrdenDetalle).ThenInclude(od => od.Producto)
                .Include(ot => ot.OrdenDetalle).ThenInclude(od => od.Orden)
                .Include(ot => ot.Vehiculo)
                .Include(ot => ot.Conductor)
                .Include(ot => ot.RazonSocialTransportista)
                .Where(ot => ot.Activo && ot.Vehiculo != null && ot.Vehiculo.PatenteChasis.ToUpper() == patente.ToUpper())
                .FirstOrDefaultAsync();

            if (item == null)
                return NotFound(new { message = "No se encontró ninguna orden activa para la patente indicada." });

            return item;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrdenTransporte>> Get(long id)
        {
            var item = await _context.OrdenTransportes.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(long id, OrdenTransporteCreationDto dto)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var transporte = await _context.OrdenTransportes
                    .Include(t => t.OrdenDetalle)
                    .ThenInclude(d => d.Orden)
                    .FirstOrDefaultAsync(t => t.Id_OrdenTransporte == id);

                if (transporte == null) return NotFound();

                // 1. Update Orden
                if (transporte.OrdenDetalle?.Orden != null)
                {
                    transporte.OrdenDetalle.Orden.FechaPlanificacion = dto.Fecha;
                }

                // 2. Update Detalle
                if (transporte.OrdenDetalle != null)
                {
                    transporte.OrdenDetalle.Id_Producto = dto.Id_Producto;
                    transporte.OrdenDetalle.Id_RazonSocialClienteProveedor = dto.Id_RazonSocialCliente;
                    transporte.OrdenDetalle.NroRemito = dto.NroRemito;
                    transporte.OrdenDetalle.Peso = dto.Cantidad;
                }

                // 3. Update Transporte
                transporte.Id_Vehiculo = dto.Id_Vehiculo;
                transporte.Id_Conductor = dto.Id_Conductor;
                transporte.Id_RazonSocialTransportista = dto.Id_RazonSocialTransportista;
                transporte.FechaPlanificacion = dto.Fecha;

                // 4. Update Planificacion
                var plan = await _context.Planificaciones.FirstOrDefaultAsync(p => p.Id_OrdenTransporte == id);
                if (plan != null)
                {
                    plan.CantidadPlanificada = dto.Cantidad;
                    plan.CantidadKG = dto.Cantidad;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error updating order: {ex.Message}");
            }
        }

        // Libera el volumen reservado en el tanque cuando una descarga abierta se cancela o elimina.
        // No hace nada si la orden ya está cerrada o cancelada (el volumen ya fue consumido o liberado).
        private async Task LiberarTanqueAsync(OrdenDetalle? detalle)
        {
            if (detalle?.Orden == null || !detalle.Orden.Activo || detalle.Orden.Id_TipoOrden != TipoOrdenDescarga)
                return;

            var vinculos = await _context.TanqueAlmacenamientos
                .Where(ta => ta.Id_OrdenDetalle == detalle.Id_OrdenDetalle)
                .ToListAsync();

            foreach (var vinculo in vinculos)
            {
                var tanque = await _context.Tanques.FindAsync(vinculo.Id_Tanque);
                if (tanque != null)
                {
                    tanque.VolumenOcupado = Math.Max(0, tanque.VolumenOcupado - vinculo.Volumen);
                }
            }
        }

        [HttpPatch("{id}/cancelar")]
        public async Task<IActionResult> Cancelar(long id, [FromBody] CancelarOrdenDto dto)
        {
            var transporte = await _context.OrdenTransportes
                .Include(t => t.OrdenDetalle)
                .ThenInclude(d => d.Orden)
                .FirstOrDefaultAsync(t => t.Id_OrdenTransporte == id);

            if (transporte == null) return NotFound();

            if (transporte.Activo == false)
                return BadRequest("La orden ya está cancelada.");

            if (transporte.OrdenDetalle?.Orden?.FechaCierre != null)
                return BadRequest("La orden ya fue cerrada con sus pesadas y no puede cancelarse.");

            await LiberarTanqueAsync(transporte.OrdenDetalle);

            if (transporte.OrdenDetalle?.Orden != null)
            {
                transporte.OrdenDetalle.Orden.Activo = false;
                transporte.OrdenDetalle.Orden.FechaAnulacion = DateTime.Now;
                transporte.OrdenDetalle.Orden.MotivoAnulacion = dto.Motivo;
            }

            transporte.Activo = false;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Orden cancelada." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var transporte = await _context.OrdenTransportes
                    .Include(t => t.OrdenDetalle)
                    .ThenInclude(d => d.Orden)
                    .FirstOrDefaultAsync(t => t.Id_OrdenTransporte == id);

                if (transporte == null) return NotFound();

                // 0. Liberar y eliminar el vínculo con el tanque (si no, la baja falla por clave foránea)
                if (transporte.OrdenDetalle != null)
                {
                    await LiberarTanqueAsync(transporte.OrdenDetalle);
                    var vinculosTanque = await _context.TanqueAlmacenamientos
                        .Where(ta => ta.Id_OrdenDetalle == transporte.OrdenDetalle.Id_OrdenDetalle)
                        .ToListAsync();
                    _context.TanqueAlmacenamientos.RemoveRange(vinculosTanque);
                }

                // 1. Delete Planificacion
                var plan = await _context.Planificaciones.FirstOrDefaultAsync(p => p.Id_OrdenTransporte == id);
                if (plan != null) _context.Planificaciones.Remove(plan);

                // 2. Delete Transporte
                _context.OrdenTransportes.Remove(transporte);

                // 3. Delete Detalle
                if (transporte.OrdenDetalle != null)
                {
                    _context.OrdenDetalles.Remove(transporte.OrdenDetalle);

                    // 4. Delete Orden
                    if (transporte.OrdenDetalle.Orden != null)
                    {
                        _context.Ordenes.Remove(transporte.OrdenDetalle.Orden);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error deleting order: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrdenTransporte>> Post(OrdenTransporteCreationDto dto)
        {
            // Flujo provisorio: se rehace en la semana 2 con Autorización de Descarga y Orden de Entrega.
            // Mientras tanto se completan las columnas obligatorias que el formulario no pide con
            // valores por defecto, para que el alta no falle.
            var idPuesto = await _context.Puestos
                .Where(p => p.Activo)
                .OrderBy(p => p.Id_PuestoExpedicionRecepcion)
                .Select(p => (int?)p.Id_PuestoExpedicionRecepcion)
                .FirstOrDefaultAsync();
            if (idPuesto == null)
            {
                return BadRequest("No hay ningún Puesto de Expedición/Recepción activo. Publique la base de datos para cargar el puesto inicial.");
            }

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // 1. Create Orden
                var orden = new Orden
                {
                    Id_EstadoOrden = EstadoOrdenBorrador,
                    Id_TipoOrden = dto.Id_TipoOrden > 0 ? dto.Id_TipoOrden : TipoOrdenEntrega,
                    Id_PuestoExpedicionRecepcion = idPuesto.Value,
                    FechaPlanificacion = dto.Fecha
                };
                _context.Ordenes.Add(orden);
                await _context.SaveChangesAsync();

                // 2. Create Detalle
                var detalle = new OrdenDetalle
                {
                    Id_Orden = orden.Id_Orden,
                    Id_Producto = dto.Id_Producto,
                    Id_RazonSocialClienteProveedor = dto.Id_RazonSocialCliente,
                    NroRemito = dto.NroRemito,
                    Peso = dto.Cantidad, // Total Order weight
                    Id_UnidadMedidaPeso = UnidadKilos,
                    Volumen = 0,
                    Id_UnidadMedidaVolumen = UnidadLitros,
                    EsMovimientoInterno = false
                };
                _context.OrdenDetalles.Add(detalle);
                await _context.SaveChangesAsync();

                // 3. Create Transporte
                var transporte = new OrdenTransporte
                {
                    Id_OrdenDetalle = detalle.Id_OrdenDetalle,
                    Id_Vehiculo = dto.Id_Vehiculo,
                    Id_Conductor = dto.Id_Conductor,
                    Id_RazonSocialTransportista = dto.Id_RazonSocialTransportista,
                    FechaPlanificacion = dto.Fecha
                    // Id_EstadoOrdenTransporte = 1 (Planificacion) por defecto en el modelo
                };
                _context.OrdenTransportes.Add(transporte);
                await _context.SaveChangesAsync();

                // 4. Create Planificacion
                var plan = new Planificacion
                {
                    Id_OrdenTransporte = transporte.Id_OrdenTransporte,
                    NroPosicion = 1,
                    CantidadPlanificada = dto.Cantidad,
                    Id_UnidadMedidaCantidadPlanificada = UnidadKilos,
                    CantidadKG = dto.Cantidad
                };
                _context.Planificaciones.Add(plan);
                await _context.SaveChangesAsync();

                // 5. Vincular Tanque de Almacenamiento si fue seleccionado (CU061)
                // La capacidad del tanque está en litros y la cantidad de la orden en kilos:
                // se convierte con la densidad del producto (kg/L).
                if (dto.Id_Tanque.HasValue && dto.Id_Tanque.Value > 0)
                {
                    var tanque = await _context.Tanques.FindAsync(dto.Id_Tanque.Value);
                    if (tanque == null || !tanque.Activo)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest("El tanque seleccionado no existe o no está activo.");
                    }

                    var producto = await _context.Productos.FindAsync(dto.Id_Producto);
                    if (producto == null || producto.Densidad <= 0)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest("El producto no tiene una densidad válida para calcular el volumen.");
                    }

                    var volumenLitros = Math.Round(dto.Cantidad / producto.Densidad, 2);
                    var esDescarga = orden.Id_TipoOrden == TipoOrdenDescarga;

                    // Validación de capacidad: solo aplica a la recepción (descarga) en el tanque de destino.
                    if (esDescarga)
                    {
                        var disponible = tanque.VolumenMaximo - tanque.VolumenOcupado;
                        if (volumenLitros > disponible)
                        {
                            await transaction.RollbackAsync();
                            return BadRequest($"Capacidad insuficiente en el tanque {tanque.Codigo}: disponible {disponible:N2} L, requerido {volumenLitros:N2} L ({dto.Cantidad:N2} kg).");
                        }
                    }

                    _context.TanqueAlmacenamientos.Add(new TanqueAlmacenamiento
                    {
                        Id_OrdenDetalle = detalle.Id_OrdenDetalle,
                        Id_Tanque = dto.Id_Tanque.Value,
                        Volumen = volumenLitros,
                        Activo = true
                    });

                    // Una descarga reserva volumen en el tanque de destino.
                    if (esDescarga)
                    {
                        tanque.VolumenOcupado += volumenLitros;
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(Get), new { id = transporte.Id_OrdenTransporte }, transporte);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error creating order: {ex.Message}");
            }
        }
    }

    public class CancelarOrdenDto
    {
        public string Motivo { get; set; } = string.Empty;
    }

    public class OrdenTransporteCreationDto
    {
        public int Id_Producto { get; set; }
        public int Id_RazonSocialCliente { get; set; }
        public int Id_RazonSocialTransportista { get; set; }
        public int Id_Vehiculo { get; set; }
        public int Id_Conductor { get; set; }
        public long NroRemito { get; set; }
        public decimal Cantidad { get; set; }
        public DateTime Fecha { get; set; }
        public byte Id_TipoOrden { get; set; }
        public int? Id_Tanque { get; set; }
    }
}