using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
{
    public class CategoryManage
    {
        private readonly Repository _repository;

        public CategoryManage(Repository repository)
        {
            _repository = repository;
        }

        public async Task<Model.CategoryManage.GetList.Output> GetList(Model.CategoryManage.GetList.Input input)
        {
            int pageSize = 100;

            bool? isHidden = null;
            if (input.IsHidden)
                isHidden = input.IsHidden;

            var model = _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
            {
                IsHidden = isHidden,
                Name = input.Keyword,
                ParentId = input.ParentId
            });

            var itemPage = await PageList<Model.CategoryManage.GetList.Item>.CreateAsync(model.Select(m => new Model.CategoryManage.GetList.Item
            {
                Id = m.Id,
                ParentId = m.ParentId,
                Name = m.Name,
                OrderNumber = m.OrderNumber,
                Level = m.Level,
            }), input.PageIndex, pageSize);

            return new Model.CategoryManage.GetList.Output
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
