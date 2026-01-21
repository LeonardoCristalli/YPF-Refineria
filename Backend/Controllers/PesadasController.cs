using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PesadasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PesadasController(AppDbContext context)
        {
            _context = context;
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
        [HttpPost]
        public async Task<ActionResult<Pesada>> PostPesada(Pesada pesada)
        {
            // 1. Validar que la Planificacion (Orden de Transporte) exista
            var planificacion = await _context.Planificaciones.FindAsync(pesada.Id_Planificacion);
            if (planificacion == null)
            {
                return BadRequest("La Planificación (Orden de Transporte) no existe.");
            }

            // 2. Validar que la Orden este en estado valido (Pendiente o En Proceso)
            // Esto requeriria navegar a la Orden desde Planificacion -> OrdenTransporte -> Orden
            // Por simplicidad del prototipo, asumimos que si existe la planificacion, es valida.

            // 3. Determinar el Tipo de Pesada (Tara o Bruto)
            // Si es la primera pesada para esta planificacion, es TARA (entrada). Si es la segunda, es BRUTO/NETO (salida).
            var pesadasPrevias = await _context.Pesadas
                .Where(p => p.Id_Planificacion == pesada.Id_Planificacion)
                .CountAsync();

            if (pesadasPrevias == 0)
            {
                pesada.Id_TipoPesada = 1; // Asumimos 1 = Entrada/Tara
            }
            else
            {
                pesada.Id_TipoPesada = 2; // Asumimos 2 = Salida/Bruto
            }

            // 4. Registrar Fecha Actual
            pesada.Fecha = DateTime.Now;

            // 5. Guardar
            _context.Pesadas.Add(pesada);
            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"EXCEPCION CRITICA: {ex.ToString()}");
            }

            return CreatedAtAction("GetPesada", new { id = pesada.Id_Pesada }, pesada);
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
                .Where(p => p.Planificacion.Id_OrdenTransporte == idOrdenTransporte)
                .ToListAsync();
        }
    }
}
