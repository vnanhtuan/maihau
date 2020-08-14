using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class ProductByCategory
    {
        public long CategoryId { get; set; }
        public long ItemId { get; set; }

        public virtual ProductCategory Category { get; set; }
        public virtual Product Item { get; set; }
    }
}
