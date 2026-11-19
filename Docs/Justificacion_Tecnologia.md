# Justificación de Tecnologías y Herramientas

## 1. Elección del Lenguaje de Programación y Stack Tecnológico

Para el desarrollo del sistema **CILP** se seleccionó una arquitectura moderna y robusta, con una API REST en el servidor y una aplicación web de página única (SPA) en el cliente. El objetivo es garantizar escalabilidad, seguridad y facilidad de mantenimiento.

### Backend: C# con ASP.NET Core (.NET 10)
Se eligió **C#** sobre el framework **ASP.NET Core** (.NET 10) por las siguientes razones:
*   **Tipado fuerte y seguridad:** al ser un lenguaje fuertemente tipado, reduce los errores en tiempo de ejecución, algo crítico en un sistema que maneja datos sensibles de pesaje y logística.
*   **Rendimiento:** ASP.NET Core es uno de los frameworks web más rápidos del mercado, lo que permite procesar registros de pesaje y consultas de órdenes de transporte con latencia mínima.
*   **Ecosistema empresarial:** ofrece integración nativa con SQL Server y herramientas de depuración de primer nivel (Visual Studio).
*   **Acceso a datos con Entity Framework Core:** el backend usa **Entity Framework Core** (proveedor SQL Server) solo para **mapear** las entidades al esquema existente. El esquema no lo crea ni lo migra el backend: se define y versiona en el proyecto de base de datos (ver sección de Base de Datos).
*   **Seguridad de credenciales:** la cadena de conexión no se guarda en el repositorio. En desarrollo se administra con *user-secrets* de .NET, y las contraseñas de usuario se almacenan como hash mediante `PasswordHasher`, nunca en texto plano.
*   **Documentación de la API:** el backend expone la especificación **OpenAPI**, lo que facilita probar y documentar los endpoints.

### Frontend: React (JavaScript) con Vite y Tailwind CSS
Para la interfaz de usuario se seleccionó la librería **React**, junto con herramientas que aceleran el desarrollo:
*   **Arquitectura basada en componentes:** permite construir elementos reutilizables (tablas de órdenes, formularios de pesaje, menú lateral), lo que acelera el desarrollo y asegura consistencia visual.
*   **Experiencia de usuario (UX):** al ser una *Single Page Application*, la navegación entre "Operaciones", "Maestros" y "Reportes" es instantánea, sin recargas completas de página, simulando una aplicación de escritorio.
*   **Vite:** herramienta de construcción y servidor de desarrollo con recarga inmediata, que acorta el ciclo de prueba.
*   **Tailwind CSS:** estilos mediante clases utilitarias, que dan un diseño uniforme sin mantener hojas de estilo extensas.
*   **Librerías de apoyo:** *React Router* (navegación entre pantallas), *React Hook Form* (formularios y validaciones), *Axios* (comunicación con la API) y *Lucide* (iconografía).

### Base de Datos: Microsoft SQL Server
*   **Integridad de datos:** es un motor relacional que garantiza la estructura estricta que requiere el sistema (relaciones entre vehículos, conductores, empresas, órdenes de transporte y pesadas), con claves foráneas, restricciones y transacciones.
*   **Coherencia con el diseño:** es el motor definido en la especificación del proyecto y en el diseño entidad-relación.
*   **Esquema versionado como código:** la base se define en un **proyecto de base de datos de SQL Server** (`.sqlproj`) incluido en el repositorio. Contiene las tablas, funciones, procedimientos almacenados, triggers de auditoría, los datos de sistema (estados, tipos, unidades), los datos iniciales de roles y casos de uso, y un script de datos de demostración. Así, cualquier integrante puede reconstruir la base completa desde el repositorio.
*   **Auditoría:** los triggers registran fecha y usuario de alta y modificación de cada registro, lo que da trazabilidad sobre las operaciones de pesaje.

### Seguridad y control de acceso
*   **Inicio de sesión obligatorio:** para usar el sistema es necesario autenticarse con usuario y contraseña. Las contraseñas se almacenan como hash y nunca en texto plano.
*   **Control de acceso basado en roles (RBAC):** cada usuario pertenece a un rol, y cada rol tiene asignados los casos de uso que puede ejecutar. La base de datos incluye las tablas de roles, casos de uso y su relación, que sustentan estos permisos.
*   **Protección de la API:** el backend valida la identidad y el rol en cada petición, de modo que las restricciones no dependen solo de lo que muestra la interfaz.

---

## 2. Herramientas para la Toma de Decisiones y Gestión

La elección de estas herramientas busca maximizar la transparencia, la trazabilidad del trabajo y una comunicación fluida entre los desarrolladores y los interesados (stakeholders).

### Gestión del Código: Git y GitHub
*   **Justificación:** permite un control de versiones distribuido. Es fundamental para trabajar en equipo sin sobrescribir el trabajo de otros, mantener un historial completo de cambios (quién modificó qué y cuándo) y facilitar la incorporación de nuevas funcionalidades mediante *Pull Requests* para revisión de código.

### Gestión de Proyectos: Trello / Jira
*   **Justificación:** se utiliza una metodología ágil (Kanban/Scrum). Estas herramientas permiten visualizar el estado real del proyecto (Pendiente > En progreso > Testeo > Terminado).
    *   *Ejemplo:* una tarjeta para "Crear ABM de Conductores" se mueve a "Terminado" solo cuando cumple con los criterios de aceptación, lo que facilita decidir cuándo liberar una nueva versión.

### Enfoque de Desarrollo: Desarrollo Funcional Directo
*   **Justificación:** se optó por prescindir de herramientas de diseño estático (como Figma) para pasar directamente al **desarrollo del sistema funcional**.
*   **Beneficio:** esta estrategia "Code-First" permite validar la lógica de negocio y la experiencia de usuario sobre el software real desde el primer momento, reduciendo los tiempos de entrega y evitando la discrepancia entre el diseño estático y la implementación final.