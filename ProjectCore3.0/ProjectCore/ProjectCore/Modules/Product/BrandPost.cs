using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class BrandPost 
    { 
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Repository _repository;
        private readonly Current _current;
        private readonly File.Repository _fileRepository;
        private readonly File.Manage _fileManage;
        private readonly Logs.Logs _logger;
        private readonly User.Repository _userRepository;
        public BrandPost(Data.UnitOfWork unitOfWork, Repository repository, Current current, File.Repository fileRepository, File.Manage fileManage, Logs.Logs logger, User.Repository userRepository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _current = current;
            _fileRepository = fileRepository;
            _fileManage = fileManage;
            _logger = logger;
            _userRepository = userRepository;
        }

        public async Task<dynamic> Init(long? id)
        {
            var output = new Model.BrandPost.Init.Output
            {
                Item = null
            };

            if (id.HasValue)
            {
                output.Item = await _repository.ProductBrandGetQuery(id.Value).Select(x => new Model.BrandPost.Item
                {
                    Id = x.Id,
                    Name = x.Name,
                    PopularOrderNumber = x.PopularOrderNumber
                }).FirstOrDefaultAsync();

                output.Item.FileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.Brand,
                    ItemId = output.Item.Id.ToString(),
                }).OrderBy(m => m.OrderNumber).Select(m => new Model.BrandPost.File
                {
                    Id = m.FileId,
                }).ToListAsync();
            }

            return output;
        }

        public async Task<ApiResult<long>> Submit(Model.BrandPost.Submit.Input input)
        {
            var output = new ApiResult<long>();

            if (string.IsNullOrWhiteSpace(input.Name))
                output.Msgs.Add(new MsgResult("name", "common.name_empty"));

            if (output.Msgs.Any()) return output;

            var name = input.Name.Trim();
            var queryBrandWithName = _repository.ProductBrandGetQuery(new Model.Repository.ProductBrandGetQuery.Input
            {
                Name = name
            });

            try
            {
                if (input.Id.HasValue)
                {
                    var item = await _repository.ProductBrandGetQuery(input.Id.Value).FirstOrDefaultAsync();

                    if (item == null)
                    {
                        output.Msgs.Add(new MsgResult("general", "common.not_exists"));
                        return output;
                    }

                    if (await queryBrandWithName.Where(x => !x.Name.Equals(item.Name)).AnyAsync())
                    {
                        output.Msgs.Add(new MsgResult("name", "common.name_dupplicate"));
                        return output;
                    }

                    _unitOfWork.Edit(item, nameof(item.Name), name);
                    _unitOfWork.Edit(item, nameof(item.PopularOrderNumber), input.PopularOrderNumber);
                    await _unitOfWork.SaveChanges();

                    output.Code = Const.ApiCodeEnum.Success;
                    output.Data = item.Id;
                }
                else
                {
                    if (await queryBrandWithName.AnyAsync())
                    {
                        output.Msgs.Add(new MsgResult("name", "common.name_dupplicate"));
                        return output;
                    }

                    var item = new Models.ProductBrand
                    {
                        Name = input.Name,
                        PopularOrderNumber = input.PopularOrderNumber,
                    };
                    await _unitOfWork._dbContext.ProductBrand.AddAsync(item);
                    await _unitOfWork.SaveChanges();

                    input.Id = item.Id;

                    output.Code = Const.ApiCodeEnum.Success;
                    output.Data = item.Id;
                }

                if (input.FileList != null)
                {
                    await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                    {
                        CategoryId = (long)Const.FileCategory.Brand,
                        ItemId = input.Id.ToString(),
                        IsTemp = false,
                        FileList = input.FileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                    });
                }
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
                var item = await _repository.ProductBrandGetQuery(id).FirstOrDefaultAsync();

                if (item == null)
                {
                    output.Msgs.Add(new MsgResult("general", "common.not_exists"));
                    return output;
                }

                _unitOfWork._dbContext.ProductBrand.Remove(item);
                await _unitOfWork.SaveChanges();

                await _fileManage.Delete(new File.Model.Manage.DeleteModel.Input
                {
                    CategoryId = (long)Const.FileCategory.Brand,
                    ItemId = item.Id.ToString(),
                });

                output.Code = Const.ApiCodeEnum.Success;
                output.Data = true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, ex.Message);
            }

            return output;
        }
    }
}
