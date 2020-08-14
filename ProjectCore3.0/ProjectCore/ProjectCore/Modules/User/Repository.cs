using Microsoft.EntityFrameworkCore;
using ProjectCore.Modules.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.User
{
    public class Repository
    {
        private readonly Data.UnitOfWork _unitOfWork;
        private readonly Current _current;

        public Repository(Data.UnitOfWork unitOfWork, Current current)
        {
            _unitOfWork = unitOfWork;
            _current = current;
        }

        public IQueryable<Models.User> GetQuery(Model.Repository.GetQuery.Input input = null)
        {
            var model = _unitOfWork._dbContext.User.AsQueryable();

            if (input == null)
                return model;

            if (string.IsNullOrEmpty(input.Id) == false)
                model = model.Where(m => m.Id == input.Id);

            if (string.IsNullOrEmpty(input.UserName) == false)
                model = model.Where(m => m.UserName.ToLower() == input.UserName.ToLower());

            if (string.IsNullOrEmpty(input.Email) == false)
                model = model.Where(m => m.Email == input.Email);

            if (string.IsNullOrEmpty(input.RoleId) == false)
                model = model.Where(m => m.UserByRole.Any(n => n.RoleId == input.RoleId));

            if (input.IsAccess == true)
                model = model.Where(m => m.IsActivated && m.IsBanned == false);

            if (input.IsActivated.HasValue)
                model = model.Where(m => m.IsActivated == input.IsActivated.Value);

            if (input.IsBanned.HasValue)
                model = model.Where(m => m.IsBanned == input.IsBanned.Value);

            if (string.IsNullOrEmpty(input.Keyword) == false)
                model = model.Where(m => m.UserName.Contains(input.Keyword) || m.Email.Contains(input.Keyword));

            if (string.IsNullOrEmpty(input.OrderBy) == false)
                switch (input.OrderBy)
                {
                    case "dateCreatedDec":
                        model = model.OrderByDescending(m => m.DateCreated);
                        break;
                    case "dateCreatedInc":
                        model = model.OrderBy(m => m.DateCreated);
                        break;
                }

            return model;
        }

        public IQueryable<Models.User> GetQuery(string id)
        {
            if (string.IsNullOrEmpty(id) == false)
                return GetQuery(new Model.Repository.GetQuery.Input { Id = id });
            else
                return null;
        }

        public IQueryable<Models.User> GetQuery(bool isAccess)
        {
            return GetQuery(new Model.Repository.GetQuery.Input { IsAccess = isAccess });
        }

        public bool IsAccess(Models.User user)
        {
            return user.IsActivated && user.IsBanned == false;
        }

        public async Task<bool> IsAdmin(string id)
        {
            return await _unitOfWork._dbContext.UserByRole.AnyAsync(m => m.UserId == id && m.RoleId == Const.Role.Admin);
        }

        public async Task<ApiResult<Model.Repository.UserCheck.Output>> UserCheck(Model.Repository.UserCheck.Input input)
        {
            var output = new ApiResult<Model.Repository.UserCheck.Output> { };

            var currentUserId = _current.UserId;

            if (string.IsNullOrEmpty(input.UserName) == false)
            {
                var model = GetQuery(new Model.Repository.GetQuery.Input
                {
                    UserName = input.UserName,
                    RoleId = Const.Role.User,
                    IsAccess = true,
                });
                if (input.NotCurrent)
                    model = model.Where(m => m.Id != currentUserId);

                output.Data = await model.Select(m => new Model.Repository.UserCheck.Output { Id = m.Id, UserName = m.UserName, Email = m.Email }).FirstOrDefaultAsync();
            }

            if (output.Data != null)
                output.Code = Const.ApiCodeEnum.Success;
            else
                output.Msgs.Add(new MsgResult("userCheck", "common.user_notfound"));

            return output;
        }

        public string NewUserId()
        {
            return Utility.NewGuid();
        }

    }
}
