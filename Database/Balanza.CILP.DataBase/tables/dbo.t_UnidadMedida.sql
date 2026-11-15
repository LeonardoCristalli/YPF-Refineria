CREATE TABLE [dbo].[t_UnidadMedida] (
     [Id_UnidadMedida]          TINYINT IDENTITY(1,1)	NOT NULL
    ,[Descripcion_UnidadMedida] VARCHAR(30)				NOT NULL
    ,[Notacion_UnidadMedida]    VARCHAR(10)             NOT NULL
    ,[EsPeso_UnidadMedida]      BIT						NOT NULL
    ,[EsVolumen_UnidadMedida]   BIT						NOT NULL
	,[Activo_UnidadMedida]		BIT						DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]		DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]		VARCHAR(50)				DEFAULT(dbo.fn_GetCurrentUser()) NOT NULL
	,[Audit_Update_Date]		DATETIME				NULL
	,[Audit_Update_User]		VARCHAR(50)				NULL
    CONSTRAINT [PK_UnidadMedida] PRIMARY KEY CLUSTERED ([Id_UnidadMedida])
);
GO
--
CREATE TRIGGER tg_UnidadMedida_u
ON [dbo].[t_UnidadMedida]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_UnidadMedida t
    INNER JOIN INSERTED AS i ON (i.id_UnidadMedida = t.id_UnidadMedida)
GO