using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanificacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlanificacionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Planificacion>>> Get()
        {
            return await _context.Planificaciones
                .Include(p => p.OrdenTransporte)
                    .ThenInclude(ot => ot.OrdenDetalle)
                        .ThenInclude(od => od.Producto)
                .Include(p => p.OrdenTransporte)
                    .ThenInclude(ot => ot.Vehiculo)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Planificacion>> Get(long id)
        {
            var item = await _context.Planificaciones.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }
    }
}
