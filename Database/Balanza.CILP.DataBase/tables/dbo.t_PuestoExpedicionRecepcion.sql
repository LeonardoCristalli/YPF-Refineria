CREATE TABLE [dbo].[t_PuestoExpedicionRecepcion] (
     [Id_PuestoExpedicionRecepcion]           INT IDENTITY(1, 1)    NOT NULL
    ,[Descripcion_PuestoExpedicionRecepcion]  VARCHAR(100)          NOT NULL
	,[Activo_PuestoExpedicionRecepcion]		  BIT					DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			          DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			          VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			          DATETIME				NULL
	,[Audit_Update_User]			          VARCHAR(50)			NULL
    ,CONSTRAINT [PK_PuestoExpedicionRecepcion] PRIMARY KEY CLUSTERED ([Id_PuestoExpedicionRecepcion])
);
GO
--
CREATE TRIGGER tg_PuestoExpedicionRecepcion_u
ON [dbo].[t_PuestoExpedicionRecepcion]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_PuestoExpedicionRecepcion t
    INNER JOIN INSERTED AS i ON (i.id_PuestoExpedicionRecepcion = t.id_PuestoExpedicionRecepcion)
GO