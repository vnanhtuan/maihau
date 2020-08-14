import React, { Component } from "react";
import { Row, Col, Input, Button, Tree, Modal, Switch } from "antd";

import * as TreeHelper from "../../common/tree";
import { Popup, PopMessage } from "../../common/component";
import { TreeView } from "../../common/treeView";

import { ProductCategoryManageService, ProductCategoryPostService } from "./productService";

import CategoryPost from "./categoryPost";

export default class CategoryManage extends Component {
	state = {
		keyword: null,
		categoryTree: null,
		isItemModel: false,
		itemId: null,
		itemParentId: null,
		isPopular: null,
	};

	componentDidMount() {
		this.getList();
	}

	getList = () => {
		const { isPopular } = this.state;
		ProductCategoryManageService.getList({
			popularOrderNumber: this.state.isPopular === true ? 1 : null,
		}).then((res) => {
			if (!res.success) return;

			let categoryTree = [];
			if (isPopular === true) {
				res.itemList.sort((a, b) => a.popularOrderNumber - b.popularOrderNumber);
				res.itemList.forEach((item, i) => {
					categoryTree.push({
						key: item.id,
						title: `${item.popularOrderNumber} - ${item.name}`,
						value: item.id,
					});
				});
			} else categoryTree = TreeHelper.parseTree(res.itemList);

			this.setState({
				categoryTree,
				itemId: null,
				itemParentId: null,
				selectedKeys: [],
			});
		});
	};

	onAddItem = () => {
		this.setState({
			itemId: null,
			isItemModel: true,
		});
	};

	onEditItem = () => {
		if (!this.state.itemId) return;

		this.setState({
			isItemModel: true,
		});
	};

	onDeleteItem = () => {
		if (!this.state.itemId) return;

		Popup.confirm({
			onOk: () => {
				ProductCategoryPostService.delete(this.state.itemId).then((res) => {
					if (!res.success) {
						Popup.error();
						return;
					}

					PopMessage.success();

					this.getList();
				});
			},
		});
	};

	onItemCancel = () => {
		this.setState({
			isItemModel: false,
		});
	};

	onItemOk = () => {
		this.getList();

		this.setState({
			isItemModel: false,
		});
	};

	onItemOkAndContinue = () => {
		this.getList();
	};

	onSelectTreeNode = (value, info) => {
		const itemId = value.length > 0 ? info.node.value : null;

		this.setState({
			itemId: itemId,
			itemParentId: itemId,
			selectedKeys: value,
		});
	};

	render() {
		return (
			<React.Fragment>
				<div className="categoryManage-page">
					<h1>Quản lý danh mục</h1>
					<Row align="middle">
						<Col>
							<Button onClick={this.onAddItem}>
								<i className="fa fa-plus" />
							</Button>
							<Button onClick={this.onEditItem}>
								<i className="fa fa-edit" />
							</Button>
							<Button onClick={this.onDeleteItem}>
								<i className="fa fa-trash" />
							</Button>
						</Col>
						<Col flex="auto">
							<Input.Search placeholder="Từ khóa" value={this.state.keyword} onChange={({ target: { value } }) => this.setState({ keyword: value })} />
						</Col>
						<Col>
							<Switch onChange={(value) => this.setState({ isPopular: value }, () => this.getList())} /> Nổi bật
						</Col>
					</Row>
					<div className="box">
						{this.state.categoryTree && (
							<TreeView
								searchText={this.state.keyword}
								onSelect={this.onSelectTreeNode}
								treeData={this.state.categoryTree}
								selectedKeys={this.state.selectedKeys}
							/>
						)}
					</div>
				</div>
				<Modal footer={null} destroyOnClose={true} visible={this.state.isItemModel} onCancel={this.onItemCancel}>
					<CategoryPost
						itemId={this.state.itemId}
						itemParentId={this.state.itemParentId}
						onOk={this.onItemOk}
						onItemOkAndContinue={this.onItemOkAndContinue}
						onCancel={this.onItemCancel}
					/>
				</Modal>
			</React.Fragment>
		);
	}
}
