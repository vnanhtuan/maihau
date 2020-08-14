using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectCore.Models;

namespace ProjectCore.Modules.Data
{
    public class Startup
    {
		static public void ConfigureServices(IServiceCollection services, IConfiguration Configuration)
		{
			services.AddEntityFrameworkSqlServer().AddDbContext<ProjectDbContext>(option => option
				.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
				.UseSqlServer(Configuration["Database:ConnectionString"]));

			services.AddScoped<UnitOfWork>();
		}
	}
}
