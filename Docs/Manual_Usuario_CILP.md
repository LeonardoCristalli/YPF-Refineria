# Manual de Usuario - Sistema de Gestión de Pesajes (CILP)

Bienvenido al sistema **CILP**. Este manual le guiará paso a paso para utilizar el sistema de manera sencilla y eficiente.

> En esta versión el sistema **no solicita inicio de sesión**: al abrir la aplicación se accede directamente al Panel de Control.

---

## 1. Pantalla Principal y Menú

Al ingresar al sistema, verá un **Menú Lateral** a la izquierda con el título "Refinería CILP". Este menú es su centro de comando para navegar por todas las funciones.

El menú está dividido en dos secciones:

### Operaciones
Aquí realizará las tareas diarias del sistema.
*   **Inicio**: Panel de Control con los indicadores generales de la operación.
*   **Gestión de Pesadas**: Pantalla utilizada por el operador de báscula para registrar las pesadas de los camiones y emitir el ticket.
*   **Órdenes de Transporte**: Consulta y alta de las órdenes de transporte.
*   **Planificación Logística**: Alta, modificación y cancelación de las Autorizaciones de Descarga (crudo) y las Órdenes de Entrega (refinados).
*   **Reportes**: Métricas operativas y reportes de movimientos.

### Administración
Aquí se configuran los datos base del sistema.
*   **Vehículos**: Gestión de camiones y acoplados habilitados.
*   **Conductores**: Gestión de los choferes permitidos.
*   **Productos**: Lista de materiales (ej. Crudo, Combustible).
*   **Razones Sociales**: Base de datos de Clientes, Proveedores y empresas de Transporte.
*   **Básculas**: Configuración técnica de las balanzas.
*   **Tanques**: Tanques de almacenamiento, con su capacidad y volumen ocupado.
*   **Puestos de Expedición**: Puntos de expedición y recepción de la planta.
*   **Dispositivos de Detección**: Dispositivos que detectan los vehículos, identificados por su IP.
*   **Puntos de Menú**: Puntos de menú (casos de uso) del sistema.
*   **Usuarios**: Gestión de personas con acceso al sistema.

---

## 2. Panel de Control

La pantalla **Inicio** muestra cuatro indicadores: **Pesajes Hoy**, **Órdenes de Transporte**, **Tonelaje Hoy** y **Conductores Activos**. Debajo se ve la **Actividad de Pesaje Reciente** (el enlace "Ver todo" lleva a Gestión de Pesadas), el estado de las básculas y tres **Accesos Rápidos**: Nueva Pesada, Planificación y Reportes.

---

## 3. Guía Paso a Paso: Realizar una Operación Completa

Para que un camión pueda ingresar y pesarse en la planta, primero debe existir una **orden** planificada. El flujo completo es: planificar la orden, registrar las dos pesadas y emitir el ticket.

### Paso 1: Planificar la orden (Logística)
Esta tarea se realiza antes de que el camión llegue a la planta.

1.  En el menú lateral, haga clic en **Planificación Logística**.
2.  Elija la pestaña según el tipo de movimiento:
    *   **Autorizaciones (Crudo)**: recepción de material. El camión llega cargado y se descarga en un tanque.
    *   **Entregas (Refinados)**: despacho de material. El camión llega vacío y se carga.
3.  Haga clic en el botón **Nueva Autorización** o **Nueva Entrega** (arriba a la derecha).
4.  Complete los campos del formulario:
    *   **Fecha Planificada**: fecha en la que se espera al camión.
    *   **Cantidad (KG)**: peso estimado en kilogramos (ej: 30000).
    *   **Nro. de Remito**: número del remito de la carga.
    *   **Producto / Material**: seleccione el material de la lista.
    *   **Tanque de Destino (Almacenamiento)**: obligatorio en las descargas. En las entregas, **Tanque de Origen** es opcional. La lista muestra la capacidad disponible de cada tanque.
    *   **Proveedor (Origen)** en las descargas, o **Cliente (Destino)** en las entregas.
    *   **Transportista**, **Vehículo (Chasis)** y **Conductor**.
5.  Haga clic en **Crear Autorización** o **Crear Entrega**.

> **Control de capacidad:** en una descarga, el sistema convierte los kilos a litros según la densidad del producto y verifica que el tanque tenga espacio. Si la carga no entra, muestra un aviso con los litros disponibles y no permite crear la orden.

**Acciones sobre una orden existente** (columna *Acciones* de la lista):
*   **Ver detalle**: muestra todos los datos de la orden.
*   **Modificar**: permite corregir los datos (botón **Guardar Cambios**).
*   **Cancelar orden**: pide un **motivo obligatorio**. En una descarga abierta, libera el volumen reservado en el tanque.
*   **Eliminar orden**: elimina la orden, previa confirmación.

La lista se puede filtrar escribiendo en el buscador (por cliente, producto o ID). La columna *Estado* indica la situación de cada orden (por ejemplo, completada o cancelada; en las canceladas, al pasar el cursor se ve el motivo).

> También puede crear órdenes desde **Órdenes de Transporte** con el botón **+ Nuevo**. En esa pantalla, para corregir una orden use el lápiz (Editar). No se pueden eliminar órdenes que ya tengan pesajes registrados.

---

### Paso 2: Registrar el Pesaje (Balanza)
Esta tarea la realiza el operador de báscula cuando el camión está físicamente en la balanza.

1.  En el menú lateral, haga clic en **Gestión de Pesadas**.
2.  **Identificar el camión** (recomendado):
    *   En el panel **Consultar Orden Asignada al Vehículo**, escriba la patente (ej: AA123BB o ABC123DE) y haga clic en **Buscar por Patente**.
    *   Aparecen los datos de la orden: patente, número de OT, producto, conductor, transportista y cantidad planificada.
    *   Haga clic en **Registrar Pesada para esta OT →**.
    *   Si no hay una orden activa para esa patente, el sistema muestra un aviso. Avise a Logística para que verifique el Paso 1.
3.  También puede usar el botón **Nueva Pesada** (arriba a la derecha) y elegir la orden en el desplegable **Orden de Transporte**. Cada opción se muestra como `OT-[número] | [Producto] | [Patente] | [Kilos]`.
4.  En la ventana **Registrar Pesada**, complete:
    *   **Peso (kg)**: el valor que indica la balanza.
    *   **Báscula**: la balanza que se está usando.
    *   **Ingreso Manual**: marque la casilla si el peso no llega automáticamente. Es obligatorio completar el **Motivo** (ej: "Falla de conexión").
5.  Haga clic en el botón **Registrar Peso**.

**Qué pesada corresponde (la define el sistema):**

| Tipo de orden | Primera pesada | Segunda pesada |
|---|---|---|
| Autorización de Descarga (crudo) | **Bruto** (camión cargado) | **Tara** (camión vacío) |
| Orden de Entrega (refinados) | **Tara** (camión vacío) | **Bruto** (camión cargado) |

**Resultado de la operación:**
*   Tras la **primera pesada**, aparece el mensaje "✓ Pesada [tipo] registrada. Aguardando pesada [tipo]".
*   Tras la **segunda pesada**, el sistema calcula el **Peso Neto** (Bruto − Tara), cierra la orden y muestra "✓ Orden completada. Peso neto: …".

**Controles del sistema al registrar:**
*   El peso debe ser mayor que cero.
*   La orden debe estar abierta (no cerrada ni cancelada) y tener pesadas pendientes: una orden admite solo dos pesadas.
*   El Bruto debe ser mayor que la Tara.
*   El peso neto debe estar dentro de la **tolerancia** del producto respecto de la cantidad planificada. Si la diferencia la supera, el sistema informa el desvío y **la pesada no se registra**.

La lista de **Gestión de Pesadas** muestra el ID de pesada, el tipo (TARA o BRUTO), producto, vehículo, peso, peso neto, báscula, fecha y hora, y si el ingreso fue **AUTO** o **MANUAL**. Se puede filtrar por producto, patente o ID.

---

### Paso 3: Emitir el Ticket de Pesada
Cuando la orden tiene las dos pesadas, en la fila correspondiente de **Gestión de Pesadas** aparece el botón del ticket (en las órdenes que aún no se completaron se ve la leyenda "En curso").

1.  Haga clic en el botón del ticket (**Ver / Imprimir Ticket de Pesada**).
2.  Se abre el **Comprobante Oficial de Pesada** con los datos de la orden, el remito, el producto, el vehículo, el conductor, el transportista, las dos pesadas con su hora y báscula, y el **Peso Neto** frente a lo planificado.
3.  Use **Imprimir Comprobante** para imprimirlo, o **Cerrar** para volver.

---

## 4. Reportes

En **Reportes** hay tres pestañas. El botón **Actualizar** (arriba a la derecha) recarga los datos de la pestaña activa, y **Exportar / Imprimir** imprime el reporte en pantalla.

*   **Operaciones & Básculas**: duración de las órdenes de transporte (tiempo entre las dos pesadas), ocupación de cada báscula y el detalle de las últimas órdenes.
*   **Movimientos por Período**: complete **Fecha Desde** y **Fecha Hasta** (la fecha Desde no puede ser posterior a Hasta). Opcionalmente filtre por **Tipo Movimiento** (todos, Órdenes de Entrega o Autorizaciones de Descarga) y por **Replanificado** (Todas, Sí, No). Haga clic en **Filtrar Período**. Se muestra un resumen y el listado de movimientos.
*   **Por Producto**: con **Fecha Desde** y **Fecha Hasta** y el botón **Filtrar Período**, muestra la carga movilizada por cada producto.

Los reportes de movimientos incluyen solamente las órdenes ya completadas (con sus dos pesadas).

---

## 5. Gestión de Datos (Administración)

Para mantener el sistema actualizado, utilice la sección Administración del menú. El procedimiento es estándar para todas las opciones:

**Ejemplo: Dar de alta un nuevo Conductor**
1.  Haga clic en **Conductores** en el menú.
2.  Haga clic en el botón azul **+ Nuevo**.
3.  Complete el formulario con los datos personales (Nombre, Apellido, DNI, Licencia).
4.  Haga clic en **Guardar**.
    *   *Para ver el detalle*: use el ícono del ojo (en las pantallas que lo tienen).
    *   *Para editar*: use el botón del lápiz en la lista.
    *   *Para dar de baja*: use el botón de la papelera. La baja es lógica: el registro deja de aparecer en las listas, pero se conserva su historial.

**Reglas de cada maestro**

*   **Tanques**: el código es obligatorio, alfanumérico (letras, números y guiones, ej: TK-101) y único entre los tanques activos. El volumen máximo debe ser mayor a cero. El **volumen ocupado** no se edita a mano: lo actualizan las autorizaciones de descarga. No se puede reducir el volumen máximo por debajo del volumen ocupado, ni dar de baja un tanque que tiene volumen almacenado.
*   **Básculas**: la fecha de vencimiento del certificado debe ser posterior a hoy. La IP debe ser una dirección IPv4 válida y única entre las básculas activas, y la combinación de lote, serie y certificado no puede repetirse.
*   **Vehículos**: los pesos y el volumen deben ser mayores a cero, el peso máximo debe superar al peso sin carga, la patente de chasis no puede repetirse entre vehículos activos y la razón social debe estar activa.
*   **Dispositivos de Detección**: la descripción admite entre 2 y 30 caracteres. La IP es obligatoria, con formato IPv4 válido y única entre los dispositivos activos.
*   **Puestos de Expedición**: la descripción es obligatoria (hasta 50 caracteres). No se puede dar de baja un puesto que tiene órdenes asociadas.
*   **Puntos de Menú**: solo se pueden consultar, ver, modificar y eliminar; **no hay botón "Nuevo"**, porque los define el sistema. El nombre es obligatorio y único. Al darlo de baja, el punto también se quita de los roles que lo tenían asignado.

---

## 6. Solución de Problemas Frecuentes

**P: El camión está en balanza pero no aparece su orden.**
> R: Esto suele ocurrir por tres razones:
> 1. La orden no fue creada. Verifique con Logística (Paso 1).
> 2. La orden ya fue completada (ya tiene las dos pesadas).
> 3. La orden fue cancelada.
> Pruebe también con la búsqueda por patente: el sistema avisa si la patente no tiene una orden activa.

**P: Al registrar la pesada aparece "Peso fuera de tolerancia".**
> R: El peso neto se desvía de la cantidad planificada más de lo que admite el producto. Verifique que la lectura de la balanza y las dos pesadas sean correctas. Si la cantidad planificada estaba mal, corríjala en Planificación Logística con **Modificar**. La pesada rechazada no queda registrada.

**P: Aparece "El peso Bruto debe ser mayor que la Tara".**
> R: Se invirtieron las pesadas o se cargó un peso incorrecto. Revise los valores. Recuerde que el tipo de pesada lo define el sistema según el tipo de orden (ver tabla del Paso 2).

**P: Hubo un error al guardar la pesada u otra operación.**
> R: Aparecerá un mensaje indicando el error. Verifique que el sistema esté conectado. Si el error persiste, intente usar el modo **Ingreso Manual** (solo para pesadas) o contacte a soporte informando el mensaje exacto.

**P: Al crear una Autorización de Descarga aparece "Capacidad insuficiente".**
> R: El tanque elegido no tiene espacio para la cantidad planificada. Elija otro tanque o reduzca la cantidad. Puede ver la capacidad disponible de cada tanque en la pantalla **Tanques**.

**P: No puedo dar de baja un tanque, un puesto o una orden.**
> R: Es una protección del sistema. Un tanque con volumen almacenado, un puesto con órdenes asociadas y una orden con pesajes registrados no pueden eliminarse. El mensaje en pantalla indica el motivo.

**P: ¿Cómo corrijo una orden mal cargada?**
> R: Vaya a **Planificación Logística**, busque la orden y use **Modificar** para corregir los datos, o **Cancelar orden** (con motivo) si ya no corresponde. Una orden con pesajes registrados no puede eliminarse.

---

## Roles y Permisos

En el menú **Administración**, la opción **Roles y Permisos** permite definir qué puntos de menú tiene cada rol.

1.  Haga clic en **Roles y Permisos**. Verá los roles con la cantidad de puntos de menú asignados.
2.  Para crear un rol, use **+ Nuevo**, escriba la descripción (de 3 a 50 caracteres, sin repetir una existente) y tilde los puntos de menú que corresponden. Haga clic en **Guardar**.
3.  Para consultar un rol use el ícono del ojo; para modificarlo, el lápiz; para darlo de baja, la papelera.

> **No se puede eliminar un rol que tiene usuarios asignados.** El sistema muestra un mensaje indicándolo.

## Lectura de báscula y cámara

En esta versión los equipos son **simulados**, pero se usan igual que los reales:

*   **Leer de báscula:** en **Nueva Pesada**, elija la orden y la báscula y haga clic en **Leer de báscula** (arriba del campo *Peso*). El peso se completa solo y la pesada queda registrada como **AUTO**. Si la báscula no está operativa (por ejemplo, con el certificado vencido), use **Ingreso Manual** y escriba el motivo.
*   **Detectar con cámara:** en **Gestión de Pesadas**, el botón **Detectar con cámara** lee la patente del camión que está en la entrada y muestra su orden, igual que la búsqueda por patente.
*   **Estado de Hardware:** el Panel de Control muestra si cada báscula y cámara está en línea.
