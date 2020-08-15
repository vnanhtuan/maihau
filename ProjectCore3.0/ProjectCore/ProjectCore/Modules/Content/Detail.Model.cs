using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class Detail
    {
		public class Init
		{
			public class Output
			{
				public Item Item { get; set; }
				public List<Item> ItemList { get; set; }
			}
		}

		public class Item
		{
			public long Id { get; set; }
			public string Name { get; set; }
			public string Summary { get; set; }
			public string Description { get; set; }
			public string Link { get; set; }
			public string CategoryName { get; set; }
			public long CategoryId { get; set; }
			public long ImageId { get; set; }
			public List<File> ImageList { get; set; }
		}

		public class File
		{
			public long Id { get; set; }
			public bool IsVR { get; set; }
		}
	}
}
