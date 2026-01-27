# Justificación de Tecnologías y Herramientas

## 1. Elección del Lenguaje de Programación y Stack Tecnológico

Para el desarrollo del sistema **CILP**, se ha seleccionado una arquitectura moderna y robusta que garantiza escalabilidad, seguridad y facilidad de mantenimiento.

### Backend: C# (.NET Core)
Se eligió **C#** usando el framework **.NET Core** por las siguientes razones:
*   **Tipado Fuerte y Seguridad:** Al ser un lenguaje fuertemente tipado, reduce significativamente los errores en tiempo de ejecución, lo cual es crítico para un sistema que maneja datos sensibles de pesaje y logística.
*   **Rendimiento:** .NET Core es uno de los frameworks más rápidos del mercado, permitiendo procesar transacciones de pesaje y consultas de órdenes de transporte con latencia mínima.
*   **Ecosistema Empresarial:** Ofrece una integración nativa y sencilla con bases de datos relacionales y servicios en la nube, además de contar con herramientas de depuración de clase mundial (Visual Studio).

### Frontend: React (JavaScript)
Para la interfaz de usuario se seleccionó la librería **React**:
*   **Arquitectura Basada en Componentes:** Permite construir elementos reutilizables (como las tablas de órdenes, formularios de pesaje y menús laterales), lo que acelera el desarrollo y asegura una consistencia visual en toda la aplicación.
*   **Experiencia de Usuario (UX):** Al ser una *Single Page Application (SPA)*, la navegación entre "Operaciones", "Maestros" y reportes es instantánea, sin recargas de página completas, simulando una aplicación de escritorio.
*   **Comunidad y Soporte:** Cuenta con el ecosistema más grande de librerías de terceros, facilitando la implementación de gráficos, calendarios y validaciones complejas.

### Base de Datos: MySQL
*   **Fiabilidad y Costo:** Es un motor de base de datos relacional de código abierto, lo que reduce costos de licencias sin sacrificar potencia ni seguridad.
*   **Integridad de Datos:** Ideal para mantener la estructura relacional estricta que requiere el sistema (relaciones entre vehículos, conductores, empresas y órdenes de transporte).

---

## 2. Herramientas para la Toma de Decisiones y Gestión

La elección de estas herramientas busca maximizar la transparencia, la trazabilidad del trabajo y una comunicación fluida entre los desarrolladores y los stakeholders (interesados).

### Gestión del Código: Git y GitHub
*   **Justificación:** Permite un control de versiones distribuido. Esto es fundamental para trabajar en equipo sin sobrescribir el trabajo de otros, mantener un historial completo de cambios (quién modificó qué y cuándo) y facilitar la implementación de nuevas funcionalidades mediante *Pull Requests* para revisión de código.

### Gestión de Proyectos: Trello / Jira
*   **Justificación:** Se utiliza una metodología ágil (Kanban/Scrum). Estas herramientas permiten visualizar el estado real del proyecto (Pendiente > En Progreso > Testeo > Terminado).
    *   *Ejemplo:* Una tarjeta para "Crear ABM de Conductores" se mueve a "Terminado" solo cuando cumple con los criterios de aceptación, facilitando la decisión de cuándo liberar una nueva versión.

### Comunicación: Discord / Slack / Teams
*   **Justificación:** Centralizan la comunicación del equipo, permitiendo canales específicos por temática (ej. #backend, #frontend, #errores). Esto agiliza la resolución de bloqueos y la toma de decisiones rápidas sin depender de hilos de correo interminables.

### Enfoque de Desarrollo: Prototipado Funcional Directo
*   **Justificación:** Se ha optado por prescindir de herramientas de diseño estático (como Figma) para pasar directamente al **desarrollo del prototipo funcional**.
*   **Beneficio:** Esta estrategia "Code-First" permite validar la lógica de negocio y la experiencia de usuario sobre el software real desde el primer momento, reduciendo drásticamente los tiempos de entrega y evitando la discrepancia entre el diseño estático y la implementación final.
