using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Security.Claims;

namespace ProjectCore.Modules.Common
{
    public class Current
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public Current(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        public string UserId
        {
            get
            {
                return _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(m => m.Type == ClaimTypes.Sid)?.Value;
            }
        }

        public string SessionId
        {
            get
            {
                return _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(m => m.Type == ClaimTypes.Locality)?.Value;
            }
        }

        public string LoginId
        {
            get
            {
                return _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(m => m.Type == ClaimTypes.GroupSid)?.Value;
            }
        }

        public DateTime? TokenDateCreated
        {
            get
            {
                var dateCreated = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(m => m.Type == ClaimTypes.DateOfBirth)?.Value;
                if (string.IsNullOrEmpty(dateCreated))
                    return null;
                else
                    return DateTime.Parse(dateCreated);
            }
        }

        public string UserIP
        {
            get
            {
                if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
                    return null;
                return _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            }
        }

        public string DomainName
        {
            get { return _httpContextAccessor.HttpContext.Request.Host.Host.Replace("www.", ""); }
        }

        public string DomainURL
        {
            get { return _httpContextAccessor.HttpContext.Request.Scheme + "://" + _httpContextAccessor.HttpContext.Request.Host; }
        }

        public string Directory
        {
            get
            {
                return _configuration.GetValue<string>(WebHostDefaults.ContentRootKey);
            }
        }

        public DateTime Now
        {
            get
            {
                return DateTime.Now;
            }
        }
    }
}
