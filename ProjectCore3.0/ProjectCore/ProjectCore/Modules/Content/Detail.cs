using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
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
					Description = m.Description,
					Link = m.Link,
					CategoryName = m.ContentByCategory.Select(n => n.Category.Name).FirstOrDefault(),
					CategoryId = m.ContentByCategory.Select(n => n.CategoryId).FirstOrDefault()
				}).FirstOrDefaultAsync()
			};

			output.Item.ImageList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
			{
				CategoryId = (long)Const.FileCategory.Content,
				ItemId = output.Item.Id.ToString(),
			}).OrderBy(m => m.OrderNumber).Select(m => new Model.Detail.File
			{
				Id = m.FileId,
				IsVR = m.File.IsVR,
			}).ToListAsync();

			var itemList = await _repository.GetQuery(new Model.Repository.GetQuery.Input
			{
				ByCategoryId = output.Item.CategoryId,
				IsVisible = true,
			}).Where(m => m.Id != id).Take(10).Select(m => new Model.Detail.Item
			{
				Id = m.Id,
				Name = m.Name,
				Summary = m.Summary,
				Link = m.Link,
				CategoryName = m.ContentByCategory.Select(n => n.Category.Name).FirstOrDefault(),
				CategoryId = m.ContentByCategory.Select(n => n.CategoryId).FirstOrDefault()
			}).ToListAsync();

			foreach (var item in itemList)
				item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Content);

			output.ItemList = itemList;

			return output;
		}
	}
}
