using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class Detail
    {
        private readonly Repository _repository;
        private readonly File.Repository _fileRepository;

        public Detail(Repository repository, File.Repository fileRepository)
        {
            _repository = repository;
            _fileRepository = fileRepository;
        }

        public async Task<Model.Detail.Init.Output> Init(long id)
        {
            var output = new Model.Detail.Init.Output
            {
                Item = await _repository.GetQuery(id).Select(m => new Model.Detail.Item
                {
                    Id = m.Id,
                    Name = m.Name,
                    Summary = m.Summary,
                    Description = m.Description,
                    AllowOrder = m.AllowOrder,
                    Price = m.Price,
                    PriceSource = m.PriceSource,
                    SaleOffPercent = m.SaleOffPercent,
                }).FirstOrDefaultAsync()
            };
            output.Item.ImageList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
            {
                CategoryId = (long)Const.FileCategory.Product,
                ItemId = output.Item.Id.ToString(),
            }).OrderBy(m => m.OrderNumber).Select(m => new Model.Detail.File
            {
                Id = m.FileId,
                IsVR = m.File.IsVR,
            }).ToListAsync();

            return output;
        }

        public async Task<object> CategoryGetList(Model.Detail.CategoryGetList.Input input)
        {
            var categoryId = await _repository.GetQuery(input.ProductId).Select(m => m.ProductByCategory.Select(n => n.CategoryId).FirstOrDefault()).FirstOrDefaultAsync();

            var parentList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { ParentListById = categoryId })
                .Where(m => m.Id != 1)
                .Select(m => new { m.Id, m.Name }).ToListAsync();

            return new
            {
                parentList,
            };
        }
    }
}
