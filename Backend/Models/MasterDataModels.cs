using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("t_Producto")]
    public class Producto
    {
        [Key]
        public int Id_Producto { get; set; }

        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "La descripción debe tener entre 2 y 150 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9\s\.\,\-]+$", ErrorMessage = "Contiene caracteres inválidos.")]
        public string? Descripcion { get; set; }

        [Range(0.01, 10000.0, ErrorMessage = "La densidad debe ser mayor a 0.")]
        public decimal? Densidad { get; set; }

        public byte? Id_UnidadMedida { get; set; }
    }

    [Table("t_UnidadMedida")]
    public class UnidadMedida
    {
        [Key]
        public byte Id_UnidadMedida { get; set; }

        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "La descripción debe tener entre 1 y 50 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9\s]+$", ErrorMessage = "Contiene caracteres inválidos.")]
        public string? Descripcion { get; set; }

        public bool? EsPeso { get; set; }
        public bool? EsVolumen { get; set; }
    }

    [Table("t_Vehiculo")]
    public class Vehiculo
    {
        [Key]
        public int Id_Vehiculo { get; set; }

        [Required(ErrorMessage = "La Razón Social es requerida.")]
        public int? Id_RazonSocial { get; set; }

        [Required(ErrorMessage = "La patente del chasis es requerida.")]
        [StringLength(10, MinimumLength = 6, ErrorMessage = "La patente debe tener entre 6 y 10 caracteres.")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "La patente solo puede contener letras mayúsculas y números, sin espacios.")]
        public string? PatenteChasis { get; set; }

        [StringLength(10, ErrorMessage = "La patente no puede superar los 10 caracteres.")]
        [RegularExpression(@"^[A-Z0-9]*$", ErrorMessage = "La patente solo puede contener letras mayúsculas y números, sin espacios.")]
        public string? PatenteAcoplado { get; set; }

        [Range(0, 100000.0, ErrorMessage = "El peso sin cargas debe ser válido.")]
        public decimal? PesoSinCargas { get; set; }

        [Range(0, 100000.0, ErrorMessage = "El peso máximo debe ser válido.")]
        public decimal? PesoMaximo { get; set; }

        [Range(0, 100000.0, ErrorMessage = "El volumen máximo debe ser válido.")]
        public decimal? VolumenMaximo { get; set; }
    }

    [Table("t_Conductor")]
    public class Conductor
    {
        [Key]
        public int Id_Conductor { get; set; }

        [Required(ErrorMessage = "El apellido es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 100 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Solo se permiten letras.")]
        public string? Apellido { get; set; }

        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "Solo se permiten letras.")]
        public string? Nombre { get; set; }

        [Required]
        public byte? Id_TipoDocumento { get; set; }

        [Required(ErrorMessage = "El número de documento es requerido.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "El documento debe tener entre 6 y 20 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El número de documento debe ser alfanumérico sin espacios.")]
        public string? NroDocumento { get; set; }
    }

    [Table("t_RazonSocial")]
    public class RazonSocial
    {
        [Key]
        public int Id_RazonSocial { get; set; }

        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "La descripción debe tener entre 2 y 200 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\,\-\&]+$", ErrorMessage = "Contiene caracteres inválidos.")]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El CUIT es requerido.")]
        [StringLength(20, MinimumLength = 11, ErrorMessage = "El CUIT debe tener entre 11 y 20 caracteres.")]
        [RegularExpression(@"^[0-9\-]+$", ErrorMessage = "El CUIT solo puede contener números y guiones.")]
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

        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(50, MinimumLength = 2)]
        public string? Descripcion { get; set; }
    }

    [Table("t_PuestoExpedicionRecepcion")]
    public class PuestoExpedicionRecepcion
    {
        [Key]
        public int Id_PuestoExpedicionRecepcion { get; set; }

        [Required(ErrorMessage = "La descripción es requerida.")]
        [StringLength(100, MinimumLength = 2)]
        public string? Descripcion { get; set; }
    }
}
