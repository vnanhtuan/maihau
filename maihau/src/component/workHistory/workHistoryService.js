import * as Service from "../../common/serviceHelper";

export const WorkHistoryManageService = {
	init: async () => await Service.get("api/workhistory/manage/init"),
	getList: async (param) => await Service.get("api/workhistory/manage/getList", param),
}