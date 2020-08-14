using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
{
    public class Post
    {
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Repository _repository;
        private readonly Current _current;
        private readonly File.Repository _fileRepository;
        private readonly File.Manage _fileManage;
        private readonly Logs.Logs _logger;

        public Post(Data.UnitOfWork unitOfWork, Repository repository, Current current, File.Repository fileRepository, File.Manage fileManage, Logs.Logs logger)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _current = current;
            _fileRepository = fileRepository;
            _fileManage = fileManage;
            _logger = logger;
        }

        public async Task<dynamic> Init(long? id)
        {
            var output = new Model.Post.Init.Output
            {
                CategoryList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
                {
                    ByParentId = 1,
                }).Select(m => new { m.Id, m.Name, m.ParentId, m.OrderNumber }).ToListAsync(),
            };

            if (id.HasValue)
            {
                output.Item = await _repository.GetQuery(id.Value).Select(m => new Model.Post.Item
                {
                    Id = m.Id,
                    Name = m.Name,
                    CategoryId = m.ContentByCategory.Select(m => m.CategoryId).FirstOrDefault(),
                    IsHidden = m.IsHidden,
                    DateCreated = m.DateCreated,
                    Summary = m.Summary,
                    Description = m.Description,
                    Link = m.Link,
                }).FirstOrDefaultAsync();

                output.Item.FileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.Content,
                    ItemId = output.Item.Id.ToString(),
                }).OrderBy(m => m.OrderNumber).Select(m => new Model.Post.File
                {
                    Id = m.FileId,
                    IsVR = m.File.IsVR,
                }).ToListAsync();

                output.Item.DescriptionFileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.Content,
                    ItemId = output.Item.Id.ToString(),
                    ItemField = "description",
                }).OrderBy(m => m.OrderNumber).Select(m => new Model.Post.File
                {
                    Id = m.FileId,
                }).ToListAsync();
            }

            return output;
        }
        public async Task<ApiResult<long>> Submit(Model.Post.Submit.Input input)
        {
            var userId = _current.UserId;

            var output = new ApiResult<long>();

            if (string.IsNullOrEmpty(input.Name))
                output.Msgs.Add(new MsgResult("name", "common.name_empty"));

            if (input.CategoryId.HasValue == false)
                output.Msgs.Add(new MsgResult("category", "common.category_empty"));

            if (output.Msgs.Any() == false)
                try
                {
                    if (input.Id.HasValue)
                    {
                        var item = await _repository.GetQuery(input.Id.Value).FirstOrDefaultAsync();

                        if (item != null)
                        {
                            _unitOfWork._dbContext.ContentByCategory.RemoveRange(_unitOfWork._dbContext.ContentByCategory.Where(m => m.ItemId == item.Id));
                            await _unitOfWork._dbContext.ContentByCategory.AddAsync(new Models.ContentByCategory { CategoryId = input.CategoryId.Value, ItemId = item.Id });

                            _unitOfWork.Edit(item, nameof(item.Name), input.Name);
                            _unitOfWork.Edit(item, nameof(item.Summary), input.Summary);
                            _unitOfWork.Edit(item, nameof(item.IsHidden), input.IsHidden);
                            _unitOfWork.Edit(item, nameof(item.DateCreated), input.DateCreated);
                            _unitOfWork.Edit(item, nameof(item.Description), input.Description);
                            _unitOfWork.Edit(item, nameof(item.Link), input.Link);
                            await _unitOfWork.SaveChanges();

                            output.Code = Const.ApiCodeEnum.Success;
                            output.Data = item.Id;
                        }
                        else
                            output.Msgs.Add(new MsgResult("general", "common.not_exists"));
                    }
                    else
                    {
                        var item = new Models.Content
                        {
                            UserId = userId,
                            Name = input.Name,
                            Summary = input.Summary,
                            IsHidden = input.IsHidden,
                            Description = input.Description,
                            Link = input.Link,
                            DateCreated = input.DateCreated ?? _current.Now,
                            ContentByCategory = new List<Models.ContentByCategory> { new Models.ContentByCategory { CategoryId = input.CategoryId.Value } },
                        };
                        await _unitOfWork._dbContext.Content.AddAsync(item);
                        await _unitOfWork.SaveChanges();

                        input.Id = item.Id;

                        output.Code = Const.ApiCodeEnum.Success;
                        output.Data = item.Id;
                    }

                    if (output.Code == Const.ApiCodeEnum.Success)
                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.Content,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            FileList = input.FileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, IsVR = m.IsVR, OrderNumber = index }).ToList(),
                        });

                    await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                    {
                        CategoryId = (long)Const.FileCategory.Content,
                        ItemId = input.Id.ToString(),
                        IsTemp = false,
                        ItemField = "description",
                        FileList = input.DescriptionFileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                    });
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, ex.Message);
                }

            return output;
        }
        public async Task<ApiResult<bool>> Delete(long id)
        {
            var output = new ApiResult<bool>();

            try
            {
                var item = await _repository.GetQuery(new Model.Repository.GetQuery.Input { Id = id }).FirstOrDefaultAsync();

                if (item != null)
                {
                    _unitOfWork._dbContext.Content.Remove(item);
                    await _unitOfWork.SaveChanges();

                    await _fileManage.Delete(new File.Model.Manage.DeleteModel.Input
                    {
                        CategoryId = (long)Const.FileCategory.Content,
                        ItemId = item.Id.ToString(),
                    });

                    output.Code = Const.ApiCodeEnum.Success;
                    output.Data = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, ex.Message);
            }

            return output;
        }
    }
}
