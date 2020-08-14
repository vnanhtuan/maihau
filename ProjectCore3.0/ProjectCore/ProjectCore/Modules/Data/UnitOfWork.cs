using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using ProjectCore.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Data
{
    public class UnitOfWork: IDisposable
    {
        public readonly ProjectDbContext _dbContext;

        public UnitOfWork(ProjectDbContext dbContext)
        {
            _dbContext = dbContext;

            _dbContext.Database.SetCommandTimeout(120);
        }

        public async Task<int> SaveChanges()
        {
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _dbContext.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        }

        public void Edit<T>(T entry, string name, object value)
        {
            var pEntry = _dbContext.Entry(entry).Property(name);
            pEntry.CurrentValue = value;
            pEntry.IsModified = true;
        }

		public async Task<int> Update(string table, List<Model.UnitOfWork.FieldParam> fieldSet, List<Model.UnitOfWork.FieldParam> fieldWhere)
		{
			var sqlParam = new List<SqlParameter> { };

			var sqlTable = $"update \"{table}\"";

			var sqlSet = "set ";
			foreach (var item in fieldSet)
			{
				if (item == null)
					continue;

				var param = "@" + (string.IsNullOrEmpty(item.Param) ? item.Field : item.Param);

				if (item.Operation == "=")
					sqlSet += $"\"{item.Field}\"={param},";
				else
					sqlSet += $"\"{item.Field}\"=\"{item.Field}\"{item.Operation}{param},";

				sqlParam.Add(new SqlParameter(param, item.Value));
			}
			sqlSet = sqlSet.TrimEnd(',');

			var sqlWhere = "where ";
			foreach (var item in fieldWhere)
			{
				if (item == null)
					continue;

				var param = "@" + (string.IsNullOrEmpty(item.Param) ? "_" + item.Field : item.Param);

				if (item.Value != DBNull.Value)
				{
					sqlWhere += $"\"{item.Field}\"{item.Operation}{param} and ";

					sqlParam.Add(new SqlParameter(param, item.Value));
				}
				else
					sqlWhere += $"\"{item.Field}\" IS NULL and ";
			}
			sqlWhere = sqlWhere.Substring(0, sqlWhere.Length - 5);

			return await _dbContext.Database.ExecuteSqlRawAsync($"{sqlTable} {sqlSet} {sqlWhere}", sqlParam);
		}
		public Model.UnitOfWork.FieldParam UpdateParam(string field, object value)
		{
			return new Model.UnitOfWork.FieldParam { Field = field, Value = value };
		}
		public Model.UnitOfWork.FieldParam UpdateParam(string field, string operation, object value)
		{
			return new Model.UnitOfWork.FieldParam { Field = field, Operation = operation, Value = value };
		}
		public Model.UnitOfWork.FieldParam UpdateParam(string field, string param, string operation, object value)
		{
			return new Model.UnitOfWork.FieldParam { Field = field, Param = param, Operation = operation, Value = value };
		}

		private bool disposed = false;

		protected virtual void Dispose(bool disposing)
		{
			if (!this.disposed)
				if (disposing)
					_dbContext.Dispose();
			this.disposed = true;
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

	}
}
