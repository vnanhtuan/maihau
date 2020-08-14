using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class ProductBrand
    {
        public ProductBrand()
        {
            Product = new HashSet<Product>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public long? PopularOrderNumber { get; set; }

        public virtual ICollection<Product> Product { get; set; }
    }
}
