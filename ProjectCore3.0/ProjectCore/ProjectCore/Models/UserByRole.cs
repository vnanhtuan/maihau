using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class UserByRole
    {
        public string RoleId { get; set; }
        public string UserId { get; set; }

        public virtual Role Role { get; set; }
        public virtual User User { get; set; }
    }
}
