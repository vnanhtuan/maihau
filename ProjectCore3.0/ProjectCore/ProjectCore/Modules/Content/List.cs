using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
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

        public async Task<Model.List.GetList.Output> GetList(Model.List.GetList.Input input)
        {
            int pageSize = 20;

            string categoryName = input.CategoryId.HasValue ? _repository.CategoryGetQuery(input.CategoryId.Value).Select(m => m.Name).FirstOrDefault() : "";

            var model = _repository.GetQuery(new Model.Repository.GetQuery.Input
            {
                ByCategoryId = input.CategoryId,
                IsVisible = true,
                OrderBy = input.OrderBy,
                NumberItem = input.NumberItem,
            });

            var itemPage = await PageList<Model.List.GetList.Item>.CreateAsync(model.Select(m => new Model.List.GetList.Item
            {
                Id = m.Id,
                Name = m.Name,
                Summary = m.Summary,
                CategoryName = m.ContentByCategory.Select(n => n.Category.Name).FirstOrDefault(),
            }), input.PageIndex, pageSize);

            foreach (var item in itemPage)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Content);

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

        public async Task<Model.List.CategoryList.Output> CategoryGetList(Model.List.CategoryList.Input input)
        {
            var itemList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
            {
                ByParentId = input.ParentId,
                IdList = input.IdList,
            }).OrderBy(m => m.OrderNumber)
            .Select(m => new Model.List.CategoryList.Item
            {
                Id = m.Id,
                ParentId = m.ParentId,
                Name = m.Name,
                OrderNumber = m.OrderNumber,
                Level = m.Level
            }).ToListAsync();

            foreach (var item in itemList)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.ContentCategory);

            return new Model.List.CategoryList.Output
            {
                ItemList = itemList
            };
        }
    }
}
