using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product
{
    public class CategoryManage
    {
        private readonly Repository _repository;

        public CategoryManage(Repository repository)
        {
            _repository = repository;
        }

        public async Task<Model.CategoryManage.GetList.Output> GetList(Model.CategoryManage.GetList.Input input)
        {
            var itemList = await _repository.CategoryGetQuery(new Model.Repository.CategoryGetQuery.Input
            {
                PopularOrderNumber = input.PopularOrderNumber
            })
                .Select(m => new Model.CategoryManage.GetList.Item
                {
                    Id = m.Id,
                    ParentId = m.ParentId,
                    Name = m.Name,
                    OrderNumber = m.OrderNumber,
                    Level = m.Level,
                    PopularOrderNumber = m.PopularOrderNumber,
                }).ToListAsync();

            return new Model.CategoryManage.GetList.Output
            {
                ItemList = itemList
            };
        }
    }
}
