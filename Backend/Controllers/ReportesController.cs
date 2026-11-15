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
    }
}
