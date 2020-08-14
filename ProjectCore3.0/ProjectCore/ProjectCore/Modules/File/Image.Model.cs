using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File.Model
{
    public class Image
    {
		public class GetModel
		{
			public class Input
			{
				public long Id { get; set; }
				public int Size { get; set; }
				public bool Square { get; set; }
			}
			public class Output
			{
				public string FilePath { get; set; }
				public string FileType { get; set; }
			}
		}
	}
}
