using System;
using System.Collections.Generic;

namespace ProjectCore.Modules.Product.Model
{
    public class Manage
    {
        public class GetList
        {
            public class Input
            {
                public string Keyword { get; set; }
                public DateTime? DateFrom { get; set; }
                public DateTime? DateTo { get; set; }
                public long? CategoryId { get; set; }
                public long? BrandId { get; set; }
                public bool IsHidden { get; set; }
                public bool AllowOrder { get; set; }
                public string OrderBy { get; set; }
                public int PageIndex { get; set; }
            }

            public class Output
            {
                public List<Item> ItemList { get; set; }
                public int PageIndex { get; set; }
                public int PageSize { get; set; }
                public int TotalPages { get; set; }
                public int TotalItems { get; set; }
            }

            public class Item
            {
                public long Id { get; set; }
                public string Name { get; set; }
                public decimal? Price { get; set; }
                public decimal? PriceSource { get; set; }
                public decimal? SaleOffPercent { get; set; }

                public string CategoryName { get; set; }
                public string BrandName { get; set; }
                public DateTime? DateCreated { get; set; }
                public bool IsHidden { get; set; }
                public bool AllowOrder { get; set; }
                public long? Quantity { get; set; }
                public long ImageId { get; set; }
            }
        }
    }
}
