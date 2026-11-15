CREATE TABLE [dbo].[t_DispositivoDetector] (
     [Id_DispositivoDetector]           INT IDENTITY(1,1)       NOT NULL
    ,[Descripcion_DispositivoDetector]  VARCHAR(30)             NOT NULL
    ,[IP_DispositivoDetector]           VARCHAR(19)             NOT NULL
	,[Activo_DispositivoDetector]	    BIT						DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			    DATETIME				DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]			    VARCHAR(50)				DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			    DATETIME				NULL
	,[Audit_Update_User]			    VARCHAR(50)				NULL
    CONSTRAINT [PK_DispositivoDetector] PRIMARY KEY CLUSTERED ([Id_DispositivoDetector])
);
GO
--
CREATE TRIGGER tg_DispositivoDetector_u
ON [dbo].[t_DispositivoDetector]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_DispositivoDetector t
    INNER JOIN INSERTED AS i ON (i.id_DispositivoDetector = t.id_DispositivoDetector)
GO