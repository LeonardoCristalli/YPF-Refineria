CREATE TABLE [dbo].[t_EstadoOrdenTransporte] (
     [Id_EstadoOrdenTransporte]            TINYINT IDENTITY(1,1) NOT NULL
    ,[Descripcion_EstadoOrdenTransporte]   VARCHAR(15)           NOT NULL
	,[Activo_EstadoOrdenTransporte]		   BIT					 DEFAULT(1) NOT NULL
	,[Audit_Insert_Date]			       DATETIME			     DEFAULT(GETDATE()) NOT NULL
	,[Audit_Insert_User]			       VARCHAR(50)			 DEFAULT(dbo.fn_getcurrentuser()) NOT NULL
	,[Audit_Update_Date]			       DATETIME			     NULL
	,[Audit_Update_User]			       VARCHAR(50)			 NULL
    ,CONSTRAINT [PK_EstadoOrdenTransporte] PRIMARY KEY CLUSTERED ([Id_EstadoOrdenTransporte])
);
GO
--
CREATE TRIGGER tg_EstadoOrdenTransporte_u
ON [dbo].[t_EstadoOrdenTransporte]
FOR UPDATE AS
    --
    SET NOCOUNT ON;
    --
    UPDATE t
    SET 
             audit_update_user = dbo.fn_getcurrentuser()
            ,audit_update_date = GETDATE()
    FROM    dbo.t_EstadoOrdenTransporte t
    INNER JOIN INSERTED AS i ON (i.id_EstadoOrdenTransporte = t.id_EstadoOrdenTransporte)
GO