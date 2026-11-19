using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TanquesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TanquesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tanques
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetTanques()
        {
            var tanques = await _context.Tanques
                .Where(t => t.Activo)
                .Select(t => new
                {
                    t.Id_Tanque,
                    t.Codigo,
                    t.Descripcion,
                    t.VolumenMaximo,
                    t.VolumenOcupado,
                    CapacidadDisponible = t.VolumenMaximo - t.VolumenOcupado,
                    t.Activo
                })
                .ToListAsync();

            return Ok(tanques);
        }

        // GET: api/Tanques/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetTanque(int id)
        {
            var tanque = await _context.Tanques.FindAsync(id);

            if (tanque == null || !tanque.Activo)
            {
                return NotFound();
            }

            return Ok(Proyectar(tanque));
        }

        // Código alfanumérico: letras, números y guiones (los códigos de planta son del tipo TK-101).
        private static readonly Regex FormatoCodigo = new(@"^[A-Za-z0-9\-]+$", RegexOptions.Compiled);

        private static object Proyectar(Tanque tanque) => new
        {
            tanque.Id_Tanque,
            tanque.Codigo,
            tanque.Descripcion,
            tanque.VolumenMaximo,
            tanque.VolumenOcupado,
            CapacidadDisponible = tanque.VolumenMaximo - tanque.VolumenOcupado,
            tanque.Activo
        };

        // Reglas de CU057 (crear) y CU058 (modificar).
        private async Task<string?> ValidarReglasAsync(Tanque tanque, int idActual)
        {
            tanque.Codigo = (tanque.Codigo ?? "").Trim().ToUpperInvariant();
            tanque.Descripcion = (tanque.Descripcion ?? "").Trim();

            if (tanque.Codigo.Length == 0 || tanque.Codigo.Length > 20 || !FormatoCodigo.IsMatch(tanque.Codigo))
                return "El código es obligatorio, alfanumérico (letras, números y guiones) y de hasta 20 caracteres.";

            if (tanque.Descripcion.Length < 2 || tanque.Descripcion.Length > 50)
                return "La descripción es obligatoria y debe tener entre 2 y 50 caracteres.";

            // RN02: el volumen máximo debe ser mayor que 0
            if (tanque.VolumenMaximo <= 0)
                return "El volumen máximo debe ser mayor que cero.";

            if (tanque.VolumenMaximo > 99999999.99m)
                return "El volumen máximo supera el valor permitido (99.999.999,99 L).";

            // RN01: el código no puede repetirse entre los tanques activos
            var codigoDuplicado = await _context.Tanques.AnyAsync(t =>
                t.Activo && t.Id_Tanque != idActual && t.Codigo == tanque.Codigo);
            if (codigoDuplicado)
                return $"Ya existe un tanque activo con el código {tanque.Codigo}.";

            return null;
        }

        // POST: api/Tanques  (CU057: Crear Tanque)
        [HttpPost]
        public async Task<ActionResult<object>> PostTanque(Tanque tanque)
        {
            var error = await ValidarReglasAsync(tanque, 0);
            if (error != null) return BadRequest(error);

            // El volumen ocupado lo gestionan las autorizaciones de descarga, nunca el alta.
            tanque.Id_Tanque = 0;
            tanque.VolumenOcupado = 0;
            tanque.Activo = true;

            _context.Tanques.Add(tanque);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTanque), new { id = tanque.Id_Tanque }, Proyectar(tanque));
        }

        // PUT: api/Tanques/5  (CU058: Modificar Tanque)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTanque(int id, Tanque datos)
        {
            if (id != datos.Id_Tanque)
                return BadRequest("El identificador del tanque no coincide.");

            var tanque = await _context.Tanques.FirstOrDefaultAsync(t => t.Id_Tanque == id && t.Activo);
            if (tanque == null) return NotFound();

            var error = await ValidarReglasAsync(datos, id);
            if (error != null) return BadRequest(error);

            // No se puede reducir la capacidad por debajo de lo que el tanque ya almacena.
            if (datos.VolumenMaximo < tanque.VolumenOcupado)
                return BadRequest($"El volumen máximo no puede ser menor al volumen ocupado actual ({tanque.VolumenOcupado:N2} L).");

            // Solo se modifican los campos editables; el volumen ocupado se conserva.
            tanque.Codigo = datos.Codigo;
            tanque.Descripcion = datos.Descripcion;
            tanque.VolumenMaximo = datos.VolumenMaximo;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Tanques/5  (CU059: Eliminar Tanque, baja lógica)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTanque(int id)
        {
            var tanque = await _context.Tanques.FirstOrDefaultAsync(t => t.Id_Tanque == id && t.Activo);
            if (tanque == null) return NotFound();

            // Un tanque que todavía almacena producto no puede darse de baja.
            if (tanque.VolumenOcupado > 0)
                return BadRequest($"No se puede eliminar el tanque {tanque.Codigo}: tiene {tanque.VolumenOcupado:N2} L ocupados.");

            tanque.Activo = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}