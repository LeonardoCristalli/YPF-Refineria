using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Orden")]
    public class Orden
    {
        [Key]
        public long Id_Orden { get; set; }
        public byte Id_EstadoOrden { get; set; }
        public byte Id_TipoOrden { get; set; }
        public DateTime? FechaInicioPlanificacion { get; set; }
        public DateTime? FechaPlanificacion { get; set; }
        public int? Id_PuestoExpedicionRecepcion { get; set; }
    }

    [Table("t_OrdenDetalle")]
    public class OrdenDetalle
    {
        [Key]
        public long Id_OrdenDetalle { get; set; }
        public long Id_Orden { get; set; }
        public long? NroDocumento { get; set; } 
        public int? Id_RazonSocialClienteProveedor { get; set; }
        public int Id_Producto { get; set; }
        public decimal? Peso { get; set; }
        public byte? Id_UnidadMedidaPeso { get; set; }
        public decimal? Volumen { get; set; }
        public byte? Id_UnidadMedidaVolumen { get; set; }

        [ForeignKey("Id_Producto")]
        public virtual Producto? Producto { get; set; }

        [ForeignKey("Id_Orden")]
        public virtual Orden? Orden { get; set; }

        [ForeignKey("Id_RazonSocialClienteProveedor")]
        public virtual RazonSocial? ClienteProveedor { get; set; }
    }

    [Table("t_OrdenTransporte")]
    public class OrdenTransporte
    {
        [Key]
        public long Id_OrdenTransporte { get; set; }
        public long Id_OrdenDetalle { get; set; }
        public int? Id_RazonSocialTransportista { get; set; }
        public int? Id_Vehiculo { get; set; }
        public int? Id_Conductor { get; set; }

        [ForeignKey("Id_OrdenDetalle")]
        public virtual OrdenDetalle? OrdenDetalle { get; set; }

        [ForeignKey("Id_Vehiculo")]
        public virtual Vehiculo? Vehiculo { get; set; }

        [ForeignKey("Id_Conductor")]
        public virtual Conductor? Conductor { get; set; }

        [ForeignKey("Id_RazonSocialTransportista")]
        public virtual RazonSocial? RazonSocialTransportista { get; set; }
    }

    [Table("t_Planificacion")]
    public class Planificacion
    {
        [Key]
        public long Id_Planificacion { get; set; }
        public long Id_OrdenTransporte { get; set; }
        public int? NroPosicion { get; set; }
        public decimal? CantidadPlanificada { get; set; }
        public byte? UnidadMedidaCantidadPlanificada { get; set; }
        public decimal? CantidadKG { get; set; }

        [ForeignKey("Id_OrdenTransporte")]
        public virtual OrdenTransporte? OrdenTransporte { get; set; }
    }

    [Table("t_EstadoOrden")]
    public class EstadoOrden
    {
        [Key]
        public byte Id_EstadoOrden { get; set; }
        public string? Descripcion { get; set; }
    }

    [Table("t_TipoOrden")]
    public class TipoOrden
    {
        [Key]
        public byte Id_TipoOrden { get; set; }
        public string? Descripcion { get; set; }
    }
}
