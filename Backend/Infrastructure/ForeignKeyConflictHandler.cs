using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure
{
    // Convierte el error de SQL Server 547 (violación de FK) en un DELETE en un 409 con mensaje claro,
    // en vez de un 500. Ej.: borrar un vehículo que ya está asignado a una orden de transporte.
    public class ForeignKeyConflictHandler : IExceptionHandler
    {
        public const string Mensaje = "No se puede eliminar porque está siendo usado en otros registros";
        private const int SqlForeignKeyViolation = 547;

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            if (!HttpMethods.IsDelete(httpContext.Request.Method) || !IsForeignKeyViolation(exception))
            {
                return false;
            }

            httpContext.Response.StatusCode = StatusCodes.Status409Conflict;
            await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Conflicto",
                Detail = Mensaje
            }, cancellationToken);
            return true;
        }

        public static bool IsForeignKeyViolation(Exception exception) =>
            exception is DbUpdateException { InnerException: SqlException { Number: SqlForeignKeyViolation } };
    }
}
