PRINT N'initdata dbo.t_RolCasoDeUso'
GO
;SET IDENTITY_INSERT dbo.t_RolCasoDeUso ON
;MERGE dbo.t_RolCasoDeUso t
USING
(
	SELECT	*
	FROM	(
				VALUES
				---- Rol Administrador de Sistema
				 (1, 1, 1, 1)
				,(2, 1, 2, 1)
				,(3, 1, 3, 1)
				,(4, 1, 4, 1)
				,(5, 1, 5, 1)
				,(6, 1, 6, 1)
				,(7, 1, 7, 1)
				,(8, 1, 8, 1)
				,(9, 1, 9, 1)
			) i (id_RolCasoDeUso, id_rol, id_CasoDeUso, activo_RolCasoDeUso)
) ii ON t.id_RolCasoDeUso = ii.id_RolCasoDeUso
WHEN MATCHED THEN
	UPDATE
	SET	 
		 t.id_rol = ii.id_rol
		,t.id_CasoDeUso = ii.id_CasoDeUso
		,t.activo_RolCasoDeUso = ii.activo_RolCasoDeUso
WHEN NOT MATCHED BY TARGET THEN
	INSERT (id_RolCasoDeUso, id_rol, id_CasoDeUso)
	VALUES (ii.id_RolCasoDeUso, ii.id_rol, ii.id_CasoDeUso)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE
;SET IDENTITY_INSERT dbo.t_RolCasoDeUso OFF
GO