using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Backend.Models
{
    [Table("t_Usuario")]
    public class Usuario
    {
        [Key]
        public int Id_Usuario { get; set; }

        // Acepta usuarios de dominio (ej. YPF\ADMIN).
        [Column("IdRed_Usuario")]
        [Required(ErrorMessage = "El ID de red es requerido.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "El ID de red debe tener entre 3 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9\.\_\-\\]+$", ErrorMessage = "El ID de red solo puede contener letras, números, puntos, guiones y \\.")]
        public string IdRed { get; set; } = "";

        [Column("Nombre_Usuario")]
        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$", ErrorMessage = "El nombre solo puede contener letras.")]
        public string Nombre { get; set; } = "";

        [Column("Apellido_Usuario")]
        [Required(ErrorMessage = "El apellido es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 100 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$", ErrorMessage = "El apellido solo puede contener letras.")]
        public string Apellido { get; set; } = "";

        [Column("NroDocumento_Usuario")]
        [Required(ErrorMessage = "El número de documento es requerido.")]
        [StringLength(12, MinimumLength = 6, ErrorMessage = "El documento debe tener entre 6 y 12 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El número de documento debe ser alfanumérico, sin espacios.")]
        public string NroDocumento { get; set; } = "";

        // Nunca viaja en el JSON. El controller lo calcula a partir de Password.
        [Column("PasswordHash_Usuario"), MaxLength(255), JsonIgnore, ValidateNever]
        public string PasswordHash { get; set; } = "";

        // Solo de entrada: contraseña en texto plano que manda el frontend. No se mapea ni se devuelve.
        [NotMapped, JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Password { get; set; }

        [Range(1, byte.MaxValue, ErrorMessage = "El tipo de documento es requerido.")]
        public byte Id_TipoDocumento { get; set; }

        [Column("Activo_Usuario")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_Rol")]
    public class Rol
    {
        [Key]
        public int Id_Rol { get; set; }

        [Column("Descripcion_Rol"), Required, StringLength(50, MinimumLength = 3)]
        public string Descripcion { get; set; } = "";

        [Column("Activo_Rol")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_UsuarioRol")]
    public class UsuarioRol
    {
        [Key]
        public int Id_UsuarioRol { get; set; }
        public int Id_Usuario { get; set; }
        public int Id_Rol { get; set; }

        [Column("Activo_UsuarioRol")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_CasoDeUso")]
    public class CasoDeUso
    {
        [Key]
        public int Id_CasoDeUso { get; set; }

        [Column("Descripcion_CasoDeUso"), Required, StringLength(250)]
        public string Descripcion { get; set; } = "";

        [Column("Activo_CasoDeUso")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_RolCasoDeUso")]
    public class RolCasoDeUso
    {
        [Key]
        public int Id_RolCasoDeUso { get; set; }
        public int Id_Rol { get; set; }
        public int Id_CasoDeUso { get; set; }

        [Column("Activo_RolCasoDeUso")]
        public bool Activo { get; set; } = true;
    }
}
