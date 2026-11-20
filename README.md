# CILP — Sistema Inteligente de Gestión y Automatización de Pesajes

Sistema de pesaje de camiones para la Refinería de La Plata (YPF). Gestiona órdenes de transporte, planificación logística (autorizaciones de descarga y órdenes de entrega), tanques de almacenamiento, registro de pesadas en báscula con ticket y reportes.

## Estado del proyecto

Están implementados **73 de los 78 casos de uso** de la especificación. El detalle caso por caso está en `Docs/Estado implementacion CU.md`.

Todavía no están:

- ABM de Roles y permisos (CU05 a CU09).
- Inicio de sesión, control de acceso por roles y doble factor de autenticación.
- Integración con básculas y cámaras reales (Device Connector y OCR de patentes). Por ahora el peso se carga desde la pantalla de pesadas.

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `Backend/` | API REST en ASP.NET Core (.NET 10) con Entity Framework Core |
| `Frontend/` | Aplicación web en React + Vite + Tailwind CSS |
| `Database/` | Proyecto de base de datos de SQL Server (`.sqlproj`): esquema, datos de sistema, datos iniciales y datos de demo |
| `Docs/` | Documentación: casos de uso, estado de implementación, manual de usuario, justificación de tecnologías, DER y entrega del proyecto |

## Requisitos previos

- **SQL Server**: sirve SQL Server Express (instancia `.\SQLEXPRESS`) o SQL Server LocalDB (instancia `(localdb)\MSSQLLocalDB`), que se instala con Visual Studio.
- **Visual Studio 2022** con la carga de trabajo *Almacenamiento y procesamiento de datos* (incluye SQL Server Data Tools, necesarias para publicar el proyecto de base de datos).
- **.NET SDK 10**.
- **Node.js** (versión LTS) y npm.
- **sqlcmd** (viene con SQL Server o se instala aparte), para cargar los datos de demo.

## Puesta en marcha

Hay que hacer los pasos en este orden: base de datos, backend y frontend.

### 1. Crear la base de datos

1. Abrir `Database/Balanza.CILP.DB.sln` con Visual Studio.
2. Clic derecho sobre el proyecto `Balanza.CILP.DataBase` y elegir **Publicar**.
3. Cargar el perfil `Balanza.CILP.DataBase.publish.xml`. Por defecto apunta a la instancia `.\SQLExpress` y crea la base `BalanzaCILP`.
4. Si usan otra instancia, cambien la conexión de destino con el botón **Editar**:
   - **SQL Server Express:** servidor `.\SQLEXPRESS`.
   - **LocalDB:** servidor `(localdb)\MSSQLLocalDB`, autenticación de Windows y **Cifrar** en *Opcional* (o tildar *Certificado de servidor de confianza*).
5. Antes de publicar, el **Nombre de la base de datos de destino** tiene que ser `BalanzaCILP`.
6. Publicar.

La publicación crea las tablas, funciones, procedimientos y triggers de auditoría, y carga los datos de sistema (estados, tipos de pesada, unidades de medida) y los datos iniciales de roles y casos de uso.

> **Si la base todavía no existe**, al probar la conexión Visual Studio puede decir que "la base de datos especificada no existe". En ese cuadro, para la conexión, ingresen `master` en *Nombre de la base de datos*. Es **solo para conectarse**: la base de destino sigue siendo `BalanzaCILP`. No publiquen las tablas dentro de `master`.

> **Atención:** el perfil de publicación tiene activada la opción `DropObjectsNotInSource`. Al volver a publicar, se eliminan de la base los objetos que no estén en el proyecto. No agreguen a mano objetos en la base que quieran conservar: agréguenlos al proyecto.

Con LocalDB, si la instancia está detenida, arránquenla con:

```
sqllocaldb start MSSQLLocalDB
```

### 2. Cargar los datos de demo (opcional, recomendado)

El script `seed_demo.sql` **no se ejecuta al publicar**; se corre a mano. Carga vehículos, conductores, empresas, productos, básculas, tanques, puestos, dispositivos, órdenes de transporte con pesadas recientes y dos usuarios de prueba. Todos los datos son ficticios.

Desde la raíz del repositorio, con SQL Server Express:

```
sqlcmd -S .\SQLEXPRESS -E -d BalanzaCILP -f 65001 -b -i Database\Balanza.CILP.DataBase\scripts\testdata\seed_demo.sql
```

Con LocalDB (el servidor va entre comillas):

```
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -d BalanzaCILP -f 65001 -b -i Database\Balanza.CILP.DataBase\scripts\testdata\seed_demo.sql
```

Si da un error de certificado con el driver ODBC 17, agreguen `-C` al comando. Al terminar bien, el script imprime `seed_demo OK`.

Es idempotente: se puede ejecutar varias veces sin duplicar datos. Las fechas de las pesadas se calculan respecto del día en que se ejecuta, para que el Dashboard muestre actividad reciente.

Usuarios de demostración (contraseña de ambos: `Demo1234!`):

| Usuario | Rol |
|---|---|
| `YPF\ADMIN` | Administrador de Sistema |
| `YPF\OPERADOR` | Gerente de Puesto de Básculas |

> La aplicación **todavía no pide inicio de sesión**: estos usuarios existen en la base para cuando se implemente. Son solo para demostración; en un entorno real deben eliminarse o cambiarse sus contraseñas.

### 3. Configurar y ejecutar el backend

La cadena de conexión **no está en el repositorio**. Se configura con *user-secrets* de .NET. Desde la carpeta `Backend/`:

```
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=.\SQLEXPRESS;Database=BalanzaCILP;Trusted_Connection=True;TrustServerCertificate=True"
```

Con LocalDB, el servidor es `(localdb)\MSSQLLocalDB`:

```
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\MSSQLLocalDB;Database=BalanzaCILP;Trusted_Connection=True;TrustServerCertificate=True"
```

El nombre de la base (`Database=`) tiene que coincidir con el que se usó al publicar. Luego, desde `Backend/`:

```
dotnet run --launch-profile http
```

La API queda disponible en `http://localhost:5033`. En modo desarrollo expone la especificación OpenAPI. La primera vez la compilación puede tardar un par de minutos.

Para comprobar que se conecta a la base, abran `http://localhost:5033/api/Tanques` en el navegador: tiene que devolver los tanques de demostración en formato JSON.

> Usen siempre el perfil `http`. El frontend apunta a `http://localhost:5033`, y con el perfil `https` la redirección a HTTPS hace que el navegador bloquee las peticiones (CORS).

> El backend solo **mapea** las tablas existentes. No crea ni migra el esquema: no usen migrations de Entity Framework. Todo cambio de estructura se hace en el proyecto `Database/`.

### 4. Ejecutar el frontend

Desde la carpeta `Frontend/`:

```
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

El frontend se comunica con la API en `http://localhost:5033/api` (definido en `Frontend/src/api/agent.js`), y el backend acepta peticiones únicamente desde `http://localhost:5173`. Si cambian alguno de los puertos, hay que actualizar ambos lugares.

## Pantallas principales

El menú lateral tiene dos grupos:

- **Operaciones:** Inicio (Panel de Control), Gestión de Pesadas, Órdenes de Transporte, Planificación Logística (autorizaciones de descarga y órdenes de entrega) y Reportes.
- **Administración:** Vehículos, Conductores, Productos, Razones Sociales, Básculas, Tanques, Puestos de Expedición, Dispositivos de Detección, Puntos de Menú y Usuarios.

El detalle de uso está en `Docs/Manual_Usuario_CILP.md`.

## Solución de problemas

**El backend arranca con el error "Falta ConnectionStrings:DefaultConnection".**
No se configuró el secreto. Ejecuten el comando `dotnet user-secrets set` del paso 3 desde la carpeta `Backend/`.

**El backend no se conecta a la base ("Cannot open database" o "Invalid object name").**
Verifiquen que la instancia de SQL Server esté en ejecución y que el nombre de `Server` en la cadena de conexión coincida con su instancia. Verifiquen también que el `Database=` de la cadena sea el mismo en el que se publicó el proyecto. Si las tablas quedaron en `master` y la cadena apunta a `BalanzaCILP` (o al revés), la API da error en todas las pantallas. Para ver dónde están las tablas:

```
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -Q "SELECT name FROM sys.databases"
```

**`sqlcmd` dice "Error Locating Server/Instance Specified".**
El servidor del comando no existe en su equipo. Si solo tienen LocalDB, usen `-S "(localdb)\MSSQLLocalDB"` en vez de `.\SQLEXPRESS`.

**`dotnet run` se queda en "Compilando..." mucho tiempo.**
Cortenlo con `Ctrl+C` y prueben `dotnet build-server shutdown` y luego `dotnet run --no-build --launch-profile http`. Si el repositorio está dentro de OneDrive, muévanlo a otra carpeta (por ejemplo `C:\dev`): OneDrive puede bloquear los archivos de `bin` y `obj`.

**El frontend carga pero las listas aparecen vacías o hay errores de red.**
Confirmen que el backend esté corriendo en el puerto 5033, con el perfil `http`, y que el frontend corra exactamente en `http://localhost:5173`, porque el backend rechaza otros orígenes (CORS).

**Las listas están vacías aunque todo conecta.**
Falta cargar los datos de demo (paso 2), o crear los registros desde la sección Administración.

## Documentación

- `Docs/CUs.md`: especificación funcional y casos de uso.
- `Docs/Estado implementacion CU.md`: estado de implementación de cada caso de uso.
- `Docs/Manual_Usuario_CILP.md`: manual de usuario.
- `Docs/Justificacion_Tecnologia.md`: justificación del stack y las herramientas.
- `Docs/DER_Balanza_CILP (1).png`: diagrama entidad-relación.

## Equipo

Cristalli, Villa Flores, Rodríguez.