using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Pesada")]
    public class Pesada
    {
        [Key]
        public long Id_Pesada { get; set; }
        public long Id_Planificacion { get; set; }
        public byte Id_TipoPesada { get; set; }
        public DateTime? Fecha { get; set; }
        public decimal? Cantidad { get; set; }
        public bool? EsIngresoManual { get; set; }
        public string? MotivoIngresoManual { get; set; }
        public int? ID_Bascula { get; set; }

        [ForeignKey("Id_Planificacion")]
        public virtual Planificacion? Planificacion { get; set; }
    }

    [Table("t_TipoPesada")]
    public class TipoPesada
    {
        [Key]
        public byte Id_TipoPesada { get; set; }
        public string? Descripcion { get; set; }
    }

    [Table("t_Bascula")]
    public class Bascula
    {
        [Key]
        public int Id_Bascula { get; set; }
        public string? Descripcion { get; set; }
        public string? Lote { get; set; }
        public string? Serie { get; set; }
        public string? CertificadoHabilitado { get; set; }
        public DateTime? VencimientoCertificado { get; set; }
        public string? IP { get; set; }
    }
}
