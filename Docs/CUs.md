# Especificación Funcional: Sistema Inteligente de Gestión y Automatización de Pesajes (CILP)

[cite_start]Este documento contiene la lógica detallada de los Casos de Uso (CUs) para el sistema de pesaje de la Refinería de La Plata[cite: 653, 665]. Está diseñado para ser procesado por LLMs en el desarrollo de la arquitectura y lógica del proyecto.

## 1. Resumen de Casos de Uso (Módulos)

[cite_start]El sistema se compone de 83 Casos de Uso organizados en cuatro módulos principales: Maestros, Gestión, Operaciones y Reportes[cite: 1397, 1398, 1399, 1403, 1404].

### Módulo de Maestros (Configuración y Parametrización)
* [cite_start]**CU01-CU04:** Gestión de Puntos de Menú (Consultar, Ver, Modificar, Eliminar)[cite: 1536].
* [cite_start]**CU05-CU09:** Gestión de Roles y Permisos[cite: 1536].
* [cite_start]**CU10-CU14:** Gestión de Usuarios y Autenticación[cite: 1536].
* [cite_start]**CU15-CU19:** Maestro de Conductores[cite: 1536].
* [cite_start]**CU20-CU24:** Maestro de Vehículos (Chasis, Acoplado, Pesos Máximos)[cite: 1536].
* [cite_start]**CU030-CU034:** Maestro de Productos (Densidad, Unidad de Medida)[cite: 1540].
* [cite_start]**CU035-CU039:** Maestro de Razones Sociales (Clientes, Proveedores, Transportistas)[cite: 1540].
* [cite_start]**CU040-CU044:** Dispositivos de Detección de Vehículo (Cámaras OCR)[cite: 1540].
* [cite_start]**CU045-CU049:** Puntos de Expedición y Recepción[cite: 1540].
* [cite_start]**CU050-CU054:** Maestro de Básculas (IP, Certificados INTI, Lotes)[cite: 1543].
* [cite_start]**CU055-CU059:** Maestro de Tanques de Almacenamiento[cite: 1543].

### Módulo de Gestión (Planificación Logística)
* [cite_start]**CU60-CU65:** Autorización de Descarga (Recepción de Crudo)[cite: 1543].
* [cite_start]**CU66-CU71:** Orden de Entrega (Despacho de Productos Refinados)[cite: 1543].
* [cite_start]**CU72-CU76:** Orden de Transporte (Vinculación de Vehículo, Conductor y Entrega)[cite: 1543].

### Módulo de Operaciones (Ejecución de Pesaje)
* [cite_start]**CU77:** Consultar Orden de Transporte asignada a Vehículo (vía OCR/Patente)[cite: 1547].
* [cite_start]**CU78:** Registrar Pesada de Transporte (Tara y Peso Bruto)[cite: 1547].
* [cite_start]**CU79:** Emitir Ticket de Pesada[cite: 1547].

---

## 2. Detalle de Lógica de Negocio y Reglas (CUs Críticos)

### CU78 - Registrar Pesada de Transporte
[cite_start]**Meta:** Registrar el peso del vehículo (Tara o Bruto) de forma automática o manual[cite: 823, 824, 1547].

* **Flujo Básico:**
    1. [cite_start]El vehículo arriba a la báscula[cite: 886].
    2. [cite_start]El sistema identifica la **Orden de Transporte** mediante OCR (Patente) o escaneo de código de barras[cite: 890, 891, 1466].
    3. [cite_start]El sistema valida que la Orden esté abierta y tenga pesajes pendientes[cite: 895].
    4. [cite_start]Se obtiene la lectura en tiempo real de la báscula digital a través del **Device Connector**[cite: 900, 1450].
    5. [cite_start]**Regla de Tolerancia:** El peso capturado debe estar dentro del margen configurado para el producto/entrega[cite: 905].
    6. [cite_start]Se registra el peso (Tara si es el primero, Bruto si es el segundo)[cite: 907].
    7. [cite_start]Si se completan ambos pesajes, el sistema calcula el Peso Neto y cierra la transacción[cite: 1115].

### CU21 - Crear Vehículo (Maestro)
**Reglas de Negocio (RN):**
* [cite_start]**CUOV-RN01:** Los campos Patente Chasis, Patente Acoplado, Peso Sin Cargar, Peso Máximo y Volumen Máximo son obligatorios[cite: 2343].
* [cite_start]**CUOV-RN02:** La Patente Chasis debe ser única en el sistema[cite: 2344].
* [cite_start]**CUOV-RN03:** Los valores de peso y volumen deben ser mayores a cero[cite: 2345].

### CU52 - Crear Báscula (Configuración de Hardware)
**Reglas de Negocio (RN):**
* [cite_start]**CU052-RN05:** La fecha de "Vencimiento Certificado" (INTI) debe ser posterior a la fecha actual[cite: 2879].
* [cite_start]**CU052-RN06:** La dirección IP es obligatoria, debe tener formato IPv4 y ser única[cite: 2880].

### CU61 - Crear Autorización de Descarga
**Lógica de Flujo:**
* [cite_start]Se deben definir: Centro de Recepción, Material, Cantidad y Tanque de destino[cite: 844, 846].
* [cite_start]**Validación de Capacidad:** El sistema debe verificar que la cantidad planificada no supere la capacidad máxima disponible del tanque seleccionado[cite: 848].

---

## 3. Arquitectura Técnica para Implementación

Para la generación de código, Gemini debe considerar esta pila tecnológica definida en el proyecto:

* [cite_start]**Arquitectura:** Clean Architecture (Arquitectura Limpia)[cite: 1446].
* [cite_start]**Backend:** .NET (WebAPI)[cite: 1446].
* [cite_start]**Frontend:** React JS (Single Page Application)[cite: 1441].
* [cite_start]**Base de Datos:** SQL Server[cite: 1453].
* [cite_start]**Integración de Hardware:** Módulo "Device Connector" en .NET con arquitectura orientada a eventos para comunicación con básculas y cámaras en tiempo real[cite: 1450, 1467].
* [cite_start]**Seguridad:** Autenticación con Doble Factor (2FA) y control de acceso basado en roles (RBAC)[cite: 1448, 1475].

---

## 4. Reportes y Métricas (Módulo Reportes)
* [cite_start]**CU82:** Cálculo de duración promedio de la Orden de Transporte (desde el primer pesaje hasta el cierre)[cite: 1547].
* [cite_start]**CU83:** Frecuencia de ocupación por báscula para optimización de flujo[cite: 1547].