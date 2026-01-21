using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Producto")]
    public class Producto
    {
        [Key]
        public int Id_Producto { get; set; }
        public string? Descripcion { get; set; }
        public decimal? Densidad { get; set; }
        public byte? Id_UnidadMedida { get; set; }
    }

    [Table("t_UnidadMedida")]
    public class UnidadMedida
    {
        [Key]
        public byte Id_UnidadMedida { get; set; }
        public string? Descripcion { get; set; }
        public bool? EsPeso { get; set; }
        public bool? EsVolumen { get; set; }
    }

    [Table("t_Vehiculo")]
    public class Vehiculo
    {
        [Key]
        public int Id_Vehiculo { get; set; }
        public int? Id_RazonSocial { get; set; }
        public string? PatenteChasis { get; set; }
        public string? PatenteAcoplado { get; set; }
        public decimal? PesoSinCargas { get; set; }
        public decimal? PesoMaximo { get; set; }
        public decimal? VolumenMaximo { get; set; }
    }

    [Table("t_Conductor")]
    public class Conductor
    {
        [Key]
        public int Id_Conductor { get; set; }
        public string? Apellido { get; set; }
        public string? Nombre { get; set; }
        public byte? Id_TipoDocumento { get; set; }
        public string? NroDocumento { get; set; }
    }

    [Table("t_RazonSocial")]
    public class RazonSocial
    {
        [Key]
        public int Id_RazonSocial { get; set; }
        public string? Descripcion { get; set; }
        public string? CUIT { get; set; }
        public bool? EsCliente { get; set; }
        public bool? EsProveedor { get; set; }
        public bool? EsTransportista { get; set; }
    }

    [Table("t_TipoDocumentoIdentidad")]
    public class TipoDocumentoIdentidad
    {
        [Key]
        public byte Id_TipoDocumento { get; set; }
        public string? Descripcion { get; set; }
    }

     [Table("t_PuestoExpedicionRecepcion")]
    public class PuestoExpedicionRecepcion
    {
        [Key]
        public int Id_PuestoExpedicionRecepcion { get; set; }
        public string? Descripcion { get; set; }
    }
}
