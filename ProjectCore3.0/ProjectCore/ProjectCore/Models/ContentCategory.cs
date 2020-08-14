using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class ContentCategory
    {
        public ContentCategory()
        {
            ContentByCategory = new HashSet<ContentByCategory>();
        }

        public long Id { get; set; }
        public long? ParentId { get; set; }
        public long Left { get; set; }
        public long Right { get; set; }
        public int Level { get; set; }
        public long OrderNumber { get; set; }
        public string Name { get; set; }
        public bool IsHidden { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }

        public virtual ICollection<ContentByCategory> ContentByCategory { get; set; }
    }
}
