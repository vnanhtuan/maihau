using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
	[Route("api/product/[controller]/[action]")]
	public class Manage : BaseAPIController
	{
		private readonly Product.Manage _manager;

		public Manage(Product.Manage manager)
		{
			_manager = manager;
		}

		[HttpGet]
		public async Task<dynamic> Init()
		{
			return await _manager.Init();
		}

		[HttpGet]
		public async Task<dynamic> GetList([FromQuery] Model.Manage.GetList.Input input)
		{
			return await _manager.GetList(input);
		}
	}
}
