using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RazonesSocialesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RazonesSocialesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RazonSocial>>> Get()
        {
            return await _context.RazonesSociales.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RazonSocial>> Get(int id)
        {
            var item = await _context.RazonesSociales.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<RazonSocial>> Post(RazonSocial item)
        {
            _context.RazonesSociales.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = item.Id_RazonSocial }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, RazonSocial item)
        {
            if (id != item.Id_RazonSocial) return BadRequest();
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.RazonesSociales.FindAsync(id);
            if (item == null) return NotFound();
            _context.RazonesSociales.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
