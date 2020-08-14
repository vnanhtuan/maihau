using System.Collections.Generic;

namespace ProjectCore.Modules.Product.Model
{
    public class BrandPost
    {
        public class Init
        {
            public class Output
            {
                public Item Item { get; set; }
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
            public string Name { get; set; }
            public List<File> FileList { get; set; }
            public long? PopularOrderNumber { get; set; }
        }

        public class File
        {
            public long Id { get; set; }
        }
    }
}
