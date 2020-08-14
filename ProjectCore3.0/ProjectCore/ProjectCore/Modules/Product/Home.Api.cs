using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class Home: BaseAPIController
    {
        private readonly Product.Home _home;

        public Home(Product.Home home)
        {
            _home = home;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<dynamic> Init()
        {
            return await _home.Init();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<dynamic> CategoryTree()
        {
            return await _home.CategoryTree();
        }
    }
}
