using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class CategoryPost
    {
        public class Init
        {
            public class Output
            {
                public dynamic Category { get; set; }
                public dynamic CategoryList { get; set; }
                public dynamic OrderList { get; set; }
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
            public long? ParentId { get; set; }
            public long? OrderNumber { get; set; }
            public string Name { get; set; }
            public string Summary { get; set; }
            public string Description { get; set; }
            public string Icon { get; set; }
            public List<File> FileList { get; set; }
            public List<File> DescriptionFileList { get; set; }
        }
        public class File
        {
            public long Id { get; set; }
        }
    }
}
