CREATE TABLE [dbo].[t_TipoPesada]
(
	 [Id_TipoPesada]			TINYINT	IDENTITY(1,1)	NOT NULL
	,[Descripcion_TipoPesada]	VARCHAR(12)				NOT NULL
	,[Audit_Insert_Date]		DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]		VARCHAR(50)				DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]		DATETIME				NULL
	,[Audit_Update_User]		VARCHAR(50)				NULL
	,CONSTRAINT [PK_TipoPesada] PRIMARY KEY CLUSTERED ([Id_TipoPesada] ASC)
)
GO;
--
CREATE TRIGGER tg_TipoPesada_u
ON [dbo].[t_TipoPesada]
FOR UPDATE AS
	--
	SET NOCOUNT ON;
	--
	UPDATE t
	SET 
			 Audit_update_User = dbo.fn_getcurrentuser()
			,Audit_update_Date = GETDATE()
	FROM	dbo.t_TipoPesada t
	INNER JOIN INSERTED AS i ON (i.Id_TipoPesada = t.Id_TipoPesada)
	--
GO;