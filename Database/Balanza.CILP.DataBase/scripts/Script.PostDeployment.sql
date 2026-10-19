/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
:r .\sysdata\script_sysdata_t_tipodocumentoidentidad.sql
:r .\sysdata\script_sysdata_t_tipopesada.sql
:r .\sysdata\script_sysdata_t_unidadmedida.sql
:r .\sysdata\script_sysdata_t_estadoorden.sql
:r .\sysdata\script_sysdata_t_estadoordentransporte.sql
:r .\sysdata\script_sysdata_t_tipoorden.sql
--:r .\sysdata\script_sysdata_t_[].sql
-------------------------------------------------
:r .\initdata\script_initdata_t_rol.sql
:r .\initdata\script_initdata_t_casodeuso.sql
:r .\initdata\script_initdata_t_rolcasodeuso.sql
-------------------------------------------------
:r .\configuration\script_disabled_identity-cache.sql
:r .\configuration\script_enabled_isolation-snapshot.sql