CREATE TABLE [dbo].[t_RolCasoDeUso] (
     [Id_RolCasoDeUso]      INT IDENTITY(1,1)   NOT NULL
    ,[Id_Rol]               INT                 NOT NULL
    ,[Id_CasoDeUso]         INT                 NOT NULL
	,[Activo_RolCasoDeUso]	BIT					DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]	DATETIME			DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]	VARCHAR(50)			DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]	DATETIME			NULL
	,[Audit_Update_User]	VARCHAR(50)			NULL
    ,CONSTRAINT [PK_RolCasoDeUso] PRIMARY KEY CLUSTERED ([Id_RolCasoDeUso])
    ,CONSTRAINT [FK_RolCasoDeUso_Rol] FOREIGN KEY([Id_Rol]) REFERENCES [t_Rol]([Id_Rol])
    ,CONSTRAINT [FK_RolCasoDeUso_CasoDeUso] FOREIGN KEY([Id_CasoDeUso]) REFERENCES [t_CasoDeUso]([Id_CasoDeUso])
);
GO
--
CREATE TRIGGER tg_RolCasoDeUso_u
ON [dbo].[t_RolCasoDeUso]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_RolCasoDeUso t
    INNER JOIN INSERTED AS i ON (i.id_RolCasoDeUso = t.id_RolCasoDeUso)
GO