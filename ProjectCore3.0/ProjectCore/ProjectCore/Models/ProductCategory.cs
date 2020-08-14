using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class ProductCategory
    {
        public ProductCategory()
        {
            ProductByCategory = new HashSet<ProductByCategory>();
        }

        public long Id { get; set; }
        public long? ParentId { get; set; }
        public string Name { get; set; }
        public long Left { get; set; }
        public long Right { get; set; }
        public int Level { get; set; }
        public long OrderNumber { get; set; }
        public bool IsHidden { get; set; }
        public long? PopularOrderNumber { get; set; }
        public string Icon { get; set; }

        public virtual ICollection<ProductByCategory> ProductByCategory { get; set; }
    }
}
