using Backend.Models;

namespace Backend.Hardware
{
    // Lectura de peso devuelta por una báscula.
    public record LecturaPeso(decimal PesoKg, bool Estable, DateTime Fecha, string Origen);

    // Patente leída por una cámara con OCR.
    public record DeteccionPatente(string Patente, decimal Confianza, DateTime Fecha, string Origen);

    // Estados posibles de un equipo.
    public static class EstadoEquipo
    {
        public const string Online = "ONLINE";
        public const string CertificadoVencido = "CERTIFICADO_VENCIDO";
        public const string SinConexion = "SIN_CONEXION";
    }

    // Punto único de comunicación con el hardware de la planta (Device Connector).
    // Hoy hay una implementación simulada; la real (TCP/serie hacia el indicador de la
    // báscula y API de la cámara) solo tiene que implementar esta interfaz y registrarse
    // en Program.cs con Hardware:Modo = "Real".
    public interface IDeviceConnector
    {
        string Modo { get; }

        // pesoEsperadoKg y ruidoKg son pistas para el simulador: un conector real las ignora.
        Task<LecturaPeso> LeerPesoAsync(Bascula bascula, decimal? pesoEsperadoKg, decimal ruidoKg);

        // patenteEsperada es una pista para el simulador: un conector real lee la imagen de la cámara.
        Task<DeteccionPatente> DetectarPatenteAsync(DispositivoDetector dispositivo, string patenteEsperada);

        string EstadoBascula(Bascula bascula);
        string EstadoDispositivo(DispositivoDetector dispositivo);
    }
}