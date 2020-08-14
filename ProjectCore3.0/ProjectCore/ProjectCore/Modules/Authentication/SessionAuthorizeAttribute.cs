using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace ProjectCore.Modules.Authentication
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class SessionAuthorizeAttribute: AuthorizeAttribute, IAuthorizationFilter
    {
        public SessionAuthorizeAttribute()
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

			//var _unitOfWork = (Data.UnitOfWork)context.HttpContext.RequestServices.GetService(typeof(Data.UnitOfWork));
			var _current = (Common.Current)context.HttpContext.RequestServices.GetService(typeof(Common.Current));

			var isAuthorized = string.IsNullOrEmpty(_current.SessionId) == false;
			if (!isAuthorized)
			{
				context.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Unauthorized);
				return;
			}
		}
	}
}
