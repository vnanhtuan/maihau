using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content.Api
{
    [Route("api/content/[controller]/[action]")]
    public class Manage: BaseAPIController
    {
        private readonly Content.Manage _manager;
        public Manage(Content.Manage manager)
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
