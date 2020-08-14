using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Api
{
    [Route("api/product/[controller]/[action]")]
    public class BrandManage : BaseAPIController
    {
        private readonly Product.BrandManage _banrdManage;

        public BrandManage(Product.BrandManage banrdManage)
        {
            _banrdManage = banrdManage;
        }

        [HttpGet]
        public async Task<dynamic> GetList([FromQuery] Model.BrandManage.GetList.Input input)
        {
            return await _banrdManage.GetList(input);
        }
    }
}
