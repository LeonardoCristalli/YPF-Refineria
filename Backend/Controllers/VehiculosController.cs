using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiculosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehiculosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehiculo>>> GetVehiculos()
        {
            return await _context.Vehiculos.Where(v => v.Activo).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Vehiculo>> PostVehiculo(Vehiculo vehiculo)
        {
            if (string.IsNullOrWhiteSpace(vehiculo.PatenteChasis))
                return BadRequest("La patente del chasis es requerida.");

            vehiculo.PatenteChasis = vehiculo.PatenteChasis.Trim().ToUpper();
            vehiculo.PatenteAcoplado = vehiculo.PatenteAcoplado?.Trim().ToUpper() ?? "";

            // CU21: Unicidad de la patente del chasis
            var existePatente = await _context.Vehiculos
                .AnyAsync(v => v.Activo && v.PatenteChasis == vehiculo.PatenteChasis);
            if (existePatente)
                return BadRequest($"Ya existe un vehículo activo registrado con la patente de chasis {vehiculo.PatenteChasis}.");

            // CU21: Validación de valores positivos y coherencia de pesos
            if (vehiculo.PesoSinCargas <= 0)
                return BadRequest("El peso sin carga debe ser mayor a 0 kg.");

            if (vehiculo.PesoMaximo <= 0)
                return BadRequest("El peso máximo debe ser mayor a 0 kg.");

            if (vehiculo.VolumenMaximo <= 0)
                return BadRequest("El volumen máximo debe ser mayor a 0 L.");

            if (vehiculo.PesoMaximo <= vehiculo.PesoSinCargas)
                return BadRequest("El peso máximo debe ser mayor al peso sin carga.");

            // RN04: la razón social asociada debe existir y estar activa
            if (!await _context.RazonesSociales.AnyAsync(r => r.Id_RazonSocial == vehiculo.Id_RazonSocial && r.Activo))
                return BadRequest("La razón social asociada no existe o no está activa.");

            _context.Vehiculos.Add(vehiculo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetVehiculo", new { id = vehiculo.Id_Vehiculo }, vehiculo);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehiculo>> GetVehiculo(int id)
        {
            var item = await _context.Vehiculos.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehiculo(int id, Vehiculo vehiculo)
        {
            if (id != vehiculo.Id_Vehiculo)
            {
                return BadRequest("El identificador del vehículo no coincide.");
            }

            if (string.IsNullOrWhiteSpace(vehiculo.PatenteChasis))
                return BadRequest("La patente del chasis es requerida.");

            vehiculo.PatenteChasis = vehiculo.PatenteChasis.Trim().ToUpper();
            vehiculo.PatenteAcoplado = vehiculo.PatenteAcoplado?.Trim().ToUpper() ?? "";

            // CU21: Unicidad de la patente del chasis (excluyendo el vehículo actual)
            var existePatente = await _context.Vehiculos
                .AnyAsync(v => v.Activo && v.Id_Vehiculo != id && v.PatenteChasis == vehiculo.PatenteChasis);
            if (existePatente)
                return BadRequest($"Ya existe otro vehículo activo registrado con la patente de chasis {vehiculo.PatenteChasis}.");

            // CU21: Validación de valores positivos y coherencia de pesos
            if (vehiculo.PesoSinCargas <= 0)
                return BadRequest("El peso sin carga debe ser mayor a 0 kg.");

            if (vehiculo.PesoMaximo <= 0)
                return BadRequest("El peso máximo debe ser mayor a 0 kg.");

            if (vehiculo.VolumenMaximo <= 0)
                return BadRequest("El volumen máximo debe ser mayor a 0 L.");

            if (vehiculo.PesoMaximo <= vehiculo.PesoSinCargas)
                return BadRequest("El peso máximo debe ser mayor al peso sin carga.");

            // RN04: la razón social asociada debe existir y estar activa
            if (!await _context.RazonesSociales.AnyAsync(r => r.Id_RazonSocial == vehiculo.Id_RazonSocial && r.Activo))
                return BadRequest("La razón social asociada no existe o no está activa.");

            _context.Entry(vehiculo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vehiculos.Any(e => e.Id_Vehiculo == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehiculo(int id)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(id);
            if (vehiculo == null)
            {
                return NotFound();
            }

            vehiculo.Activo = false;
            _context.Entry(vehiculo).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}