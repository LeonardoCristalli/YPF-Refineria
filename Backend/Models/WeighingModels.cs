using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Table("t_Pesada")]
    public class Pesada
    {
        [Key]
        public long Id_Pesada { get; set; }
        public long Id_Planificacion { get; set; }
        public byte Id_TipoPesada { get; set; }

        [Column("Fecha_Pesada")]
        public DateTime Fecha { get; set; }

        [Column("Cantidad_Pesada"), Precision(10, 2)]
        public decimal Cantidad { get; set; }

        [Column("EsIngresoManual_Pesada")]
        public bool EsIngresoManual { get; set; }

        [Column("MotivoIngresoManual_Pesada"), MaxLength(300)]
        public string? MotivoIngresoManual { get; set; }

        [Column("ID_Bascula")]
        public int? Id_Bascula { get; set; }

        [ForeignKey("Id_Planificacion")]
        public virtual Planificacion? Planificacion { get; set; }
    }

    [Table("t_TipoPesada")]
    public class TipoPesada
    {
        [Key]
        public byte Id_TipoPesada { get; set; }

        [Column("Descripcion_TipoPesada"), MaxLength(12), Required]
        public string Descripcion { get; set; } = "";
    }

    [Table("t_Bascula")]
    public class Bascula
    {
        [Key]
        public int Id_Bascula { get; set; }

        [Column("Descripcion_Bascula"), MaxLength(50), Required]
        public string Descripcion { get; set; } = "";

        [Column("Lote_Bascula"), MaxLength(20), Required]
        public string Lote { get; set; } = "";

        [Column("Serie_Bascula"), MaxLength(20), Required]
        public string Serie { get; set; } = "";

        [Column("CertificadoHabilitado_Bascula"), MaxLength(20), Required]
        public string CertificadoHabilitado { get; set; } = "";

        [Column("VencimientoCertificado_Bascula", TypeName = "date")]
        public DateTime VencimientoCertificado { get; set; }

        [Column("IP_Bascula"), MaxLength(19), Required]
        public string IP { get; set; } = "";

        [Column("Activo_Bascula")]
        public bool Activo { get; set; } = true;
    }
}
