CREATE TABLE [dbo].[t_Tanque] (
     [Id_Tanque]             INT IDENTITY(1,1)  NOT NULL
    ,[Codigo_Tanque]         VARCHAR(20)        NOT NULL
    ,[Descripcion_Tanque]    VARCHAR(50)        NOT NULL
    ,[VolumenMaximo_Tanque]  DECIMAL(10,2)      NOT NULL
    ,[VolumenOcupado_Tanque] DECIMAL(10,2)      NOT NULL
	,[Activo_Tanque]		 BIT				DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]	 DATETIME			DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]	 VARCHAR(50)		DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]	 DATETIME			NULL
	,[Audit_Update_User]	 VARCHAR(50)		NULL
    ,CONSTRAINT [PK_Tanque] PRIMARY KEY CLUSTERED ([Id_Tanque])
);
GO
--
CREATE TRIGGER tg_Tanque_u
ON [dbo].[t_Tanque]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Tanque t
    INNER JOIN INSERTED AS i ON (i.id_Tanque = t.id_Tanque)
GO