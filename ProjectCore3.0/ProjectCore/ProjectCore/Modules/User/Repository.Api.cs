using Microsoft.AspNetCore.Mvc;
using ProjectCore.Modules.Common;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User.Api
{
    [Route("api/user/[controller]/[action]")]
    public class Repository : Base.BaseAPIController
    {
        private readonly Modules.User.Repository _repository;
        public Repository(Modules.User.Repository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ApiResult<Model.Repository.UserCheck.Output>> UserCheck([FromQuery] Model.Repository.UserCheck.Input input)
        {
            return await _repository.UserCheck(input);
        }
    }
}
