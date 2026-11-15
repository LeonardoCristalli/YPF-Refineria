PRINT N'initdata dbo.t_CasoDeUso'
GO
;SET IDENTITY_INSERT dbo.t_CasoDeUso ON
;MERGE dbo.t_CasoDeUso t
USING
(
	SELECT	*
	FROM	(
				VALUES
				 
				 (1, N'Consultar Puntos de Menu', 1)
				,(2, N'Ver Punto de Menu', 1)
				,(3, N'Modificar Punto de Menu', 1)
				,(4, N'Eliminar Punto de Menu', 1)
				,(5, N'Consultar Roles', 1)
				,(6, N'Crear Rol', 1)
				,(7, N'Ver Rol', 1)
				,(8, N'Modificar Rol', 1)
				,(9, N'Eliminar Rol', 1)
				--,(,N'', 1)
			) i (id_CasoDeUso, descripcion_CasoDeUso, activo_CasoDeUso)
) ii ON t.id_CasoDeUso = ii.id_CasoDeUso
WHEN MATCHED THEN
	UPDATE 
	SET  
		 descripcion_CasoDeUso = ii.descripcion_CasoDeUso
		,activo_CasoDeUso = ii.activo_CasoDeUso
WHEN NOT MATCHED BY TARGET THEN
	INSERT (id_CasoDeUso, descripcion_CasoDeUso, activo_CasoDeUso)
	VALUES (ii.id_CasoDeUso, ii.descripcion_CasoDeUso, ii.activo_CasoDeUso)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE
;SET IDENTITY_INSERT dbo.t_CasoDeUso OFF
GO