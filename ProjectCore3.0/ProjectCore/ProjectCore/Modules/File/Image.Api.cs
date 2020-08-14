using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File.Api
{
    [Route("api/image/")]
    public class Image: BaseAPIController
    {
        private readonly File.Image _image;
        public Image(File.Image image)
        {
            _image = image;
        }

        [AllowAnonymous]
        [HttpGet("{id}/{size?}/{*slug}")]
        public async Task<PhysicalFileResult> Get([FromRoute] Model.Image.GetModel.Input input)
        {
            var data = await _image.Get(input);
            return PhysicalFile(data.FilePath, data.FileType);
        }

        [AllowAnonymous]
        [HttpGet("square/{id}/{size?}/{*slug}")]
        public async Task<PhysicalFileResult> Square([FromRoute] Model.Image.GetModel.Input input)
        {
            input.Square = true;
            var data = await _image.Get(input);
            return PhysicalFile(data.FilePath, data.FileType);
        }
    }
}
