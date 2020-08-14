using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class FileByCategory
    {
        public long FileId { get; set; }
        public long CategoryId { get; set; }
        public string ItemId { get; set; }
        public string ItemField { get; set; }
        public long? OrderNumber { get; set; }

        public virtual File File { get; set; }
    }
}
