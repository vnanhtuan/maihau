using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class List: BaseAPIController
    {
        private readonly Product.List _list;

        public List(Product.List list)
        {
            _list = list;
        }

		[AllowAnonymous]
		[HttpGet]
		public async Task<dynamic> Init()
		{
			return await _list.Init();
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<dynamic> CategoryGetList([FromQuery] Model.List.CategoryGetList.Input input)
		{
			return await _list.CategoryGetList(input);
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<dynamic> GetList([FromQuery] Model.List.GetList.Input input)
		{
			return await _list.GetList(input);
		}
	}
}
