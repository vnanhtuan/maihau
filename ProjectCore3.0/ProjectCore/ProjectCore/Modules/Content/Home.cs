using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
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

        public async Task<Model.Home.ItemGetList.Output> ItemGetList(Model.Home.ItemGetList.Input input)
        {
            var itemList = await _repository.GetQuery(new Model.Repository.GetQuery.Input
            {
                ByCategoryId = input.CategoryId,
                IdList = input.IdList,
                NumberItem = input.NumberItem,
                IsVisible = true,
            }).OrderByDescending(m => m.DateCreated)
            .Select(m => new Model.Home.ItemGetList.Item
            {
                Id = m.Id,
                Name = m.Name,
                Summary = m.Summary,
                Link = m.Link,
                CategoryId = m.ContentByCategory.Select(n => n.Category.Id).FirstOrDefault(),
                CategoryName = m.ContentByCategory.Select(n => n.Category.Name).FirstOrDefault(),
                Description = input.hasDescription.HasValue && input.hasDescription.Value ? m.Description : null,
            }).ToListAsync();

            foreach (var item in itemList)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Content);

            return new Model.Home.ItemGetList.Output
            {
                ItemList = itemList
            };
        }

        public async Task<Model.Home.CategoryList.Output> CategoryGetList(Model.Home.CategoryList.Input input)
        {
            var itemList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
            {
                ByParentId = input.ParentId,
                IdList = input.IdList,
            }).OrderBy(m => m.OrderNumber)
            .Select(m => new Model.Home.CategoryList.Item
            {
                Id = m.Id,
                ParentId = m.ParentId,
                Name = m.Name,
                Icon = m.Icon,
            }).ToListAsync();

            foreach (var item in itemList)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.ContentCategory);

            return new Model.Home.CategoryList.Output
            {
                ItemList = itemList
            };
        }
    }
}
