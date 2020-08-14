using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class BrandManage
    {
        private readonly Repository _repository;

        public BrandManage(Repository repository)
        {
            _repository = repository;
        }

        public async Task<Model.BrandManage.GetList.Output> GetList(Model.BrandManage.GetList.Input input)
        {
            var itemList = await _repository.ProductBrandGetQuery(new Model.Repository.ProductBrandGetQuery.Input
            {
                PopularOrderNumber = input.PopularOrderNumber
            })
                .Select(m => new Model.BrandManage.GetList.Item
                {
                    Id = m.Id,
                    Name = m.Name,
                    PopularOrderNumber = m.PopularOrderNumber,
                }).ToListAsync();

            return new Model.BrandManage.GetList.Output
            {
                ItemList = itemList
            };
        }
    }
}
