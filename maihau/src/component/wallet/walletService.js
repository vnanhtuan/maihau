import * as Service from "../../common/serviceHelper";

export const DepositService = {
	init: async () => await Service.get("api/wallet/deposit/init"),
	getList: async (param) => await Service.get("api/wallet/deposit/getList", param),
};

export const TransferService = {
	init: async () => await Service.get("api/wallet/transfer/init"),
	submit: async (param) => await Service.post("api/wallet/transfer/submit", param),
};

export const WithdrawService = {
	init: async () => await Service.get("api/wallet/withdraw/init"),
	submit: async (param) => await Service.post("api/wallet/withdraw/submit", param),
	getList: async (param) => await Service.get("api/wallet/withdraw/getList", param),
};
