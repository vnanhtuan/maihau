namespace ProjectCore.Modules.Common.Model
{
    public class Tree
    {
		public class Insert
		{
			public class Input
			{
				public long ParentId { get; set; }
				public long OrderNumber { get; set; }
			}

			public class Output
			{
				public long Left { get; set; }
				public long Right { get; set; }
				public int Level { get; set; }
			}
		}

		public class Update
		{
			public class Input
			{
				public long NewParentId { get; set; }
				public long CurrentParentId { get; set; }
				public long NewOrderNumber { get; set; }
				public long CurrentOrderNumber { get; set; }
				public long CurrentRight { get; set; }
				public long CurrentLeft { get; set; }
				public int CurrentLevel { get; set; }
			}

			public class Output
			{
				public long Left { get; set; }
				public long Right { get; set; }
				public int Level { get; set; }
				public long OrderNumber { get; set; }
			}
		}

		public class Delete
		{
			public class Input
			{
				public long Left { get; set; }
				public long Right { get; set; }
				public long ParentId { get; set; }
				public long OrderNumber { get; set; }
			}

			public class Output
			{
			}
		}
	}
}
