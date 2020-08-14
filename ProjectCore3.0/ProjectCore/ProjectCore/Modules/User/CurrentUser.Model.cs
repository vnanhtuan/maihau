using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User.Model
{
    public class CurrentUser
    {
        public class Check
        {
            public class Output
            {
                public string UserName { get; set; }
                public string FullName { get; set; }
                public string Email { get; set; }
                public string LoginUserName { get; set; }
                public string RoleId { get; set; }
                public bool IsAdmin { get; set; }
                public bool IsProductManager { get; set; }
                public bool IsContentManager { get; set; }
            }
        }
    }
}
