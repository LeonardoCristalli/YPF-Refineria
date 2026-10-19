CREATE TABLE [dbo].[t_Vehiculo] (
     [Id_Vehiculo]               INT IDENTITY(1,1)   NOT NULL
    ,[Id_RazonSocial]            INT                 NOT NULL
    ,[PatenteChasis_Vehiculo]    VARCHAR(8)          NOT NULL
    ,[PatenteAcoplado_Vehiculo]  VARCHAR(8)          NOT NULL
    ,[PesoSinCargar_Vehiculo]    DECIMAL(10,2)       NOT NULL
    ,[PesoMaximo_Vehiculo]       DECIMAL(10,2)       NOT NULL
    ,[VolumenMaximo_Vehiculo]    DECIMAL(10,2)       NOT NULL
	,[Activo_Vehiculo]		     BIT				 DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]		 DATETIME			 DEFAULT(GETDATE()) NOT	NULL
	,[Audit_Insert_User]		 VARCHAR(50)		 DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]		 DATETIME			 NULL
	,[Audit_Update_User]		 VARCHAR(50)		 NULL
    ,CONSTRAINT [PK_Vehiculo] PRIMARY KEY CLUSTERED ([Id_Vehiculo])
    ,CONSTRAINT [FK_Vehiculo_RazonSocial] FOREIGN KEY([Id_RazonSocial]) REFERENCES [t_RazonSocial]([Id_RazonSocial])
);
GO
--
CREATE TRIGGER tg_Vehiculo_u
ON [dbo].[t_Vehiculo]
FOR UPDATE AS
    -- 
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_Vehiculo t
    INNER JOIN INSERTED AS i ON (i.id_Vehiculo = t.id_Vehiculo)
GO