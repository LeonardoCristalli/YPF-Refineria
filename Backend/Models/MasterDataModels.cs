using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Table("t_Producto")]
    public class Producto
    {
        [Key]
        public int Id_Producto { get; set; }

        [Column("Descripcion_Producto"), MaxLength(50), Required]
        public string Descripcion { get; set; } = "";

        [Column("Densidad_Producto"), Precision(4, 3)]
        public decimal Densidad { get; set; }

        public byte Id_UnidadMedida { get; set; }

        [Column("ToleranciaPorc_Producto"), Precision(5, 2)]
        public decimal ToleranciaPorc { get; set; } = 0.5m;

        [Column("Activo_Producto")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_UnidadMedida")]
    public class UnidadMedida
    {
        [Key]
        public byte Id_UnidadMedida { get; set; }

        [Column("Descripcion_UnidadMedida"), MaxLength(30), Required]
        public string Descripcion { get; set; } = "";

        [Column("Notacion_UnidadMedida"), MaxLength(10), Required]
        public string Notacion { get; set; } = "";

        [Column("EsPeso_UnidadMedida")]
        public bool EsPeso { get; set; }

        [Column("EsVolumen_UnidadMedida")]
        public bool EsVolumen { get; set; }

        [Column("Activo_UnidadMedida")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_Vehiculo")]
    public class Vehiculo
    {
        [Key]
        public int Id_Vehiculo { get; set; }

        public int Id_RazonSocial { get; set; }

        [Column("PatenteChasis_Vehiculo"), MaxLength(8), Required]
        public string PatenteChasis { get; set; } = "";

        [Column("PatenteAcoplado_Vehiculo"), MaxLength(8), Required]
        public string PatenteAcoplado { get; set; } = "";

        [Column("PesoSinCargar_Vehiculo"), Precision(10, 2)]
        public decimal PesoSinCargas { get; set; }

        [Column("PesoMaximo_Vehiculo"), Precision(10, 2)]
        public decimal PesoMaximo { get; set; }

        [Column("VolumenMaximo_Vehiculo"), Precision(10, 2)]
        public decimal VolumenMaximo { get; set; }

        [Column("Activo_Vehiculo")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_Conductor")]
    public class Conductor
    {
        [Key]
        public int Id_Conductor { get; set; }

        [Column("Apellido_Conductor"), MaxLength(50), Required]
        public string Apellido { get; set; } = "";

        [Column("Nombre_Conductor"), MaxLength(50), Required]
        public string Nombre { get; set; } = "";

        public byte Id_TipoDocumento { get; set; }

        [Column("NroDocumento_Conductor"), MaxLength(12), Required]
        public string NroDocumento { get; set; } = "";

        [Column("Activo_Conductor")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_RazonSocial")]
    public class RazonSocial
    {
        [Key]
        public int Id_RazonSocial { get; set; }

        [Column("Descripcion_RazonSocial"), MaxLength(50), Required]
        public string Descripcion { get; set; } = "";

        [Column("CUIT_RazonSocial"), MaxLength(13), Required]
        public string CUIT { get; set; } = "";

        [Column("EsCliente_RazonSocial")]
        public bool EsCliente { get; set; }

        [Column("EsProveedor_RazonSocial")]
        public bool EsProveedor { get; set; }

        [Column("EsTransportista_RazonSocial")]
        public bool EsTransportista { get; set; }

        [Column("Activo_RazonSocial")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_TipoDocumentoIdentidad")]
    public class TipoDocumentoIdentidad
    {
        [Key]
        public byte Id_TipoDocumentoIdentidad { get; set; }

        [Column("Descripcion_TipoDocumentoIdentidad"), MaxLength(50), Required]
        public string Descripcion { get; set; } = "";

        [Column("Activo_TipoDocumentoIdentidad")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_PuestoExpedicionRecepcion")]
    public class PuestoExpedicionRecepcion
    {
        [Key]
        public int Id_PuestoExpedicionRecepcion { get; set; }

        [Column("Descripcion_PuestoExpedicionRecepcion"), MaxLength(100), Required]
        public string Descripcion { get; set; } = "";

        [Column("Activo_PuestoExpedicionRecepcion")]
        public bool Activo { get; set; } = true;
    }
}
