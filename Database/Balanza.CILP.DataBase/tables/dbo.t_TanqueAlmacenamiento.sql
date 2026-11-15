CREATE TABLE [dbo].[t_TanqueAlmacenamiento] (
     [Id_TanqueAlmacenamiento]       INT IDENTITY(1,1)   NOT NULL
    ,[Id_OrdenDetalle]               BIGINT              NOT NULL
    ,[Id_Tanque]                     INT                 NOT NULL
    ,[Volumen_TanqueAlmacenamiento]  DECIMAL(10,2)       NOT NULL
	,[Activo_TanqueAlmacenamiento]	 BIT				 DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			 DATETIME			 DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			 VARCHAR(50)		 DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			 DATETIME			 NULL
	,[Audit_Update_User]			 VARCHAR(50)		 NULL
    ,CONSTRAINT [PK_TanqueAlmacenamiento] PRIMARY KEY CLUSTERED ([Id_TanqueAlmacenamiento])
    ,CONSTRAINT [FK_TanqueAlmacenamiento_Tanque] FOREIGN KEY([Id_Tanque]) REFERENCES [t_Tanque]([Id_Tanque])
    ,CONSTRAINT [FK_TanqueAlmacenamiento_OrdenDetalle] FOREIGN KEY([Id_OrdenDetalle]) REFERENCES [t_OrdenDetalle]([Id_OrdenDetalle])
);
GO
--
CREATE TRIGGER tg_TanqueAlmacenamiento_u
ON [dbo].[t_TanqueAlmacenamiento]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_TanqueAlmacenamiento t
    INNER JOIN INSERTED AS i ON (i.id_TanqueAlmacenamiento = t.id_TanqueAlmacenamiento)
GO