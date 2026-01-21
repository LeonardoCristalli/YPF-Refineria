using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Usuario")]
    public class Usuario
    {
        [Key]
        public int Id_Usuario { get; set; }
        public string? IdRed { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? NroDocumento { get; set; }
        public byte Id_TipoDocumento { get; set; }
    }

    [Table("t_Rol")]
    public class Rol
    {
        [Key]
        public int Id_Rol { get; set; }
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
