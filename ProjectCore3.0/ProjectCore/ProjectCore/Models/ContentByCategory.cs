using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class ContentByCategory
    {
        public long CategoryId { get; set; }
        public long ItemId { get; set; }

        public virtual ContentCategory Category { get; set; }
        public virtual Content Item { get; set; }
    }
}
