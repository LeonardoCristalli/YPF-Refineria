# CILP — Sistema Inteligente de Gestión y Automatización de Pesajes

Sistema de pesaje de camiones para la Refinería de La Plata (YPF), en su versión final. Gestiona órdenes de transporte, planificación logística (autorizaciones de descarga y órdenes de entrega), registro de pesadas en báscula y reportes.

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `Backend/` | API REST en ASP.NET Core (.NET 10) con Entity Framework Core |
| `Frontend/` | Aplicación web en React + Vite + Tailwind CSS |
| `Database/` | Proyecto de base de datos de SQL Server (`.sqlproj`): esquema, datos de sistema, datos iniciales y datos de demo |
| `Docs/` | Documentación: casos de uso, manual de usuario, justificación de tecnologías, DER y entrega del proyecto |

## Requisitos previos

- **SQL Server** (la configuración por defecto usa la instancia local `.\SQLEXPRESS`; sirve SQL Server Express).
- **Visual Studio 2022** con la carga de trabajo *Almacenamiento y procesamiento de datos* (incluye SQL Server Data Tools, necesarias para publicar el proyecto de base de datos).
- **.NET SDK 10**.
- **Node.js** (versión LTS) y npm.
- **sqlcmd** (viene con SQL Server o se instala aparte), para cargar los datos de demo.

## Puesta en marcha

Hay que hacer los pasos en este orden: base de datos, backend y frontend.

### 1. Crear la base de datos

1. Abrir `Database/Balanza.CILP.DB.sln` con Visual Studio.
2. Clic derecho sobre el proyecto `Balanza.CILP.DataBase` y elegir **Publicar**.
3. Cargar el perfil `Balanza.CILP.DataBase.publish.xml`. Por defecto apunta a la instancia `.\SQLExpress` y crea la base `BalanzaCILP`. Si usan otra instancia, cambien la conexión de destino en ese cuadro de diálogo.
4. Publicar.

La publicación crea las tablas, funciones, procedimientos y triggers de auditoría, y carga los datos de sistema (estados, tipos de pesada, unidades de medida) y los datos iniciales de roles y casos de uso.

> **Atención:** el perfil de publicación tiene activada la opción `DropObjectsNotInSource`. Al volver a publicar, se eliminan de la base los objetos que no estén en el proyecto. No agreguen a mano objetos en la base que quieran conservar: agréguenlos al proyecto.

### 2. Cargar los datos de demo (opcional, recomendado)

El script `seed_demo.sql` **no se ejecuta al publicar**; se corre a mano. Carga vehículos, conductores, empresas, productos, básculas, órdenes de transporte con pesadas recientes y dos usuarios de prueba. Todos los datos son ficticios.

Desde la raíz del repositorio:

```
sqlcmd -S .\SQLEXPRESS -E -d BalanzaCILP -f 65001 -b -i Database\Balanza.CILP.DataBase\scripts\testdata\seed_demo.sql
```

Es idempotente: se puede ejecutar varias veces sin duplicar datos. Las fechas de las pesadas se calculan respecto del día en que se ejecuta, para que el Dashboard muestre actividad reciente.

Usuarios de demostración (contraseña de ambos: `Demo1234!`):

| Usuario | Rol |
|---|---|
| `YPF\ADMIN` | Administrador de Sistema |
| `YPF\OPERADOR` | Gerente de Puesto de Básculas |

> Con estos usuarios se puede iniciar sesión en la aplicación. Son solo para demostración: en un entorno real deben eliminarse o cambiarse sus contraseñas.

### 3. Configurar y ejecutar el backend

La cadena de conexión **no está en el repositorio**. Se configura con *user-secrets* de .NET. Desde la carpeta `Backend/`:

```
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=.\SQLEXPRESS;Database=BalanzaCILP;Trusted_Connection=True;TrustServerCertificate=True"
```

Ajusten `Server` si su instancia de SQL Server es distinta. Luego:

```
dotnet run --launch-profile http
```

La API queda disponible en `http://localhost:5033`. En modo desarrollo expone la especificación OpenAPI.

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

- **Inicio (Dashboard):** indicadores generales de la operación.
- **Operaciones:** Gestión de Pesadas, Órdenes de Transporte, Planificación Logística y Reportes.
- **Maestros:** Vehículos, Conductores, Productos, Razones Sociales, Básculas y Usuarios.

El detalle de uso está en `Docs/Manual_Usuario_CILP.md`.

## Solución de problemas

**El backend arranca con el error "Falta ConnectionStrings:DefaultConnection".**
No se configuró el secreto. Ejecuten el comando `dotnet user-secrets set` del paso 3 desde la carpeta `Backend/`.

**El backend no se conecta a la base.**
Verifiquen que la instancia de SQL Server esté en ejecución y que el nombre de `Server` en la cadena de conexión coincida con su instancia. Verifiquen también que la base `BalanzaCILP` exista (paso 1).

**El frontend carga pero las listas aparecen vacías o hay errores de red.**
Confirmen que el backend esté corriendo en el puerto 5033 y que el frontend corra exactamente en `http://localhost:5173`, porque el backend rechaza otros orígenes (CORS).

**Las listas están vacías aunque todo conecta.**
Falta cargar los datos de demo (paso 2), o crear los registros desde los Maestros.

## Documentación

- `Docs/CUs.md`: especificación funcional y casos de uso.
- `Docs/Manual_Usuario_CILP.md`: manual de usuario.
- `Docs/Justificacion_Tecnologia.md`: justificación del stack y las herramientas.
- `Docs/DER_Balanza_CILP (1).png`: diagrama entidad-relación.

## Equipo

Cristalli, Villa Flores, Rodríguez.