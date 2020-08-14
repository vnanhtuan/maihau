using System.Collections.Generic;

namespace ProjectCore.Modules.User.Model
{
    public class Profile
    {
        public class Init
        {
            public class Output
            {
                public bool HasVerificationCode { get; set; }
                public bool IsAdmin { get; set; }
                public string UserName { get; set; }
                public string FullName { get; set; }
                public string PhoneNumber { get; set; }
                public string Email { get; set; }
                public List<File> FileList { get; set; }
            }
        }

        public class Submit
        {
            public class Input
            {
                public string FullName { get; set; }
                public string PhoneNumber { get; set; }
                public string Email { get; set; }
                public string Password { get; set; }
                public string ConfirmPassword { get; set; }
                public string VerificationCode { get; set; }
                public List<File> FileList { get; set; }
            }
        }

        public class File
        {
            public long Id { get; set; }
        }
    }
}
