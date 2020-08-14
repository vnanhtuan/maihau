using System;
using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class Manage
    {
		public class GetList
		{
			public class Input
			{
				public string Keyword { get; set; }
				public DateTime? DateFrom { get; set; }
				public DateTime? DateTo { get; set; }
				public long? CategoryId { get; set; }
				public bool IsHidden { get; set; }
				public string OrderBy { get; set; }
				public int PageIndex { get; set; }
			}

			public class Output
			{
				public List<Item> ItemList { get; set; }
				public int PageIndex { get; set; }
				public int PageSize { get; set; }
				public int TotalPages { get; set; }
				public int TotalItems { get; set; }
			}

			public class Item
			{
				public long Id { get; set; }
				public string Name { get; set; }
				public DateTime? DateCreated { get; set; }
				public string CategoryName { get; set; }
				public long ImageId { get; set; }
			}
		}
	}
}
