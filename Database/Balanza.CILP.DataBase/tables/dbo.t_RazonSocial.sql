CREATE TABLE [dbo].[t_RazonSocial] (
     [Id_RazonSocial]               INT IDENTITY(1,1)   NOT NULL
    ,[Descripcion_RazonSocial]      VARCHAR(50)         NOT NULL
    ,[CUIT_RazonSocial]             VARCHAR(13)         NOT NULL
    ,[EsProveedor_RazonSocial]      BIT                 NOT NULL
    ,[EsCliente_RazonSocial]        BIT                 NOT NULL
    ,[EsTransportista_RazonSocial]  BIT                 NOT NULL
	,[Activo_RazonSocial]		    BIT				    DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]		    DATETIME		    DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]		    VARCHAR(50)		    DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]		    DATETIME		    NULL
	,[Audit_Update_User]		    VARCHAR(50)		    NULL
    ,CONSTRAINT [PK_RazonSocial] PRIMARY KEY CLUSTERED ([Id_RazonSocial])
);
GO
--
CREATE TRIGGER tg_RazonSocial_u
ON [dbo].[t_RazonSocial]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_RazonSocial t
    INNER JOIN INSERTED AS i ON (i.id_RazonSocial = t.id_RazonSocial)
GO