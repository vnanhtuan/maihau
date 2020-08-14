using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File.Api
{
    [Route("api/file/[action]")]
    public class Manage: BaseAPIController
    {
        private readonly File.Manage _manage;

        public Manage(File.Manage manage)
        {
            _manage = manage;
        }

        [HttpPost]
        public async Task<dynamic> Upload([FromForm] Model.Manage.UploadModel.Input input)
        {
            input.Files = HttpContext.Request.Form.Files;
            return await _manage.Upload(input);
        }
    }
}
