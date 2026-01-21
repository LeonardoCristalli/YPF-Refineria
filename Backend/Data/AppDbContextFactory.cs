using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Backend.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            File.WriteAllText("debug_ef.txt", "Entering AppDbContextFactory.CreateDbContext\n");
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            // Using hardcoded connection string for design time to avoid config issues
            var connectionString = "Server=127.0.0.1;Database=refineria;User ID=root;Password=root;";

            optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)));

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
