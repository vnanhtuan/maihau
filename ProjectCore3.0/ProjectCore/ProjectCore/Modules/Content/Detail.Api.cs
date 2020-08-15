using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content.Api
{
	[Route("api/content/[controller]/[action]")]
	public class Detail: BaseAPIController
	{
		private readonly Content.Detail _detail;

		public Detail(Content.Detail detail)
		{
			_detail = detail;
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<dynamic> Init([FromQuery] long id)
		{
			return await _detail.Init(id);
		}
	}
}
