using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content.Api
{
    [Route("api/content/[controller]/[action]")]
    public class CategoryManage: BaseAPIController
    {
        private readonly Content.CategoryManage _categoryManage;
        public CategoryManage(Content.CategoryManage categoryManage)
        {
            _categoryManage = categoryManage;
        }
        [HttpGet]
        public async Task<dynamic> GetList([FromQuery] Model.CategoryManage.GetList.Input input)
        {
            return await _categoryManage.GetList(input);
        }
    }
}
