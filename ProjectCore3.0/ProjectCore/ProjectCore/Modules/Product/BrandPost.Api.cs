using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class BrandPost: BaseAPIController
    {
        private readonly Product.BrandPost _brandPost;

        public BrandPost(Product.BrandPost brandPost)
        {
            _brandPost = brandPost;
        }
        [HttpGet]
        public async Task<dynamic> Init([FromQuery] long? id)
        {
            return await _brandPost.Init(id);
        }

        [HttpPost]
        public async Task<dynamic> Submit([FromBody] Model.BrandPost.Submit.Input input)
        {
            return await _brandPost.Submit(input);
        }

        [HttpPost]
        public async Task<dynamic> Delete([FromBody] long id)
        {
            return await _brandPost.Delete(id);
        }
    }
}
