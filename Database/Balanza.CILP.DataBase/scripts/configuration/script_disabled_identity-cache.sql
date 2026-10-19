----
PRINT 'Se deshabilita identity_cache'
GO
-- Se deshabilita identity_cache para evitar issue de salto 
-- de 1000 en el numerador de la columna de primary key en las tablas.
----
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = OFF;