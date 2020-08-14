using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class CategoryManage
    {
		public class GetList
		{
			public class Input
			{
				public string Keyword { get; set; }
				public long? ParentId { get; set; }
				public bool IsHidden { get; set; }
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
				public long? ParentId { get; set; }
				public int Level { get; set; }
				public long OrderNumber { get; set; }
				public string Name { get; set; }
				public bool IsHidden { get; set; }
			}
		}
	}
}
