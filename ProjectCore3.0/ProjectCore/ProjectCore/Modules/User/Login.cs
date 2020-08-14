using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User
{
    public class Login
    {
        private readonly Repository _repository;
        private readonly Authentication.Token _token;
        private readonly Current _current;
        private readonly Data.UnitOfWork _unitOfWork;

        public Login(Repository repository, Authentication.Token token, Current current, Data.UnitOfWork unitOfWork)
        {
            _repository = repository;
            _token = token;
            _current = current;
            _unitOfWork = unitOfWork;
        }

		public async Task<ApiResult<string>> Submit(Model.Login.Submit.Input input)
		{
			var output = new ApiResult<string>();

			if (string.IsNullOrEmpty(input.UserName) || string.IsNullOrEmpty(input.Password))
				output.Msgs.Add(new MsgResult("login", "login.info_incorrect"));
			else
			{
				input.Password = Utility.PasswordEncrypt(input.Password);

				var user = await _repository.GetQuery().Where(m =>
					m.UserName.ToLower() == input.UserName.ToLower()
					&& m.PasswordHash == input.Password
				).FirstOrDefaultAsync();

				if (user != null)
				{
					if (_repository.IsAccess(user))
					{
						output.Code = Const.ApiCodeEnum.Success;
						output.Data = _token.Create(new Authentication.Model.Token.CreateModel.Input
						{
							Id = user.Id,
							SessionId = Utility.NewGuid(),
						}).Token;
					}
					else
						output.Msgs.Add(new MsgResult("login", "login.user_banned"));
				}
				else
					output.Msgs.Add(new MsgResult("login", "login.info_incorrect"));
			}

			return output;
		}

		public async Task<bool> Logout()
		{
			var currentUserId = _current.UserId;
			return await _unitOfWork.Update("User", new List<Data.Model.UnitOfWork.FieldParam>
			{
				_unitOfWork.UpdateParam("DateLogout", _current.Now),
			}
			, new List<Data.Model.UnitOfWork.FieldParam>
			{
				_unitOfWork.UpdateParam("Id", currentUserId),
			}) > 0;
		}
	}
}
