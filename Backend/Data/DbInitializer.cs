using Backend.Models;

namespace Backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Ensure database is created
            // Reset Database for Prototype Testing (Ensures new data is applied)
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // Look for any products.
            // if (context.Productos.Any())
            // {
            //    return;   // commented out to allow seeding other tables if products already exist
            // }

            // 1. Unidades de Medida
            if (!context.UnidadesMedida.Any())
            {
                var unidades = new UnidadMedida[]
                {
                    new UnidadMedida { Id_UnidadMedida = 1, Descripcion = "KG", EsPeso = true, EsVolumen = false },
                    new UnidadMedida { Id_UnidadMedida = 2, Descripcion = "Liters", EsPeso = false, EsVolumen = true }
                };
                context.UnidadesMedida.AddRange(unidades);
                context.SaveChanges();
            }

            // 2. Productos
            if (!context.Productos.Any())
            {
                var productos = new Producto[]
                {
                    new Producto { Descripcion = "Crudo Medanito", Densidad = 0.85m, Id_UnidadMedida = 2 },
                    new Producto { Descripcion = "Nafta Super", Densidad = 0.74m, Id_UnidadMedida = 2 },
                     new Producto { Descripcion = "Diesel Premium", Densidad = 0.83m, Id_UnidadMedida = 2 }
                };
                context.Productos.AddRange(productos);
                context.SaveChanges();
            }

            // 3. Razones Sociales
            if (!context.RazonesSociales.Any())
            {
                var razones = new RazonSocial[]
                {
                new RazonSocial { Descripcion = "Transportes YPF", CUIT = "30-54668806-1", EsTransportista = true },
                new RazonSocial { Descripcion = "Cliente Industrial S.A.", CUIT = "30-11223344-5", EsCliente = true },
                new RazonSocial { Descripcion = "Proveedor Patagonico", CUIT = "30-99887766-2", EsProveedor = true }
            };
            context.RazonesSociales.AddRange(razones);
            context.SaveChanges();
            }

             // 4. Vehiculos
             if (!context.Vehiculos.Any()) 
             {
                 var vehiculos = new Vehiculo[]
                 {
                     new Vehiculo { PatenteChasis = "AA123BB", PatenteAcoplado = "CC456DD", PesoSinCargas = 15000, PesoMaximo = 45000, VolumenMaximo = 30000, Id_RazonSocial = 1 },
                     new Vehiculo { PatenteChasis = "AE999ZZ", PatenteAcoplado = "AF111XX", PesoSinCargas = 14000, PesoMaximo = 42000, VolumenMaximo = 28000, Id_RazonSocial = 1 }
                 };
                 context.Vehiculos.AddRange(vehiculos);
                 context.SaveChanges();
             }

             // 5. Conductores
             if (!context.Conductores.Any())
             {
                 var conductores = new Conductor[]
                 {
                     new Conductor { Nombre = "Juan", Apellido = "Perez", NroDocumento = "30123456" },
                     new Conductor { Nombre = "Carlos", Apellido = "Gomez", NroDocumento = "28987654" }
                 };
                 context.Conductores.AddRange(conductores);
                 context.SaveChanges();
             }

             // 6. Estados y Tipos Orden
             if (!context.EstadosOrden.Any())
             {
                 var estados = new EstadoOrden[]
                 {
                     new EstadoOrden { Id_EstadoOrden = 1, Descripcion = "Pendiente" },
                     new EstadoOrden { Id_EstadoOrden = 2, Descripcion = "En Proceso" },
                     new EstadoOrden { Id_EstadoOrden = 3, Descripcion = "Finalizada" }
                 };
                 context.EstadosOrden.AddRange(estados);
             }

             if (!context.TiposOrden.Any())
             {
                 var tipos = new TipoOrden[]
                 {
                     new TipoOrden { Id_TipoOrden = 1, Descripcion = "Recepcion" },
                     new TipoOrden { Id_TipoOrden = 2, Descripcion = "Despacho" }
                 };
                 context.TiposOrden.AddRange(tipos);
                 context.SaveChanges();
             }

             // 7. Orden de Prueba
             if (!context.Ordenes.Any())
             {
                 var orden = new Orden
                 {
                     Id_Orden = 1, // Explicit ID for linking
                     Id_EstadoOrden = 1,
                     Id_TipoOrden = 1, // Recepcion
                     FechaInicioPlanificacion = DateTime.Now,
                     FechaPlanificacion = DateTime.Now.AddDays(1)
                 };
                 context.Ordenes.Add(orden);
                 context.SaveChanges();

                 // 7.1 Detalle
                 var detalle = new OrdenDetalle
                 {
                     Id_OrdenDetalle = 1,
                     Id_Orden = 1,
                     Id_Producto = 2, // Nafta Super
                     Peso = 30000,
                     Id_UnidadMedidaPeso = 1 // KG
                 };
                 context.OrdenDetalles.Add(detalle);
                 context.SaveChanges();

                 // 7.2 Transporte
                 var transporte = new OrdenTransporte
                 {
                     Id_OrdenTransporte = 1,
                     Id_OrdenDetalle = 1,
                     Id_Vehiculo = 1, // From previous seeds
                     Id_Conductor = 1, // From previous seeds
                     Id_RazonSocialTransportista = 1 // YPF Transportes
                 };
                 context.OrdenTransportes.Add(transporte);
                 context.SaveChanges();

                 // 7.3 Planificacion
                 var plan = new Planificacion
                 {
                     Id_Planificacion = 1,
                     Id_OrdenTransporte = 1,
                     CantidadPlanificada = 30000,
                     CantidadKG = 30000
                 };
                 context.Planificaciones.Add(plan);
                 context.SaveChanges();
             }



             // 7.4 Tipos Pesada
             if (!context.TiposPesada.Any())
             {
                 var tiposPesada = new TipoPesada[]
                 {
                     new TipoPesada { Id_TipoPesada = 1, Descripcion = "Entrada (Tara)" },
                     new TipoPesada { Id_TipoPesada = 2, Descripcion = "Salida (Bruto)" }
                 };
                 context.TiposPesada.AddRange(tiposPesada);
                 context.SaveChanges();
             }

             // 8. Basculas
             if (!context.Basculas.Any())
             {
                 var basculas = new Bascula[]
                 {
                     new Bascula { Descripcion = "Báscula Acceso A", IP = "192.168.1.100", Serie = "FW-2024-A", Lote = "Lote-001", CertificadoHabilitado = "CERT-001", VencimientoCertificado = DateTime.Now.AddYears(1) },
                     new Bascula { Descripcion = "Báscula Salida B", IP = "192.168.1.101", Serie = "FW-2024-B", Lote = "Lote-001", CertificadoHabilitado = "CERT-002", VencimientoCertificado = DateTime.Now.AddYears(1) }
                 };
                 context.Basculas.AddRange(basculas);
                 context.SaveChanges();
             }

             // 9. Usuarios
             if (!context.Usuarios.Any())
             {
                 var usuarios = new Usuario[]
                 {
                     new Usuario { IdRed = "192.168.1.50", Nombre = "Admin", Apellido = "Terminal", NroDocumento = "11111111", Id_TipoDocumento = 1 },
                     new Usuario { IdRed = "192.168.1.51", Nombre = "Operador", Apellido = "Acceso", NroDocumento = "22222222", Id_TipoDocumento = 1 }
                 };
                 context.Usuarios.AddRange(usuarios);
                 context.SaveChanges();
             }

             Console.WriteLine("Data Seeding Completed!");
        }
    }
}
