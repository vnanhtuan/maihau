using System;
using System.Collections.Generic;

namespace ProjectCore.Modules.Content.Model
{
    public class Repository
    {
        #region Content
        public class GetQuery
        {
            public class Input
            {
                public long? Id { get; set; }
                public string UserId { get; set; }
                public long? ByCategoryId { get; set; }
                public bool? IsHidden { get; set; }
                public bool? IsVisible { get; set; }
                public string Keyword { get; set; }
                public DateTime? DateFrom { get; set; }
                public DateTime? DateTo { get; set; }
                public string OrderBy { get; set; }
                public List<long> IdList { get; set; }
                public int? NumberItem { get; set; }
            }
        }
        #endregion

        #region Category

        public class CategoryGetQuery
        {
            public class Input
            {
                public long? Id { get; set; }
                public long? ParentId { get; set; }
                public long? ByParentId { get; set; }
                public bool? IsHidden { get; set; }
                public string Name { get; set; }
                public List<long> IdList { get; set; }
            }
        }

        #endregion
    }
}
