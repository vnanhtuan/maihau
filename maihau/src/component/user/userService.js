import * as Service from "../../common/serviceHelper";

export const LoginService = {
	tokenSet: (token) => Service.tokenSet(token),
	loginSubmit: async (param) => await Service.post("api/user/login/submit", param),
	logoutSubmit: async () => {
		await Service.get("api/user/login/logout");
		Service.tokenRemove();
	},
};

export const RegisterService = {
	init: async () => await Service.get("api/user/register/init"),
	submit: async (param) => await Service.post("api/user/register/submit", param),
};

export const RepositoryService = {
	userCheck: async (async) => await Service.get("api/user/repository/userCheck", async),
};

export const UserManageService = {
	init: async () => await Service.get("api/user/manage/init"),
	getList: async (param) => await Service.get("api/user/manage/getList", param),
	ban: async (param) => await Service.post("api/user/manage/ban", param),
};

export const UserTreeService = {
	init: async () => await Service.get("api/user/tree/init"),
	getList: async (param) => await Service.get("api/user/tree/getList", param),
};

export const ProfileService = {
	init: async () => await Service.get("api/user/profile/init"),
	submit: async (param) => await Service.post("api/user/profile/submit", param),
	shippingInfoInit: async () => await Service.get("api/user/profile/shippingInfoInit"),
	shippingInfoSubmit: async (param) => await Service.post("api/user/profile/shippingInfoSubmit", param),
};

export const ForgetPasswordService = {
	submit: async (param) => await Service.post("api/user/forgetPassword/submit", param),
	resetSubmit: async (param) => await Service.post("api/user/forgetPassword/resetSubmit", param),
};

export const LoginToUserService = {
	login: async (param) => await Service.get("api/user/loginToUser/login", param),
	backToLogin: async () => await Service.get("api/user/loginToUser/backToLogin"),
};

export const VerificationCodeService = {
	get: async (param) => await Service.get("api/authentication/verificationCode/get", param),
};

export const DashboardService = {
	init: async () => await Service.get("api/user/dashboard/init"),
};

export const LocationService = {
	wardGetList: async (param) => await Service.get("api/user/location/wardGetList", param),
};

export const MemberGroupService = {
	init: async () => await Service.get("api/memberGroup/memberGroup/init"),
};

export const UserSponsorListService = {
	init: async () => await Service.get("api/user/userSponsorList/init"),
	getList: async (param) => await Service.get("api/user/userSponsorList/getList", param),
};

export const ContactService = {
	submit: async (param) => await Service.post("api/user/contact/submit", param),
};

export const BankService = {
	init: async () => await Service.get("api/user/bank/init"),
	submit: async (param) => await Service.post("api/user/bank/submit", param),
}
