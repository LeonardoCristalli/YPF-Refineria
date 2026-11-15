CREATE TABLE [dbo].[t_CasoDeUso] (
     [Id_CasoDeUso]          INT IDENTITY(1,1)  NOT NULL
    ,[Descripcion_CasoDeUso] VARCHAR(250)       NOT NULL
	,[Activo_CasoDeUso]		 BIT				DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]	 DATETIME			DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]	 VARCHAR(50)		DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]	 DATETIME			NULL
	,[Audit_Update_User]	 VARCHAR(50)		NULL
    ,CONSTRAINT [PK_CasoDeUso] PRIMARY KEY CLUSTERED ([Id_CasoDeUso])
);
GO
--
CREATE TRIGGER tg_CasoDeUso_u
ON [dbo].[t_CasoDeUso]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_CasoDeUso t
    INNER JOIN INSERTED AS i ON (i.id_CasoDeUso = t.id_CasoDeUso)
GO;