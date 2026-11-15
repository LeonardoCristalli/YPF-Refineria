CREATE TABLE [dbo].[t_TipoDocumentoIdentidad] (
     [Id_TipoDocumentoIdentidad]            TINYINT IDENTITY(1,1) NOT NULL
    ,[Descripcion_TipoDocumentoIdentidad]   VARCHAR(50)           NOT NULL
	,[Activo_TipoDocumentoIdentidad]		BIT					  DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			        DATETIME			  DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			        VARCHAR(50)			  DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			        DATETIME			  NULL
	,[Audit_Update_User]			        VARCHAR(50)			  NULL
    CONSTRAINT [PK_TipoDocumentoIdentidad] PRIMARY KEY CLUSTERED ([Id_TipoDocumentoIdentidad])
);
GO
--
CREATE TRIGGER tg_TipoDocumentoIdentidad_u
ON [dbo].[t_TipoDocumentoIdentidad]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_TipoDocumentoIdentidad t
    INNER JOIN INSERTED AS i ON (i.id_TipoDocumentoIdentidad = t.id_TipoDocumentoIdentidad)
GO
