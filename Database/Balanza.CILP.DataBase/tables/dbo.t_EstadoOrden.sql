CREATE TABLE [dbo].[t_EstadoOrden] (
     [Id_EstadoOrden]               TINYINT IDENTITY(1,1) NOT NULL
    ,[Descripcion_EstadoOrden]      VARCHAR(15)           NOT NULL
	,[Activo_EstadoOrden]			BIT					  DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			DATETIME			  DEFAULT(GETDATE()) NOT NULL
	,[Audit_Insert_User]			VARCHAR(50)			  DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			DATETIME			  NULL
	,[Audit_Update_User]			VARCHAR(50)			  NULL
    ,CONSTRAINT [PK_EstadoOrden] PRIMARY KEY CLUSTERED ([Id_EstadoOrden])
);
GO
--
CREATE TRIGGER tg_EstadoOrden_u
ON [dbo].[t_EstadoOrden]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_EstadoOrden t
    INNER JOIN INSERTED AS i ON (i.id_EstadoOrden = t.id_EstadoOrden)
GO