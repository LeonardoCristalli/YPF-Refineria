using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Table("t_Tanque")]
    public class Tanque
    {
        [Key]
        public int Id_Tanque { get; set; }

        [Column("Codigo_Tanque"), MaxLength(20), Required]
        public string Codigo { get; set; } = "";

        [Column("Descripcion_Tanque"), MaxLength(50), Required]
        public string Descripcion { get; set; } = "";

        [Column("VolumenMaximo_Tanque"), Precision(10, 2)]
        public decimal VolumenMaximo { get; set; }

        [Column("VolumenOcupado_Tanque"), Precision(10, 2)]
        public decimal VolumenOcupado { get; set; }

        [Column("Activo_Tanque")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_TanqueAlmacenamiento")]
    public class TanqueAlmacenamiento
    {
        [Key]
        public int Id_TanqueAlmacenamiento { get; set; }
        public long Id_OrdenDetalle { get; set; }
        public int Id_Tanque { get; set; }

        [Column("Volumen_TanqueAlmacenamiento"), Precision(10, 2)]
        public decimal Volumen { get; set; }

        [Column("Activo_TanqueAlmacenamiento")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_DispositivoDetector")]
    public class DispositivoDetector
    {
        [Key]
        public int Id_DispositivoDetector { get; set; }

        [Column("Descripcion_DispositivoDetector"), MaxLength(50), Required]
        public string Descripcion { get; set; } = "";

        [Column("IP_DispositivoDetector"), MaxLength(19), Required]
        public string IP { get; set; } = "";

        [Column("Activo_DispositivoDetector")]
        public bool Activo { get; set; } = true;
    }
}
