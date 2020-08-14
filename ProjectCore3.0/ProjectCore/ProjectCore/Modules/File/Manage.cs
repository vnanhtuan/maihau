using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File
{
    public class Manage
    {
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Repository _repository;
        private readonly Current _current;
        private readonly Logs.Logs _logger;
        public Manage(Data.UnitOfWork unitOfWork, Repository repository, Current current, Logs.Logs logger)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _current = current;
            _logger = logger;
        }

        public async Task<ApiResult<Model.Manage.UploadModel.Output>> Upload(Model.Manage.UploadModel.Input input)
        {
            var output = new ApiResult<Model.Manage.UploadModel.Output> { };

            string userId = _current.UserId;
            var fileList = new List<Model.Manage.UploadModel.File>();
            var path = _repository.dataFilePath;
            foreach(var fileInput in input.Files.Where(m => m.Length <= _repository.fileSizeAllow))
            {
                var fileExt = Path.GetExtension(fileInput.FileName).ToLower();
                if(_repository.fileExtAllow.Any(m => m == fileExt) == false)
                {
                    output.Msgs.Add(new MsgResult("File type not support: " + fileInput.FileName));
                    continue;
                }

                string guid = Guid.NewGuid().ToString();

                try
                {
                    var file = new Models.File
                    {
                        Name = guid + fileExt,
                        FileExt = fileExt,
                        UserId = userId,
                        Title = Path.GetFileNameWithoutExtension(fileInput.FileName),
                        FileType = fileInput.ContentType,
                        FileSize = fileInput.Length,
                        IsTemp = true,
                        GUID = input.GUID,
                    };
                    await _unitOfWork._dbContext.File.AddAsync(file);
                    await _unitOfWork.SaveChanges();

                    var filePath = Path.Combine(path, file.Name);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await fileInput.CopyToAsync(stream);
                    }

                    fileList.Add(new Model.Manage.UploadModel.File
                    {
                        Id = file.Id,
                    });
                }
                catch(Exception ex)
                {
                    _logger.Error(ex, ex.Message);
                }
            }

            output.Code = Const.ApiCodeEnum.Success;
            output.Data = new Model.Manage.UploadModel.Output
            {
                FileList = fileList,
            };

            return output;
        }

        public async Task Update(Model.Manage.UpdateModel.Input input)
        {
            try
            {
                var fileIdList = await _repository.ByCategoryGetQuery(new Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = input.CategoryId,
                    ItemId = input.ItemId,
                    ItemField = input.ItemField,
                }).Select(m => m.FileId).ToListAsync();

                var fileListDelete = fileIdList.Where(fileId => input.FileList.Any(n => n.Id == fileId) == false).ToList();
                foreach (var fileId in fileListDelete)
                    await Delete(new Model.Manage.DeleteModel.Input { FileId = fileId });

                var fileListUpdate = input.FileList.Where(m => fileIdList.Any(fileId => fileId == m.Id)).ToList();
                foreach (var file in fileListUpdate)
                {
                    var fileUpdate = await _repository.GetQuery(file.Id).FirstOrDefaultAsync();
                    _unitOfWork.Edit(fileUpdate, nameof(fileUpdate.IsVR), file.IsVR);
                    _unitOfWork.Edit(fileUpdate, nameof(fileUpdate.IsTemp), input.IsTemp);

                    var fileListItemUpdate = await _repository.ByCategoryGetQuery(file.Id).FirstOrDefaultAsync();
                    _unitOfWork.Edit(fileListItemUpdate, nameof(fileListItemUpdate.OrderNumber), file.OrderNumber);
                }

                var fileListAdd = input.FileList.Where(m => fileIdList.Any(fileId => fileId == m.Id) == false).ToList();
                foreach (var file in fileListAdd)
                {
                    var fileUpdate = await _repository.GetQuery(file.Id).FirstOrDefaultAsync();
                    _unitOfWork.Edit(fileUpdate, nameof(fileUpdate.IsVR), file.IsVR);
                    _unitOfWork.Edit(fileUpdate, nameof(fileUpdate.IsTemp), input.IsTemp);

                    await _unitOfWork._dbContext.FileByCategory.AddAsync(new Models.FileByCategory
                    {
                        FileId = file.Id,
                        CategoryId = input.CategoryId,
                        ItemId = input.ItemId,
                        ItemField = input.ItemField,
                        OrderNumber = file.OrderNumber,
                    });
                }
                await _unitOfWork.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, ex.Message);
            }
        }

        public async Task Delete(Model.Manage.DeleteModel.Input input)
        {
            var model = _unitOfWork._dbContext.File.AsQueryable();

            if (input.FileId.HasValue)
                model = model.Where(m => m.Id == input.FileId.Value);
            if (input.Istemp.HasValue)
                model = model.Where(m => m.IsTemp == input.Istemp.Value);
            if (input.DateDeleteTo.HasValue)
                model = model.Where(m => m.DateCreated < input.DateDeleteTo.Value);
            if (input.CategoryId.HasValue)
                model = model.Where(m => m.FileByCategory.Any(n => n.CategoryId == input.CategoryId.Value));
            if (string.IsNullOrEmpty(input.ItemId) == false)
                model = model.Where(m => m.FileByCategory.Any(n => n.ItemId == input.ItemId));

            var path = _repository.dataFilePath;

            try
            {
                foreach (var file in model)
                {
                    var filePath = Path.Combine(path, file.Name);
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);

                    _unitOfWork._dbContext.File.Remove(file);
                }

                await _unitOfWork.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, ex.Message);
            }
        }

        public async Task FileTempCleaning()
        {
            await Delete(new Model.Manage.DeleteModel.Input
            {
                Istemp = true,
                DateDeleteTo = _current.Now.AddDays(-1),
            });
        }

    }
}
