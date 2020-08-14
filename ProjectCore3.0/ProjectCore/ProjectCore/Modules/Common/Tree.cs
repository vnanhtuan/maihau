using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Common
{
    public class Tree
    {
        private readonly Data.UnitOfWork _unitOfWork;

        public Tree(Data.UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Model.Tree.Insert.Output> Insert<TEntity>(Model.Tree.Insert.Input input) where TEntity : class
        {
            try
            {
                var tableName = typeof(TEntity).Name;
                dynamic data = await _unitOfWork._dbContext.Set<TEntity>().FromSqlRaw($"select * from \"{tableName}\" where \"Id\"= {input.ParentId}").FirstOrDefaultAsync();
                long parentRight = data.Right;
                int parentLevel = data.Level;

                //update order number
                await UpdateOrderNumberWhenNewNode(tableName, input.ParentId, input.OrderNumber);

                // update left - right column
                await UpdateLeftRightWhenAddNode(tableName, parentRight);

                return new Model.Tree.Insert.Output
                {
                    Left = parentRight,
                    Right = parentRight + 1,
                    Level = parentLevel + 1
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Model.Tree.Update.Output> Update<TEntity>(Model.Tree.Update.Input input) where TEntity : class
        {
            try
            {
                var result = new Model.Tree.Update.Output();
                result.OrderNumber = input.NewParentId == input.CurrentParentId && input.NewOrderNumber > input.CurrentOrderNumber
                        ? input.NewOrderNumber - 1 : input.NewOrderNumber;
                if (input.CurrentParentId == input.NewParentId && input.CurrentOrderNumber == result.OrderNumber)
                {
                    result.Left = input.CurrentLeft;
                    result.Right = input.CurrentRight;
                    result.Level = input.CurrentLevel;
                    return result;
                }
                var tableName = typeof(TEntity).Name;
                dynamic data = await _unitOfWork._dbContext.Set<TEntity>().FromSqlRaw($"select * from \"{tableName}\" where \"Id\"= {input.NewParentId}").FirstOrDefaultAsync();
                long newParentRight = data.Right;
                int newParentLevel = data.Level;

                result.Left = input.CurrentLeft;
                result.Right = input.CurrentRight;
                result.Level = newParentLevel + 1;

                //update order number
                if (input.CurrentParentId == input.NewParentId)
                {
                    var whereQuery = input.CurrentOrderNumber > input.NewOrderNumber
                        ? $"\"OrderNumber\" >= {input.NewOrderNumber} and \"OrderNumber\" < {input.CurrentOrderNumber}"
                        : $"\"OrderNumber\" > {input.CurrentOrderNumber} and \"OrderNumber\" <= {input.NewOrderNumber}";
                    var setQuery = input.CurrentOrderNumber > input.NewOrderNumber
                        ? $"\"OrderNumber\" = \"OrderNumber\" + 1"
                        : $"\"OrderNumber\" = \"OrderNumber\" - 1";
                    await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tableName}\" set {setQuery} where \"ParentId\" = {input.CurrentParentId} and {whereQuery}");
                }
                else
                {
                    await UpdateOrderNumberWhenRemoveNode(tableName, input.CurrentParentId, input.CurrentOrderNumber);
                    await UpdateOrderNumberWhenNewNode(tableName, input.NewParentId, input.NewOrderNumber);
                }

                // update left - right column
                if (input.CurrentParentId != input.NewParentId)
                {
                    await UpdateLeftRightWhenRemoveNode(tableName, input.CurrentRight, input.CurrentLeft);
                    dynamic dataAfterRemove = await _unitOfWork._dbContext.Set<TEntity>().FromSqlRaw($"select * from public.\"{tableName}\" where \"Id\"= {input.NewParentId}").FirstOrDefaultAsync();
                    result.Left = dataAfterRemove.Right;
                    result.Right = dataAfterRemove.Right + 1;
                    await UpdateLeftRightWhenAddNode(tableName, dataAfterRemove.Right);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task Delete<TEntity>(Model.Tree.Delete.Input input) where TEntity : class
        {
            try
            {
                var tableName = typeof(TEntity).Name;

                //update order number
                await UpdateOrderNumberWhenRemoveNode(tableName, input.ParentId, input.OrderNumber);

                // update left - right column
                await UpdateLeftRightWhenRemoveNode(tableName, input.Right, input.Left);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task UpdateLeftRightWhenAddNode(string tableName, long parentRight)
        {
            await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tableName}\" set \"Right\" = \"Right\" + 2 where \"Right\" >= {parentRight}");
            await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tableName}\" set \"Left\" = \"Left\" + 2 where \"Left\" >= {parentRight}");
        }
        private async Task UpdateLeftRightWhenRemoveNode(string tableName, long right, long left)
        {
            var width = right - left + 1;
            await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tableName}\" set \"Right\" = \"Right\" - {width} where \"Right\" > {right}");
            await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tableName}\" set \"Left\" = \"Left\" - {width} where \"Left\" > {right}");
        }

        private async Task UpdateOrderNumberWhenNewNode(string tblName, long parentId, long orderNumber)
        {
            await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tblName}\" set \"OrderNumber\" = \"OrderNumber\" + 1 where \"ParentId\" = {parentId} and \"OrderNumber\" >= {orderNumber}");
        }

        private async Task UpdateOrderNumberWhenRemoveNode(string tblName, long parentId, long orderNumber)
        {
            await _unitOfWork._dbContext.Database.ExecuteSqlRawAsync($"update \"{tblName}\" set \"OrderNumber\" = \"OrderNumber\" - 1 where \"ParentId\" = {parentId} and \"OrderNumber\" > {orderNumber}");
        }
    }
}
