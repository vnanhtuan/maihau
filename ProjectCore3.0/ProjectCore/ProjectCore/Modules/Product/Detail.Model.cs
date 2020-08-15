using System.Collections.Generic;

namespace ProjectCore.Modules.Product.Model
{
    public class Detail
    {
        public class Init
        {
            public class Output
            {
                public Item Item { get; set; }
            }
        }

        public class Item
        {
            public long Id { get; set; }
            public string Name { get; set; }
            public string Summary { get; set; }
            public string Description { get; set; }
            public bool AllowOrder { get; set; }
            public decimal? Price { get; set; }
            public decimal? PriceSource { get; set; }
            public decimal? SaleOffPercent { get; set; }
            public List<File> ImageList { get; set; }
        }

        public class File
        {
            public long Id { get; set; }
            public bool IsVR { get; set; }
        }

        public class CategoryGetList
        {
            public class Input
            {
                public long ProductId { get; set; }
            }
        }
    }
}
