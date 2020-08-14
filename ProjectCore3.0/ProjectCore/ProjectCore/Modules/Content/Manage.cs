using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
{
    public class Manage
    {
        private readonly Repository _repository;
        private readonly Current _current;
        private readonly File.Repository _fileRepository;
        public Manage(Repository repository, Current current, File.Repository fileRepository)
        {
            _repository = repository;
            _current = current;
            _fileRepository = fileRepository;
        }

        public async Task<dynamic> Init()
        {
            return new
            {
                categoryList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
                {
                    ByParentId = 1,
                }).Select(m => new { m.Id, m.Name, m.ParentId, m.OrderNumber }).ToListAsync()
            };
        }

		public async Task<Model.Manage.GetList.Output> GetList(Model.Manage.GetList.Input input)
		{
			int pageSize = 20;

			bool? isHidden = null;
			if (input.IsHidden)
				isHidden = input.IsHidden;

			var model = _repository.GetQuery(new Model.Repository.GetQuery.Input
			{
				ByCategoryId = input.CategoryId,
				IsHidden = isHidden,
				Keyword = input.Keyword,
				DateFrom = input.DateFrom,
				DateTo = input.DateTo,
				OrderBy = input.OrderBy,
			});

			var itemPage = await PageList<Model.Manage.GetList.Item>.CreateAsync(model.Select(m => new Model.Manage.GetList.Item
			{
				Id = m.Id,
				Name = m.Name,
				DateCreated = m.DateCreated,
				CategoryName = m.ContentByCategory.Select(n => n.Category.Name).FirstOrDefault(),
			}), input.PageIndex, pageSize);

			foreach (var item in itemPage)
				item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Content);

			return new Model.Manage.GetList.Output
			{
				ItemList = itemPage,
				PageIndex = itemPage.PageIndex,
				PageSize = pageSize,
				TotalItems = itemPage.TotalItems,
				TotalPages = itemPage.TotalPages,
			};
		}
	}
}
