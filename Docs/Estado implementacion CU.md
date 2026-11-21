# Estado de Implementación de los Casos de Uso

Este documento compara los casos de uso especificados (según el documento de Entrega 3 y `CUs.md`) con lo que está implementado en el sistema.

**Referencias de estado**

| Estado | Significado |
|---|---|
| Implementado | El caso de uso está disponible en la aplicación. |
| Parcial | Existe una parte del caso de uso; el detalle indica qué falta. |
| Pendiente | No está disponible en la aplicación. |

**Fecha de corte:** 21/11/2026. Actualizar la tabla antes de la entrega final.

## 1. Resumen

El documento de Entrega 3 define **78 casos de uso** (CU01 a CU24 y CU030 a CU083; la numeración no incluye CU25 a CU29).

| Estado | Casos de uso | Cantidad |
|---|---|---|
| Implementado | CU01-CU24, CU030-CU083 | 78 |
| Parcial | — | 0 |
| Pendiente | — | 0 |

Avance por casos de uso: **78 de 78 (100 %)**. Falta únicamente la autenticación (inicio de sesión), con el control de acceso por roles y el doble factor que dependen de ella (sección 3).

> El conteo por estado debe recalcularse cuando cambie la tabla de la sección 2.

## 2. Detalle por módulo

### Módulo de Maestros

| CU | Nombre | Estado | Observaciones |
|---|---|---|---|
| CU01-CU04 | Puntos de Menú (consultar, ver, modificar, eliminar) | Implementado | `PuntosMenuController` y pantalla `PuntosMenuPage` sobre `t_CasoDeUso`. Sin alta, porque la especificación no la incluye. Reglas de CU03: el nombre es obligatorio y único entre los puntos de menú. La baja es lógica y quita además el punto de los roles que lo tenían asignado. |
| CU05-CU09 | Roles (consultar, crear, ver, modificar, eliminar) | Implementado | `RolesController` y pantalla `RolesPage` sobre `t_Rol` y `t_RolCasoDeUso`. Reglas: descripción obligatoria de 3 a 50 caracteres y única entre roles activos, puntos de menú asignados existentes y activos, y no se puede eliminar un rol con usuarios asignados. La baja es lógica y quita sus asignaciones. |
| CU10-CU14 | Usuarios | Implementado | Alta, consulta, modificación y baja. Las contraseñas se guardan como hash. |
| CU15-CU19 | Conductores | Implementado | |
| CU20-CU24 | Vehículos | Implementado | Reglas de CU021 y CU023: campos obligatorios, pesos y volumen mayores a cero, peso máximo mayor al peso sin carga, patente de chasis única entre vehículos activos y razón social existente y activa. |
| CU030-CU034 | Productos | Implementado | |
| CU035-CU039 | Razones Sociales | Implementado | |
| CU040-CU044 | Dispositivos de Detección de Vehículo | Implementado | Alta, consulta, modificación y baja lógica (`DispositivosDetectoresController`, pantalla `DispositivosPage`). Reglas de CU042 y CU043: IP obligatoria con formato IPv4 y única entre dispositivos activos. La descripción admite hasta 50 caracteres, según la especificación (se amplió la columna). |
| CU045-CU049 | Puntos de Expedición y Recepción | Implementado | Alta, consulta, modificación y baja lógica (`PuestosController`, pantalla `PuestosPage`). Descripción obligatoria de hasta 50 caracteres (CU047 y CU048). No se puede eliminar un puesto con órdenes asociadas. |
| CU050-CU054 | Básculas | Implementado | Reglas de CU052 y CU053: vencimiento del certificado posterior a la fecha actual, IP con formato IPv4 y única entre básculas activas, y combinación de lote, serie y certificado habilitado única. Baja lógica para conservar el historial de pesadas. |
| CU055-CU059 | Tanques de Almacenamiento | Implementado | Alta, consulta, modificación y baja lógica (`TanquesController`, pantalla `TanquesPage`). Reglas de CU057 y CU058: código obligatorio, alfanumérico (letras, números y guiones), de hasta 20 caracteres y único entre tanques activos; descripción de 2 a 50 caracteres; volumen máximo mayor a cero. El volumen ocupado lo gestionan las autorizaciones de descarga: no se edita a mano. No se puede reducir el volumen máximo por debajo del ocupado ni dar de baja un tanque con volumen almacenado. |

### Módulo de Gestión (Planificación Logística)

| CU | Nombre | Estado | Observaciones |
|---|---|---|---|
| CU060, CU061, CU062, CU063 | Autorización de Descarga: consultar, crear, ver, modificar | Implementado | Pantalla con tabs por tipo de orden. Selección de tanque de destino y validación de capacidad (CU061): los kilos se convierten a litros con la densidad del producto. Modales de detalle (CU062) y modificación (CU063). |
| CU064, CU065 | Autorización de Descarga: cancelar, eliminar | Implementado | Cancelación con motivo obligatorio (PATCH) y eliminación física en cascada con confirmación. Ambas liberan el volumen reservado en el tanque si la orden seguía abierta. |
| CU066, CU067, CU068, CU069 | Orden de Entrega: consultar, crear, ver, modificar | Implementado | Tab de Despacho de Refinados con alta, detalle, modificación y filtros por producto/transportista. |
| CU070, CU071 | Orden de Entrega: cancelar, eliminar | Implementado | Cancelación y baja disponibles en la tabla de entregas con actualización de badges de estado. |
| CU072-CU076 | Orden de Transporte | Implementado | Alta, consulta, detalle, modificación y baja. |

### Módulo de Operaciones

| CU | Nombre | Estado | Observaciones |
|---|---|---|---|
| CU077 | Consultar Orden de Transporte asignada a un vehículo | Implementado | Búsqueda por patente en backend (`/api/OrdenesTransporte/ByPatente/{patente}`) con panel visual de resultado y acceso directo a registrar pesada. |
| CU078 | Registrar Pesada de Transporte | Implementado | Valida orden activa y pesajes pendientes (máx. 2), determina TARA/BRUTO, aplica tolerancia del producto, calcula peso neto y cierra la orden en BRUTO. Notificación toast interactiva y columna de peso neto. |
| CU079 | Emitir Ticket de Pesada | Implementado | Endpoint `/api/Pesadas/Ticket/{id}` y modal con formato oficial de comprobante de balanza CILP YPF con botón de impresión directa (`window.print`). |

### Módulo de Reportes

| CU | Nombre | Estado | Observaciones |
|---|---|---|---|
| CU080 | Reporte de Movimientos por Periodos | Implementado | Considera solo órdenes en estado Ejecutado (RN01) y valida que Desde sea menor o igual a Hasta (RN02). Filtros: rango obligatorio de Fecha Fin de Ejecución, y opcionales Tipo de Movimiento (Todos, Carga, Descarga) y Replanificado (vacío, Sí, No). Muestra tarjetas de totales, tabla detallada y totalizador. |
| CU081 | Reporte de Movimientos por Productos | Implementado | Filtro por período, agrupación por producto con cantidad de OTs, total planificado vs neto, promedio por orden y barra de volumen relativo. |
| CU082 | Reporte de Duración Promedio de Orden de Transporte | Implementado | Incluye distribución por rangos de duración y detalle por orden. |
| CU083 | Reporte de Frecuencia de Ocupación por Báscula | Implementado | Gráficos de barra de porcentaje de uso y desglose por báscula. |

## 3. Funcionalidades transversales

| Funcionalidad | Estado | Observaciones |
|---|---|---|
| Autenticación (inicio de sesión) | Pendiente | A implementar antes de la entrega final según indicación. |
| Control de acceso por roles (RBAC) | Pendiente | Depende del inicio de sesión. El ABM de roles y la asignación de puntos de menú ya están implementados. |
| Doble factor de autenticación (2FA) | Pendiente | Depende del inicio de sesión. |
| Panel de control (Dashboard) | Implementado | Métricas operativas en tiempo real. |
| Integración con básculas y cámaras (Device Connector, OCR) | Simulado | `IDeviceConnector` con una implementación simulada (`SimulatedDeviceConnector`, `Hardware:Modo = "Simulado"`). La pantalla de pesadas tiene "Leer de báscula" (la pesada queda como automática) y "Detectar con cámara" (obtiene la patente y su orden), y el Panel de Control muestra el estado de los equipos. Para hardware real hay que escribir otro conector que implemente la misma interfaz. |
