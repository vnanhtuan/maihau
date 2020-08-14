using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File
{
    public class Repository
    {
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Common.Current _current;

        public string dataFilePath
        {
            get { return Path.Combine(_current.Directory, "Data", "File"); }
        }

        public string dataImageTempPath
        {
            get { return Path.Combine(_current.Directory, "Data", "Temp", "Size"); }
        }

        public readonly Models.File imageDefault = new Models.File
        {
            Name = "image-default.png",
            FileType = "image/png",
        };
        public IList<string> fileExtAllow = new List<string> { ".jpg", ".png", ".bmp", ".gif", ".jpeg" };
        public readonly int fileSizeAllow = 10_485_760; // 10 MB

        public Repository(Data.UnitOfWork unitOfWork, Common.Current current)
        {
            _unitOfWork = unitOfWork;
            _current = current;
        }

        public IQueryable<Models.File> GetQuery(Model.Repository.GetQueryModel.Input input = null)
        {
            var model = _unitOfWork._dbContext.File.AsQueryable();

            if (input == null)
                return model;

            if (input.Id.HasValue)
                model = model.Where(m => m.Id == input.Id);

            if (string.IsNullOrEmpty(input.ItemId) == false)
                model = model.Where(m => m.FileByCategory.Any(n => n.ItemId == input.ItemId));

            return model;
        }

        public IQueryable<Models.File> GetQuery(long id)
        {
            return GetQuery(new Model.Repository.GetQueryModel.Input { Id = id });
        }

        public async Task<long> GetFirstIdByItem(string itemId, long categoryId)
        {
            return await _unitOfWork._dbContext.FileByCategory.Where(m => m.ItemId == itemId && m.CategoryId == categoryId)
                            .OrderBy(m => m.OrderNumber).Select(m => m.FileId).FirstOrDefaultAsync();
        }

        public IQueryable<Models.FileByCategory> ByCategoryGetQuery(Model.Repository.ByCategoryGetQueryModel.Input input = null)
        {
            var model = _unitOfWork._dbContext.FileByCategory.AsQueryable();

            if (input == null)
                return model;

            if (input.CategoryId.HasValue)
                model = model.Where(m => m.CategoryId == input.CategoryId);

            if (input.FileId.HasValue)
                model = model.Where(m => m.FileId == input.FileId);

            if (string.IsNullOrEmpty(input.ItemId) == false)
                model = model.Where(m => m.ItemId == input.ItemId);

            if (input.FileId.HasValue == false && string.IsNullOrEmpty(input.ItemField) == false)
                model = model.Where(m => m.ItemField == input.ItemField);

            return model;
        }

        public IQueryable<Models.FileByCategory> ByCategoryGetQuery(long fileId)
        {
            return ByCategoryGetQuery(new Model.Repository.ByCategoryGetQueryModel.Input { FileId = fileId });
        }
    }
}
