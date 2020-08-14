using System;
using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class Post
    {
        public class Init
        {
            public class Output
            {
                public dynamic CategoryList { get; set; }

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
            public bool IsHidden { get; set; }
            public DateTime? DateCreated { get; set; }
            public string Summary { get; set; }
            public string Description { get; set; }
            public string Link { get; set; }
            public List<File> FileList { get; set; }
            public List<File> DescriptionFileList { get; set; }

        }
        public class File
        {
            public long Id { get; set; }
            public bool IsVR { get; set; }
        }
    }
}
