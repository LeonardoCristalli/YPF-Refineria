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

        public OrdenesTransporteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrdenTransporte>>> Get()
        {
            return await _context.OrdenTransportes
                .Include(ot => ot.OrdenDetalle).ThenInclude(od => od.Producto)
                .Include(ot => ot.Vehiculo)
                .Include(ot => ot.Conductor)
                .Include(ot => ot.RazonSocialTransportista)
                .ToListAsync();
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
                    transporte.OrdenDetalle.Orden.FechaInicioPlanificacion = dto.Fecha;
                    // Update PuestoExpedicionRecepcion?
                }

                // 2. Update Detalle
                if (transporte.OrdenDetalle != null)
                {
                    transporte.OrdenDetalle.Id_Producto = dto.Id_Producto;
                    transporte.OrdenDetalle.Id_RazonSocialClienteProveedor = dto.Id_RazonSocialCliente;
                    transporte.OrdenDetalle.Peso = dto.Cantidad;
                }

                // 3. Update Transporte
                transporte.Id_Vehiculo = dto.Id_Vehiculo;
                transporte.Id_Conductor = dto.Id_Conductor;
                transporte.Id_RazonSocialTransportista = dto.Id_RazonSocialTransportista;

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
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // 1. Create Orden
                var orden = new Orden
                {
                    Id_EstadoOrden = 1, // Pendiente
                    Id_TipoOrden = 1, // Recepcion by default for prototype
                    FechaInicioPlanificacion = dto.Fecha,
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
                    Peso = dto.Cantidad, // Total Order weight
                    Id_UnidadMedidaPeso = 1 // KG
                };
                _context.OrdenDetalles.Add(detalle);
                await _context.SaveChangesAsync();

                // 3. Create Transporte
                var transporte = new OrdenTransporte
                {
                    Id_OrdenDetalle = detalle.Id_OrdenDetalle,
                    Id_Vehiculo = dto.Id_Vehiculo,
                    Id_Conductor = dto.Id_Conductor,
                    Id_RazonSocialTransportista = dto.Id_RazonSocialTransportista
                };
                _context.OrdenTransportes.Add(transporte);
                await _context.SaveChangesAsync();

                // 4. Create Planificacion
                var plan = new Planificacion
                {
                    Id_OrdenTransporte = transporte.Id_OrdenTransporte,
                    CantidadPlanificada = dto.Cantidad,
                    CantidadKG = dto.Cantidad
                };
                _context.Planificaciones.Add(plan);
                await _context.SaveChangesAsync();

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

    public class OrdenTransporteCreationDto
    {
        public int Id_Producto { get; set; }
        public int Id_RazonSocialCliente { get; set; }
        public int Id_RazonSocialTransportista { get; set; }
        public int Id_Vehiculo { get; set; }
        public int Id_Conductor { get; set; }
        public decimal Cantidad { get; set; }
        public DateTime Fecha { get; set; }
    }
}
