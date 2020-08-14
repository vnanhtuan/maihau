using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class CategoryPost: BaseAPIController
    {
        private readonly Product.CategoryPost _categoryPost;

        public CategoryPost(Product.CategoryPost categoryPost)
        {
            _categoryPost = categoryPost;
        }

        [HttpGet]
        public async Task<dynamic> Init([FromQuery] long? id, long? parentId)
        {
            return await _categoryPost.Init(id, parentId);
        }

        [HttpGet]
        public async Task<dynamic> GetOrderList([FromQuery] long? parentId)
        {
            return await _categoryPost.GetOrderList(parentId);
        }

        [HttpPost]
        public async Task<dynamic> Submit([FromBody] Model.CategoryPost.Submit.Input input)
        {
            return await _categoryPost.Submit(input);
        }

        [HttpPost]
        public async Task<dynamic> Delete([FromBody] long id)
        {
            return await _categoryPost.Delete(id);
        }
    }
}
