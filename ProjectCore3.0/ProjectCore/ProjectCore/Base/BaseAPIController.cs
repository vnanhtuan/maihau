using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Base
{
    [Authorize]
    [Modules.Authentication.ValidationAuthorize]
    [Modules.Authentication.SessionAuthorize]
    [ApiController]
	public class BaseAPIController : ControllerBase
	{
	}
}
