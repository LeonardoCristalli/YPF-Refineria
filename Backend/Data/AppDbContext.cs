using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    // El esquema lo define el proyecto Database/Balanza.CILP.DataBase (fuente de verdad).
    // Este contexto solo mapea: no usar migrations, EnsureCreated ni EnsureDeleted.
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
        public DbSet<EstadoOrdenTransporte> EstadosOrdenTransporte { get; set; }
        public DbSet<TipoOrden> TiposOrden { get; set; }

        public DbSet<Pesada> Pesadas { get; set; }
        public DbSet<TipoPesada> TiposPesada { get; set; }
        public DbSet<Bascula> Basculas { get; set; }

        public DbSet<Tanque> Tanques { get; set; }
        public DbSet<TanqueAlmacenamiento> TanqueAlmacenamientos { get; set; }
        public DbSet<DispositivoDetector> DispositivosDetectores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Todas las tablas t_X tienen un trigger tg_X_u (FOR UPDATE) que completa la auditoría.
            // EF Core usa OUTPUT en INSERT/UPDATE, que SQL Server rechaza en tablas con triggers
            // salvo que EF sepa que existen: declararlos hace que use una estrategia compatible.
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                var table = entity.GetTableName();
                if (table is not null && table.StartsWith("t_"))
                {
                    modelBuilder.Entity(entity.ClrType)
                        .ToTable(tb => tb.HasTrigger($"tg_{table[2..]}_u"));
                }
            }
        }
    }
}
