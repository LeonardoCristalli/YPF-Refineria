using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportesController(AppDbContext context)
        {
            _context = context;
        }

        // CU82: Duración promedio de la Orden de Transporte.
        // Tiempo entre la primera y la última pesada de cada OT (completada = al menos 2 pesadas).
        // Sin pesadas devuelve ceros reales (no datos de ejemplo).
        [HttpGet("duracion-ordenes")]
        public async Task<ActionResult> GetDuracionOrdenes()
        {
            var pesadas = await _context.Pesadas
                .AsNoTracking()
                .Select(p => new
                {
                    p.Fecha,
                    p.Planificacion!.Id_OrdenTransporte,
                    Producto = p.Planificacion.OrdenTransporte!.OrdenDetalle!.Producto!.Descripcion,
                    Patente = p.Planificacion.OrdenTransporte.Vehiculo!.PatenteChasis
                })
                .ToListAsync();

            var ordenes = pesadas
                .GroupBy(p => p.Id_OrdenTransporte)
                .Select(g =>
                {
                    var primera = g.Min(p => p.Fecha);
                    var ultima = g.Max(p => p.Fecha);
                    var cantidad = g.Count();
                    double? duracion = cantidad > 1 ? Math.Round((ultima - primera).TotalMinutes, 1) : null;
                    return new
                    {
                        idOrdenTransporte = g.Key,
                        producto = g.First().Producto ?? "N/A",
                        patente = g.First().Patente ?? "N/A",
                        nroPesadas = cantidad,
                        duracionMinutos = duracion,
                        estado = cantidad >= 2 ? "Completada" : "En Proceso"
                    };
                })
                .OrderBy(o => o.idOrdenTransporte)
                .ToList();

            var completadas = ordenes.Where(o => o.duracionMinutos.HasValue).Select(o => o.duracionMinutos!.Value).ToList();

            return Ok(new
            {
                promedioMinutos = completadas.Count > 0 ? Math.Round(completadas.Average(), 1) : 0,
                totalOrdenesCompletadas = completadas.Count,
                distribucion = new[]
                {
                    new { rango = "< 30 min", cantidad = completadas.Count(d => d < 30) },
                    new { rango = "30-60 min", cantidad = completadas.Count(d => d >= 30 && d < 60) },
                    new { rango = "60-90 min", cantidad = completadas.Count(d => d >= 60 && d < 90) },
                    new { rango = "> 90 min", cantidad = completadas.Count(d => d >= 90) }
                },
                ordenes
            });
        }

        // CU83: Frecuencia de ocupación por báscula.
        // Lista todas las básculas activas (con 0 si no tienen pesadas) más las pesadas manuales sin báscula.
        [HttpGet("ocupacion-basculas")]
        public async Task<ActionResult> GetOcupacionBasculas()
        {
            var porBascula = await _context.Pesadas
                .AsNoTracking()
                .GroupBy(p => p.Id_Bascula)
                .Select(g => new { IdBascula = g.Key, Total = g.Count(), Ultima = g.Max(p => p.Fecha) })
                .ToListAsync();

            var basculas = await _context.Basculas
                .AsNoTracking()
                .Where(b => b.Activo || porBascula.Select(x => x.IdBascula).Contains(b.Id_Bascula))
                .Select(b => new { b.Id_Bascula, b.Descripcion })
                .ToListAsync();

            var total = porBascula.Sum(x => x.Total);
            double Porcentaje(int n) => total > 0 ? Math.Round((double)n / total * 100, 1) : 0;

            var filas = basculas
                .Select(b =>
                {
                    var datos = porBascula.FirstOrDefault(x => x.IdBascula == b.Id_Bascula);
                    return new
                    {
                        idBascula = (int?)b.Id_Bascula,
                        nombre = b.Descripcion,
                        totalPesadas = datos?.Total ?? 0,
                        porcentaje = Porcentaje(datos?.Total ?? 0),
                        ultimaPesada = datos?.Ultima
                    };
                })
                .ToList();

            var manuales = porBascula.FirstOrDefault(x => x.IdBascula == null);
            if (manuales != null)
            {
                filas.Add(new
                {
                    idBascula = (int?)null,
                    nombre = "Ingreso manual (sin báscula)",
                    totalPesadas = manuales.Total,
                    porcentaje = Porcentaje(manuales.Total),
                    ultimaPesada = (DateTime?)manuales.Ultima
                });
            }

            return Ok(new
            {
                totalPesadas = total,
                basculas = filas.OrderByDescending(f => f.totalPesadas).ToList()
            });
        }

        // KPIs del dashboard. Cantidad_Pesada está en kg; el tonelaje se informa en toneladas.
        [HttpGet("kpis")]
        public async Task<ActionResult> GetKpis()
        {
            var hoy = DateTime.Today;
            var manana = hoy.AddDays(1);

            var pesadasHoy = _context.Pesadas.Where(p => p.Fecha >= hoy && p.Fecha < manana);
            var kgHoy = await pesadasHoy.SumAsync(p => (decimal?)p.Cantidad) ?? 0;
            var kgTotal = await _context.Pesadas.SumAsync(p => (decimal?)p.Cantidad) ?? 0;

            return Ok(new
            {
                pesadasHoy = await pesadasHoy.CountAsync(),
                tonelajeHoy = Math.Round(kgHoy / 1000, 2),
                totalOTs = await _context.OrdenTransportes.CountAsync(o => o.Activo),
                totalVehiculos = await _context.Vehiculos.CountAsync(v => v.Activo),
                totalConductores = await _context.Conductores.CountAsync(c => c.Activo),
                pesadasTotales = await _context.Pesadas.CountAsync(),
                tonelajeTotal = Math.Round(kgTotal / 1000, 2)
            });
        }

        // CU080: Movimientos por período (especificación oficial: órdenes ejecutadas filtradas por FechaFinEjecucion y tipo de movimiento).
        [HttpGet("movimientos-por-periodo")]
        public async Task<ActionResult> GetMovimientosPorPeriodo(
            [FromQuery] DateTime? desde,
            [FromQuery] DateTime? hasta,
            [FromQuery] byte? idTipoOrden = null,
            [FromQuery] bool? replanificado = null)
        {
            // CU080-RF01: el rango Desde / Hasta de Fecha Fin de Ejecución es obligatorio
            if (!desde.HasValue || !hasta.HasValue)
                return BadRequest("Las fechas Desde y Hasta son obligatorias.");

            // CU080-RN02: Desde debe ser menor o igual a Hasta
            if (desde.Value.Date > hasta.Value.Date)
                return BadRequest("La fecha Desde debe ser menor o igual a la fecha Hasta.");

            var desdeEfectivo = desde ?? DateTime.Today.AddMonths(-1);
            var hastaEfectivo = hasta?.Date.AddDays(1) ?? DateTime.Today.AddDays(1);

            var query = _context.OrdenTransportes
                .AsNoTracking()
                .Where(ot => ot.Activo
                    && ot.Id_EstadoOrdenTransporte == 5   // CU080-RN01: solo órdenes en estado Ejecutado (t_EstadoOrdenTransporte)
                    && ot.FechaFinEjecucion != null
                    && ot.FechaFinEjecucion >= desdeEfectivo
                    && ot.FechaFinEjecucion < hastaEfectivo);

            // CU080-RF02 / RF04: filtro opcional "Replanificado" (vacío = todas, Sí, No)
            if (replanificado.HasValue)
            {
                if (replanificado.Value)
                    query = query.Where(ot => ot.FechaFinReplanificacion != null || ot.MotivoReplanificacion != null);
                else
                    query = query.Where(ot => ot.FechaFinReplanificacion == null && ot.MotivoReplanificacion == null);
            }

            if (idTipoOrden.HasValue && idTipoOrden.Value > 0)
            {
                query = query.Where(ot => ot.OrdenDetalle != null
                    && ot.OrdenDetalle.Orden != null
                    && ot.OrdenDetalle.Orden.Id_TipoOrden == idTipoOrden.Value);
            }

            var ots = await query
                .Select(ot => new
                {
                    ot.Id_OrdenTransporte,
                    ot.FechaPlanificacion,
                    ot.FechaInicioEjecucion,
                    FechaFinEjecucion = ot.FechaFinEjecucion!.Value,
                    IdTipoOrden = ot.OrdenDetalle != null && ot.OrdenDetalle.Orden != null
                        ? ot.OrdenDetalle.Orden.Id_TipoOrden : (byte)1,
                    TipoOrden = ot.OrdenDetalle != null && ot.OrdenDetalle.Orden != null
                        ? (ot.OrdenDetalle.Orden.Id_TipoOrden == 2 ? "Autorización de Descarga" : "Orden de Entrega")
                        : "Orden de Entrega",
                    ot.Id_EstadoOrdenTransporte,
                    Estado = ot.EstadoOrdenTransporte != null ? ot.EstadoOrdenTransporte.Descripcion : "Ejecutado",
                    Producto = ot.OrdenDetalle != null && ot.OrdenDetalle.Producto != null
                        ? ot.OrdenDetalle.Producto.Descripcion : "N/A",
                    CantidadPlanificada = ot.OrdenDetalle != null
                        ? (decimal?)ot.OrdenDetalle.Peso : null,
                    Transportista = ot.RazonSocialTransportista != null
                        ? ot.RazonSocialTransportista.Descripcion : "N/A",
                    Vehiculo = ot.Vehiculo != null ? ot.Vehiculo.PatenteChasis : "N/A",
                    Pesadas = _context.Pesadas
                        .Where(p => p.Planificacion != null && p.Planificacion.Id_OrdenTransporte == ot.Id_OrdenTransporte)
                        .OrderBy(p => p.Id_TipoPesada)
                        .Select(p => new { p.Id_TipoPesada, p.Cantidad })
                        .ToList()
                })
                .ToListAsync();

            var registros = ots.Select(ot =>
            {
                var tara = ot.Pesadas.FirstOrDefault(p => p.Id_TipoPesada == 1)?.Cantidad;
                var bruto = ot.Pesadas.FirstOrDefault(p => p.Id_TipoPesada == 2)?.Cantidad;
                var neto = tara.HasValue && bruto.HasValue ? Math.Abs(bruto.Value - tara.Value) : (decimal?)null;

                return new MovimientoPeriodoDto
                {
                    IdOT = ot.Id_OrdenTransporte,
                    Fecha = ot.FechaFinEjecucion,
                    FechaPlanificacion = ot.FechaPlanificacion,
                    IdTipoOrden = ot.IdTipoOrden,
                    TipoOrden = ot.TipoOrden,
                    Producto = ot.Producto,
                    Transportista = ot.Transportista,
                    Vehiculo = ot.Vehiculo,
                    CantidadPlanificada = ot.CantidadPlanificada,
                    PesoTara = tara,
                    PesoBruto = bruto,
                    PesoNeto = neto,
                    Estado = ot.Estado
                };
            }).OrderBy(r => r.Fecha).ThenBy(r => r.IdOT).ToList();

            var totalOTs = registros.Count;
            var totalKgNeto = registros.Where(r => r.PesoNeto.HasValue).Sum(r => r.PesoNeto!.Value);
            var diasEnPeriodo = Math.Max(1, (hastaEfectivo.Date - desdeEfectivo.Date).TotalDays);
            var promedioDiario = Math.Round((double)totalKgNeto / diasEnPeriodo, 2);

            return Ok(new
            {
                registros,
                resumen = new
                {
                    totalOTs,
                    totalKgNeto = Math.Round(totalKgNeto, 2),
                    promedioDiario,
                    desde = desdeEfectivo.Date,
                    hasta = hastaEfectivo.Date.AddDays(-1)
                }
            });
        }

        // CU081: Movimientos agrupados por producto.
        // Mismo filtro de período; retorna un registro por producto ordenado por totalKgNeto desc.
        [HttpGet("movimientos-por-producto")]
        public async Task<ActionResult> GetMovimientosPorProducto(
            [FromQuery] DateTime? desde,
            [FromQuery] DateTime? hasta)
        {
            var desdeEfectivo = desde ?? DateTime.Today.AddMonths(-1);
            var hastaEfectivo = hasta?.Date.AddDays(1) ?? DateTime.Today.AddDays(1);

            var ots = await _context.OrdenTransportes
                .AsNoTracking()
                .Where(ot => ot.Activo
                    && ot.FechaFinEjecucion != null
                    && ot.FechaFinEjecucion >= desdeEfectivo
                    && ot.FechaFinEjecucion < hastaEfectivo)
                .Select(ot => new
                {
                    IdProducto = ot.OrdenDetalle != null ? (int?)ot.OrdenDetalle.Id_Producto : null,
                    Producto = ot.OrdenDetalle != null && ot.OrdenDetalle.Producto != null
                        ? ot.OrdenDetalle.Producto.Descripcion : "N/A",
                    CantidadPlanificada = ot.OrdenDetalle != null ? (decimal?)ot.OrdenDetalle.Peso : null,
                    Pesadas = _context.Pesadas
                        .Where(p => p.Planificacion != null && p.Planificacion.Id_OrdenTransporte == ot.Id_OrdenTransporte)
                        .OrderBy(p => p.Id_TipoPesada)
                        .Select(p => new { p.Id_TipoPesada, p.Cantidad })
                        .ToList()
                })
                .ToListAsync();

            var agrupado = ots
                .GroupBy(ot => new { ot.IdProducto, ot.Producto })
                .Select(g =>
                {
                    var cantidadOTs = g.Count();
                    var totalKgPlanificado = g.Sum(ot => ot.CantidadPlanificada ?? 0);
                    var kgsNeto = g.Select(ot =>
                    {
                        var tara = ot.Pesadas.FirstOrDefault(p => p.Id_TipoPesada == 1)?.Cantidad;
                        var bruto = ot.Pesadas.FirstOrDefault(p => p.Id_TipoPesada == 2)?.Cantidad;
                        return tara.HasValue && bruto.HasValue ? Math.Abs(bruto.Value - tara.Value) : (decimal?)null;
                    }).Where(n => n.HasValue).Select(n => n!.Value).ToList();

                    var totalKgNeto = kgsNeto.Sum();
                    var promedioPorOT = cantidadOTs > 0 && kgsNeto.Count > 0
                        ? Math.Round((double)totalKgNeto / cantidadOTs, 2) : 0;

                    return new MovimientoProductoDto
                    {
                        IdProducto = g.Key.IdProducto,
                        Descripcion = g.Key.Producto,
                        CantidadOTs = cantidadOTs,
                        TotalKgPlanificado = Math.Round(totalKgPlanificado, 2),
                        TotalKgNeto = Math.Round(totalKgNeto, 2),
                        PromedioPorOT = (decimal)promedioPorOT
                    };
                })
                .OrderByDescending(x => x.TotalKgNeto)
                .ToList();

            return Ok(agrupado);
        }

        // ─── DTOs ───────────────────────────────────────────────────────────────

        public class MovimientoPeriodoDto
        {
            public long IdOT { get; set; }
            public DateTime Fecha { get; set; }
            public DateTime? FechaPlanificacion { get; set; }
            public byte IdTipoOrden { get; set; }
            public string TipoOrden { get; set; } = "";
            public string Producto { get; set; } = "";
            public string Transportista { get; set; } = "";
            public string Vehiculo { get; set; } = "";
            public decimal? CantidadPlanificada { get; set; }
            public decimal? PesoTara { get; set; }
            public decimal? PesoBruto { get; set; }
            public decimal? PesoNeto { get; set; }
            public string Estado { get; set; } = "";
        }

        public class MovimientoProductoDto
        {
            public int? IdProducto { get; set; }
            public string Descripcion { get; set; } = "";
            public int CantidadOTs { get; set; }
            public decimal TotalKgPlanificado { get; set; }
            public decimal TotalKgNeto { get; set; }
            public decimal PromedioPorOT { get; set; }
        }
    }
}