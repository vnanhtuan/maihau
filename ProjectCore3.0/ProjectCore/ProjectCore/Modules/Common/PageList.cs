using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Common
{
	public class PageList<T> : List<T>
	{
		public int PageIndex { get; set; }
		public int TotalPages { get; set; }
		public int TotalItems { get; set; }

		public PageList(List<T> items, int totalItems, int totalPages, int pageIndex, int pageSize)
		{
			PageIndex = pageIndex;
			TotalPages = totalPages;
			TotalItems = totalItems;

			if (items != null)
				this.AddRange(items);
		}

		public bool HasPreviousPage
		{
			get
			{
				return (PageIndex > 1);
			}
		}

		public bool HasNextPage
		{
			get
			{
				return (PageIndex < TotalPages);
			}
		}

		public static async Task<PageList<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize)
		{
			var totalItems = await source.CountAsync();
			if (totalItems > 0)
			{
				var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
				if (pageIndex < 1)
					pageIndex = 1;
				else if (pageIndex > totalPages)
					pageIndex = totalPages;
				var items = await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
				return new PageList<T>(items, totalItems, totalPages, pageIndex, pageSize);
			}
			else
				return new PageList<T>(null, 0, 0, 1, pageSize);
		}
	}
}
