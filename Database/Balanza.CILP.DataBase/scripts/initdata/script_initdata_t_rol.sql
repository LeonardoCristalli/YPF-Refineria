PRINT N'initdata dbo.t_rol'
GO
;SET IDENTITY_INSERT dbo.t_rol ON
GO
;MERGE dbo.t_rol t
USING
(
	SELECT	*
	FROM
			(
				VALUES
				 (1, N'Administrador de Sistema', 1)
				,(2, N'Administrador de Negocio', 1)
				,(3, N'Administrador de Recepción', 1)
				,(4, N'Planificador de Descarga', 1)
				,(5, N'Administrador de Despacho', 1)
				,(6, N'Planificador de Carga', 1)
				,(7, N'Conductor Transporte', 1)
				,(8, N'Gerente de Puesto de Básculas', 1)
			) i (id_rol, descripcion_rol, activo_rol)
			
) ii ON t.id_rol = ii.id_rol
WHEN MATCHED THEN
	UPDATE
	SET  t.descripcion_rol = ii.descripcion_rol
		,t.activo_rol = ii.activo_rol
WHEN NOT MATCHED BY TARGET THEN
	INSERT (id_rol, descripcion_rol, activo_rol)
	VALUES (ii.id_rol, ii.descripcion_rol, ii.activo_rol)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE
;SET IDENTITY_INSERT dbo.t_rol OFF
GO