import { Subject } from "rxjs";
import getSlug from "speakingurl";

import * as Service from "../../common/serviceHelper";

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
		if (!categoryList) return null;
		categoryList.sort((a, b) => a.orderNumber - b.orderNumber);
		return CategoryParseTreeLoop(categoryList, 1);
	},
	submit: async (param) => await Service.post("api/product/categorypost/create", param),
};

export const SiderService = {
	categoryGetList: async () => await Service.get("api/product/sider/categoryGetList"),
};

export const ProductHomeService = {
	init: async (param) => await Service.get("api/product/home/init", param),
	categoryTree: async (param) => await Service.get("api/product/home/CategoryTree", param),
	featuredGetList: async (param) => await Service.get("api/product/home/featuredGetList", param),
};

export const ProductDetailService = {
	init: async (param) => await Service.get("api/product/detail/init", param),
	categoryGetList: async (param) => await Service.get("api/product/detail/categoryGetList", param),
};

export const ProductListService = {
	init: async () => await Service.get("api/product/list/init"),
	getList: async (param) => await Service.get("api/product/list/getList", param),
	categoryGetList: async (param) => await Service.get("api/product/list/categoryGetList", param),
};

export const ProductManageService = {
	init: async () => await Service.get("api/product/manage/init"),
	getList: async (param) => await Service.get("api/product/manage/getList", param),
};

export const ProductPostService = {
	init: async (param) => await Service.get("api/product/post/init", param),
	submit: async (param) => await Service.post("api/product/post/submit", param),
	delete: async (param) => await Service.post("api/product/post/delete", param),
};

const cartSubject = new Subject();
let cartDate = null;
export const CartService = {
	getItemList: async () => {
		CartService.getCart();

		if (cartDate.length == 0) return [];

		let idList = [];
		cartDate.forEach((item) => idList.push(item.id));
		const res = await Service.get("api/product/cart/getItemList", { idList: idList });
		if (res.success) {
			res.itemList.forEach((item) => {
				const cartItem = cartDate.find((m, index) => {
					m.orderNumber = index;
					return m.id === item.id;
				});
				item.qty = cartItem.qty;
				item.orderNumber = cartItem.orderNumber;
			});
			res.itemList.sort((a, b) => a.orderNumber - b.orderNumber);
			CartService.setCart(res.itemList.map((item) => ({ id: item.id, qty: item.qty })));
			return res.itemList;
		} else return [];
	},
	getCart: () => {
		if (cartDate == null) {
			let cartString = localStorage.getItem("shoppingCart");
			cartDate = cartString ? JSON.parse(cartString) : [];
		}

		return cartDate;
	},
	addCart: (item) => {
		CartService.getCart();

		const itemCart = cartDate.find((m) => m.id === item.id);
		if (itemCart) itemCart.qty += item.qty;
		else cartDate.push({ id: item.id, qty: item.qty });

		localStorage.setItem("shoppingCart", JSON.stringify(cartDate));

		cartSubject.next(cartDate);
	},
	setCart: (cart) => {
		cartDate = cart;

		localStorage.setItem("shoppingCart", JSON.stringify(cartDate));

		cartSubject.next(cartDate);
	},
	clearCart: () => CartService.setCart([]),
	getObservable: () => cartSubject.asObservable(),
};

export const CheckoutService = {
	init: async () => await Service.get("api/product/checkout/init"),
	submit: async (param) => await Service.post("api/product/checkout/submit", param),
};

export const OrdersManageService = {
	init: async () => await Service.get("api/product/ordersManage/init"),
	getList: async (param) => await Service.get("api/product/ordersManage/getList", param),
	getDetail: async (param) => await Service.get("api/product/ordersManage/getDetail", param),
	update: async (param) => await Service.post("api/product/ordersManage/update", param),
	cancel: async (param) => await Service.post("api/product/ordersManage/cancel", param),
};

export const ProductBrandManageServices = {
	getList: async (param) => await Service.get("api/product/brandManage/getList", param),
};

export const ProductBrandPostServices = {
	init: async (param) => await Service.get("api/product/brandPost/init", param),
	submit: async (param) => await Service.post("api/product/brandPost/submit", param),
	delete: async (param) => await Service.post("api/product/brandPost/delete", param),
};

export const ProductCategoryManageService = {
	getList: async (param) => await Service.get("api/product/categoryManage/getList", param),
};

export const ProductCategoryPostService = {
	init: async (param) => await Service.get("api/product/categoryPost/Init", param),
	getOrderList: async (param) => await Service.get("api/product/categoryPost/GetOrderList", param),
	submit: async (param) => await Service.post("api/product/categoryPost/submit", param),
	delete: async (param) => await Service.post("api/product/categoryPost/delete", param),
};

export const ProductURL = {
	productListURL: (query, option) => {
		if (option.categoryName != null) query.categoryName = option.categoryName;
		if (option.brandName != null) query.brandName = option.brandName;
		if (option.categoryId != null) query.categoryId = option.categoryId;
		if (option.brandId != null) query.brandId = option.brandId;
		if (option.userId != null) query.userId = option.userId;
		if (option.pageIndex != null) query.pageIndex = option.pageIndex;
		if (option.orderBy != null) query.orderBy = option.orderBy;

		let text = "";
		if (query.categoryName) text += (text ? "-" : "") + query.categoryName;
		if (query.brandName) text += (text ? "-" : "") + query.brandName;

		let url = "/san-pham/" + getSlug(text);

		url += query.categoryId ? "/" + query.categoryId : "/0";
		url += query.brandId ? "/" + query.brandId : "/0";
		url += query.userId ? "/" + query.userId : "/";
		url += query.pageIndex ? "/" + query.pageIndex : "/1";
		url += query.orderBy ? "/" + query.orderBy : "/";

		return url;
	},
	productDetailURL: (query, option) => {
		if (option.name != null) query.name = option.name;
		if (option.id != null) query.id = option.id;

		let text = "";
		if (query.name) text += (text ? "" : "") + query.name;

		let url = "/chi-tiet-san-pham/" + getSlug(text);

		url += query.id ? "/" + query.id : "/0";

		return url;
	},
};
