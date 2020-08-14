using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Model
{
    public class BrandManage
    {
		public class GetList
		{
			public class Input
			{
				public long? PopularOrderNumber { get; set; }
			}

			public class Output
			{
				public List<Item> ItemList { get; set; }
			}

			public class Item
			{
				public long Id { get; set; }
				public string Name { get; set; }
				public long? PopularOrderNumber { get; set; }
			}
		}
	}
}
