CREATE TABLE [dbo].[t_Planificacion] (
     [Id_Planificacion]                   BIGINT IDENTITY(1,1)    NOT NULL
    ,[Id_OrdenTransporte]                 BIGINT                  NOT NULL
    ,[NroPosicion_Planificacion]          INT                     NOT NULL
    ,[CantidadPlanificada_Planificacion]  DECIMAL(10,2)           NOT NULL
    ,[Id_UnidadMedidaCantidadPlanificada] TINYINT                 NOT NULL
    ,[CantidadKG_Planificacion]           DECIMAL(10,2)           NOT NULL
	,[Activo_Planificacion]				  BIT					  DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			      DATETIME				  DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			      VARCHAR(50)			  DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			      DATETIME				  NULL
	,[Audit_Update_User]			      VARCHAR(50)			  NULL
    ,CONSTRAINT [PK_Planificacion] PRIMARY KEY CLUSTERED ([Id_Planificacion])
    ,CONSTRAINT [FK_Planificacion_OrdenTransporte] FOREIGN KEY([Id_OrdenTransporte]) REFERENCES [t_OrdenTransporte]([Id_OrdenTransporte])
    ,CONSTRAINT [FK_Planificacion_UnidadMedida] FOREIGN KEY([Id_UnidadMedidaCantidadPlanificada]) REFERENCES [t_UnidadMedida]([Id_UnidadMedida])
);
GO
--
CREATE TRIGGER tg_Planificacion_u
ON [dbo].[t_Planificacion]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Planificacion t
    INNER JOIN INSERTED AS i ON (i.id_Planificacion = t.id_Planificacion)
GO
