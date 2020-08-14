using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content
{
    public class Repository
    {
        private readonly Data.UnitOfWork _unitOfWork;

        public Repository(Data.UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        #region Content
        public IQueryable<Models.Content> GetQuery(Model.Repository.GetQuery.Input input = null)
        {
            var model = _unitOfWork._dbContext.Content.AsQueryable();

            if (input == null)
                return model;

            if (input.Id.HasValue)
                model = model.Where(m => m.Id == input.Id);

            if (input.IdList != null)
                model = model.Where(m => input.IdList.Contains(m.Id));

            if (string.IsNullOrEmpty(input.UserId) == false)
                model = model.Where(m => m.UserId == input.UserId);

            if (input.ByCategoryId.HasValue)
            {
                var parent = _unitOfWork._dbContext.ContentCategory
                    .Where(m => m.Id == input.ByCategoryId)
                    .Select(m => new { m.Left, m.Right }).FirstOrDefault();
                model = model.Where(m => m.ContentByCategory.Any(n => n.Category.Left >= parent.Left && n.Category.Right <= parent.Right));
            }

            if (input.IsHidden.HasValue)
                model = model.Where(m => m.IsHidden == input.IsHidden.Value);

            if (input.IsVisible.HasValue)
            {
                model = model.Where(m => m.IsHidden != input.IsVisible.Value);
                model = model.Where(m => m.ContentByCategory.All(n => n.Category.IsHidden != input.IsVisible.Value));
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

            if (string.IsNullOrEmpty(input.OrderBy))
                input.OrderBy = "latest";

            switch (input.OrderBy)
            {
                case "latest":
                    model = model.OrderByDescending(m => m.DateCreated);
                    break;
                case "oldest":
                    model = model.OrderBy(m => m.DateCreated);
                    break;
            }

            if (input.NumberItem.HasValue)
                model = model.Take(input.NumberItem.Value);

            return model;
        }

        public IQueryable<Models.Content> GetQuery(long id)
        {
            return GetQuery(new Model.Repository.GetQuery.Input { Id = id });
        }
        #endregion

        #region Category
        public IQueryable<Models.ContentCategory> CategoryGetQuery(Model.Repository.CategoryGetQuery.Input input = null)
        {
            var model = _unitOfWork._dbContext.ContentCategory.AsQueryable();

            if (input == null)
                return model;

            if (input.Id.HasValue)
                model = model.Where(m => m.Id == input.Id);

            if (input.IdList != null)
                model = model.Where(m => input.IdList.Contains(m.Id));

            if (string.IsNullOrWhiteSpace(input.Name) == false)
                model = model.Where(m => m.Name.Contains(input.Name));

            if (input.ParentId.HasValue)
                model = model.Where(m => m.ParentId == input.ParentId);

            if (input.ByParentId.HasValue)
            {
                var parent = _unitOfWork._dbContext.ContentCategory
                    .Where(m => m.Id == input.ByParentId)
                    .Select(m => new { m.Left, m.Right }).FirstOrDefault();
                model = model.Where(m => m.Left > parent.Left && m.Right < parent.Right);
            }

            if (input.IsHidden.HasValue)
                model = model.Where(m => m.IsHidden == input.IsHidden.Value);

            return model;
        }

        public IQueryable<Models.ContentCategory> CategoryGetQuery(long id)
        {
            return CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input { Id = id });
        }
        #endregion
    }
}
