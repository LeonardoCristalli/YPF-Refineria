# Especificación Funcional: Sistema Inteligente de Gestión y Automatización de Pesajes (CILP)

Este documento contiene la lógica detallada de los Casos de Uso (CUs) para el sistema de pesaje de la Refinería de La Plata. Está diseñado para ser procesado por LLMs en el desarrollo de la arquitectura y lógica del proyecto.

## 1. Resumen de Casos de Uso (Módulos)

El sistema se compone de 78 Casos de Uso (CU01 a CU24 y CU030 a CU083) organizados en cuatro módulos principales: Maestros, Gestión, Operaciones y Reportes.

### Módulo de Maestros (Configuración y Parametrización)
* **CU01-CU04:** Gestión de Puntos de Menú (Consultar, Ver, Modificar, Eliminar).
* **CU05-CU09:** Gestión de Roles y Permisos.
* **CU10-CU14:** Gestión de Usuarios y Autenticación.
* **CU15-CU19:** Maestro de Conductores.
* **CU20-CU24:** Maestro de Vehículos (Chasis, Acoplado, Pesos Máximos).
* **CU030-CU034:** Maestro de Productos (Densidad, Unidad de Medida).
* **CU035-CU039:** Maestro de Razones Sociales (Clientes, Proveedores, Transportistas).
* **CU040-CU044:** Dispositivos de Detección de Vehículo (Cámaras OCR).
* **CU045-CU049:** Puntos de Expedición y Recepción.
* **CU050-CU054:** Maestro de Básculas (IP, Certificados INTI, Lotes).
* **CU055-CU059:** Maestro de Tanques de Almacenamiento.

### Módulo de Gestión (Planificación Logística)
* **CU060-CU065:** Autorización de Descarga (Recepción de Crudo).
* **CU066-CU071:** Orden de Entrega (Despacho de Productos Refinados).
* **CU072-CU076:** Orden de Transporte (Vinculación de Vehículo, Conductor y Entrega).

### Módulo de Operaciones (Ejecución de Pesaje)
* **CU077:** Consultar Orden de Transporte asignada a Vehículo (vía OCR/Patente).
* **CU078:** Registrar Pesada de Transporte (Tara y Peso Bruto).
* **CU079:** Emitir Ticket de Pesada.

---

## 2. Detalle de Lógica de Negocio y Reglas (CUs Críticos)

### CU078 - Registrar Pesada de Transporte
**Meta:** Registrar el peso del vehículo (Tara o Bruto) de forma automática o manual.

* **Flujo Básico:**
    1. El vehículo arriba a la báscula.
    2. El sistema identifica la **Orden de Transporte** mediante OCR (Patente) o escaneo de código de barras.
    3. El sistema valida que la Orden esté abierta y tenga pesajes pendientes.
    4. Se obtiene la lectura en tiempo real de la báscula digital a través del **Device Connector**.
    5. **Regla de Tolerancia:** El peso capturado debe estar dentro del margen configurado para el producto/entrega.
    6. Se registra el peso (Tara si es el primero, Bruto si es el segundo).
    7. Si se completan ambos pesajes, el sistema calcula el Peso Neto y cierra la transacción.

### CU21 - Crear Vehículo (Maestro)
**Reglas de Negocio (RN):**
* **CU21-RN01:** Los campos Patente Chasis, Patente Acoplado, Peso Sin Cargar, Peso Máximo y Volumen Máximo son obligatorios.
* **CU21-RN02:** La Patente Chasis debe ser única en el sistema.
* **CU21-RN03:** Los valores de peso y volumen deben ser mayores a cero.

### CU052 - Crear Báscula (Configuración de Hardware)
**Reglas de Negocio (RN):**
* **CU052-RN05:** La fecha de "Vencimiento Certificado" (INTI) debe ser posterior a la fecha actual.
* **CU052-RN06:** La dirección IP es obligatoria, debe tener formato IPv4 y ser única.

### CU061 - Crear Autorización de Descarga
**Lógica de Flujo:**
* Se deben definir: Centro de Recepción, Material, Cantidad y Tanque de destino.
* **Validación de Capacidad:** El sistema debe verificar que la cantidad planificada no supere la capacidad máxima disponible del tanque seleccionado.

---

## 3. Arquitectura Técnica para Implementación

Pila tecnológica definida para el proyecto:

* **Arquitectura:** aplicación web de tres capas. El backend es un único proyecto ASP.NET Core con carpetas de controladores, modelos y acceso a datos (Entity Framework Core). La especificación original proponía Clean Architecture; este desvío está documentado en el documento de Entrega 3.
* **Backend:** .NET (WebAPI).
* **Frontend:** React JS (Single Page Application).
* **Base de Datos:** SQL Server.
* **Integración de Hardware:** módulo "Device Connector" en .NET detrás de la interfaz `IDeviceConnector`. La implementación incluida es un **simulador** (`Hardware:Modo = "Simulado"`) de básculas y cámaras OCR; un conector real solo debe implementar la misma interfaz.
* **Seguridad:** Autenticación con Doble Factor (2FA) y control de acceso basado en roles (RBAC).

---

## 4. Reportes y Métricas (Módulo Reportes)
* **CU080:** Reporte de movimientos por período (órdenes ejecutadas, filtrado por fecha de fin de ejecución y tipo de movimiento).
* **CU081:** Reporte de movimientos por producto.
* **CU082:** Cálculo de duración promedio de la Orden de Transporte (desde el primer pesaje hasta el cierre).
* **CU083:** Frecuencia de ocupación por báscula para optimización de flujo.