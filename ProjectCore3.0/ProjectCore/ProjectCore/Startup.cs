using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ProjectCore.Modules.Logs;

namespace ProjectCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddHttpClient();

            services.AddControllers();

            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddHttpContextAccessor();

            Modules.Authentication.Startup.ConfigureServices(services, Configuration);

            Modules.Data.Startup.ConfigureServices(services, Configuration);

            services.AddSingleton<Logs>();

            services.AddScoped<Modules.Common.Current>();
            services.AddScoped<Modules.Common.Tree>();

            services.AddScoped<Modules.User.Repository>();
            services.AddScoped<Modules.User.Register>();
            services.AddScoped<Modules.User.Login>();
            services.AddScoped<Modules.User.CurrentUser>();
            services.AddScoped<Modules.User.Profile>();

            services.AddScoped<Modules.Product.Repository>();
            services.AddScoped<Modules.Product.Post>();
            services.AddScoped<Modules.Product.Manage>();
            services.AddScoped<Modules.Product.CategoryPost>();
            services.AddScoped<Modules.Product.CategoryManage>();
            services.AddScoped<Modules.Product.BrandPost>();
            services.AddScoped<Modules.Product.BrandManage>();
            services.AddScoped<Modules.Product.Home>();
            services.AddScoped<Modules.Product.List>();
            services.AddScoped<Modules.Product.Detail>();

            services.AddScoped<Modules.Content.Repository>();
            services.AddScoped<Modules.Content.Post>();
            services.AddScoped<Modules.Content.Manage>();
            services.AddScoped<Modules.Content.CategoryPost>();
            services.AddScoped<Modules.Content.CategoryManage>();
            services.AddScoped<Modules.Content.Home>();

            services.AddScoped<Modules.File.Repository>();
            services.AddScoped<Modules.File.Image>();
            services.AddScoped<Modules.File.Manage>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(x => x
               .AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());

            Modules.Authentication.Startup.Configure(app, env);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
