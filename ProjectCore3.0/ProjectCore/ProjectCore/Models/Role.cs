using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class Role
    {
        public Role()
        {
            UserByRole = new HashSet<UserByRole>();
        }

        public string Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<UserByRole> UserByRole { get; set; }
    }
}
