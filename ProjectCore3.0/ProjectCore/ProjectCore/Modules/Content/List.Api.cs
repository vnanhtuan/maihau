using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectCore.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.Content.Api
{
    [Route("api/content/[controller]/[action]")]
    public class List : BaseAPIController
    {
        private readonly Content.List _list;

        public List(Content.List list)
        {
            _list = list;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<dynamic> CategoryGetList([FromQuery] Model.List.CategoryList.Input input)
        {
            return await _list.CategoryGetList(input);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<dynamic> GetList([FromQuery] Model.List.GetList.Input input)
        {
            return await _list.GetList(input);
        }
    }
}
