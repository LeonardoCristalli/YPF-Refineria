using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    // ABM de Roles y asignación de puntos de menú (CU05 a CU09).
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // Datos de entrada: el rol y los puntos de menú (casos de uso) que tiene asignados.
        public class RolRequest
        {
            public int Id_Rol { get; set; }
            public string? Descripcion { get; set; }
            public List<int>? PuntosMenu { get; set; }
        }

        private async Task<object> ProyectarAsync(Rol rol)
        {
            var puntos = await _context.RolCasosDeUso
                .Where(x => x.Id_Rol == rol.Id_Rol && x.Activo)
                .Select(x => x.Id_CasoDeUso)
                .OrderBy(x => x)
                .ToListAsync();

            return new { rol.Id_Rol, rol.Descripcion, rol.Activo, PuntosMenu = puntos, CantidadPuntosMenu = puntos.Count };
        }

        // Devuelve un mensaje de error o null si los datos son válidos.
        private async Task<string?> ValidarAsync(RolRequest datos, string nombre, int idActual)
        {
            // RN01: la descripción es obligatoria (3 a 50 caracteres, límite de la columna)
            if (nombre.Length < 3 || nombre.Length > 50)
                return "La descripción es obligatoria y debe tener entre 3 y 50 caracteres.";

            // RN02: la descripción debe ser única entre los roles activos
            var duplicado = await _context.Roles.AnyAsync(r => r.Activo && r.Id_Rol != idActual && r.Descripcion == nombre);
            if (duplicado)
                return $"Ya existe un rol con la descripción \"{nombre}\".";

            // RN03: los puntos de menú asignados deben existir y estar activos
            var ids = (datos.PuntosMenu ?? new List<int>()).Distinct().ToList();
            var validos = await _context.CasosDeUso.CountAsync(c => c.Activo && ids.Contains(c.Id_CasoDeUso));
            if (validos != ids.Count)
                return "Alguno de los puntos de menú seleccionados no existe o está dado de baja.";

            return null;
        }

        // Deja asignados exactamente los puntos de menú indicados (reactiva, agrega o da de baja).
        private async Task SincronizarPuntosMenuAsync(int idRol, List<int> ids)
        {
            var existentes = await _context.RolCasosDeUso.Where(x => x.Id_Rol == idRol).ToListAsync();

            foreach (var asignacion in existentes)
                asignacion.Activo = ids.Contains(asignacion.Id_CasoDeUso);

            foreach (var id in ids.Where(id => !existentes.Any(x => x.Id_CasoDeUso == id)))
                _context.RolCasosDeUso.Add(new RolCasoDeUso { Id_Rol = idRol, Id_CasoDeUso = id, Activo = true });
        }

        // GET: api/Roles  (CU05: Consultar)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRoles()
        {
            var roles = await _context.Roles
                .Where(r => r.Activo)
                .OrderBy(r => r.Id_Rol)
                .Select(r => new
                {
                    r.Id_Rol,
                    r.Descripcion,
                    r.Activo,
                    CantidadPuntosMenu = _context.RolCasosDeUso.Count(x => x.Id_Rol == r.Id_Rol && x.Activo)
                })
                .ToListAsync();

            return Ok(roles);
        }

        // GET: api/Roles/5  (CU07: Ver, con sus puntos de menú)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null || !rol.Activo) return NotFound();

            return Ok(await ProyectarAsync(rol));
        }

        // POST: api/Roles  (CU06: Crear)
        [HttpPost]
        public async Task<ActionResult<object>> PostRol(RolRequest datos)
        {
            var nombre = (datos.Descripcion ?? "").Trim();
            var error = await ValidarAsync(datos, nombre, 0);
            if (error != null) return BadRequest(error);

            var rol = new Rol { Descripcion = nombre, Activo = true };
            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();

            await SincronizarPuntosMenuAsync(rol.Id_Rol, (datos.PuntosMenu ?? new List<int>()).Distinct().ToList());
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRol), new { id = rol.Id_Rol }, await ProyectarAsync(rol));
        }

        // PUT: api/Roles/5  (CU08: Modificar)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRol(int id, RolRequest datos)
        {
            if (id != datos.Id_Rol)
                return BadRequest("El identificador del rol no coincide.");

            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.Id_Rol == id && r.Activo);
            if (rol == null) return NotFound();

            var nombre = (datos.Descripcion ?? "").Trim();
            var error = await ValidarAsync(datos, nombre, id);
            if (error != null) return BadRequest(error);

            rol.Descripcion = nombre;
            await SincronizarPuntosMenuAsync(id, (datos.PuntosMenu ?? new List<int>()).Distinct().ToList());

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Roles/5  (CU09: Eliminar, baja lógica)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.Id_Rol == id && r.Activo);
            if (rol == null) return NotFound();

            // RN04: no se puede eliminar un rol que tiene usuarios activos asignados
            var enUso = await _context.UsuarioRoles.AnyAsync(u => u.Id_Rol == id && u.Activo);
            if (enUso)
                return BadRequest($"No se puede eliminar el rol \"{rol.Descripcion}\": tiene usuarios asignados.");

            var asignaciones = await _context.RolCasosDeUso.Where(x => x.Id_Rol == id && x.Activo).ToListAsync();
            foreach (var asignacion in asignaciones)
                asignacion.Activo = false;

            rol.Activo = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}