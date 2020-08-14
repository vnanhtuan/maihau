using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
{
    public class CategoryPost
    {
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Repository _repository;
        private readonly Tree _tree;
        private readonly Logs.Logs _logger;
        private readonly File.Repository _fileRepository;
        private readonly File.Manage _fileManage;
        public CategoryPost(Data.UnitOfWork unitOfWork, Repository repository, Tree tree, Logs.Logs logger, File.Repository fileRepository, File.Manage fileManage)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _tree = tree;
            _logger = logger;
            _fileRepository = fileRepository;
            _fileManage = fileManage;
        }
        public async Task<dynamic> Init(long? id, long? parentId)
        {
            dynamic category = null;
            var categoriesQuery = _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input());

            if (id.HasValue)
            {
                category = await _repository.CategoryGetQuery(id.Value).Select(m => new Model.CategoryPost.Submit.Input
                {
                    Id = m.Id,
                    Name = m.Name,
                    Summary = m.Summary,
                    Description = m.Description,
                    Icon = m.Icon,
                    OrderNumber = m.OrderNumber,
                    ParentId = m.ParentId
                }).FirstOrDefaultAsync();
                if (category == null) return new ApiResult<dynamic> { Code = Const.ApiCodeEnum.Error };

                categoriesQuery = categoriesQuery.Where(x => x.Id != id);
                parentId = category.ParentId;

                category.FileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.ContentCategory,
                    ItemId = category.Id.ToString(),
                }).OrderBy(m => m.OrderNumber).Select(m => new Model.CategoryPost.File
                {
                    Id = m.FileId,
                }).ToListAsync();

                category.DescriptionFileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.ContentCategory,
                    ItemId = category.Id.ToString(),
                    ItemField = "description",
                }).OrderBy(m => m.OrderNumber).Select(m => new Model.CategoryPost.File
                {
                    Id = m.FileId,
                }).ToListAsync();
            }

            var output = new ApiResult<Model.CategoryPost.Init.Output>
            {
                Code = Const.ApiCodeEnum.Success,
                Data = new Model.CategoryPost.Init.Output
                {
                    Category = category,
                    CategoryList = await categoriesQuery.Select(m => new Model.CategoryManage.GetList.Item
                    {
                        Id = m.Id,
                        ParentId = m.ParentId,
                        Name = m.Name,
                        OrderNumber = m.OrderNumber,
                        Level = m.Level
                    }).ToListAsync(),
                    OrderList = parentId.HasValue ? await GetOrderList(parentId) : new object[0],
                }
            };
            return output;
        }

        public async Task<dynamic> GetOrderList(long? categoryParentId)
        {
            if (!categoryParentId.HasValue) return new object[0];

            var categoriesQuery = _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { ParentId = categoryParentId });
            return await categoriesQuery.Select(x => new
            {
                x.Name,
                x.OrderNumber
            }).OrderBy(o => o.OrderNumber).ToListAsync();
        }

        public async Task<ApiResult<long>> Submit(Model.CategoryPost.Submit.Input input)
        {
            return input.Id.HasValue ? await this.Edit(input) : await this.Add(input);
        }

        private async Task<ApiResult<long>> Add(Model.CategoryPost.Submit.Input input)
        {
            var output = new ApiResult<long>();

            if (string.IsNullOrEmpty(input.Name))
                output.Msgs.Add(new MsgResult("name", "common.name_empty"));

            if (input.ParentId.HasValue == false)
                output.Msgs.Add(new MsgResult("parent", "common.parent_empty"));

            if (input.OrderNumber.HasValue == false)
                output.Msgs.Add(new MsgResult("orderNumber", "common.order_empty"));

            if (output.Msgs.Any()) return output;

            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    var treeData = await _tree.Insert<Models.ContentCategory>(new Common.Model.Tree.Insert.Input
                    {
                        ParentId = input.ParentId.Value,
                        OrderNumber = input.OrderNumber.Value
                    });

                    var item = new Models.ContentCategory
                    {
                        ParentId = input.ParentId,
                        OrderNumber = input.OrderNumber.Value,
                        Level = treeData.Level,
                        Name = input.Name,
                        Summary = input.Summary,
                        Description = input.Description,
                        Icon = input.Icon,
                        Left = treeData.Left,
                        Right = treeData.Right
                    };
                    await _unitOfWork._dbContext.ContentCategory.AddAsync(item);
                    await _unitOfWork.SaveChanges();

                    input.Id = item.Id;

                    if (input.FileList != null)
                    {
                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.ContentCategory,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            FileList = input.FileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                        });
                    }

                    if (input.DescriptionFileList != null)
                    {
                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.ContentCategory,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            ItemField = "description",
                            FileList = input.DescriptionFileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                        });
                    }

                    transaction.Commit();
                    output.Code = Const.ApiCodeEnum.Success;
                    output.Data = item.Id;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    _logger.Error(ex, ex.Message);
                }
            }
            return output;
        }

        private async Task<ApiResult<long>> Edit(Model.CategoryPost.Submit.Input input)
        {
            var output = new ApiResult<long>();

            var item = await _repository.CategoryGetQuery(input.Id.Value).FirstOrDefaultAsync();
            if (item == null)
                output.Msgs.Add(new MsgResult("general", "common.not_exists"));

            if (string.IsNullOrEmpty(input.Name))
                output.Msgs.Add(new MsgResult("name", "common.name_empty"));

            if (input.ParentId.HasValue == false)
                output.Msgs.Add(new MsgResult("parent", "common.parent_empty"));

            if (input.OrderNumber.HasValue == false)
                output.Msgs.Add(new MsgResult("orderNumber", "common.order_empty"));

            if (output.Msgs.Any()) return output;

            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    var treeData = await _tree.Update<Models.ContentCategory>(new Common.Model.Tree.Update.Input
                    {
                        NewParentId = input.ParentId.Value,
                        NewOrderNumber = input.OrderNumber.Value,
                        CurrentParentId = item.ParentId.Value,
                        CurrentOrderNumber = item.OrderNumber,
                        CurrentLeft = item.Left,
                        CurrentRight = item.Right,
                        CurrentLevel = item.Level
                    });

                    _unitOfWork.Edit(item, nameof(item.Name), input.Name);
                    _unitOfWork.Edit(item, nameof(item.Summary), input.Summary);
                    _unitOfWork.Edit(item, nameof(item.Description), input.Description);
                    _unitOfWork.Edit(item, nameof(item.ParentId), input.ParentId);
                    _unitOfWork.Edit(item, nameof(item.Icon), input.Icon);
                    _unitOfWork.Edit(item, nameof(item.Level), treeData.Level);
                    _unitOfWork.Edit(item, nameof(item.Left), treeData.Left);
                    _unitOfWork.Edit(item, nameof(item.Right), treeData.Right);
                    _unitOfWork.Edit(item, nameof(item.OrderNumber), treeData.OrderNumber);
                    await _unitOfWork.SaveChanges();

                    if (input.FileList != null)
                    {
                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.ContentCategory,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            FileList = input.FileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                        });
                    }

                    if (input.DescriptionFileList != null)
                    {
                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.ContentCategory,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            FileList = input.DescriptionFileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                        });
                    }

                    transaction.Commit();
                    output.Code = Const.ApiCodeEnum.Success;
                    output.Data = item.Id;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    _logger.Error(ex, ex.Message);
                }
            }
            return output;
        }

        public async Task<ApiResult<bool>> Delete(long id)
        {
            var output = new ApiResult<bool>();
            var item = await _repository.CategoryGetQuery(id).FirstOrDefaultAsync();
            if (item == null)
                output.Msgs.Add(new MsgResult("general", "common.not_exists"));

            if (await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { ParentId = id }).AnyAsync())
                output.Msgs.Add(new MsgResult("general", "common.has_childrens"));

            if (output.Msgs.Any()) return output;

            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    await _tree.Delete<Models.ContentCategory>(new Common.Model.Tree.Delete.Input
                    {
                        Left = item.Left,
                        Right = item.Right,
                        OrderNumber = item.OrderNumber,
                        ParentId = item.ParentId.Value
                    });
                    _unitOfWork._dbContext.ContentCategory.Remove(item);
                    await _unitOfWork.SaveChanges();

                    transaction.Commit();
                    output.Code = Const.ApiCodeEnum.Success;
                    output.Data = true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    _logger.Error(ex, ex.Message);
                }
            }
            return output;
        }
    }
}
