using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class Home
    {
        private readonly Repository _repository;
        private readonly File.Repository _fileRepository;

        public Home(Repository repository, File.Repository fileRepository)
        {
            _repository = repository;
            _fileRepository = fileRepository;
        }

        public async Task<Model.Home.Init.Output> Init()
        {
            int pageSize = 12;
            int saleOffPageSize = 9;

            var model = _repository.GetQuery(new Model.Repository.GetQuery.Input
            {
                IsVisible = true,
                OrderBy = "dateCreatedDec",
            });

            var saleOffProductList = await model.Where(m => m.SaleOffPercent.HasValue)
                .Select(m => new Model.Home.Init.Item
                {
                    Id = m.Id,
                    Name = m.Name,
                    Price = m.Price,
                    PriceSource = m.PriceSource,
                    SaleOffPercent = m.SaleOffPercent,
                    CategoryName = m.ProductByCategory.Select(n => n.Category.Name).FirstOrDefault(),
                }).Take(saleOffPageSize).ToListAsync();

            foreach (var item in saleOffProductList)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Product);

            #region Category Popular
            var queryCategory = _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
            {
                IsVisible = true,
            });

            var categoryPopularList = await queryCategory.Where(m => m.PopularOrderNumber.HasValue)
                    .Select(m => new Model.Home.Init.CategoryPopular.Item
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Icon = m.Icon,
                        PopularOrderNumber = m.PopularOrderNumber.Value,
                    }).OrderBy(m => m.PopularOrderNumber).ToListAsync();

            foreach (var item in categoryPopularList)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Category);
            #endregion

            #region Brand Popular
            var queryBrand = _repository.ProductBrandGetQuery();

            var brandPopularList = await queryBrand.Where(m => m.PopularOrderNumber.HasValue)
                    .Select(m => new Model.Home.Init.BrandPopular.Item
                    {
                        Id = m.Id,
                        Name = m.Name,
                        PopularOrderNumber = m.PopularOrderNumber.Value,
                    }).OrderBy(m => m.PopularOrderNumber).ToListAsync();

            foreach (var item in brandPopularList)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Brand);
            #endregion

            return new Model.Home.Init.Output
            {
                SaleOffProductList = saleOffProductList,
                CategoryPopularList = categoryPopularList,
                BrandPopularList = brandPopularList,
            };
        }

        public async Task<Model.Home.CategoryTree.Output> CategoryTree()
        {
            var itemList = await _repository.CategoryGetQuery()
                .Select(m => new Model.Home.CategoryTree.Item
                {
                    Id = m.Id,
                    ParentId = m.ParentId,
                    Name = m.Name,
                    OrderNumber = m.OrderNumber,
                    Level = m.Level
                }).ToListAsync();

            return new Model.Home.CategoryTree.Output
            {
                ItemList = itemList
            };
        }
    }
}
