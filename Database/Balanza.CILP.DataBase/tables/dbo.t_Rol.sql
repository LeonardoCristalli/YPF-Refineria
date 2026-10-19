CREATE TABLE [dbo].[t_Rol]
(
	 [Id_Rol]				INT IDENTITY(1,1)	NOT NULL 
	,[Descripcion_Rol]		VARCHAR(50)			NOT NULL
	,[Activo_Rol]			BIT					DEFAULT(1) NOT NULL
	,[Audit_insert_date]	DATETIME			DEFAULT(GETDATE()) NOT	NULL
	,[Audit_insert_user]	VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_update_date]	DATETIME			NULL
	,[Audit_update_user]	VARCHAR(50)			NULL
	,CONSTRAINT [PK_Rol] PRIMARY KEY CLUSTERED ([id_Rol] ASC)
)
GO;
--
CREATE TRIGGER tg_Rol_u
ON [dbo].[t_Rol]
FOR UPDATE AS
	--
	SET NOCOUNT ON;
	--
	UPDATE	t
	SET 
			 audit_update_user = dbo.fn_getcurrentuser()
			,audit_update_date = GETDATE()
	FROM	dbo.t_Rol t
	INNER JOIN INSERTED AS i ON (i.id_Rol = t.id_Rol)
	--
GO;
