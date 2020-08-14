export const parseTree = (categoryList, parentId = 1) => {
	if (!categoryList) return null;
	categoryList.sort((a, b) => a.orderNumber - b.orderNumber);
	return CategoryParseTreeLoop(categoryList, parentId);
};

const CategoryParseTreeLoop = (categoryList, parentId) => {
	let childList = [];
	for (var i = 0; i < categoryList.length; i++) {
		const item = categoryList[i];
		if (item.parentId === parentId) {
			const children = CategoryParseTreeLoop(categoryList, item.id);
			childList.push({
				key: item.id,
				title: item.name,
				value: item.id,
				orderNumber: item.orderNumber,
				parentId: item.parentId,
				children,
			});
		}
	}
	return childList;
};
