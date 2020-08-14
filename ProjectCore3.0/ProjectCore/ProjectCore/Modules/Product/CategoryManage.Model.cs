using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Model
{
    public class CategoryManage
    {
		public class GetList
		{
			public class Input
			{
				public string Keyword { get; set; }
				public long ParentId { get; set; }
				public bool IsVisible { get; set; }
				public long? PopularOrderNumber { get; set; }
			}

			public class Output
			{
				public List<Item> ItemList { get; set; }
			}

			public class Item
			{
				public long Id { get; set; }
				public long? ParentId { get; set; }
				public int Level { get; set; }
				public long OrderNumber { get; set; }
				public string Name { get; set; }
				public bool IsHidden { get; set; }
				public long? PopularOrderNumber { get; set; }
			}
		}
	}
}
