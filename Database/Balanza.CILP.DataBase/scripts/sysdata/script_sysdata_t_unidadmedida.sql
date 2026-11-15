PRINT N'sysdata dbo.t_UnidadMedida'
GO
;SET IDENTITY_INSERT dbo.t_UnidadMedida ON
;MERGE dbo.t_UnidadMedida t
USING
(
	SELECT	*
	FROM	(
				VALUES
				 (1, N'Kilos', N'Kg', 1, 0, 1)
				,(2, N'Toneladas', N'T', 1, 0, 1)
				,(3, N'Litros', N'L', 0, 1, 1)
				,(4, N'Galon', N'Gal', 0, 1, 1)
			) i (id_UnidadMedida, descripcion_UnidadMedida, notacion_UnidadMedida, esPeso_UnidadMedida, esVolumen_UnidadMedida, activo_UnidadMedida)
) ii ON t.id_UnidadMedida = ii.id_UnidadMedida
WHEN MATCHED THEN
	UPDATE
	SET	 
		 t.descripcion_UnidadMedida = ii.descripcion_UnidadMedida
		,t.notacion_UnidadMedida = ii.notacion_UnidadMedida
		,t.esPeso_UnidadMedida = ii.esPeso_UnidadMedida
		,t.esVolumen_UnidadMedida = ii.esVolumen_UnidadMedida
		,t.activo_UnidadMedida = ii.activo_UnidadMedida
WHEN NOT MATCHED BY TARGET THEN
	INSERT (id_UnidadMedida, descripcion_UnidadMedida, notacion_UnidadMedida, esPeso_UnidadMedida, esVolumen_UnidadMedida, activo_UnidadMedida)
	VALUES (ii.id_UnidadMedida, ii.descripcion_UnidadMedida, ii.notacion_UnidadMedida, ii.esPeso_UnidadMedida, ii.esVolumen_UnidadMedida, ii.activo_UnidadMedida)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE
;SET IDENTITY_INSERT dbo.t_UnidadMedida OFF
GO