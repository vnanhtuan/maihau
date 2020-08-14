using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;

namespace ProjectCore.Modules.Authentication
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class ValidationAuthorizeAttribute: AuthorizeAttribute, IAuthorizationFilter
    {
        public ValidationAuthorizeAttribute()
        {
        }

		public void OnAuthorization(AuthorizationFilterContext context)
		{
			var user = context.HttpContext.User;

			if (!user.Identity.IsAuthenticated)
			{
				// it isn't needed to set unauthorized result 
				// as the base class already requires the user to be authenticated
				// this also makes redirect to a login page work properly
				// context.Result = new UnauthorizedResult();
				return;
			}

			var _current = (Common.Current)context.HttpContext.RequestServices.GetService(typeof(Common.Current));
			var tokenDateCreated = _current.TokenDateCreated;
			var isAuthorized = tokenDateCreated.HasValue;
			if (isAuthorized)
			{
				var _unitOfWork = (Data.UnitOfWork)context.HttpContext.RequestServices.GetService(typeof(Data.UnitOfWork));
                var userDateLogout = _unitOfWork._dbContext.User.Where(m => m.Id == _current.UserId).Select(m => new { m.DateLogout }).FirstOrDefault();
                if (userDateLogout == null || (userDateLogout.DateLogout.HasValue && userDateLogout.DateLogout.Value > tokenDateCreated))
                    isAuthorized = false;
            }

			if (!isAuthorized)
			{
				context.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Unauthorized);
				return;
			}
		}
	}
}
