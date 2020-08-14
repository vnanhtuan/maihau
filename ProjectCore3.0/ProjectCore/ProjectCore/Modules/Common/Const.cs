
using System;

namespace ProjectCore.Modules.Common
{
    public class Const
    {
        [Flags]
        public enum ApiCodeEnum
        {
            Success = 1,
            Validation = 2,
            Error = 3,
            Processing = 4,
        }

        [Flags]
        public enum FileCategory
        {
            User = 1,
            Content = 2,
            Product = 3,
            News = 4,
            Service = 5,
            Project = 6,
            Brand = 7,
            Category = 8,
            ContentCategory = 9,
        }

        public class Role
        {
            public const string Admin = "admin";
            public const string User = "user";
            public const string Manager = "manager";
            public const string ProductManager = "productmanager";
            public const string ContentManager = "contentmanager";
        }
    }
}
