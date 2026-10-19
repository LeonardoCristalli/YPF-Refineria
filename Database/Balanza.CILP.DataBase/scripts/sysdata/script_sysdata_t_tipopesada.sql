PRINT N'sysdata dbo.t_tipopesada'
GO
;SET IDENTITY_INSERT dbo.t_tipopesada ON
GO
;MERGE dbo.t_tipopesada t
USING 
(
    SELECT  *
    FROM 
            (
    	        VALUES 
				 (1,'Pesada Tara')
    	        ,(2,'Pesada Bruto')
            ) i (id_tipopesada, descripcion_tipopesada)
) ii ON t.id_tipopesada = ii.id_tipopesada
WHEN MATCHED THEN 
    UPDATE SET
    t.descripcion_tipopesada = ii.descripcion_tipopesada
WHEN NOT MATCHED BY TARGET THEN  
    INSERT (id_tipopesada, descripcion_tipopesada)
    VALUES (ii.id_tipopesada, ii.descripcion_tipopesada)  
WHEN NOT MATCHED BY SOURCE THEN DELETE;
;SET IDENTITY_INSERT dbo.t_tipopesada OFF
GO