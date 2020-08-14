using System.Collections.Generic;

namespace ProjectCore.Modules.Product.Model
{
    public class Post
    {
        public class Init
        {
            public class Output
            {
                public dynamic CategoryList { get; set; }
                public dynamic BrandList { get; set; }
                public dynamic MemberTypeList { get; set; }

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
            public long? CategoryId { get; set; }
            public long? BrandId { get; set; }
            public string PriceType { get; set; }
            public decimal? Price { get; set; }
            public decimal? PriceSource { get; set; }
            public decimal? SaleOffPercent { get; set; }
            public decimal? PriceSaleOff { get; set; }
            public decimal? BonusPoint { get; set; }
            public int? NumberOfReceive { get; set; }
            public decimal? FundWallet { get; set; }
            public decimal? CommunicationFund { get; set; }
            public decimal? Commission { get; set; }
            public string MemberTypeIdBonus { get; set; }
            public bool IsHidden { get; set; }
            public bool AllowOrder { get; set; }
            public string Summary { get; set; }
            public string Description { get; set; }
            public long? Quantity { get; set; }
            public List<File> FileList { get; set; }
            public List<File> DescriptionFileList { get; set; }
        }

        public class File
        {
            public long Id { get; set; }
        }
    }
}
