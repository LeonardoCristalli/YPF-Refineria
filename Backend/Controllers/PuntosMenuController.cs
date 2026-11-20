using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    // Puntos de Menú = casos de uso del sistema (t_CasoDeUso).
    // Según la especificación solo se consultan, ven, modifican y eliminan (CU01 a CU04):
    // los puntos de menú los define el sistema, por eso no hay alta.
    [Route("api/[controller]")]
    [ApiController]
    public class PuntosMenuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PuntosMenuController(AppDbContext context)
        {
            _context = context;
        }

        private static object Proyectar(CasoDeUso c) => new
        {
            c.Id_CasoDeUso,
            c.Descripcion,
            c.Activo
        };

        // GET: api/PuntosMenu  (CU01: Consultar)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPuntosMenu()
        {
            var puntos = await _context.CasosDeUso
                .Where(c => c.Activo)
                .OrderBy(c => c.Id_CasoDeUso)
                .Select(c => new
                {
                    c.Id_CasoDeUso,
                    c.Descripcion,
                    c.Activo
                })
                .ToListAsync();

            return Ok(puntos);
        }

        // GET: api/PuntosMenu/5  (CU02: Ver)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPuntoMenu(int id)
        {
            var punto = await _context.CasosDeUso.FindAsync(id);
            if (punto == null || !punto.Activo) return NotFound();

            return Ok(Proyectar(punto));
        }

        // PUT: api/PuntosMenu/5  (CU03: Modificar)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPuntoMenu(int id, CasoDeUso datos)
        {
            if (id != datos.Id_CasoDeUso)
                return BadRequest("El identificador del punto de menú no coincide.");

            var punto = await _context.CasosDeUso.FirstOrDefaultAsync(c => c.Id_CasoDeUso == id && c.Activo);
            if (punto == null) return NotFound();

            var nombre = (datos.Descripcion ?? "").Trim();

            // RN01: el nombre es obligatorio (la columna admite 250 caracteres)
            if (nombre.Length == 0 || nombre.Length > 250)
                return BadRequest("El nombre es obligatorio y debe tener hasta 250 caracteres.");

            // RN02: el nombre debe ser único entre los puntos de menú
            var duplicado = await _context.CasosDeUso.AnyAsync(c =>
                c.Activo && c.Id_CasoDeUso != id && c.Descripcion == nombre);
            if (duplicado)
                return BadRequest($"Ya existe un punto de menú con el nombre \"{nombre}\".");

            punto.Descripcion = nombre;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/PuntosMenu/5  (CU04: Eliminar, baja lógica)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuntoMenu(int id)
        {
            var punto = await _context.CasosDeUso.FirstOrDefaultAsync(c => c.Id_CasoDeUso == id && c.Activo);
            if (punto == null) return NotFound();

            // Al darlo de baja se quita también de los roles que lo tenían asignado.
            var asignaciones = await _context.RolCasosDeUso
                .Where(r => r.Id_CasoDeUso == id && r.Activo)
                .ToListAsync();
            foreach (var asignacion in asignaciones)
                asignacion.Activo = false;

            punto.Activo = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}