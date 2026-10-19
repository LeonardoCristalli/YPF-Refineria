PRINT N'sysdata dbo.t_TipoDocumentoIdentidad'
GO
;SET IDENTITY_INSERT dbo.t_TipoDocumentoIdentidad ON
GO
;MERGE dbo.t_TipoDocumentoIdentidad t
USING 
(
    SELECT  *
    FROM 
            (
    	        VALUES 
				 (1,'DNI')
    	        ,(2,'CI')
                ,(3,'Pasaporte')
            ) i (id_TipoDocumentoIdentidad, descripcion_TipoDocumentoIdentidad)
) ii ON t.id_TipoDocumentoIdentidad = ii.id_TipoDocumentoIdentidad
WHEN MATCHED THEN 
    UPDATE SET
    t.descripcion_TipoDocumentoIdentidad = ii.descripcion_TipoDocumentoIdentidad
WHEN NOT MATCHED BY TARGET THEN  
    INSERT (id_TipoDocumentoIdentidad, descripcion_TipoDocumentoIdentidad)
    VALUES (ii.id_TipoDocumentoIdentidad, ii.descripcion_TipoDocumentoIdentidad)  
WHEN NOT MATCHED BY SOURCE THEN DELETE;
;SET IDENTITY_INSERT dbo.t_TipoDocumentoIdentidad OFF;
GO