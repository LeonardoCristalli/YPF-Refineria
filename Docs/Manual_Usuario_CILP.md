# Manual de Usuario - Sistema de Gestión de Pesajes (CILP)

Bienvenido al sistema **CILP**. Este manual le guiará paso a paso para utilizar el sistema de manera sencilla y eficiente.

---

## 1. Pantalla Principal y Menú

Al ingresar al sistema, verá un **Menú Lateral** a la izquierda con el título "Refinería CILP". Este menú es su centro de comando para navegar por todas las funciones.

El menú está dividido en dos secciones:

### Operaciones
Aquí realizará las tareas diarias del sistema.
*   **Inicio**: Pantalla de bienvenida con información general.
*   **Gestión de Pesadas**: Pantalla utilizada por el balancero para registrar el peso de entrada (Tara) y salida (Bruto) de los camiones.
*   **Órdenes de Transporte**: Pantalla para la logística, donde se crean y consultan las órdenes de carga o descarga planificadas.

### Maestros
Aquí se configuran los datos base del sistema.
*   **Vehículos**: Gestión de camiones y acoplados habilitados.
*   **Conductores**: Gestión de los choferes permitidos.
*   **Productos**: Lista de materiales (ej. Crudo, Combustible).
*   **Razones Sociales**: Base de datos de Clientes, Proveedores y empresas de Transporte.
*   **Básculas**: Configuración técnica de las balanzas.
*   **Usuarios**: Gestión de personas con acceso al sistema.

---

## 2. Guía Paso a Paso: Realizar una Operación Completa

Para que un camión pueda ingresar y pesarse en la planta, primero debe existir una **Orden de Transporte** válida. El flujo completo es:

### Paso 1: Crear una Orden de Transporte (Logística)
Esta tarea se realiza antes de que el camión llegue a la planta.

1.  En el menú lateral, haga clic en la opción **Órdenes de Transporte**.
2.  Verá la lista de órdenes existentes. Haga clic en el botón azul **+ Nuevo** ubicado arriba a la derecha.
3.  Se abrirá una ventana emergente con el título "Nueva Orden de Transporte". Complete los siguientes campos obligatorios:
    *   **Fecha Planificada**: Seleccione la fecha en la que se espera al camión.
    *   **Cantidad (KG)**: Ingrese el peso estimado en kilogramos (ej: 30000).
    *   **Producto**: Seleccione el material a cargar/descargar de la lista desplegable.
    *   **Cliente/Proveedor**: Seleccione la empresa dueña de la carga.
    *   **Transportista**: Seleccione la empresa transportista.
    *   **Vehículo**: Seleccione la patente del camión asignado.
    *   **Conductor**: Seleccione el chofer asignado.
4.  Revise los datos y haga clic en el botón azul **Guardar Orden** al pie del formulario.
    > *La ventana se cerrará y verá la nueva orden en la lista principal.*

---

### Paso 2: Registrar el Pesaje (Balanza)
Esta tarea la realiza el operador de báscula cuando el camión está físicamente en la balanza.

1.  En el menú lateral, haga clic en la opción **Gestión de Pesadas**.
2.  Verá el formulario "Registrar Pesada".
3.  **Identificar el Camión**:
    *   Haga clic en el desplegable **Orden de Transporte (Planificación)**.
    *   Seleccione la orden correspondiente. El formato muestra: `OT #[Número] - [Producto] ([Patente]) - [Kilos]`.
    *   *Nota: Si la lista está vacía o no encuentra la patente, contacte a Logística para verificar que la Orden de Transporte del Paso 1 fue creada.*
4.  **Capturar el Peso**:
    *   **Automático**: El campo **Lectura Báscula (kg)** mostrará el valor transmitido por la balanza digital.
    *   **Manual**: Si la balanza no conecta, marque la casilla **Ingreso Manual**. Esto habilitará el campo de peso para que pueda escribirlo y le pedirá obligatoriamente un **Motivo** (ej: "Falla de conexión").
5.  Verifique que el ID Báscula sea correcto (por defecto es 1).
6.  Haga clic en el botón azul **Registrar Peso**.

**Resultado de la operación:**
*   Si es el **Primer Pesaje** (Entrada), el sistema guardará la **Tara** del camión.
*   Si es el **Segundo Pesaje** (Salida), el sistema guardará el **Bruto**, calculará el Neto automáticamente y cerrará la orden.
*   En la parte inferior aparecerá un recuadro verde con el mensaje:
    > **✅ Pesada Registrada**
    > ID Pesada: ...
    > Tipo: Tara o Bruto
    > Peso Registrado: ... kg

---

## 3. Gestión de Datos (Maestros)

Para mantener el sistema actualizado, utilice la sección Maestros del menú. El procedimiento es estándar para todas las opciones (Vehículos, Conductores, etc.):

**Ejemplo: Dar de alta un nuevo Conductor**
1.  Haga clic en **Conductores** en el menú.
2.  Haga clic en el botón azul **+ Nuevo**.
3.  Complete el formulario con los datos personales (Nombre, Apellido, DNI, Licencia).
4.  Haga clic en **Guardar**.
    *   *Para editar*: Use el botón del lápiz en la lista.
    *   *Para borrar*: Use el botón de la papelera (solo posible si no tiene operaciones asociadas).

---

## 4. Solución de Problemas Frecuentes

**P: El camión está en balanza pero no aparece en la lista de "Orden de Transporte".**
> R: Esto suele ocurrir por dos razones:
> 1. La Orden de Transporte no fue creada. Verifique con Logística (Paso 1).
> 2. La Orden ya fue completada (ya tiene los dos pesajes realizados).

**P: Hubo un error al guardar la pesada.**
> R: Aparecerá un mensaje rojo indicando el error. Verifique su conexión a internet. Si el error persiste, intente usar el modo "Ingreso Manual" o contacte a soporte informando el mensaje de error exacto.

**P: ¿Cómo corrijo una Orden de Transporte mal cargada?**
> R: Vaya a la pantalla **Órdenes de Transporte**, busque la línea correspondiente y haga clic en el ícono del **Lápiz** (Editar) para modificar los datos, o en la **Papelera** (Eliminar) para empezar de cero. *Nota: No podrá eliminar órdenes que ya tengan pesajes registrados.*
