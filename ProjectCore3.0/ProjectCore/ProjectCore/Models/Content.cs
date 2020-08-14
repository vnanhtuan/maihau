using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class Content
    {
        public Content()
        {
            ContentByCategory = new HashSet<ContentByCategory>();
        }

        public long Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public DateTime? DateCreated { get; set; }
        public bool IsHidden { get; set; }
        public string Link { get; set; }

        public virtual ICollection<ContentByCategory> ContentByCategory { get; set; }
    }
}
