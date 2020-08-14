using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Modules.Common;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User.Api
{
    [Route("api/user/[controller]/[action]")]
    public class Login: Base.BaseAPIController
    {
		private readonly Modules.User.Login _login;
		public Login(Modules.User.Login login)
		{
			_login = login;
		}

		[AllowAnonymous]
		[HttpPost]
		public async Task<ApiResult<string>> Submit([FromBody] Model.Login.Submit.Input input)
		{
			return await _login.Submit(input);
		}

		[HttpGet]
		public async Task<dynamic> Logout()
		{
			return await _login.Logout();
		}
	}
}
