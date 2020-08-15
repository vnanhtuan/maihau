using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class List
    {
        private readonly Repository _repository;
        private readonly File.Repository _fileRepository;

        public List(Repository repository, File.Repository fileRepository)
        {
            _repository = repository;
            _fileRepository = fileRepository;
        }

        public async Task<dynamic> Init()
        {
            return new
            {
            };
        }

        public async Task<object> CategoryGetList(Model.List.CategoryGetList.Input input)
        {
            if (input.CategoryId.HasValue == false)
                input.CategoryId = 1;
            long? categoryId = input.CategoryId;

            var hasChildren = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
            {
                ParentId = categoryId
            }).AnyAsync();

            if (hasChildren == false)
                categoryId = await _repository.CategoryGetQuery(categoryId.Value).Select(m => m.ParentId).FirstOrDefaultAsync();

            string categoryName = await _repository.CategoryGetQuery(input.CategoryId.Value).Select(m => m.Name).FirstOrDefaultAsync();

            var childrenList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { ParentId = categoryId.Value })
                .Select(m => new { m.Id, m.Name }).ToListAsync();

            var parentList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { ParentListById = input.CategoryId.Value }).Where(m => m.Id != 1)
                .Select(m => new { m.Id, m.Name }).ToListAsync();

            var brandIdList = await _repository.GetQuery(new Model.Repository.GetQuery.Input { ByCategoryId = input.CategoryId.Value }).GroupBy(mn => mn.BrandId).Select(m => m.Key).ToListAsync();

            var brandList = await _repository.ProductBrandGetQuery().Where(m => brandIdList.Contains(m.Id)).Select(m => new { m.Id, m.Name }).ToListAsync();

            return new
            {
                categoryId,
                categoryName,
                childrenList,
                parentList,
                brandList,
            };
        }

        public async Task<Model.List.GetList.Output> GetList(Model.List.GetList.Input input)
        {
            int pageSize = 20;

            string categoryName = input.CategoryId.HasValue ? _repository.CategoryGetQuery(input.CategoryId.Value).Select(m => m.Name).FirstOrDefault() : "";

            var model = _repository.GetQuery(new Model.Repository.GetQuery.Input
            {
                ByCategoryId = input.CategoryId,
                ByBrandId = input.BrandId,
                IsVisible = true,
                Keyword = input.Keyword,
                OrderBy = input.OrderBy,
            });

            var itemPage = await PageList<Model.List.GetList.Item>.CreateAsync(model.Select(m => new Model.List.GetList.Item
            {
                Id = m.Id,
                Name = m.Name,
                Price = m.Price,
                PriceSource = m.PriceSource,
                SaleOffPercent = m.SaleOffPercent,
                CategoryName = m.ProductByCategory.Select(n => n.Category.Name).FirstOrDefault(),
            }), input.PageIndex, pageSize);

            foreach (var item in itemPage)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Product);

            return new Model.List.GetList.Output
            {
                CategoryName = categoryName,
                ItemList = itemPage,
                PageIndex = itemPage.PageIndex,
                PageSize = pageSize,
                TotalItems = itemPage.TotalItems,
                TotalPages = itemPage.TotalPages,
            };
        }
    }
}
