CREATE TABLE [t_Usuario] (
     [Id_Usuario]			INT IDENTITY(1,1)	NOT NULL
    ,[IdRed_Usuario]		VARCHAR(50)			NOT NULL
    ,[Nombre_Usuario]		VARCHAR(100)		NOT NULL
    ,[Apellido_Usuario]		VARCHAR(100)		NOT NULL
    ,[NroDocumento_Usuario] VARCHAR				NOT NULL
    ,[Id_TipoDocumento]		TINYINT				NOT NULL
    ,[Activo_Usuario]		BIT	DEFAULT(1)		NOT NULL
	,[Audit_insert_date]	DATETIME			DEFAULT(GETDATE()) NOT NULL
	,[Audit_insert_user]	VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_update_date]	DATETIME			NULL
	,[Audit_update_user]	VARCHAR(50)			NULL
	,CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED (id_usuario ASC)
	,CONSTRAINT [FK_Usuario_TipoDocumentoIdentidad] FOREIGN KEY([Id_TipoDocumento]) REFERENCES [t_TipoDocumentoIdentidad]([Id_TipoDocumentoIdentidad])
)
GO;
--
CREATE TRIGGER tg_usuario_u
ON [dbo].[t_usuario]
FOR UPDATE AS
	--
	SET NOCOUNT ON;
	--
	UPDATE	t
	SET 
			 audit_update_user = dbo.fn_getcurrentuser()
			,audit_update_date = GETDATE()
	FROM	dbo.t_usuario t
	INNER JOIN INSERTED AS i ON (i.id_usuario = t.id_usuario)
	--
GO;