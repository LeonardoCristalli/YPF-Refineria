/*
================================================================================
 seed_demo.sql - Datos de prueba / demo (NO se publica)
--------------------------------------------------------------------------------
 Build Action = None y NO está referenciado en Script.PostDeployment.sql:
 nunca corre en un publish. Se ejecuta a mano contra una base ya publicada:

   sqlcmd -S .\SQLEXPRESS -E -d BalanzaCILP -f 65001 -b -i Database\Balanza.CILP.DataBase\scripts\testdata\seed_demo.sql

 Idempotente: cada fila se inserta solo si no existe (por su clave natural:
 descripción, CUIT, patente, documento, serie, código, ID de red o nro. de
 remito). Se puede correr varias veces sin duplicar, y no pisa cambios hechos
 desde la aplicación. Todas las empresas, CUITs y personas son ficticias.

 Usuarios de demo (contraseña de ambos: Demo1234!):
   YPF\ADMIN     -> rol 1 Administrador de Sistema
   YPF\OPERADOR  -> rol 8 Gerente de Puesto de Básculas
 El hash es formato ASP.NET Core Identity v3 (PasswordHasher, PBKDF2-SHA512),
 el mismo que usa UsuariosController. SOLO para demo.

 Órdenes de transporte: las fechas de las pesadas son relativas al día en que
 se corre el script (hace 6 días ... hoy, y una planificada para mañana), así
 el dashboard muestra datos recientes. Si se vuelve a correr, las OT existentes
 (por nro. de remito) no se tocan.
================================================================================
*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

DECLARE @Litros TINYINT = 3;   -- sysdata t_UnidadMedida
DECLARE @DNI    TINYINT = 1;   -- sysdata t_TipoDocumentoIdentidad

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Producto';
-------------------------------------------------------------------------------
INSERT INTO dbo.t_Producto (Descripcion_Producto, Densidad_Producto, Id_UnidadMedida, ToleranciaPorc_Producto)
SELECT v.Descripcion, v.Densidad, @Litros, v.Tolerancia
FROM (VALUES
     (N'Petróleo Crudo Medanito', 0.850, 0.50)
    ,(N'Nafta Súper',             0.740, 0.50)
    ,(N'Gasoil Grado 3',          0.845, 0.30)
    ,(N'Fuel Oil',                0.950, 1.00)
) v (Descripcion, Densidad, Tolerancia)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Producto p WHERE p.Descripcion_Producto = v.Descripcion);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_RazonSocial';
-------------------------------------------------------------------------------
INSERT INTO dbo.t_RazonSocial (Descripcion_RazonSocial, CUIT_RazonSocial, EsProveedor_RazonSocial, EsCliente_RazonSocial, EsTransportista_RazonSocial)
SELECT v.Descripcion, v.CUIT, v.EsProveedor, v.EsCliente, v.EsTransportista
FROM (VALUES
     (N'Petrolera Cuenca Neuquina S.A.',       '30-71000001-4', 1, 0, 0)
    ,(N'Distribuidora Combustibles del Sur SA','30-71000002-2', 0, 1, 0)
    ,(N'Estaciones Ruta 40 S.R.L.',            '30-71000003-0', 0, 1, 0)
    ,(N'Transportes Patagónicos S.R.L.',       '30-71000004-9', 0, 0, 1)
    ,(N'Logística Ruta 22 S.A.',               '30-71000005-7', 0, 0, 1)
) v (Descripcion, CUIT, EsProveedor, EsCliente, EsTransportista)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_RazonSocial r WHERE r.CUIT_RazonSocial = v.CUIT);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Vehiculo';
-------------------------------------------------------------------------------
-- Semirremolques cisterna: tara ~15-16 t, peso máximo 45 t, cisterna ~32-36 m3.
INSERT INTO dbo.t_Vehiculo (Id_RazonSocial, PatenteChasis_Vehiculo, PatenteAcoplado_Vehiculo, PesoSinCargar_Vehiculo, PesoMaximo_Vehiculo, VolumenMaximo_Vehiculo)
SELECT r.Id_RazonSocial, v.Chasis, v.Acoplado, v.Tara, v.PesoMaximo, v.Volumen
FROM (VALUES
     ('AE123BC', 'AE456FG', '30-71000004-9', 15200.00, 45000.00, 35000.00)
    ,('AF789HJ', 'AF012KL', '30-71000004-9', 15800.00, 45000.00, 36000.00)
    ,('AD345MN', 'AD678PQ', '30-71000005-7', 14900.00, 42000.00, 32000.00)
) v (Chasis, Acoplado, CUITTransportista, Tara, PesoMaximo, Volumen)
INNER JOIN dbo.t_RazonSocial r ON r.CUIT_RazonSocial = v.CUITTransportista
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Vehiculo x WHERE x.PatenteChasis_Vehiculo = v.Chasis);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Conductor';
-------------------------------------------------------------------------------
INSERT INTO dbo.t_Conductor (Apellido_Conductor, Nombre_Conductor, Id_TipoDocumento, NroDocumento_Conductor)
SELECT v.Apellido, v.Nombre, @DNI, v.Documento
FROM (VALUES
     (N'Fernández', N'Martín',  '28456123')
    ,(N'Sosa',      N'Gabriela','31789456')
    ,(N'Quiroga',   N'Diego',   '26123789')
) v (Apellido, Nombre, Documento)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Conductor c WHERE c.Id_TipoDocumento = @DNI AND c.NroDocumento_Conductor = v.Documento);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Bascula';
-------------------------------------------------------------------------------
INSERT INTO dbo.t_Bascula (Descripcion_Bascula, Lote_Bascula, Serie_Bascula, CertificadoHabilitado_Bascula, VencimientoCertificado_Bascula, IP_Bascula)
SELECT v.Descripcion, v.Lote, v.Serie, v.Certificado, v.Vencimiento, v.IP
FROM (VALUES
     (N'Báscula Ingreso Norte', 'L-2025-01', 'BC80-001234', 'INTI-2025-0457', CAST('2026-12-31' AS DATE), '192.168.10.21')
    ,(N'Báscula Egreso Sur',    'L-2025-01', 'BC80-001235', 'INTI-2025-0458', CAST('2027-06-30' AS DATE), '192.168.10.22')
) v (Descripcion, Lote, Serie, Certificado, Vencimiento, IP)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Bascula b WHERE b.Serie_Bascula = v.Serie);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Tanque';
-------------------------------------------------------------------------------
-- Volúmenes en litros.
INSERT INTO dbo.t_Tanque (Codigo_Tanque, Descripcion_Tanque, VolumenMaximo_Tanque, VolumenOcupado_Tanque)
SELECT v.Codigo, v.Descripcion, v.VolumenMaximo, v.VolumenOcupado
FROM (VALUES
     ('TK-101', N'Tanque Crudo de Recepción', 5000000.00, 3200000.00)
    ,('TK-205', N'Tanque Gasoil Despacho',    2500000.00,  950000.00)
) v (Codigo, Descripcion, VolumenMaximo, VolumenOcupado)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Tanque t WHERE t.Codigo_Tanque = v.Codigo);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_PuestoExpedicionRecepcion';
-------------------------------------------------------------------------------
-- El puesto 1 (Puesto Principal de Básculas) lo crea el initdata del publish.
INSERT INTO dbo.t_PuestoExpedicionRecepcion (Descripcion_PuestoExpedicionRecepcion)
SELECT v.Descripcion
FROM (VALUES (N'Puesto Acceso Norte'), (N'Puesto Salida Sur')) v (Descripcion)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_PuestoExpedicionRecepcion p WHERE p.Descripcion_PuestoExpedicionRecepcion = v.Descripcion);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Tanque (adicionales)';
-------------------------------------------------------------------------------
INSERT INTO dbo.t_Tanque (Codigo_Tanque, Descripcion_Tanque, VolumenMaximo_Tanque, VolumenOcupado_Tanque)
SELECT v.Codigo, v.Descripcion, v.VolumenMaximo, v.VolumenOcupado
FROM (VALUES
     ('TK-A1', N'Tanque A1 - Crudo', 50000.00, 10000.00)
    ,('TK-B1', N'Tanque B1 - Nafta', 30000.00,  5000.00)
) v (Codigo, Descripcion, VolumenMaximo, VolumenOcupado)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Tanque t WHERE t.Codigo_Tanque = v.Codigo);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_DispositivoDetector';
-------------------------------------------------------------------------------
INSERT INTO dbo.t_DispositivoDetector (Descripcion_DispositivoDetector, IP_DispositivoDetector)
SELECT v.Descripcion, v.IP
FROM (VALUES
     (N'Detector Barrera 1', '192.168.1.150')
    ,(N'Detector Barrera 2', '192.168.1.151')
) v (Descripcion, IP)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_DispositivoDetector d WHERE d.Descripcion_DispositivoDetector = v.Descripcion);

-------------------------------------------------------------------------------
PRINT N'testdata dbo.t_Usuario / dbo.t_UsuarioRol';
-------------------------------------------------------------------------------
-- Hash de "Demo1234!" (ver encabezado). Los roles los carga el initdata (t_Rol).
DECLARE @HashDemo VARCHAR(255) = 'AQAAAAIAAYagAAAAEGthqbGVeXZhNGI7WDo6z2HfsGZLIrmF+Q7fvR3JJLJY/JGfUNiFvbJ0e59S8xJQmA==';

INSERT INTO dbo.t_Usuario (IdRed_Usuario, Nombre_Usuario, Apellido_Usuario, NroDocumento_Usuario, PasswordHash_Usuario, Id_TipoDocumento)
SELECT v.IdRed, v.Nombre, v.Apellido, v.Documento, @HashDemo, @DNI
FROM (VALUES
     ('YPF\ADMIN',    N'Admin', N'Sistema', '11111111')
    ,('YPF\OPERADOR', N'Pedro', N'Gómez',   '22222222')
) v (IdRed, Nombre, Apellido, Documento)
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_Usuario u WHERE u.IdRed_Usuario = v.IdRed);

INSERT INTO dbo.t_UsuarioRol (Id_Usuario, Id_Rol)
SELECT u.Id_Usuario, v.IdRol
FROM (VALUES ('YPF\ADMIN', 1), ('YPF\OPERADOR', 8)) v (IdRed, IdRol)
INNER JOIN dbo.t_Usuario u ON u.IdRed_Usuario = v.IdRed
INNER JOIN dbo.t_Rol r ON r.Id_Rol = v.IdRol
WHERE NOT EXISTS (SELECT 1 FROM dbo.t_UsuarioRol x WHERE x.Id_Usuario = u.Id_Usuario AND x.Id_Rol = v.IdRol);

-------------------------------------------------------------------------------
PRINT N'testdata Órdenes de transporte con planificación y pesadas';
-------------------------------------------------------------------------------
-- Cada OT crea: t_Orden + t_OrdenDetalle + t_OrdenTransporte + t_Planificacion
-- (+ t_TanqueAlmacenamiento opcional) + sus pesadas. Clave natural: NroRemito.
-- Peso neto = litros x densidad del producto. Pesada bruta = tara del vehículo
-- + neto, con una diferencia menor a la tolerancia del producto.
-- Entrega (despacho): entra vacío -> Tara, sale cargado -> Bruto.
-- Descarga (recepción de crudo): entra cargado -> Bruto, sale vacío -> Tara.
DECLARE @Kilos TINYINT = 1;
DECLARE @OrdenEntrega TINYINT = 1, @AutorizacionDescarga TINYINT = 2;   -- sysdata t_TipoOrden
DECLARE @OrdenPlanificada TINYINT = 4;                                  -- sysdata t_EstadoOrden
DECLARE @OTPlanificado TINYINT = 2, @OTEjecucion TINYINT = 3, @OTEjecutado TINYINT = 5; -- sysdata t_EstadoOrdenTransporte
DECLARE @Tara TINYINT = 1, @Bruto TINYINT = 2;                          -- sysdata t_TipoPesada
DECLARE @Hoy DATETIME = CAST(CAST(GETDATE() AS DATE) AS DATETIME);

DECLARE @OT TABLE (
     Remito BIGINT PRIMARY KEY, TipoOrden TINYINT, EstadoOT TINYINT, Producto NVARCHAR(50)
    ,CUITClienteProveedor VARCHAR(13), CUITTransportista VARCHAR(13), Patente VARCHAR(8), DocConductor VARCHAR(12)
    ,Litros DECIMAL(10,2), Dia INT, Puesto NVARCHAR(100), Tanque VARCHAR(20) NULL);

INSERT INTO @OT VALUES
 -- OT de prueba del DbInitializer de la rama de Miguel (nafta a cliente, almacenamiento TK-B1)
 (2026001, @OrdenEntrega,         @OTEjecutado,   N'Nafta Súper',             '30-71000002-2', '30-71000004-9', 'AE123BC', '28456123', 30000, -6, N'Puesto Salida Sur',   'TK-B1')
,(2026002, @OrdenEntrega,         @OTEjecutado,   N'Gasoil Grado 3',          '30-71000003-0', '30-71000005-7', 'AD345MN', '26123789', 30000, -4, N'Puesto Salida Sur',   NULL)
,(2026003, @AutorizacionDescarga, @OTEjecutado,   N'Petróleo Crudo Medanito', '30-71000001-4', '30-71000004-9', 'AF789HJ', '31789456', 33000, -3, N'Puesto Acceso Norte', 'TK-101')
,(2026004, @OrdenEntrega,         @OTEjecutado,   N'Fuel Oil',                '30-71000002-2', '30-71000005-7', 'AD345MN', '26123789', 28000, -2, N'Puesto Salida Sur',   NULL)
,(2026005, @OrdenEntrega,         @OTEjecutado,   N'Nafta Súper',             '30-71000003-0', '30-71000004-9', 'AE123BC', '28456123', 32000, -1, N'Puesto Salida Sur',   'TK-B1')
,(2026006, @AutorizacionDescarga, @OTEjecucion,   N'Petróleo Crudo Medanito', '30-71000001-4', '30-71000004-9', 'AF789HJ', '31789456', 30000,  0, N'Puesto Acceso Norte', 'TK-101')
,(2026007, @OrdenEntrega,         @OTPlanificado, N'Gasoil Grado 3',          '30-71000002-2', '30-71000005-7', 'AD345MN', '26123789', 30000,  1, N'Puesto Salida Sur',   NULL);

DECLARE @Pes TABLE (Remito BIGINT, TipoPesada TINYINT, Dia INT, Minuto INT, Kg DECIMAL(10,2), SerieBascula VARCHAR(20) NULL, Motivo VARCHAR(300) NULL);
INSERT INTO @Pes VALUES
 -- duraciones: 45, 25, 70, 100 y 35 min (cubren los 4 rangos del reporte CU82)
 (2026001, @Tara,  -6,  8*60+10, 15200, 'BC80-001234', NULL)
,(2026001, @Bruto, -6,  8*60+55, 37440, 'BC80-001235', NULL)
,(2026002, @Tara,  -4, 10*60+ 0, 14900, 'BC80-001234', NULL)
,(2026002, @Bruto, -4, 10*60+25, 40290, 'BC80-001235', NULL)
,(2026003, @Bruto, -3,  7*60+30, 43890, 'BC80-001234', NULL)
,(2026003, @Tara,  -3,  8*60+40, 15800, 'BC80-001235', NULL)
,(2026004, @Tara,  -2, 14*60+ 0, 14900, 'BC80-001234', NULL)
,(2026004, @Bruto, -2, 15*60+40, 41530, NULL, 'Falla de comunicación con la báscula de egreso')  -- ingreso manual
,(2026005, @Tara,  -1,  9*60+15, 15200, 'BC80-001235', NULL)
,(2026005, @Bruto, -1,  9*60+50, 38900, 'BC80-001234', NULL)
,(2026006, @Bruto,  0,  7*60+45, 41320, 'BC80-001234', NULL);           -- en curso: falta la tara

DECLARE @Remito BIGINT, @IdOrden BIGINT, @IdDetalle BIGINT, @IdOT BIGINT, @IdPlan BIGINT;

DECLARE cOT CURSOR LOCAL FAST_FORWARD FOR
    SELECT o.Remito FROM @OT o
    WHERE NOT EXISTS (SELECT 1 FROM dbo.t_OrdenDetalle d WHERE d.NroRemito_OrdenDetalle = o.Remito)
    ORDER BY o.Remito;
OPEN cOT;
FETCH NEXT FROM cOT INTO @Remito;
WHILE @@FETCH_STATUS = 0
BEGIN
    INSERT INTO dbo.t_Orden (Id_EstadoOrden, Id_TipoOrden, Id_PuestoExpedicionRecepcion, FechaPlanificacion_Orden)
    SELECT @OrdenPlanificada, o.TipoOrden, pu.Id_PuestoExpedicionRecepcion, DATEADD(DAY, o.Dia, @Hoy)
    FROM @OT o
    INNER JOIN dbo.t_PuestoExpedicionRecepcion pu ON pu.Descripcion_PuestoExpedicionRecepcion = o.Puesto
    WHERE o.Remito = @Remito;
    SET @IdOrden = SCOPE_IDENTITY();

    INSERT INTO dbo.t_OrdenDetalle (Id_Orden, NroRemito_OrdenDetalle, Id_RazonSocialClienteProveedor, Id_Producto,
                                    Peso_OrdenDetalle, Id_UnidadMedida_Peso, Volumen_OrdenDetalle, Id_UnidadMedida_Volumen,
                                    EsMovimientoInterno_OrdenDetalle)
    SELECT @IdOrden, o.Remito, cp.Id_RazonSocial, pr.Id_Producto,
           ROUND(o.Litros * pr.Densidad_Producto, 2), @Kilos, o.Litros, @Litros, 0
    FROM @OT o
    INNER JOIN dbo.t_RazonSocial cp ON cp.CUIT_RazonSocial = o.CUITClienteProveedor
    INNER JOIN dbo.t_Producto pr ON pr.Descripcion_Producto = o.Producto
    WHERE o.Remito = @Remito;
    SET @IdDetalle = SCOPE_IDENTITY();

    INSERT INTO dbo.t_OrdenTransporte (Id_OrdenDetalle, Id_RazonSocialTransportista, Id_Vehiculo, Id_Conductor,
                                       Id_EstadoOrdenTransporte, FechaPlanificacion_OrdenTransporte)
    SELECT @IdDetalle, tr.Id_RazonSocial, ve.Id_Vehiculo, co.Id_Conductor, o.EstadoOT, DATEADD(DAY, o.Dia, @Hoy)
    FROM @OT o
    INNER JOIN dbo.t_RazonSocial tr ON tr.CUIT_RazonSocial = o.CUITTransportista
    INNER JOIN dbo.t_Vehiculo ve ON ve.PatenteChasis_Vehiculo = o.Patente
    INNER JOIN dbo.t_Conductor co ON co.NroDocumento_Conductor = o.DocConductor AND co.Id_TipoDocumento = @DNI
    WHERE o.Remito = @Remito;
    SET @IdOT = SCOPE_IDENTITY();

    INSERT INTO dbo.t_Planificacion (Id_OrdenTransporte, NroPosicion_Planificacion, CantidadPlanificada_Planificacion,
                                     Id_UnidadMedidaCantidadPlanificada, CantidadKG_Planificacion)
    SELECT @IdOT, 1, d.Peso_OrdenDetalle, @Kilos, d.Peso_OrdenDetalle
    FROM dbo.t_OrdenDetalle d WHERE d.Id_OrdenDetalle = @IdDetalle;
    SET @IdPlan = SCOPE_IDENTITY();

    INSERT INTO dbo.t_TanqueAlmacenamiento (Id_OrdenDetalle, Id_Tanque, Volumen_TanqueAlmacenamiento)
    SELECT @IdDetalle, t.Id_Tanque, o.Litros
    FROM @OT o INNER JOIN dbo.t_Tanque t ON t.Codigo_Tanque = o.Tanque
    WHERE o.Remito = @Remito;

    INSERT INTO dbo.t_Pesada (Id_Planificacion, Id_TipoPesada, Fecha_Pesada, Cantidad_Pesada,
                              EsIngresoManual_Pesada, MotivoIngresoManual_Pesada, ID_Bascula)
    SELECT @IdPlan, p.TipoPesada, DATEADD(MINUTE, p.Minuto, DATEADD(DAY, p.Dia, @Hoy)), p.Kg,
           CASE WHEN p.SerieBascula IS NULL THEN 1 ELSE 0 END, p.Motivo, b.Id_Bascula
    FROM @Pes p
    LEFT JOIN dbo.t_Bascula b ON b.Serie_Bascula = p.SerieBascula
    WHERE p.Remito = @Remito;

    -- Fechas de ejecución de la OT a partir de sus pesadas
    UPDATE ot
    SET  FechaInicioEjecucion_OrdenTransporte = x.Primera
        ,FechaFinEjecucion_OrdenTransporte = CASE WHEN ot.Id_EstadoOrdenTransporte = @OTEjecutado THEN x.Ultima END
    FROM dbo.t_OrdenTransporte ot
    CROSS APPLY (SELECT MIN(Fecha_Pesada) Primera, MAX(Fecha_Pesada) Ultima FROM dbo.t_Pesada WHERE Id_Planificacion = @IdPlan) x
    WHERE ot.Id_OrdenTransporte = @IdOT AND x.Primera IS NOT NULL;

    FETCH NEXT FROM cOT INTO @Remito;
END
CLOSE cOT;
DEALLOCATE cOT;

COMMIT TRANSACTION;
PRINT N'seed_demo OK';
