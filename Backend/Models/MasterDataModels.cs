using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    // Validaciones: los largos máximos son los de las columnas en Database/tables (fuente de verdad).
    // Los patrones de texto libre aceptan acentos, ü y ñ.

    [Table("t_Producto")]
    public class Producto
    {
        [Key]
        public int Id_Producto { get; set; }

        [Column("Descripcion_Producto")]
        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "La descripción debe tener entre 2 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s\.\,\-]+$", ErrorMessage = "La descripción contiene caracteres inválidos.")]
        public string Descripcion { get; set; } = "";

        [Column("Densidad_Producto"), Precision(4, 3)]
        [Range(0.001, 9.999, ErrorMessage = "La densidad debe estar entre 0,001 y 9,999.")]
        public decimal Densidad { get; set; }

        [Range(1, byte.MaxValue, ErrorMessage = "La unidad de medida es requerida.")]
        public byte Id_UnidadMedida { get; set; }

        [Column("ToleranciaPorc_Producto"), Precision(5, 2)]
        [Range(0, 100, ErrorMessage = "La tolerancia debe estar entre 0 y 100 %.")]
        public decimal ToleranciaPorc { get; set; } = 0.5m;

        [Column("Activo_Producto")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_UnidadMedida")]
    public class UnidadMedida
    {
        [Key]
        public byte Id_UnidadMedida { get; set; }

        [Column("Descripcion_UnidadMedida")]
        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(30, MinimumLength = 1, ErrorMessage = "La descripción debe tener entre 1 y 30 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$", ErrorMessage = "La descripción contiene caracteres inválidos.")]
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

        [Range(1, int.MaxValue, ErrorMessage = "La Razón Social es requerida.")]
        public int Id_RazonSocial { get; set; }

        [Column("PatenteChasis_Vehiculo")]
        [Required(ErrorMessage = "La patente del chasis es requerida.")]
        [StringLength(8, MinimumLength = 6, ErrorMessage = "La patente debe tener entre 6 y 8 caracteres.")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "La patente solo puede contener letras mayúsculas y números, sin espacios.")]
        public string PatenteChasis { get; set; } = "";

        [Column("PatenteAcoplado_Vehiculo")]
        [Required(ErrorMessage = "La patente del acoplado es requerida.")]
        [StringLength(8, MinimumLength = 6, ErrorMessage = "La patente debe tener entre 6 y 8 caracteres.")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "La patente solo puede contener letras mayúsculas y números, sin espacios.")]
        public string PatenteAcoplado { get; set; } = "";

        [Column("PesoSinCargar_Vehiculo"), Precision(10, 2)]
        [Range(0, 100000.0, ErrorMessage = "El peso sin carga debe estar entre 0 y 100.000 kg.")]
        public decimal PesoSinCargas { get; set; }

        [Column("PesoMaximo_Vehiculo"), Precision(10, 2)]
        [Range(0, 100000.0, ErrorMessage = "El peso máximo debe estar entre 0 y 100.000 kg.")]
        public decimal PesoMaximo { get; set; }

        [Column("VolumenMaximo_Vehiculo"), Precision(10, 2)]
        [Range(0, 100000.0, ErrorMessage = "El volumen máximo debe estar entre 0 y 100.000 L.")]
        public decimal VolumenMaximo { get; set; }

        [Column("Activo_Vehiculo")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_Conductor")]
    public class Conductor
    {
        [Key]
        public int Id_Conductor { get; set; }

        [Column("Apellido_Conductor")]
        [Required(ErrorMessage = "El apellido es requerido.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$", ErrorMessage = "El apellido solo puede contener letras.")]
        public string Apellido { get; set; } = "";

        [Column("Nombre_Conductor")]
        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$", ErrorMessage = "El nombre solo puede contener letras.")]
        public string Nombre { get; set; } = "";

        [Range(1, byte.MaxValue, ErrorMessage = "El tipo de documento es requerido.")]
        public byte Id_TipoDocumento { get; set; }

        [Column("NroDocumento_Conductor")]
        [Required(ErrorMessage = "El número de documento es requerido.")]
        [StringLength(12, MinimumLength = 6, ErrorMessage = "El documento debe tener entre 6 y 12 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El número de documento debe ser alfanumérico, sin espacios.")]
        public string NroDocumento { get; set; } = "";

        [Column("Activo_Conductor")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_RazonSocial")]
    public class RazonSocial
    {
        [Key]
        public int Id_RazonSocial { get; set; }

        [Column("Descripcion_RazonSocial")]
        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "La descripción debe tener entre 2 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s\.\,\-\&]+$", ErrorMessage = "La descripción contiene caracteres inválidos.")]
        public string Descripcion { get; set; } = "";

        [Column("CUIT_RazonSocial")]
        [Required(ErrorMessage = "El CUIT es requerido.")]
        [StringLength(13, MinimumLength = 11, ErrorMessage = "El CUIT debe tener entre 11 y 13 caracteres.")]
        [RegularExpression(@"^[0-9\-]+$", ErrorMessage = "El CUIT solo puede contener números y guiones.")]
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

        [Column("Descripcion_TipoDocumentoIdentidad")]
        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(50, MinimumLength = 2)]
        public string Descripcion { get; set; } = "";

        [Column("Activo_TipoDocumentoIdentidad")]
        public bool Activo { get; set; } = true;
    }

    [Table("t_PuestoExpedicionRecepcion")]
    public class PuestoExpedicionRecepcion
    {
        [Key]
        public int Id_PuestoExpedicionRecepcion { get; set; }

        [Column("Descripcion_PuestoExpedicionRecepcion")]
        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(100, MinimumLength = 2)]
        public string Descripcion { get; set; } = "";

        [Column("Activo_PuestoExpedicionRecepcion")]
        public bool Activo { get; set; } = true;
    }
}
