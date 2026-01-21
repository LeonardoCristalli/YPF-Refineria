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
            return await _context.Basculas.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Bascula>> Post(Bascula item)
        {
            // RN: Validar IP unica (Simplified)
            _context.Basculas.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = item.Id_Bascula }, item);
        }
         [HttpGet("{id}")]
        public async Task<ActionResult<Bascula>> Get(int id)
        {
            var item = await _context.Basculas.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Bascula item)
        {
            if (id != item.Id_Bascula) return BadRequest();
            _context.Entry(item).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
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
            _context.Basculas.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
