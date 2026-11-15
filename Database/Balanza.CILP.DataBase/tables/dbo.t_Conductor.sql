CREATE TABLE [dbo].[t_Conductor] (
     [Id_Conductor]             INT IDENTITY(1,1) NOT NULL
    ,[Apellido_Conductor]       VARCHAR(50)       NOT NULL
    ,[Nombre_Conductor]         VARCHAR(50)       NOT NULL
    ,[Id_TipoDocumento]         TINYINT           NOT NULL
    ,[NroDocumento_Conductor]   VARCHAR(12)       NOT NULL
	,[Activo_Conductor]			BIT				  DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]		DATETIME		  DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]		VARCHAR(50)		  DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]		DATETIME		  NULL
	,[Audit_Update_User]		VARCHAR(50)		  NULL
    ,CONSTRAINT [PK_Conductor] PRIMARY KEY CLUSTERED ([Id_Conductor])
    ,CONSTRAINT [FK_Conductor_TipoDocumento] FOREIGN KEY([Id_TipoDocumento]) REFERENCES [t_TipoDocumentoIdentidad]([Id_TipoDocumentoIdentidad])
);
GO
--
CREATE TRIGGER tg_Conductor_u
ON [dbo].[t_Conductor]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Conductor t
    INNER JOIN INSERTED AS i ON (i.id_Conductor = t.id_Conductor)
GO