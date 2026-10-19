CREATE TABLE [dbo].[t_Bascula] (
     [Id_Bascula]                     INT IDENTITY(1,1)  NOT NULL
    ,[Descripcion_Bascula]            VARCHAR(50)        NOT NULL
    ,[Lote_Bascula]                   VARCHAR(20)        NOT NULL
    ,[Serie_Bascula]                  VARCHAR(20)        NOT NULL
    ,[CertificadoHabilitado_Bascula]  VARCHAR(20)        NOT NULL
    ,[VencimientoCertificado_Bascula] DATE               NOT NULL
    ,[IP_Bascula]                     VARCHAR(19)        NOT NULL
	,[Activo_Bascula]		          BIT				 DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			  DATETIME			 DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			  VARCHAR(50)		 DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			  DATETIME			 NULL
	,[Audit_Update_User]			  VARCHAR(50)		 NULL
    ,CONSTRAINT [PK_Bascula] PRIMARY KEY CLUSTERED ([Id_Bascula])
);
GO
--
CREATE TRIGGER tg_Bascula_u
ON [dbo].[t_Bascula]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Bascula t
    INNER JOIN INSERTED AS i ON (i.id_Bascula = t.id_Bascula)
    --
GO;