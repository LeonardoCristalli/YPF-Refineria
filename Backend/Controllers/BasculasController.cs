using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasculasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BasculasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bascula>>> Get()
        {
            return await _context.Basculas.Where(b => b.Activo).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Bascula>> Post(Bascula item)
        {
            item.IP = item.IP?.Trim() ?? "";

            // CU052 RN1: Fecha de vencimiento del certificado debe ser posterior a la actual
            if (item.VencimientoCertificado.Date <= DateTime.Today)
            {
                return BadRequest("La fecha de vencimiento del certificado debe ser posterior a la fecha actual.");
            }

            // CU052 RN2: Formato IPv4 válido
            if (!IsValidIPv4(item.IP))
            {
                return BadRequest("La dirección IP debe tener un formato IPv4 válido (ej. 192.168.1.50).");
            }

            // CU052 RN3: IP única entre básculas activas
            var existeIp = await _context.Basculas
                .AnyAsync(b => b.Activo && b.IP == item.IP);
            if (existeIp)
            {
                return BadRequest($"Ya existe una báscula activa registrada con la dirección IP {item.IP}.");
            }

            // CU052 RN4: la combinación de lote, serie y certificado habilitado debe ser única
            if (await ExisteCombinacionAsync(item, 0))
            {
                return BadRequest("Ya existe una báscula activa con la misma combinación de lote, serie y certificado habilitado.");
            }

            _context.Basculas.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = item.Id_Bascula }, item);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Bascula>> Get(int id)
        {
            var item = await _context.Basculas.FindAsync(id);
            if (item == null || !item.Activo) return NotFound();
            return item;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Bascula item)
        {
            if (id != item.Id_Bascula) return BadRequest("El identificador de la báscula no coincide.");

            item.IP = item.IP?.Trim() ?? "";

            // CU052 RN1: Fecha de vencimiento del certificado debe ser posterior a la actual
            if (item.VencimientoCertificado.Date <= DateTime.Today)
            {
                return BadRequest("La fecha de vencimiento del certificado debe ser posterior a la fecha actual.");
            }

            // CU052 RN2: Formato IPv4 válido
            if (!IsValidIPv4(item.IP))
            {
                return BadRequest("La dirección IP debe tener un formato IPv4 válido (ej. 192.168.1.50).");
            }

            // CU052 RN3: IP única entre básculas activas
            var existeIp = await _context.Basculas
                .AnyAsync(b => b.Activo && b.Id_Bascula != id && b.IP == item.IP);
            if (existeIp)
            {
                return BadRequest($"Ya existe otra báscula activa registrada con la dirección IP {item.IP}.");
            }

            // CU053: la combinación de lote, serie y certificado habilitado debe seguir siendo única
            if (await ExisteCombinacionAsync(item, id))
            {
                return BadRequest("Ya existe otra báscula activa con la misma combinación de lote, serie y certificado habilitado.");
            }

            _context.Entry(item).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Basculas.Any(e => e.Id_Bascula == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Basculas.FindAsync(id);
            if (item == null) return NotFound();

            // Baja lógica para mantener integridad referencial histórica con t_Pesada
            item.Activo = false;
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<bool> ExisteCombinacionAsync(Bascula item, int idActual)
        {
            return await _context.Basculas.AnyAsync(b =>
                b.Activo &&
                b.Id_Bascula != idActual &&
                b.Lote == item.Lote &&
                b.Serie == item.Serie &&
                b.CertificadoHabilitado == item.CertificadoHabilitado);
        }

        private static bool IsValidIPv4(string? ipString)
        {
            if (string.IsNullOrWhiteSpace(ipString)) return false;
            var parts = ipString.Trim().Split('.');
            if (parts.Length != 4) return false;
            foreach (var part in parts)
            {
                if (!byte.TryParse(part, out _)) return false;
            }
            return true;
        }
    }
}