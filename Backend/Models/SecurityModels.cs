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

        [Column("IdRed_Usuario"), MaxLength(50), Required]
        public string IdRed { get; set; } = "";

        [Column("Nombre_Usuario"), MaxLength(100), Required]
        public string Nombre { get; set; } = "";

        [Column("Apellido_Usuario"), MaxLength(100), Required]
        public string Apellido { get; set; } = "";

        [Column("NroDocumento_Usuario"), MaxLength(12), Required]
        public string NroDocumento { get; set; } = "";

        // Nunca viaja en el JSON. El controller lo calcula a partir de Password.
        [Column("PasswordHash_Usuario"), MaxLength(255), JsonIgnore, ValidateNever]
        public string PasswordHash { get; set; } = "";

        // Solo de entrada: contraseña en texto plano que manda el frontend. No se mapea ni se devuelve.
        [NotMapped, JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Password { get; set; }

        public byte Id_TipoDocumento { get; set; }

        [Column("Activo_Usuario")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_Rol")]
    public class Rol
    {
        [Key]
        public int Id_Rol { get; set; }

        [Column("Descripcion_Rol"), MaxLength(50), Required]
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

        [Column("Descripcion_CasoDeUso"), MaxLength(250), Required]
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
