using System;
using System.Collections.Generic;

namespace ProjectCore.Models
{
    public partial class User
    {
        public User()
        {
            File = new HashSet<File>();
            Product = new HashSet<Product>();
            UserByRole = new HashSet<UserByRole>();
        }

        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActivated { get; set; }
        public bool IsBanned { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateLogout { get; set; }

        public virtual ICollection<File> File { get; set; }
        public virtual ICollection<Product> Product { get; set; }
        public virtual ICollection<UserByRole> UserByRole { get; set; }
    }
}
