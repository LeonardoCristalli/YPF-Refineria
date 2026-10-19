CREATE TABLE [dbo].[t_Producto] (
     [Id_Producto]              INT IDENTITY(1,1)   NOT NULL
    ,[Descripcion_Producto]     VARCHAR(50)         NOT NULL
    ,[Densidad_Producto]        DECIMAL(4,3)        NOT NULL
    ,[Id_UnidadMedida]          TINYINT             NOT NULL
	,[Activo_Producto]		    BIT					DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]	    DATETIME			DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]	    VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]	    DATETIME			NULL
	,[Audit_Update_User]	    VARCHAR(50)			NULL
    ,CONSTRAINT [PK_Producto] PRIMARY KEY CLUSTERED ([Id_Producto])
    ,CONSTRAINT [FK_Producto_UnidadMedida] FOREIGN KEY([Id_UnidadMedida]) REFERENCES [t_UnidadMedida]([Id_UnidadMedida])
);
GO
--
CREATE TRIGGER tg_Producto_u
ON [dbo].[t_Producto]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Producto t
    INNER JOIN INSERTED AS i ON (i.id_Producto = t.id_Producto)
GO
