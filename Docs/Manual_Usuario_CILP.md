# Manual de Usuario - Sistema de Gestión de Pesajes (CILP)

Bienvenido al sistema **CILP**. Este manual le guiará paso a paso para utilizar el sistema de manera sencilla y eficiente.

---

## 🏠 1. Pantalla Principal y Menú

Al ingresar al sistema, verá un **Menú Lateral** a la izquierda. Este menú es su centro de comando.

El menú está dividido en dos secciones principales:

### 🛠️ Operaciones
Aquí realizará las tareas diarias del sistema.
*   **🏠 Inicio**: Pantalla de bienvenida.
*   **⚖️ Gestión de Pesadas**: Para registrar el peso de entrada (Tara) y salida (Bruto) de los camiones.
*   **🚚 Órdenes de Transporte**: Para crear y ver las órdenes de carga o descarga planificadas.

### 📋 Maestros (Configuración)
Aquí se cargan los datos que usa el sistema (solo se hace una vez o cuando hay cambios).
*   **🚚 Vehículos**: Camiones y acoplados.
*   **👥 Conductores**: Choferes habilitados.
*   **📦 Productos**: Lista de materiales (Crudo, Combustible, etc.).
*   **🏢 Razones Sociales**: Clientes, Proveedores y Transportistas.
*   **🖥️ Básculas**: Configuración de balanzas.
*   **👤 Usuarios**: Personas con acceso al sistema.

---

## 🚀 2. Guía Rápida: Realizar una Operación Completa

Para que un camión pueda entrar y pesarse, primero debe existir una **Orden de Transporte**. Siga estos pasos:

### Paso 1: Crear una Orden de Transporte
Antes de que llegue el camión, planifique su visita.

1.  En el menú, haga clic en **Órdenes de Transporte**.
2.  Busque y haga clic en el botón (generalmente azul) que dice **"Nueva Orden"** o **"Crear"**.
3.  Se abrirá un formulario. Complete los datos obligatorios:
    *   📅 **Fecha Planificada**: Día estimado de la operación.
    *   ⚖️ **Cantidad (KG)**: Peso estimado a transportar (ej: 30000).
    *   📦 **Producto**: Qué va a cargar/descargar.
    *   🏢 **Cliente/Proveedor**: Quién envía o recibe la carga.
    *   🚛 **Transportista**: Empresa de transporte.
    *   🚚 **Vehículo**: Patente del camión.
    *   👤 **Conductor**: Nombre del chofer.
4.  Haga clic en **Guardar**.
    > ✅ *¡Listo! La orden ya está creada y el camión está habilitado para ingresar.*

---

### Paso 2: Registrar el Pesaje (Báscula)
Cuando el camión llega a la balanza:

1.  En el menú, haga clic en **Gestión de Pesadas**.
2.  Verá el formulario de "Registrar Pesada".
3.  **Seleccione la Orden**: Despliegue la lista "Orden de Transporte".
    *   *Tip*: Busque por la **Patente** del camión o el número de Orden.
    *   *Nota*: Si no ve la orden, asegúrese de haber realizado el Paso 1 correctamente.
4.  **Verifique el Peso**:
    *   El sistema intentará leer la báscula automáticamente.
    *   Si es necesario, puede ingresar el peso manualmente marcando "Ingreso Manual" (deberá explicar el motivo).
5.  Haga clic en el botón azul **Registrar Peso**.

> **¿Qué sucede ahora?**
> *   Si es la **primera vez** que se pesa esa orden, el sistema guardará la **Tara** (peso vacío/inicial).
> *   Si es la **segunda vez** (salida), el sistema guardará el **Bruto** (peso lleno/final) y cerrará la operación.
> *   Verá un mensaje verde de confirmación: **✅ Pesada Registrada**.

---

## 📝 3. Gestión de Datos (Maestros)

Si necesita agregar un nuevo Chofer, Camión o Cliente, vaya a la sección **Maestros**. El proceso es similar en todos:

**Ejemplo: Agregar un nuevo Conductor**
1.  Clic en **Conductores** en el menú.
2.  Clic en **Nuevo Conductor**.
3.  Complete los datos (Nombre, Apellido, DNI, Licencia).
4.  Clic en **Guardar**.

---

## ❓ 4. Solución de Problemas Frecuentes

**P: No encuentro la Orden de Transporte en la pantalla de Pesadas.**
> R: Verifique que la orden esté creada para **hoy** o la fecha correcta. También revise que la orden no haya sido completada (ya pesada dos veces).

**P: El peso de la báscula no aparece.**
> R: Verifique que la báscula esté conectada y encendida. Si el problema persiste, marque "Ingreso Manual" e ingrese el peso que ve en el visor digital, luego avise a soporte técnico.

**P: Me equivoqué al crear una Orden.**
> R: Vaya a "Órdenes de Transporte", busque la orden incorrecta y haga clic en el botón de **Editar** (lápiz) o **Eliminar** (papelera) si está disponible y la orden no tiene pesajes aún.
