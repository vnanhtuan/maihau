using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Product.Model
{
    public class Home
    {
        public class Init
        {
            public class Output
            {
                public List<Item> SaleOffProductList { get; set; }
                public List<Item> ServiceHelpBankProductList { get; set; }
                public List<Item> OriginProductList { get; set; }
                public List<Item> FundWalletProductList { get; set; }
                public List<CategoryPopular.Item> CategoryPopularList { get; set; }
                public List<BrandPopular.Item> BrandPopularList { get; set; }
            }

            public class Item
            {
                public long Id { get; set; }
                public string Name { get; set; }
                public decimal? Price { get; set; }
                public decimal? PriceSource { get; set; }
                public decimal? SaleOffPercent { get; set; }
                public string CategoryName { get; set; }
                public long ImageId { get; set; }
            }

            public class CategoryPopular
            {
                public class Item
                {
                    public long Id { get; set; }
                    public string Name { get; set; }
                    public long PopularOrderNumber { get; set; }
                    public string Icon { get; set; }
                    public long ImageId { get; set; }
                }
            }

            public class BrandPopular
            {
                public class Item
                {
                    public long Id { get; set; }
                    public string Name { get; set; }
                    public long PopularOrderNumber { get; set; }
                    public long ImageId { get; set; }
                }
            }
        }

        public class CategoryTree
        {
            public class Output
            {
                public List<Item> ItemList { get; set; }
            }

            public class Item
            {
                public long Id { get; set; }
                public long? ParentId { get; set; }
                public int Level { get; set; }
                public long OrderNumber { get; set; }
                public string Name { get; set; }
                public bool IsHidden { get; set; }
            }
        }
    }
}
