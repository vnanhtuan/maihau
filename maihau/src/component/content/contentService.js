import * as Service from "../../common/serviceHelper";
import getSlug from "speakingurl";

function CategoryParseTreeLoop(categoryList, parentId) {
	let childList = [];
	for (var i = 0; i < categoryList.length; i++) {
		const item = categoryList[i];
		if (item.parentId === parentId) {
			const children = CategoryParseTreeLoop(categoryList, item.id);
			childList.push({
				title: item.name,
				value: item.id,
				children,
			});
		}
	}
	return childList;
}

export const CategoryService = {
	parseTree: (categoryList) => {
		categoryList.sort((a, b) => a.orderNumber - b.orderNumber);
		return CategoryParseTreeLoop(categoryList, 1);
	},
};

export const ContentDetailService = {
	init: async (param) => await Service.get("api/content/detail/init", param),
};

export const ContentManageService = {
	init: async () => await Service.get("api/content/manage/init"),
	getList: async (param) => await Service.get("api/content/manage/getList", param),
};

export const ContentPostService = {
	init: async (param) => await Service.get("api/content/post/init", param),
	submit: async (param) => await Service.post("api/content/post/submit", param),
	delete: async (param) => await Service.post("api/content/post/delete", param),
};

export const ContentCategoryManageService = {
	getList: async (param) => await Service.get("api/content/categoryManage/getList", param),
};

export const ContentCategoryPostService = {
	init: async (param) => await Service.get("api/content/categoryPost/Init", param),
	getOrderList: async (param) => await Service.get("api/content/categoryPost/GetOrderList", param),
	submit: async (param) => await Service.post("api/content/categoryPost/submit", param),
	delete: async (param) => await Service.post("api/content/categoryPost/delete", param),
};

export const MenuService = {
	categoryGetList: async (param) => await Service.get("api/content/home/categoryGetList", param),
};

export const ContentListService = {
	getList: async (param) => await Service.get("api/content/list/getList", param),
	categoryGetList: async (param) => await Service.get("api/content/list/categoryGetList", param),
};

export const HomeContentService = {
	categoryGetList: async (param) => await Service.get("api/content/home/categoryGetList", param),
	getList: async (param) => await Service.get("api/content/home/itemGetList", param),
};

export const ContentURL = {
	contentListURL: (query, option) => {
		if (option.categoryName != null) query.categoryName = option.categoryName;
		if (option.categoryId != null) query.categoryId = option.categoryId;
		if (option.pageIndex != null) query.pageIndex = option.pageIndex;
		if (option.orderBy != null) query.orderBy = option.orderBy;

		let text = "";
		if (query.categoryName) text += (text ? "-" : "") + query.categoryName;

		let url = "/bai-viet/" + getSlug(text);

		url += query.categoryId ? "/" + query.categoryId : "/0";
		url += query.pageIndex ? "/" + query.pageIndex : "/1";
		url += query.orderBy ? "/" + query.orderBy : "/";

		return url;
	},

	contentDetailURL: (query, option) => {
		if (option.name != null) query.name = option.name;
		if (option.id != null) query.id = option.id;

		let text = "";
		if (query.name) text += (text ? "" : "") + query.name;

		let url = "/chi-tiet-bai-viet/" + getSlug(text);

		url += query.id ? "/" + query.id : "/0";

		return url;
	},
};
