using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using ProjectCore.Modules.Common;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User.Api
{
    [Route("api/user/[controller]/[action]")]
    public class CurrentUser: BaseAPIController
    {
        private readonly Modules.User.CurrentUser _currentUser;

        public CurrentUser(Modules.User.CurrentUser currentUser)
        {
            _currentUser = currentUser;
        }

        [HttpGet]
        public async Task<ApiResult<Model.CurrentUser.Check.Output>> Check()
        {
            return await _currentUser.Check();
        }
    }
}
