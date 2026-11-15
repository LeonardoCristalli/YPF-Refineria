/*
================================================================================
 seed_demo.sql - Datos de prueba / demo (NO se publica)
--------------------------------------------------------------------------------
 Build Action = None y NO está referenciado en Script.PostDeployment.sql:
 nunca corre en un publish. Se ejecuta a mano contra una base ya publicada:

   sqlcmd -S .\SQLEXPRESS -E -d BalanzaCILP -f 65001 -b -i Database\Balanza.CILP.DataBase\scripts\testdata\seed_demo.sql

 Idempotente: cada fila se inserta solo si no existe (por su clave natural:
 descripción, CUIT, patente, documento, serie o código). Se puede correr
 varias veces sin duplicar, y no pisa cambios hechos desde la aplicación.
 Todas las empresas, CUITs y personas son ficticias.
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

COMMIT TRANSACTION;
PRINT N'seed_demo OK';
