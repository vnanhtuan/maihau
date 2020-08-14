using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Data.Model
{
    public class UnitOfWork
    {
		public class FieldParam
		{
			public string Field { get; set; }
			public string Param { get; set; }
			public string Operation { get; set; } = "=";
			public object Value { get; set; }
		}
	}
}
