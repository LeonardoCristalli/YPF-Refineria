using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<UsuarioRol> UsuarioRoles { get; set; }
        public DbSet<CasoDeUso> CasosDeUso { get; set; }
        public DbSet<RolCasoDeUso> RolCasosDeUso { get; set; }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<UnidadMedida> UnidadesMedida { get; set; }
        public DbSet<Vehiculo> Vehiculos { get; set; }
        public DbSet<Conductor> Conductores { get; set; }
        public DbSet<RazonSocial> RazonesSociales { get; set; }
        public DbSet<TipoDocumentoIdentidad> TiposDocumentoIdentidad { get; set; }
        public DbSet<PuestoExpedicionRecepcion> Puestos { get; set; }

        public DbSet<Orden> Ordenes { get; set; }
        public DbSet<OrdenDetalle> OrdenDetalles { get; set; }
        public DbSet<OrdenTransporte> OrdenTransportes { get; set; }
        public DbSet<Planificacion> Planificaciones { get; set; }
        public DbSet<EstadoOrden> EstadosOrden { get; set; }
        public DbSet<TipoOrden> TiposOrden { get; set; }

        public DbSet<Pesada> Pesadas { get; set; }
        public DbSet<TipoPesada> TiposPesada { get; set; }
        public DbSet<Bascula> Basculas { get; set; }

        public DbSet<Tanque> Tanques { get; set; }
        public DbSet<TanqueAlmacenamiento> TanqueAlmacenamientos { get; set; }
        public DbSet<DispositivoDetector> DispositivosDetectores { get; set; }
        public DbSet<RazonSocialTipoCliente> RazonSocialTipoClientes { get; set; }
    }
}
