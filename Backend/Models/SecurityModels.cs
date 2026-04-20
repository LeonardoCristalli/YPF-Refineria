using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Usuario")]
    public class Usuario
    {
        [Key]
        public int Id_Usuario { get; set; }

        [Required(ErrorMessage = "El ID de red es requerido.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "El ID de red debe tener entre 3 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9\.\_\-]+$", ErrorMessage = "El ID de red contiene caracteres inválidos.")]
        public string? IdRed { get; set; }

        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Solo se permiten letras.")]
        public string? Nombre { get; set; }

        [Required(ErrorMessage = "El apellido es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 100 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Solo se permiten letras.")]
        public string? Apellido { get; set; }

        [Required(ErrorMessage = "El número de documento es requerido.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "El documento debe tener entre 6 y 20 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Documento debe ser alfanumérico sin espacios.")]
        public string? NroDocumento { get; set; }

        [Required]
        public byte Id_TipoDocumento { get; set; }
    }

    [Table("t_Rol")]
    public class Rol
    {
        [Key]
        public int Id_Rol { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string? Descripcion { get; set; }
    }

    [Table("t_UsuarioRol")]
    public class UsuarioRol
    {
        [Key]
        public int Id_UsuarioRol { get; set; }
        public int Id_Usuario { get; set; }
        public int Id_Rol { get; set; }
    }

    [Table("t_CasoDeUso")]
    public class CasoDeUso
    {
        [Key]
        public int Id_CasoDeUso { get; set; }
        
        [Required]
        [StringLength(100)]
        public string? Descripcion { get; set; }
    }

    [Table("t_RolCasoDeUso")]
    public class RolCasoDeUso
    {
        [Key]
        public int Id_RolCasoDeUso { get; set; }
        public int Id_Rol { get; set; }
        public int Id_CasoDeUso { get; set; }
    }
}
