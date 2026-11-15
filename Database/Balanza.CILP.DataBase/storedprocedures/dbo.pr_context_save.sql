CREATE PROCEDURE [dbo].[pr_context_save] 
(
	@pUserName		VARCHAR(50),
	@pCultureName	CHAR(5) = '',
	@pSession_ID	BIGINT = 0
)
AS
BEGIN
	--
	-- Guarda en el Contexto de la Sesion los valores recibidos como parámetros.
	-- Si el valor es nulo le asigna '' ya que el contexto no acepta nulos.
	-- Completa el largo de 128 Bytes con espacio vacios para evitar tener que truncar los nulos.
	--
	DECLARE @vContext VARBINARY(128);
	--
	SET @vContext = CAST (  
							CAST(ISNULL(@pCultureName,'') AS CHARACTER(5)) + -- Asigna Lenguaje
							ISNULL(CAST(@pSession_ID AS CHARACTER(19)),'') + -- Asigna Sesion
							ISNULL(@pUserName,'') + -- Asigna Usuario
							REPLICATE(' ',54) AS VARBINARY(128)
						 );  
	--
	SET CONTEXT_INFO @vContext;
	--
END;