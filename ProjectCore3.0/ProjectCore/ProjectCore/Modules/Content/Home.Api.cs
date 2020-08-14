using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content.Api
{
    [Route("api/content/[controller]/[action]")]
    public class Home: BaseAPIController
    {
        
        private readonly Content.Home _home;

        public Home(Content.Home home)
        {
            _home = home;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<dynamic> ItemGetList([FromQuery] Model.Home.ItemGetList.Input input)
        {
            return await _home.ItemGetList(input);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<dynamic> CategoryGetList([FromQuery] Model.Home.CategoryList.Input input)
        {
            return await _home.CategoryGetList(input);
        }
    }
}
