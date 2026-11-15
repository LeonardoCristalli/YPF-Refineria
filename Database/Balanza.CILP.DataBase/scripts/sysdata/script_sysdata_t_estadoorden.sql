PRINT N'sysdata dbo.t_EstadoOrden'
GO
;SET IDENTITY_INSERT dbo.t_EstadoOrden ON
;MERGE dbo.t_EstadoOrden t
USING
(
	SELECT	*
	FROM	(
				VALUES
				 (1, N'Borrador', 1)
				,(2, N'Definitivo', 1)
				,(3, N'Eliminado', 1)
				,(4, N'Planificado', 1)
				,(5, N'Anulado', 1)
			) i (id_EstadoOrden, descripcion_EstadoOrden, activo_EstadoOrden)
) ii ON t.id_EstadoOrden = ii.id_EstadoOrden
WHEN MATCHED THEN
	UPDATE
	SET	 
		 t.descripcion_EstadoOrden = ii.descripcion_EstadoOrden
		,t.activo_EstadoOrden = ii.activo_EstadoOrden
WHEN NOT MATCHED BY TARGET THEN
	INSERT (id_EstadoOrden, descripcion_EstadoOrden, activo_EstadoOrden)
	VALUES (ii.id_EstadoOrden, ii.descripcion_EstadoOrden, ii.activo_EstadoOrden)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE
;SET IDENTITY_INSERT dbo.t_EstadoOrden OFF
GO