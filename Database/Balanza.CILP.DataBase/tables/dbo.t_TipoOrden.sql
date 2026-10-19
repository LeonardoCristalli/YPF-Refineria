CREATE TABLE [dbo].[t_TipoOrden] (
     [Id_TipoOrden]          TINYINT IDENTITY(1,1)  NOT NULL
    ,[Descripcion_TipoOrden] VARCHAR(25)            NOT NULL
	,[Activo_TipoOrden]		 BIT					DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]	 DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]	 VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]	 DATETIME				NULL
	,[Audit_Update_User]	 VARCHAR(50)			NULL
    ,CONSTRAINT [PK_TipoOrden] PRIMARY KEY CLUSTERED ([Id_TipoOrden])
);
GO
--
CREATE TRIGGER tg_TipoOrden_u
ON [dbo].[t_TipoOrden]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_TipoOrden t
    INNER JOIN INSERTED AS i ON (i.id_TipoOrden = t.id_TipoOrden)
GO