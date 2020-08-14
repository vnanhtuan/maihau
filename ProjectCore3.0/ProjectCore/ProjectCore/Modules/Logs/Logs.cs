using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;
using System;
using System.IO;

namespace ProjectCore.Modules.Logs
{
    public class Logs
    {
        private readonly IConfiguration _configuration;
        private static ILogger _logger;

        public Logs(IConfiguration configuration)
        {
            _configuration = configuration;

			var currentDirectory = _configuration.GetValue<string>(WebHostDefaults.ContentRootKey);
			var logPath = Path.Combine(currentDirectory, "Logs");
			var logFilePath = Path.Combine(logPath, "log-.txt");

			Log.Logger = new LoggerConfiguration()
				.MinimumLevel.Debug()
				.MinimumLevel.Override("Microsoft", LogEventLevel.Information)
				.Enrich.FromLogContext()
				.WriteTo.File(
					logFilePath,
					rollingInterval: RollingInterval.Day,
					shared: true,
					flushToDiskInterval: TimeSpan.FromSeconds(1),
					outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff z} [{Level:u3}] {Message:lj}{NewLine}{Exception}{NewLine}")
				.CreateLogger();

			_logger = Log.Logger;
		}

		public void Error(Exception exception, string messageTemplate)
		{
			_logger.Error(exception, messageTemplate);
		}
		public void Error(string message)
		{
			Error(null, message);
		}

		public void Information(Exception exception, string messageTemplate)
		{
			_logger.Information(exception, messageTemplate);
		}
		public void Information(string message)
		{
			Information(null, message);
		}
	}
}
