PRINT 'Habilitacion Transacciones con aislamiento de tipo Snapshot'
GO
----
-- Deshabilitados hasta que haga falta persistir con transacciones.
----
----
-- Habilitacion Transacciones con aislamiento de tipo Snapshot 
----
--ALTER DATABASE BalanzaCILP SET ALLOW_SNAPSHOT_ISOLATION ON;
----
PRINT 'Habilitacion Transacciones con aislamiento Read Committed'
GO
----
-- Habilitacion Transacciones con aislamiento Read Committed
-- para que se comporten como Snapshot para evitar lecturas 
-- sucias sin tener que cambiar el nivel de aislamiento 
-- explicitamente a Snapshot
----
--ALTER DATABASE BalanzaCILP SET READ_COMMITTED_SNAPSHOT ON WITH ROLLBACK IMMEDIATE;