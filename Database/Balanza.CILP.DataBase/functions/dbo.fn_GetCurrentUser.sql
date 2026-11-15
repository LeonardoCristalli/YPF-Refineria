CREATE FUNCTION [dbo].[fn_GetCurrentUser]()
RETURNS VARCHAR(50)
AS
BEGIN
	--
	DECLARE @vText VARCHAR(128);
	--
	-- Obtiene el Usuario de CONTEXT_INFO y elimina los espacios en blanco sobrantes.
	SET @vText = SUBSTRING(RTRIM(CAST(CONTEXT_INFO() AS VARCHAR(128))),25,103);
    --
    -- Si el contexto no está seteado devuelve el usuario logueado en la base de datos
    IF  @vText IS NULL OR @vText = REPLICATE(' ',54)
	BEGIN
		--
		-- Asigna el usuario de logueado en la base de datos
	    SET @vText = SYSTEM_USER;
	    --
	END
	--
	-- Devuelve el valor.
    RETURN @vText;
    --
END;
