namespace ProjectCore.Modules.User.Model
{
    public class Repository
    {
        public class GetQuery
        {
            public class Input
            {
                public string Id { get; set; }
                public string UserName { get; set; }
                public string Email { get; set; }
                public string RoleId { get; set; }
                public bool? IsAccess { get; set; }
                public bool? IsActivated { get; set; }
                public bool? IsBanned { get; set; }
                public string Keyword { get; set; }
                public string OrderBy { get; set; }
            }
        }

        public class UserCheck
        {
            public class Input
            {
                public string UserName { get; set; }
                public bool NotCurrent { get; set; }
            }

            public class Output
            {
                public string Id { get; set; }
                public string UserName { get; set; }
                public string Email { get; set; }
            }
        }
    }
}
