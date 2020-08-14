using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class File
    {
        public File()
        {
            FileByCategory = new HashSet<FileByCategory>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime? DateCreated { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public string FileExt { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public bool IsVR { get; set; }
        public bool IsTemp { get; set; }
        public string GUID { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<FileByCategory> FileByCategory { get; set; }
    }
}
