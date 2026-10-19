CREATE TABLE [t_Pesada] (
     [Id_Pesada]					BIGINT IDENTITY(1,1)	NOT NULL
    ,[Id_Planificacion]				BIGINT					NOT NULL
    ,[Id_TipoPesada]				TINYINT					NOT NULL
    ,[Fecha_Pesada]					DATETIME				NOT NULL
    ,[Cantidad_Pesada]				DECIMAL(10,2)			NOT NULL
    ,[EsIngresoManual_Pesada]		BIT						NOT NULL
    ,[MotivoIngresoManual_Pesada]	VARCHAR(300)			NULL
    ,[ID_Bascula]					INT						NULL
	,[Audit_Insert_date]			DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			VARCHAR(50)				DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			DATETIME				NULL
	,[Audit_Update_User]			VARCHAR(50)				NULL
    ,CONSTRAINT [PK_Pesada] PRIMARY KEY CLUSTERED ([Id_Pesada])
	,CONSTRAINT [FK_Pesada_Planificacion] FOREIGN KEY([Id_Planificacion]) REFERENCES [t_Planificacion]([Id_Planificacion])
	,CONSTRAINT [FK_Pesada_TipoPesada] FOREIGN KEY([Id_TipoPesada]) REFERENCES [t_TipoPesada]([Id_TipoPesada])
	,CONSTRAINT [FK_Pesada_Balanza] FOREIGN KEY([ID_Bascula]) REFERENCES [t_Bascula]([Id_Bascula])
);
GO

CREATE TRIGGER tg_Pesada_u
ON [dbo].[t_Pesada]
FOR UPDATE AS
	--
	SET NOCOUNT ON;
	--
	UPDATE	t
	SET 
			 audit_update_user = dbo.fn_getcurrentuser()
			,audit_update_date = GETDATE()
	FROM	dbo.t_Pesada t
	INNER JOIN INSERTED AS i ON (i.id_pesada = t.id_pesada)
	--
GO;

--CREATE NONCLUSTERED INDEX idx_pesada_tipopesada ON dbo.t_Pesada(id_posicion, id_tipopesada)
--	INCLUDE(fecha_pesada, cantidad_pesada, MotivoIngresoManual_Pesada, audit_insert_user, audit_update_user)
--GO;