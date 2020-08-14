using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class Repository
    {
        private readonly Data.UnitOfWork _unitOfWork;

        public Repository(Data.UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        #region PRODUCT

        public IQueryable<Models.Product> GetQuery(Model.Repository.GetQuery.Input input = null)
        {
            var model = _unitOfWork._dbContext.Product.AsQueryable();

            if (input == null)
                return model;

            if (input.Id.HasValue)
                model = model.Where(m => m.Id == input.Id);

            if (input.IdList != null && input.IdList.Any())
                model = model.Where(m => input.IdList.Contains(m.Id));

            if (string.IsNullOrEmpty(input.UserId) == false)
                model = model.Where(m => m.UserId == input.UserId);

            if (input.ByCategoryId.HasValue)
            {
                var parent = _unitOfWork._dbContext.ProductCategory
                    .Where(m => m.Id == input.ByCategoryId)
                    .Select(m => new { m.Left, m.Right }).FirstOrDefault();
                model = model.Where(m => m.ProductByCategory.Any(n => n.Category.Left >= parent.Left && n.Category.Right <= parent.Right));
            }

            if (input.ByBrandId.HasValue)
                model = model.Where(m => m.BrandId == input.ByBrandId);

            if (input.IsHidden.HasValue)
                model = model.Where(m => m.IsHidden == input.IsHidden.Value);

            if (input.AllowOrder.HasValue)
                model = model.Where(m => m.AllowOrder == input.AllowOrder.Value);

            if (input.IsVisible.HasValue)
            {
                model = model.Where(m => m.IsHidden != input.IsVisible.Value);
                model = model.Where(m => m.ProductByCategory.All(n => n.Category.IsHidden != input.IsVisible.Value));
            }

            if (string.IsNullOrEmpty(input.Keyword) == false)
                model = model.Where(m => m.Name.Contains(input.Keyword));

            if (input.DateFrom.HasValue)
                model = model.Where(m => m.DateCreated >= input.DateFrom);

            if (input.DateTo.HasValue)
            {
                var dateTo = input.DateTo.Value.Date.AddDays(1);
                model = model.Where(m => m.DateCreated < dateTo);
            }

            if (string.IsNullOrEmpty(input.OrderBy) == false)
                switch (input.OrderBy)
                {
                    case "latest":
                        model = model.OrderByDescending(m => m.DateCreated);
                        break;
                    case "oldest":
                        model = model.OrderBy(m => m.DateCreated);
                        break;
                    case "quantityDec":
                        model = model.OrderByDescending(m => m.Quantity);
                        break;
                    case "quantityInc":
                        model = model.OrderBy(m => m.Quantity);
                        break;
                }

            return model;
        }

        public IQueryable<Models.Product> GetQuery(long id)
        {
            return GetQuery(new Model.Repository.GetQuery.Input { Id = id });
        }
        #endregion

        #region BRAND

        public IQueryable<Models.ProductBrand> ProductBrandGetQuery(Model.Repository.ProductBrandGetQuery.Input input = null)
        {
            var model = _unitOfWork._dbContext.ProductBrand.AsQueryable();

            if (input == null)
                return model;

            if (input.Id.HasValue)
                model = model.Where(m => m.Id == input.Id);

            if (!string.IsNullOrWhiteSpace(input.Name))
                model = model.Where(m => m.Name == input.Name);

            if (input.PopularOrderNumber.HasValue)
                model = model.Where(m => m.PopularOrderNumber.HasValue).OrderBy(m => m.PopularOrderNumber.Value);

            return model;
        }

        public IQueryable<Models.ProductBrand> ProductBrandGetQuery(long id)
        {
            return ProductBrandGetQuery(new Model.Repository.ProductBrandGetQuery.Input { Id = id });
        }
        #endregion

        #region CATEGORY

        public IQueryable<Models.ProductCategory> CategoryGetQuery(Model.Repository.CategoryGetQuery.Input input = null)
        {
            var model = _unitOfWork._dbContext.ProductCategory.AsQueryable();

            if (input == null)
                return model;

            if (input.Id.HasValue)
                model = model.Where(m => m.Id == input.Id);

            if (!string.IsNullOrWhiteSpace(input.Name))
                model = model.Where(m => m.Name == input.Name);

            if (input.ParentId.HasValue)
                model = model.Where(m => m.ParentId == input.ParentId);

            if (input.ByParentId.HasValue)
            {
                var parent = _unitOfWork._dbContext.ProductCategory
                    .Where(m => m.Id == input.ByParentId)
                    .Select(m => new { m.Left, m.Right }).FirstOrDefault();
                model = model.Where(m => m.Left > parent.Left && m.Right < parent.Right);
            }

            if (input.ParentListById.HasValue)
            {
                var item = _unitOfWork._dbContext.ProductCategory
                    .Where(m => m.Id == input.ParentListById)
                    .Select(m => new { m.Left, m.Right }).FirstOrDefault();
                model = model.Where(m => m.Left <= item.Left && m.Right >= item.Right).OrderBy(m => m.Level);
            }

            if (input.IsVisible.HasValue)
                model = model.Where(m => m.IsHidden != input.IsVisible.Value);

            if (input.PopularOrderNumber.HasValue)
                model = model.Where(m => m.PopularOrderNumber.HasValue).OrderBy(m => m.PopularOrderNumber);

            return model;
        }

        public IQueryable<Models.ProductCategory> CategoryGetQuery(long id)
        {
            return CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { Id = id });
        }

        #endregion
    }
}
