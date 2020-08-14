using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User.Api
{
    [Route("api/user/[controller]/[action]")]
    public class Register: Base.BaseAPIController
    {
        private readonly Modules.User.Register _register;

        public Register(Modules.User.Register register)
        {
            _register = register;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<dynamic> Submit([FromBody] Model.Register.Submit.Input input)
        {
            return await _register.Submit(input);
        }
    }
}
