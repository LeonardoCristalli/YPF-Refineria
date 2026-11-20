using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DispositivosDetectoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DispositivosDetectoresController(AppDbContext context)
        {
            _context = context;
        }

        // Cuatro octetos de 0 a 255 separados por puntos.
        private static readonly Regex FormatoIPv4 = new(
            @"^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$",
            RegexOptions.Compiled);

        private static object Proyectar(DispositivoDetector d) => new
        {
            d.Id_DispositivoDetector,
            d.Descripcion,
            d.IP,
            d.Activo
        };

        // GET: api/DispositivosDetectores  (CU040: Consultar)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDispositivos()
        {
            var dispositivos = await _context.DispositivosDetectores
                .Where(d => d.Activo)
                .OrderBy(d => d.Id_DispositivoDetector)
                .Select(d => new
                {
                    d.Id_DispositivoDetector,
                    d.Descripcion,
                    d.IP,
                    d.Activo
                })
                .ToListAsync();

            return Ok(dispositivos);
        }

        // GET: api/DispositivosDetectores/5  (CU041: Ver)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDispositivo(int id)
        {
            var dispositivo = await _context.DispositivosDetectores.FindAsync(id);
            if (dispositivo == null || !dispositivo.Activo) return NotFound();

            return Ok(Proyectar(dispositivo));
        }

        // Reglas de CU042 (crear) y CU043 (modificar).
        private async Task<string?> ValidarReglasAsync(DispositivoDetector dispositivo, int idActual)
        {
            dispositivo.Descripcion = (dispositivo.Descripcion ?? "").Trim();
            dispositivo.IP = (dispositivo.IP ?? "").Trim();

            // La columna admite 30 caracteres.
            if (dispositivo.Descripcion.Length < 2 || dispositivo.Descripcion.Length > 30)
                return "La descripción es obligatoria y debe tener entre 2 y 30 caracteres.";

            // RN01: la IP es obligatoria, con formato IPv4 estándar
            if (!FormatoIPv4.IsMatch(dispositivo.IP))
                return "La IP es obligatoria y debe tener un formato IPv4 válido (por ejemplo, 192.168.1.50).";

            // RN01: la IP no puede repetirse entre los dispositivos activos
            var ipDuplicada = await _context.DispositivosDetectores.AnyAsync(d =>
                d.Activo && d.Id_DispositivoDetector != idActual && d.IP == dispositivo.IP);
            if (ipDuplicada)
                return $"Ya existe un dispositivo activo con la IP {dispositivo.IP}.";

            return null;
        }

        // POST: api/DispositivosDetectores  (CU042: Crear)
        [HttpPost]
        public async Task<ActionResult<object>> PostDispositivo(DispositivoDetector dispositivo)
        {
            var error = await ValidarReglasAsync(dispositivo, 0);
            if (error != null) return BadRequest(error);

            dispositivo.Id_DispositivoDetector = 0;
            dispositivo.Activo = true;

            _context.DispositivosDetectores.Add(dispositivo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDispositivo),
                new { id = dispositivo.Id_DispositivoDetector }, Proyectar(dispositivo));
        }

        // PUT: api/DispositivosDetectores/5  (CU043: Modificar)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDispositivo(int id, DispositivoDetector datos)
        {
            if (id != datos.Id_DispositivoDetector)
                return BadRequest("El identificador del dispositivo no coincide.");

            var dispositivo = await _context.DispositivosDetectores
                .FirstOrDefaultAsync(d => d.Id_DispositivoDetector == id && d.Activo);
            if (dispositivo == null) return NotFound();

            var error = await ValidarReglasAsync(datos, id);
            if (error != null) return BadRequest(error);

            dispositivo.Descripcion = datos.Descripcion;
            dispositivo.IP = datos.IP;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/DispositivosDetectores/5  (CU044: Eliminar, baja lógica)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDispositivo(int id)
        {
            var dispositivo = await _context.DispositivosDetectores
                .FirstOrDefaultAsync(d => d.Id_DispositivoDetector == id && d.Activo);
            if (dispositivo == null) return NotFound();

            dispositivo.Activo = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}