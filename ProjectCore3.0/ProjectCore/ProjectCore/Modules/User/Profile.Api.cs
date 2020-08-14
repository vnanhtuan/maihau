using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User.Api
{
    [Route("api/user/[controller]/[action]")]
    public class Profile: BaseAPIController
    {
        private readonly User.Profile _profile;
        public Profile(User.Profile profile)
        {
            _profile = profile;
        }

        [HttpGet]
        public async Task<dynamic> Init()
        {
            return await _profile.Init();
        }

        [HttpPost]
        public async Task<dynamic> Submit([FromBody] Model.Profile.Submit.Input input)
        {
            return await _profile.Submit(input);
        }
    }
}
