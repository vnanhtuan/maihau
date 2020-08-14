using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace ProjectCore.Modules.Common
{
    public class Utility
    {
        static public bool PasswordCheckSecurity(string password)
        {
            string passwordRegex = @"^(?=(.*\d){1})(?=.*[a-z])(?=.*[A-Z]).{8,}$";

            bool isValid = string.IsNullOrEmpty(password) == false;
            if (isValid)
                isValid = Regex.IsMatch(password, passwordRegex);
            return isValid;
        }
        static public string PasswordEncrypt(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            StringBuilder password = new StringBuilder();

            using (SHA256 hash = SHA256Managed.Create())
            {
                Encoding enc = Encoding.UTF8;
                Byte[] result = hash.ComputeHash(enc.GetBytes(input));

                foreach (Byte b in result)
                    password.Append(b.ToString("x2"));
            }

            return password.ToString();
        }
        static public bool EmailCheck(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            Regex re = new Regex(@"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$", RegexOptions.IgnoreCase);
            return re.IsMatch(email);
        }
        static public string NewGuid()
        {
            return Guid.NewGuid().ToString("N");
        }
    }
}
