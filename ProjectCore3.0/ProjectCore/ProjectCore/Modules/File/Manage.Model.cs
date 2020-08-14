using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File.Model
{
    public class Manage
    {
        public class UploadModel
        {
            public class Input
            {
                public IFormFileCollection Files { get; set; }
                public IFormFileCollection File { get; set; }
                public string GUID { get; set; }
                public string UserId { get; set; }
            }

            public class Output
            {
                public IList<File> FileList { get; set; }
            }

            public class File
            {
                public long Id { get; set; }
                public bool IsVR { get; set; }
                public long OrderNumber { get; set; }
            }
        }

        public class UpdateModel
        {
            public class Input
            {
                public long CategoryId { get; set; }
                public string ItemId { get; set; }
                public bool IsTemp { get; set; } = true;
                public string ItemField { get; set; } = "image";
                public List<UploadModel.File> FileList { get; set; }
            }
        }

        public class DeleteModel
        {
            public class Input
            {
                public long? FileId { get; set; }
                public bool? Istemp { get; set; }
                public DateTime? DateDeleteTo { get; set; }
                public long? CategoryId { get; set; }
                public string ItemId { get; set; }
            }
        }
    }
}
