using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuestosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PuestosController(AppDbContext context)
        {
            _context = context;
        }

        private static object Proyectar(PuestoExpedicionRecepcion p) => new
        {
            p.Id_PuestoExpedicionRecepcion,
            p.Descripcion,
            p.Activo
        };

        // GET: api/Puestos  (CU045: Consultar)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPuestos()
        {
            var puestos = await _context.Puestos
                .Where(p => p.Activo)
                .OrderBy(p => p.Id_PuestoExpedicionRecepcion)
                .Select(p => new
                {
                    p.Id_PuestoExpedicionRecepcion,
                    p.Descripcion,
                    p.Activo
                })
                .ToListAsync();

            return Ok(puestos);
        }

        // GET: api/Puestos/5  (CU046: Ver)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPuesto(int id)
        {
            var puesto = await _context.Puestos.FindAsync(id);
            if (puesto == null || !puesto.Activo) return NotFound();

            return Ok(Proyectar(puesto));
        }

        // Reglas de CU047 (crear) y CU048 (modificar).
        private static string? ValidarReglas(PuestoExpedicionRecepcion puesto)
        {
            puesto.Descripcion = (puesto.Descripcion ?? "").Trim();

            // RN01: la descripción es obligatoria y de hasta 50 caracteres
            if (puesto.Descripcion.Length < 2 || puesto.Descripcion.Length > 50)
                return "La descripción es obligatoria y debe tener entre 2 y 50 caracteres.";

            return null;
        }

        // POST: api/Puestos  (CU047: Crear)
        [HttpPost]
        public async Task<ActionResult<object>> PostPuesto(PuestoExpedicionRecepcion puesto)
        {
            var error = ValidarReglas(puesto);
            if (error != null) return BadRequest(error);

            puesto.Id_PuestoExpedicionRecepcion = 0;
            puesto.Activo = true;

            _context.Puestos.Add(puesto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPuesto),
                new { id = puesto.Id_PuestoExpedicionRecepcion }, Proyectar(puesto));
        }

        // PUT: api/Puestos/5  (CU048: Modificar)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPuesto(int id, PuestoExpedicionRecepcion datos)
        {
            if (id != datos.Id_PuestoExpedicionRecepcion)
                return BadRequest("El identificador del puesto no coincide.");

            var puesto = await _context.Puestos
                .FirstOrDefaultAsync(p => p.Id_PuestoExpedicionRecepcion == id && p.Activo);
            if (puesto == null) return NotFound();

            var error = ValidarReglas(datos);
            if (error != null) return BadRequest(error);

            puesto.Descripcion = datos.Descripcion;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Puestos/5  (CU049: Eliminar, baja lógica)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePuesto(int id)
        {
            var puesto = await _context.Puestos
                .FirstOrDefaultAsync(p => p.Id_PuestoExpedicionRecepcion == id && p.Activo);
            if (puesto == null) return NotFound();

            // Un puesto con órdenes asociadas no puede darse de baja: se perdería su trazabilidad.
            var tieneOrdenes = await _context.Ordenes
                .AnyAsync(o => o.Id_PuestoExpedicionRecepcion == id);
            if (tieneOrdenes)
                return BadRequest($"No se puede eliminar el puesto \"{puesto.Descripcion}\": tiene órdenes asociadas.");

            puesto.Activo = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}