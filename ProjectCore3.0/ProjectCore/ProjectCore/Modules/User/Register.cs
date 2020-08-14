using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User
{
    public class Register
    {
        private readonly Repository _repository;
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Current _current;
        private readonly Logs.Logs _logger;

        public Register(Repository repository, Data.UnitOfWork unitOfWork, Current current, Logs.Logs logger)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _current = current;
            _logger = logger;
        }

        public async Task<dynamic> Submit(Model.Register.Submit.Input input)
        {
            var output = new ApiResult<long>();

            try
            {
                if (string.IsNullOrEmpty(input.UserName) || input.UserName.Length < 6 || input.UserName.Length > 20)
                    output.Msgs.Add(new MsgResult("userName", "register.userName_invalid"));
                else if (await _repository.GetQuery(new Model.Repository.GetQuery.Input { UserName = input.UserName }).AnyAsync())
                    output.Msgs.Add(new MsgResult("userName", "register.userName_taken"));

                if (string.IsNullOrEmpty(input.Email) || Utility.EmailCheck(input.Email) == false)
                    output.Msgs.Add(new MsgResult("email", "register.email_invalid"));
                else if (await _repository.GetQuery(new Model.Repository.GetQuery.Input { Email = input.Email }).AnyAsync())
                    output.Msgs.Add(new MsgResult("email", "register.email_taken"));

                if (string.IsNullOrEmpty(input.FullName))
                    output.Msgs.Add(new MsgResult("fullName", "register.fullName_empty"));

                if (string.IsNullOrEmpty(input.PhoneNumber))
                    output.Msgs.Add(new MsgResult("phoneNumber", "register.phoneNumber_empty"));

                if (Utility.PasswordCheckSecurity(input.Password) == false)
                    output.Msgs.Add(new MsgResult("password", "register.password_invalid"));
                else if (input.Password != input.ConfirmPassword)
                    output.Msgs.Add(new MsgResult("confirmPassword", "register.confirmPassword_incorrect"));

                if (output.Msgs.Any() == false)
                    using (var transaction = await _unitOfWork.BeginTransactionAsync())
                    {
                        try
                        {
                            
                            
                            var user = new Models.User
                            {
                                Id = _repository.NewUserId(),
                                UserName = input.UserName,
                                Email = input.Email,
                                FullName = input.FullName,
                                PhoneNumber = input.PhoneNumber,
                                PasswordHash = Utility.PasswordEncrypt(input.Password),
                                DateCreated = _current.Now,
                                IsActivated = true,
                                IsBanned = false,
                                UserByRole = new List<Models.UserByRole> { new Models.UserByRole
                                {
                                    RoleId = Const.Role.User,
                                }},
                            };
                            await _unitOfWork._dbContext.User.AddAsync(user);
                            await _unitOfWork.SaveChanges();

                            transaction.Commit();
                            output.Code = Const.ApiCodeEnum.Success;
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            _logger.Error(ex, ex.Message);
                        }
                    }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, ex.Message);
            }

            return output;
        }
    }
}
