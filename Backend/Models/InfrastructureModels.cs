using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Tanque")]
    public class Tanque
    {
        [Key]
        public int Id_Tanque { get; set; }
        public string? Descripcion { get; set; }
        public decimal? VolumenMaximo { get; set; }
        public decimal? VolumenOcupado { get; set; }
    }

    [Table("t_TanqueAlmacenamiento")]
    public class TanqueAlmacenamiento
    {
        [Key]
        public int Id_TanqueAlmacenamiento { get; set; }
        public long Id_OrdenDetalle { get; set; }
        public int Id_Tanque { get; set; }
        public decimal? Volumen { get; set; }
    }

    [Table("t_DispositivoDetector")]
    public class DispositivoDetector
    {
        [Key]
        public int Id_DispositivoDetector { get; set; }
        public string? Descripcion { get; set; }
        public string? IP { get; set; }
    }

    [Table("t_RazonSocialTipoCliente")]
    public class RazonSocialTipoCliente
    {
        // For now, I'll use Id_ClienteProveedor as Key.
        [Key]
        public int Id_ClienteProveedor { get; set; }
        public int Id_RazonSocial { get; set; }
        public bool? EsProveedor { get; set; }
        public bool? EsCliente { get; set; }
        public bool? EsTransportista { get; set; }
    }
}
