using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<Usuario> _hasher = new();

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> Get()
        {
            return await _context.Usuarios.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> Post(Usuario item)
        {
            if (string.IsNullOrWhiteSpace(item.Password))
            {
                return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>
                {
                    [nameof(Usuario.Password)] = ["La contraseña es obligatoria."]
                }));
            }

            item.PasswordHash = _hasher.HashPassword(item, item.Password);
            item.Password = null;

            _context.Usuarios.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = item.Id_Usuario }, item);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(int id)
        {
            var item = await _context.Usuarios.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Usuario item)
        {
            if (id != item.Id_Usuario) return BadRequest();

            var hashActual = await _context.Usuarios
                .Where(u => u.Id_Usuario == id)
                .Select(u => u.PasswordHash)
                .FirstOrDefaultAsync();
            if (hashActual == null) return NotFound();

            // Contraseña vacía en la edición = conservar la actual.
            item.PasswordHash = string.IsNullOrWhiteSpace(item.Password)
                ? hashActual
                : _hasher.HashPassword(item, item.Password);
            item.Password = null;

            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Usuarios.FindAsync(id);
            if (item == null) return NotFound();
            _context.Usuarios.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
