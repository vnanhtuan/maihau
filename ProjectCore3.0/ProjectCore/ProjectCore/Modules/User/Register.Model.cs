namespace ProjectCore.Modules.User.Model
{
    public class Register
    {
		public class Submit
		{
			public class Input
			{
				public string UserName { get; set; }
				public string Email { get; set; }
				public string FullName { get; set; }
				public string PhoneNumber { get; set; }
				public string Password { get; set; }
				public string ConfirmPassword { get; set; }
			}
		}
	}
}
