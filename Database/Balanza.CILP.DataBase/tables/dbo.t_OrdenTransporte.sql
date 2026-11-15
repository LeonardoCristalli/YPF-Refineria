CREATE TABLE [dbo].[t_OrdenTransporte] (
     [Id_OrdenTransporte]                       BIGINT IDENTITY(1,1)        NOT NULL
    ,[Id_OrdenDetalle]                          BIGINT                      NOT NULL
    ,[Id_RazonSocialTransportista]              INT                         NOT NULL
    ,[Id_Vehiculo]                              INT                         NOT NULL
    ,[Id_Conductor]                             INT                         NOT NULL
    ,[FechaPlanificacion_OrdenTransporte]       DATETIME                    NOT NULL
    ,[FechaFinPlanificacion_OrdenTransporte]    DATETIME                    NULL
    ,[FechaInicioEjecucion_OrdenTransporte]     DATETIME                    NULL
    ,[FechaFinEjecucion_OrdenTransporte]        DATETIME                    NULL
    ,[FechaFinReplanificacion_OrdenTransporte]  DATETIME                    NULL
    ,[MotivoReplanificacion_OrdenTransporte]    VARCHAR(5000)               NULL
	,[Activo_OrdenTransporte]		            BIT						    DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			            DATETIME				    DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			            VARCHAR(50)				    DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			            DATETIME				    NULL
	,[Audit_Update_User]			            VARCHAR(50)				    NULL
    ,CONSTRAINT [PK_OrdenTransporte] PRIMARY KEY CLUSTERED ([Id_OrdenTransporte])
    ,CONSTRAINT [FK_OrdenTransporte_OrdenDetalle] FOREIGN KEY([Id_OrdenDetalle]) REFERENCES [t_OrdenDetalle]([Id_OrdenDetalle])
    ,CONSTRAINT [FK_OrdenTransporte_RazonSocialTransportista] FOREIGN KEY([Id_RazonSocialTransportista]) REFERENCES [t_RazonSocial]([Id_RazonSocial])
    ,CONSTRAINT [FK_OrdenTransporte_Vehiculo] FOREIGN KEY([Id_Vehiculo]) REFERENCES [t_Vehiculo]([Id_Vehiculo])
    ,CONSTRAINT [FK_OrdenTransporte_Conductor] FOREIGN KEY([Id_Conductor]) REFERENCES [t_Conductor]([Id_Conductor])
);
GO
--
CREATE TRIGGER tg_OrdenTransporte_u
ON [dbo].[t_OrdenTransporte]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_OrdenTransporte t
    INNER JOIN INSERTED AS i ON (i.id_OrdenTransporte = t.id_OrdenTransporte)
GO