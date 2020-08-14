using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Model
{
    public class CategoryPost
    {
        public class Init
        {
            public class Output
            {
                public dynamic Category { get; set; }
                public dynamic CategoryList { get; set; }
                public dynamic OrderList { get; set; }
            }
        }
        public class Submit
        {
            public class Input : Item
            {
            }
        }
        public class Item
        {
            public long? Id { get; set; }
            public long? ParentId { get; set; }
            public long? OrderNumber { get; set; }
            public string Name { get; set; }
            public List<File> FileList { get; set; }
            public string Icon { get; set; }
            public long? PopularOrderNumber { get; set; }
        }
        public class File
        {
            public long Id { get; set; }
        }
    }
}
