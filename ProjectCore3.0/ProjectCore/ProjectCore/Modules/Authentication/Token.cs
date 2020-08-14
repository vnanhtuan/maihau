using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectCore.Modules.Authentication
{
    public class Token
    {
		private readonly IConfiguration _configuration;

		public Token(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public Model.Token.CreateModel.Output Create(Model.Token.CreateModel.Input input)
		{
			var claimList = new List<Claim>
			{
				new Claim(ClaimTypes.Sid, input.Id),
				new Claim(ClaimTypes.Locality, input.SessionId),
				new Claim(ClaimTypes.GroupSid, input.LoginId),
				new Claim(ClaimTypes.DateOfBirth, DateTime.Now.ToString()),
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var issuer = _configuration["Jwt:Issuer"];
			var audience = _configuration["Jwt:Issuer"];
			var expireTime = int.Parse(_configuration["Jwt:ExpireTime"]);

			var token = new JwtSecurityToken(
				issuer,
				audience,
				claimList,
				notBefore: DateTime.UtcNow,
				expires: DateTime.UtcNow.AddMinutes(expireTime),
				signingCredentials: creds
			);

			var output = new Model.Token.CreateModel.Output
			{
				ClaimList = claimList,
				Token = new JwtSecurityTokenHandler().WriteToken(token),
			};
			return output;
		}
	}
}
