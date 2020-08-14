using System.Collections.Generic;

namespace ProjectCore.Modules.Common
{
	public class ApiResult<T>
	{
		public Const.ApiCodeEnum Code { get; set; } = Const.ApiCodeEnum.Validation;
		public T Data { get; set; }
		public IList<MsgResult> Msgs { get; set; } = new List<MsgResult>();
	}

	public class MsgResult
	{
		public string Target { get; set; }
		public string Code { get; set; }
		public string Text { get; set; }

		public MsgResult(string text)
		{
			Text = text;
		}

		public MsgResult(string target, string code)
		{
			Target = target;
			Code = code;
		}

		public MsgResult(string target, string code, string text)
		{
			Target = target;
			Code = code;
			Text = text;
		}
	}
}
