using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace ProjectCore.Modules.Authentication
{
    public class Startup
    {
		static public void ConfigureServices(IServiceCollection services, IConfiguration Configuration)
		{
			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			}).AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ClockSkew = TimeSpan.Zero,
					ValidateLifetime = true,
					RequireExpirationTime = true,

					ValidateIssuer = false,
					ValidateAudience = false,

					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
					ValidateIssuerSigningKey = true,
				};
			});

			services.AddScoped<Token>();
		}

		static public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UseAuthentication();
			app.UseAuthorization();
		}
	}
}
