using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectCore.Base;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User
{
    public class CurrentUser
    {
        private readonly Repository _repository;
        private readonly Current _current;

        public CurrentUser(Repository repository, Current current)
        {
            _repository = repository;
            _current = current;
        }

        public async Task<ApiResult<Model.CurrentUser.Check.Output>> Check()
        {
            var output = new ApiResult<Model.CurrentUser.Check.Output> { };

            var currentUserId = _current.UserId;

            output.Data = await _repository.GetQuery(currentUserId)
                .Select(m => new Model.CurrentUser.Check.Output
                {
                    UserName = m.UserName,
                    FullName = m.FullName,
                    Email = m.Email,
                    RoleId = m.UserByRole.Select(n => n.RoleId).FirstOrDefault(),
                })
                .FirstOrDefaultAsync();

            if (output.Data != null)
            {
                output.Data.IsAdmin = output.Data.RoleId == Const.Role.Admin;
                output.Data.IsProductManager = output.Data.RoleId == Const.Role.ProductManager;
                output.Data.IsContentManager = output.Data.RoleId == Const.Role.ContentManager;
                if (string.IsNullOrEmpty(_current.LoginId) == false)
                {
                    output.Data.LoginUserName = await _repository.GetQuery(_current.LoginId).Select(m => m.UserName).FirstOrDefaultAsync();
                }
                output.Code = Const.ApiCodeEnum.Success;
            }

            return output;
        }
    }
}
