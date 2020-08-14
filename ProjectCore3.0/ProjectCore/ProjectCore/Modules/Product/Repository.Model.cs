using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Model
{
    public class Repository
    {
        #region PRODUCT
        public class GetQuery
        {
            public class Input
            {
                public long? Id { get; set; }
                public List<long>? IdList { get; set; }
                public string UserId { get; set; }
                public long? ByCategoryId { get; set; }
                public long? ByBrandId { get; set; }
                public bool? IsHidden { get; set; }
                public bool? AllowOrder { get; set; }
                public bool? IsVisible { get; set; }
                public string Keyword { get; set; }
                public DateTime? DateFrom { get; set; }
                public DateTime? DateTo { get; set; }
                public string OrderBy { get; set; }
            }
        }
        #endregion

        #region CATEGORY

        public class CategoryGetQuery
        {
            public class Input
            {
                public long? Id { get; set; }
                public long? ParentId { get; set; }
                public long? ByParentId { get; set; }
                public long? ParentListById { get; set; }
                public bool? IsVisible { get; set; }
                public string Name { get; set; }
                public long? PopularOrderNumber { get; set; }
            }
        }

        #endregion

        #region BRAND
        public class ProductBrandGetQuery
        {
            public class Input
            {
                public long? Id { get; set; }
                public string Name { get; set; }
                public long? PopularOrderNumber { get; set; }
            }
        }
        #endregion
    }
}
