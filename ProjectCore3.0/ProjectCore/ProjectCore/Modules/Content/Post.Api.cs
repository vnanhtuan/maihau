using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content.Api
{
    [Route("api/content/[controller]/[action]")]
    public class Post: BaseAPIController
    {
        private readonly Content.Post _post;
        public Post(Content.Post post)
        {
            _post = post;
        }

        [HttpGet]
        public async Task<dynamic> Init([FromQuery] long? id)
        {
            return await _post.Init(id);
        }

        [HttpPost]
        public async Task<dynamic> Submit([FromBody] Model.Post.Submit.Input input)
        {
            return await _post.Submit(input);
        }

        [HttpPost]
        public async Task<dynamic> Delete([FromBody] long id)
        {
            return await _post.Delete(id);
        }
    }
}
