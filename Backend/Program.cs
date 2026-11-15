using Backend.Data;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// La connection string vive en user-secrets (dotnet user-secrets set "ConnectionStrings:DefaultConnection" "...")
// o en appsettings.Development.json; nunca en appsettings.json.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Falta ConnectionStrings:DefaultConnection. Configurala con: " +
        "dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" " +
        "\"Server=.\\SQLEXPRESS;Database=BalanzaCILP;Trusted_Connection=True;TrustServerCertificate=True\"");

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ForeignKeyConflictHandler>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// El esquema y los datos de sistema los crea la publicación del proyecto Database (ver CLAUDE.md).
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
