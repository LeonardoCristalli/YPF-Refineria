PRINT N'sysdata dbo.t_EstadoOrdenTransporte'
GO
;SET IDENTITY_INSERT dbo.t_EstadoOrdenTransporte ON
;MERGE dbo.t_EstadoOrdenTransporte t
USING
(
	SELECT	*
	FROM	(
				VALUES
				 (1, N'Planificacion', 1)
				,(2, N'Planificado', 1)
				,(3, N'Ejecucion', 1)
				,(4, N'Replanificado', 1)
				,(5, N'Ejecutado', 1)
			) i (id_EstadoOrdenTransporte, descripcion_EstadoOrdenTransporte, activo_EstadoOrdenTransporte)
) ii ON t.id_EstadoOrdenTransporte = ii.id_EstadoOrdenTransporte
WHEN MATCHED THEN
	UPDATE
	SET	 
		 t.descripcion_EstadoOrdenTransporte = ii.descripcion_EstadoOrdenTransporte
		,t.activo_EstadoOrdenTransporte = ii.activo_EstadoOrdenTransporte
WHEN NOT MATCHED BY TARGET THEN
	INSERT (id_EstadoOrdenTransporte, descripcion_EstadoOrdenTransporte, activo_EstadoOrdenTransporte)
	VALUES (ii.id_EstadoOrdenTransporte, ii.descripcion_EstadoOrdenTransporte, ii.activo_EstadoOrdenTransporte)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE
;SET IDENTITY_INSERT dbo.t_EstadoOrdenTransporte OFF
GO