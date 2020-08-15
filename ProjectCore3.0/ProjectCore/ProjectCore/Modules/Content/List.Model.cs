using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class List
    {
        public class GetList
        {
            public class Input
            {
                public long? CategoryId { get; set; }
                public string OrderBy { get; set; }
                public int PageIndex { get; set; }
                public int? NumberItem { get; set; }
            }

            public class Output
            {
                public string CategoryName { get; set; }
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
                public string Summary { get; set; }
                public string CategoryName { get; set; }
                public long ImageId { get; set; }
            }
        }

        public class CategoryList
        {
            public class Input
            {
                public long? ParentId { get; set; }
                public List<long> IdList { get; set; }
            }
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
                public long ImageId { get; set; }
            }
        }
    }
}
