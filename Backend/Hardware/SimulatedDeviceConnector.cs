using Backend.Models;

namespace Backend.Hardware
{
    // Simula básculas y cámaras OCR para poder operar y demostrar el sistema sin hardware real.
    public class SimulatedDeviceConnector : IDeviceConnector
    {
        public string Modo => "Simulado";

        public Task<LecturaPeso> LeerPesoAsync(Bascula bascula, decimal? pesoEsperadoKg, decimal ruidoKg)
        {
            // Sin referencia, simula un camión de peso intermedio.
            var baseKg = pesoEsperadoKg ?? 20000m;

            // Ruido uniforme en [-ruidoKg, +ruidoKg], redondeado al kilo (resolución del indicador).
            var ruido = (decimal)(Random.Shared.NextDouble() * 2 - 1) * ruidoKg;
            var peso = Math.Max(1m, Math.Round(baseKg + ruido, 0));

            return Task.FromResult(new LecturaPeso(peso, true, DateTime.Now, $"Simulador - {bascula.Descripcion}"));
        }

        public Task<DeteccionPatente> DetectarPatenteAsync(DispositivoDetector dispositivo, string patenteEsperada)
        {
            // Confianza entre 92 % y 99 %, como una lectura OCR real.
            var confianza = Math.Round(92m + (decimal)Random.Shared.NextDouble() * 7m, 1);
            return Task.FromResult(new DeteccionPatente(patenteEsperada, confianza, DateTime.Now, $"Simulador - {dispositivo.Descripcion}"));
        }

        // Una báscula con el certificado vencido no se considera operativa.
        public string EstadoBascula(Bascula bascula) =>
            bascula.VencimientoCertificado.Date < DateTime.Today ? EstadoEquipo.CertificadoVencido : EstadoEquipo.Online;

        public string EstadoDispositivo(DispositivoDetector dispositivo) => EstadoEquipo.Online;
    }
}