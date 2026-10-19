CREATE TABLE [dbo].[t_Orden] (
     [Id_Orden]                         BIGINT IDENTITY(1,1) NOT NULL
    ,[Id_EstadoOrden]                   TINYINT              NOT NULL
    ,[Id_TipoOrden]                     TINYINT              NOT NULL
    ,[Id_PuestoExpedicionRecepcion]     INT                  NOT NULL
    ,[FechaPlanificacion_Orden]         DATETIME             NULL
    ,[FechaAnulacion_Orden]             DATETIME             NULL
    ,[MotivoAnulacion_Orden]            VARCHAR(5000)        NULL
    ,[FechaCierre_Orden]                DATETIME             NULL
	,[Activo_Orden]				        BIT					 DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			    DATETIME			 DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			    VARCHAR(50)			 DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			    DATETIME			 NULL
	,[Audit_Update_User]			    VARCHAR(50)			 NULL
    ,CONSTRAINT [PK_Orden] PRIMARY KEY CLUSTERED ([Id_Orden])
    ,CONSTRAINT [FK_Orden_EstadoOrden] FOREIGN KEY([Id_EstadoOrden]) REFERENCES [t_EstadoOrden]([Id_EstadoOrden])
    ,CONSTRAINT [FK_Orden_TipoOrden] FOREIGN KEY([Id_TipoOrden]) REFERENCES [t_TipoOrden]([Id_TipoOrden])
    ,CONSTRAINT [FK_Orden_PuestoExpedicionRecepcion] FOREIGN KEY([Id_PuestoExpedicionRecepcion]) REFERENCES [t_PuestoExpedicionRecepcion]([Id_PuestoExpedicionRecepcion])
);
GO
--
CREATE TRIGGER tg_Orden_u
ON [dbo].[t_Orden]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
              audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Orden t
    INNER JOIN INSERTED AS i ON (i.id_Orden = t.id_Orden)
GO
