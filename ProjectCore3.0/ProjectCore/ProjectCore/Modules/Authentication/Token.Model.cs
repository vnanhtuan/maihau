using System.Collections.Generic;
using System.Security.Claims;

namespace ProjectCore.Modules.Authentication.Model
{
    public class Token
    {
		public class CreateModel
		{
			public class Input
			{
				public string Id { get; set; }
				public string SessionId { get; set; }
				public string LoginId { get; set; } = "";
			}

			public class Output
			{
				public string Token { get; set; }
				public List<Claim> ClaimList { get; set; }
			}
		}
	}
}
