PRINT N'initdata dbo.t_PuestoExpedicionRecepcion'
GO
-- Puesto inicial necesario para dar de alta órdenes (t_Orden.Id_PuestoExpedicionRecepcion es NOT NULL).
-- Idempotente: corre en cada publish y solo inserta si el puesto no existe.
-- A diferencia de los scripts sysdata, NO borra los puestos que hayan cargado los usuarios.
IF NOT EXISTS (SELECT 1 FROM dbo.t_PuestoExpedicionRecepcion WHERE Id_PuestoExpedicionRecepcion = 1)
BEGIN
	SET IDENTITY_INSERT dbo.t_PuestoExpedicionRecepcion ON;

	INSERT INTO dbo.t_PuestoExpedicionRecepcion (Id_PuestoExpedicionRecepcion, Descripcion_PuestoExpedicionRecepcion, Activo_PuestoExpedicionRecepcion)
	VALUES (1, N'Puesto Principal de Básculas', 1);

	SET IDENTITY_INSERT dbo.t_PuestoExpedicionRecepcion OFF;
END
GO
