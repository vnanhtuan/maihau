using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User
{
    public class Profile
    {
        private readonly Repository _repository;
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Current _current;
        private readonly Logs.Logs _logger;
        private readonly File.Repository _fileRepository;
        private readonly File.Manage _fileManage;
        public Profile(Repository repository, Data.UnitOfWork unitOfWork, Current current, Logs.Logs logger, File.Repository fileRepository, File.Manage fileManage)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _current = current;
            _logger = logger;
            _fileRepository = fileRepository;
            _fileManage = fileManage;
        }
        public async Task<Model.Profile.Init.Output> Init()
        {
            var currentUserId = _current.UserId;
            var isAdmin = await _repository.IsAdmin(currentUserId) || string.IsNullOrEmpty(_current.LoginId) == false;
            var output = await _repository.GetQuery(currentUserId).Select(m => new Model.Profile.Init.Output
            {
                UserName = m.UserName,
                FullName = m.FullName,
                PhoneNumber = m.PhoneNumber,
                Email = m.Email,
            }).FirstOrDefaultAsync();

            output.FileList = await _fileRepository.ByCategoryGetQuery(new File.Model.Repository.ByCategoryGetQueryModel.Input
            {
                CategoryId = (long)Const.FileCategory.User,
                ItemId = currentUserId,
            }).OrderBy(m => m.OrderNumber).Select(m => new Model.Profile.File
            {
                Id = m.FileId,
            }).ToListAsync();

            output.IsAdmin = isAdmin;
            output.HasVerificationCode = false;

            return output;
        }

        public async Task<dynamic> Submit(Model.Profile.Submit.Input input)
        {
            var output = new ApiResult<long>();

            try
            {
                var currentUserId = _current.UserId;
                var isAdmin = await _repository.IsAdmin(currentUserId) || string.IsNullOrEmpty(_current.LoginId) == false;

                if (string.IsNullOrEmpty(input.FullName))
                    output.Msgs.Add(new MsgResult("fullName", "register.fullName_empty"));

                if (string.IsNullOrEmpty(input.Email) || Utility.EmailCheck(input.Email) == false)
                    output.Msgs.Add(new MsgResult("email", "register.email_invalid"));
                else if (await _repository.GetQuery(new Model.Repository.GetQuery.Input { Email = input.Email }).Where(m => m.Id != currentUserId).AnyAsync())
                    output.Msgs.Add(new MsgResult("email", "register.email_taken"));

                if (string.IsNullOrEmpty(input.Password) == false || string.IsNullOrEmpty(input.ConfirmPassword) == false)
                {
                    if (Utility.PasswordCheckSecurity(input.Password) == false)
                        output.Msgs.Add(new MsgResult("password", "register.password_invalid"));
                    else if (input.Password != input.ConfirmPassword)
                        output.Msgs.Add(new MsgResult("confirmPassword", "register.confirmPassword_incorrect"));
                }

                if (output.Msgs.Any() == false)
                    using (var transaction = await _unitOfWork.BeginTransactionAsync())
                    {
                        try
                        {
                            var user = await _repository.GetQuery(currentUserId).FirstOrDefaultAsync();
                            _unitOfWork.Edit(user, nameof(user.FullName), input.FullName);
                            _unitOfWork.Edit(user, nameof(user.PhoneNumber), input.PhoneNumber);
                            _unitOfWork.Edit(user, nameof(user.Email), input.Email);
                            if (string.IsNullOrEmpty(input.Password) == false)
                                _unitOfWork.Edit(user, nameof(user.PasswordHash), Utility.PasswordEncrypt(input.Password));
                            _unitOfWork.Edit(user, nameof(user.Email), input.Email);

                            await _unitOfWork.SaveChanges();

                            await _fileManage.Update(new File.Model.Manage.UpdateModel.Input
                            {
                                CategoryId = (long)Const.FileCategory.User,
                                ItemId = currentUserId,
                                IsTemp = false,
                                FileList = input.FileList.Select((m, index) => new File.Model.Manage.UploadModel.File { Id = m.Id, OrderNumber = index }).ToList(),
                            });

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
