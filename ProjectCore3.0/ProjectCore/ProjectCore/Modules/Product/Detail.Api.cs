using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class Detail: BaseAPIController
    {
        private readonly Product.Detail _detail;

        public Detail(Product.Detail detail)
        {
            _detail = detail;
        }

		[AllowAnonymous]
		[HttpGet]
		public async Task<dynamic> Init([FromQuery] long id)
		{
			return await _detail.Init(id);
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<dynamic> CategoryGetList([FromQuery] Model.Detail.CategoryGetList.Input input)
		{
			return await _detail.CategoryGetList(input);
		}
	}
}
