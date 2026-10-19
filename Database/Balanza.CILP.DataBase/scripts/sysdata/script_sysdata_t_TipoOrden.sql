PRINT N'sysdata dbo.t_TipoOrden'
GO
;SET IDENTITY_INSERT dbo.t_TipoOrden ON
GO
;MERGE dbo.t_TipoOrden t
USING 
(
    SELECT  *
    FROM 
            (
    	        VALUES 
				 (1,'Orden de Entrega')
 				,(2,'Autorización de Descarga')
            ) i (id_TipoOrden, descripcion_TipoOrden)
) ii ON t.Id_TipoOrden = ii.id_TipoOrden
WHEN MATCHED THEN 
    UPDATE SET
    t.Descripcion_TipoOrden = ii.descripcion_TipoOrden
WHEN NOT MATCHED BY TARGET THEN  
    INSERT (Id_TipoOrden, Descripcion_TipoOrden)
    VALUES (ii.id_TipoOrden, ii.descripcion_TipoOrden)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
;SET IDENTITY_INSERT dbo.t_TipoOrden OFF
GO