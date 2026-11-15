CREATE TABLE [dbo].[t_UsuarioRol] (
     [Id_UsuarioRol]        INT IDENTITY(1,1)   NOT NULL
    ,[Id_Usuario]           INT                 NOT NULL
    ,[Id_Rol]               INT                 NOT NULL
	,[Activo_UsuarioRol]	BIT					DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]	DATETIME			DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]	VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]	DATETIME			NULL
	,[Audit_Update_User]	VARCHAR(50)			NULL
    ,CONSTRAINT [PK_UsuarioRol] PRIMARY KEY CLUSTERED ([Id_UsuarioRol])
    ,CONSTRAINT [FK_UsuarioRol_Rol] FOREIGN KEY([Id_Rol]) REFERENCES [t_Rol]([Id_Rol])
    ,CONSTRAINT [FK_UsuarioRol_Usuario] FOREIGN KEY([Id_Usuario]) REFERENCES [t_Usuario]([Id_Usuario])
);
GO
--
CREATE TRIGGER tg_UsuarioRol_u
ON [dbo].[t_UsuarioRol]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_UsuarioRol t
    INNER JOIN INSERTED AS i ON (i.id_UsuarioRol = t.id_UsuarioRol)
GO