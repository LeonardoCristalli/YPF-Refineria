using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Table("t_Orden")]
    public class Orden
    {
        [Key]
        public long Id_Orden { get; set; }
        public byte Id_EstadoOrden { get; set; }
        public byte Id_TipoOrden { get; set; }
        public int Id_PuestoExpedicionRecepcion { get; set; }

        [Column("FechaPlanificacion_Orden")]
        public DateTime? FechaPlanificacion { get; set; }

        [Column("FechaAnulacion_Orden")]
        public DateTime? FechaAnulacion { get; set; }

        [Column("MotivoAnulacion_Orden"), MaxLength(5000)]
        public string? MotivoAnulacion { get; set; }

        [Column("FechaCierre_Orden")]
        public DateTime? FechaCierre { get; set; }

        [Column("Activo_Orden")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_OrdenDetalle")]
    public class OrdenDetalle
    {
        [Key]
        public long Id_OrdenDetalle { get; set; }
        public long Id_Orden { get; set; }

        [Column("NroRemito_OrdenDetalle")]
        public long NroRemito { get; set; }

        public int Id_RazonSocialClienteProveedor { get; set; }
        public int Id_Producto { get; set; }

        [Column("Peso_OrdenDetalle"), Precision(10, 2)]
        public decimal Peso { get; set; }

        [Column("Id_UnidadMedida_Peso")]
        public byte Id_UnidadMedidaPeso { get; set; }

        [Column("Volumen_OrdenDetalle"), Precision(10, 2)]
        public decimal Volumen { get; set; }

        [Column("Id_UnidadMedida_Volumen")]
        public byte Id_UnidadMedidaVolumen { get; set; }

        [Column("EsMovimientoInterno_OrdenDetalle")]
        public bool EsMovimientoInterno { get; set; }

        [Column("Activo_OrdenDetalle")]
        public bool Activo { get; set; } = true;

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
        public int Id_RazonSocialTransportista { get; set; }
        public int Id_Vehiculo { get; set; }
        public int Id_Conductor { get; set; }
        public byte Id_EstadoOrdenTransporte { get; set; } = 1; // Planificacion

        [Column("FechaPlanificacion_OrdenTransporte")]
        public DateTime FechaPlanificacion { get; set; }

        [Column("FechaFinPlanificacion_OrdenTransporte")]
        public DateTime? FechaFinPlanificacion { get; set; }

        [Column("FechaInicioEjecucion_OrdenTransporte")]
        public DateTime? FechaInicioEjecucion { get; set; }

        [Column("FechaFinEjecucion_OrdenTransporte")]
        public DateTime? FechaFinEjecucion { get; set; }

        [Column("FechaFinReplanificacion_OrdenTransporte")]
        public DateTime? FechaFinReplanificacion { get; set; }

        [Column("MotivoReplanificacion_OrdenTransporte"), MaxLength(5000)]
        public string? MotivoReplanificacion { get; set; }

        [Column("Activo_OrdenTransporte")]
        public bool Activo { get; set; } = true;

        [ForeignKey("Id_OrdenDetalle")]
        public virtual OrdenDetalle? OrdenDetalle { get; set; }

        [ForeignKey("Id_Vehiculo")]
        public virtual Vehiculo? Vehiculo { get; set; }

        [ForeignKey("Id_Conductor")]
        public virtual Conductor? Conductor { get; set; }

        [ForeignKey("Id_RazonSocialTransportista")]
        public virtual RazonSocial? RazonSocialTransportista { get; set; }

        [ForeignKey("Id_EstadoOrdenTransporte")]
        public virtual EstadoOrdenTransporte? EstadoOrdenTransporte { get; set; }
    }

    [Table("t_Planificacion")]
    public class Planificacion
    {
        [Key]
        public long Id_Planificacion { get; set; }
        public long Id_OrdenTransporte { get; set; }

        [Column("NroPosicion_Planificacion")]
        public int NroPosicion { get; set; }

        [Column("CantidadPlanificada_Planificacion"), Precision(10, 2)]
        public decimal CantidadPlanificada { get; set; }

        public byte Id_UnidadMedidaCantidadPlanificada { get; set; }

        [Column("CantidadKG_Planificacion"), Precision(10, 2)]
        public decimal CantidadKG { get; set; }

        [Column("Activo_Planificacion")]
        public bool Activo { get; set; } = true;

        [ForeignKey("Id_OrdenTransporte")]
        public virtual OrdenTransporte? OrdenTransporte { get; set; }
    }

    [Table("t_EstadoOrden")]
    public class EstadoOrden
    {
        [Key]
        public byte Id_EstadoOrden { get; set; }

        [Column("Descripcion_EstadoOrden"), MaxLength(15), Required]
        public string Descripcion { get; set; } = "";

        [Column("Activo_EstadoOrden")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_EstadoOrdenTransporte")]
    public class EstadoOrdenTransporte
    {
        [Key]
        public byte Id_EstadoOrdenTransporte { get; set; }

        [Column("Descripcion_EstadoOrdenTransporte"), MaxLength(15), Required]
        public string Descripcion { get; set; } = "";

        [Column("Activo_EstadoOrdenTransporte")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_TipoOrden")]
    public class TipoOrden
    {
        [Key]
        public byte Id_TipoOrden { get; set; }

        [Column("Descripcion_TipoOrden"), MaxLength(25), Required]
        public string Descripcion { get; set; } = "";

        [Column("Activo_TipoOrden")]
        public bool Activo { get; set; } = true;
    }
}
