using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectCore.Modules.Authentication
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class RoleAuthorizeAttribute: AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly List<string> _roleList;
        public RoleAuthorizeAttribute(string role = "")
        {
            _roleList = role.Split(',').ToList();
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

			var _unitOfWork = (Data.UnitOfWork)context.HttpContext.RequestServices.GetService(typeof(Data.UnitOfWork));
			var _current = (Common.Current)context.HttpContext.RequestServices.GetService(typeof(Common.Current));

			var isAuthorized = _unitOfWork._dbContext.UserByRole.Any(m => m.UserId == _current.UserId && (m.RoleId == Common.Const.Role.Admin || _roleList.Contains(m.RoleId)));
			if (!isAuthorized)
			{
				context.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Unauthorized);
				return;
			}
		}
	}
}
