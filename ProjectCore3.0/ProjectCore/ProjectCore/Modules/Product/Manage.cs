using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class Manage
    {
        private readonly Repository _repository;
        private readonly Current _current;
        private readonly File.Repository _fileRepository;
        private readonly User.Repository _userRepository;

        public Manage(Repository repository, Current current, File.Repository fileRepository, User.Repository userRepository)
        {
            _repository = repository;
            _current = current;
            _fileRepository = fileRepository;
            _userRepository = userRepository;
        }

        public async Task<dynamic> Init()
        {
            return new
            {
                categoryList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
                {
                    ByParentId = 1,
                }).Select(m => new { m.Id, m.Name, m.ParentId, m.OrderNumber }).ToListAsync(),

                brandList = await _repository.ProductBrandGetQuery().ToListAsync()
            };
        }

        public async Task<Model.Manage.GetList.Output> GetList(Model.Manage.GetList.Input input)
        {
            var CurrentUserId = _current.UserId;

            int pageSize = 20;

            bool? allowOrder = null;
            if (input.AllowOrder)
                allowOrder = false;

            bool? isHidden = null;
            if (input.IsHidden)
                isHidden = input.IsHidden;

            var model = _repository.GetQuery(new Model.Repository.GetQuery.Input
            {
                UserId = await _userRepository.IsAdmin(CurrentUserId) ? null : CurrentUserId,
                ByCategoryId = input.CategoryId,
                ByBrandId = input.BrandId,
                AllowOrder = allowOrder,
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
                Price = m.Price,
                PriceSource = m.PriceSource,
                SaleOffPercent = m.SaleOffPercent,

                CategoryName = m.ProductByCategory.Select(n => n.Category.Name).FirstOrDefault(),
                BrandName = m.Brand.Name,
                DateCreated = m.DateCreated,
                IsHidden = m.IsHidden,
                AllowOrder = m.AllowOrder,
                Quantity = m.Quantity,
            }), input.PageIndex, pageSize);

            foreach (var item in itemPage)
                item.ImageId = await _fileRepository.GetFirstIdByItem(item.Id.ToString(), (long)Const.FileCategory.Product);

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
