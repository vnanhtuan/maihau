using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class CategoryManage : BaseAPIController
    {
        private readonly Product.CategoryManage _categoryManage;

        public CategoryManage(Product.CategoryManage categoryManage)
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
