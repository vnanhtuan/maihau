
namespace ProjectCore.Modules.File.Model
{
    public class Repository
    {
		public class GetQueryModel
		{
			public class Input
			{
				public long? Id { get; set; }
				public string ItemId { get; set; }
			}
		}

		public class ByCategoryGetQueryModel
		{
			public class Input
			{
				public long? CategoryId { get; set; }
				public long? FileId { get; set; }
				public string ItemId { get; set; }
				public string ItemField { get; set; } = "image";
			}
		}
	}
}
