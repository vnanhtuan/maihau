using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class Product
    {
        public Product()
        {
            ProductByCategory = new HashSet<ProductByCategory>();
        }

        public long Id { get; set; }
        public string UserId { get; set; }
        public long? BrandId { get; set; }
        public DateTime? DateCreated { get; set; }
        public bool IsHidden { get; set; }
        public bool AllowOrder { get; set; }
        public decimal? Price { get; set; }
        public decimal? PriceSource { get; set; }
        public decimal? SaleOffPercent { get; set; }
        public string Name { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public long? Quantity { get; set; }

        public virtual ProductBrand Brand { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<ProductByCategory> ProductByCategory { get; set; }
    }
}
