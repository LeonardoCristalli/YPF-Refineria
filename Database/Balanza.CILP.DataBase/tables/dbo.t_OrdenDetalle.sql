CREATE TABLE [dbo].[t_OrdenDetalle]
(
     [Id_OrdenDetalle]                  BIGINT IDENTITY(1,1)    NOT NULL
    ,[Id_Orden]                         BIGINT                  NOT NULL
    ,[NroRemito_OrdenDetalle]           BIGINT                  NOT NULL
    ,[Id_RazonSocialClienteProveedor]   INT                     NOT NULL
    ,[Id_Producto]                      INT                     NOT NULL
    ,[Peso_OrdenDetalle]                DECIMAL(10,2)           NOT NULL
    ,[Id_UnidadMedida_Peso]             TINYINT                 NOT NULL
    ,[Volumen_OrdenDetalle]             DECIMAL(10,2)           NOT NULL
    ,[Id_UnidadMedida_Volumen]          TINYINT                 NOT NULL
    ,[EsMovimientoInterno_OrdenDetalle] BIT                     NOT NULL
	,[Activo_OrdenDetalle]			    BIT						DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			    DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			    VARCHAR(50)				DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			    DATETIME				NULL
	,[Audit_Update_User]			    VARCHAR(50)				NULL
    ,CONSTRAINT [PK_OrdenDetalle] PRIMARY KEY CLUSTERED ([Id_OrdenDetalle])
    ,CONSTRAINT [FK_OrdenDetalle_Orden] FOREIGN KEY([Id_Orden]) REFERENCES [t_Orden]([Id_Orden])
    ,CONSTRAINT [FK_OrdenDetalle_RazonSocial] FOREIGN KEY([Id_RazonSocialClienteProveedor]) REFERENCES [t_RazonSocial]([Id_RazonSocial])
    ,CONSTRAINT [FK_OrdenDetalle_Producto] FOREIGN KEY([Id_Producto]) REFERENCES [t_Producto]([Id_Producto])
    ,CONSTRAINT [FK_OrdenDetalle_UnidadMedidaPeso] FOREIGN KEY([Id_UnidadMedida_Peso]) REFERENCES [t_UnidadMedida]([Id_UnidadMedida])
    ,CONSTRAINT [FK_OrdenDetalle_UnidadMedidaVolumen] FOREIGN KEY([Id_UnidadMedida_Volumen]) REFERENCES [t_UnidadMedida]([Id_UnidadMedida])
);
GO
--
CREATE TRIGGER tg_OrdenDetalle_u
ON [dbo].[t_OrdenDetalle]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_OrdenDetalle t
    INNER JOIN INSERTED AS i ON (i.id_OrdenDetalle = t.id_OrdenDetalle)
GO