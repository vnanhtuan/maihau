using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class Post
    {
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Repository _repository;
        private readonly Current _current;
        private readonly File.Repository _fileRepository;
        private readonly File.Manage _fileManage;
        private readonly Logs.Logs _logger;
        private readonly User.Repository _userRepository;

        public Post(Data.UnitOfWork unitOfWork, Repository repository, Current current, File.Repository fileRepository, File.Manage fileManage, Logs.Logs logger, User.Repository userRepository)
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
            var currentUserId = _current.UserId;
            var output = new Model.Post.Init.Output
            {
                CategoryList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
                {
                    ByParentId = 1,
                }).Select(m => new { m.Id, m.Name, m.ParentId, m.OrderNumber }).ToListAsync(),
                BrandList = await _repository.ProductBrandGetQuery().ToListAsync(),
            };

            if (id.HasValue)
            {
                output.Item = await _repository.GetQuery(new Model.Repository.GetQuery.Input
                {
                    Id = id.Value,
                    UserId = await _userRepository.IsAdmin(currentUserId) ? null : currentUserId,
                }).Select(m => new Model.Post.Item
                {
                    Id = m.Id,
                    Name = m.Name,
                    CategoryId = m.ProductByCategory.Select(m => m.CategoryId).FirstOrDefault(),
                    BrandId = m.BrandId,
                    Price = m.Price,
                    PriceSource = m.PriceSource,
                    SaleOffPercent = m.SaleOffPercent,
                    IsHidden = m.IsHidden,
                    AllowOrder = m.AllowOrder,
                    Summary = m.Summary,
                    Description = m.Description,
                    Quantity = m.Quantity,
                }).FirstOrDefaultAsync();

                if (output.Item.PriceSource.HasValue)
                {
                    output.Item.PriceSaleOff = output.Item.Price;
                    output.Item.PriceType = "saleoff";
                }
                else
                    output.Item.PriceType = "normal";

                output.Item.FileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.Product,
                    ItemId = output.Item.Id.ToString(),
                }).OrderBy(m => m.OrderNumber).Select(m => new Model.Post.File
                {
                    Id = m.FileId,
                }).ToListAsync();

                output.Item.DescriptionFileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
                {
                    CategoryId = (long)Const.FileCategory.Product,
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
            var currentUserId = _current.UserId;

            var output = new ApiResult<long>();

            if (string.IsNullOrEmpty(input.Name))
                output.Msgs.Add(new MsgResult("name", "common.name_empty"));

            if (input.CategoryId.HasValue == false)
                output.Msgs.Add(new MsgResult("category", "common.category_empty"));

            switch (input.PriceType)
            {
                case "normal":
                    input.PriceSource = null;
                    input.SaleOffPercent = null;
                    break;
                case "saleoff":
                    if (input.PriceSource.HasValue == false || input.PriceSource.Value <= 0)
                        output.Msgs.Add(new MsgResult("priceSource", "common.value_empty"));
                    else
                        if (input.PriceSaleOff.HasValue == false || input.PriceSaleOff.Value <= 0)
                        output.Msgs.Add(new MsgResult("priceSaleOff", "common.value_empty"));
                    else
                        input.Price = input.PriceSaleOff;
                    break;
            }

            if (output.Msgs.Any() == false)
                try
                {
                    if (input.Id.HasValue)
                    {
                        var item = await _repository.GetQuery(new Model.Repository.GetQuery.Input
                        {
                            Id = input.Id.Value,
                            UserId = await _userRepository.IsAdmin(currentUserId) ? null : currentUserId,
                        }).FirstOrDefaultAsync();

                        if (item != null)
                        {
                            _unitOfWork._dbContext.ProductByCategory.RemoveRange(_unitOfWork._dbContext.ProductByCategory.Where(m => m.ItemId == item.Id));
                            await _unitOfWork._dbContext.ProductByCategory.AddAsync(new Models.ProductByCategory { CategoryId = input.CategoryId.Value, ItemId = item.Id });

                            _unitOfWork.Edit(item, nameof(item.Name), input.Name);
                            _unitOfWork.Edit(item, nameof(item.Price), input.Price);
                            _unitOfWork.Edit(item, nameof(item.PriceSource), input.PriceSource);
                            _unitOfWork.Edit(item, nameof(item.SaleOffPercent), input.SaleOffPercent);

                            _unitOfWork.Edit(item, nameof(item.IsHidden), input.IsHidden);
                            _unitOfWork.Edit(item, nameof(item.AllowOrder), input.AllowOrder);
                            _unitOfWork.Edit(item, nameof(item.Summary), input.Summary);
                            _unitOfWork.Edit(item, nameof(item.Description), input.Description);
                            _unitOfWork.Edit(item, nameof(item.Quantity), input.Quantity);
                            _unitOfWork.Edit(item, nameof(item.BrandId), input.BrandId);
                            await _unitOfWork.SaveChanges();

                            output.Code = Const.ApiCodeEnum.Success;
                            output.Data = item.Id;
                        }
                        else
                            output.Msgs.Add(new MsgResult("general", "common.not_exists"));
                    }
                    else
                    {
                        var item = new Models.Product
                        {
                            UserId = currentUserId,
                            Name = input.Name,
                            Price = input.Price,
                            PriceSource = input.PriceSource,
                            SaleOffPercent = input.SaleOffPercent,

                            IsHidden = input.IsHidden,
                            AllowOrder = input.AllowOrder,
                            Summary = input.Summary,
                            Description = input.Description,
                            Quantity = input.Quantity,
                            BrandId = input.BrandId,
                            DateCreated = _current.Now,
                            ProductByCategory = new List<Models.ProductByCategory> { new Models.ProductByCategory { CategoryId = input.CategoryId.Value } },
                        };
                        await _unitOfWork._dbContext.Product.AddAsync(item);
                        await _unitOfWork.SaveChanges();

                        input.Id = item.Id;

                        output.Code = Const.ApiCodeEnum.Success;
                        output.Data = item.Id;
                    }

                    if (output.Code == Const.ApiCodeEnum.Success)
                    {
                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.Product,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            FileList = input.FileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                        });

                        await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                        {
                            CategoryId = (long)Const.FileCategory.Product,
                            ItemId = input.Id.ToString(),
                            IsTemp = false,
                            ItemField = "description",
                            FileList = input.DescriptionFileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
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
            var currentUserId = _current.UserId;

            var output = new ApiResult<bool>();

            try
            {
                var item = await _repository.GetQuery(new Model.Repository.GetQuery.Input
                {
                    Id = id,
                    UserId = await _userRepository.IsAdmin(currentUserId) ? null : currentUserId,
                }).FirstOrDefaultAsync();

                if (item != null)
                {
                    _unitOfWork._dbContext.Product.Remove(item);
                    await _unitOfWork.SaveChanges();

                    await _fileManage.Delete(new File.Model.Manage.DeleteModel.Input
                    {
                        CategoryId = (long)Const.FileCategory.Product,
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
