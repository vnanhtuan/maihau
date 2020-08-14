import React, { Component } from "react";
import { Row, Col, Input, Button, Tree, Modal } from "antd";

import * as TreeHelper from "../../common/tree";
import { Popup, PopMessage } from "../../common/component";
import { TreeView } from "../../common/treeView";

import { ContentCategoryManageService, ContentCategoryPostService } from "./contentService";

import CategoryPost from "./categoryPost";

export default class CategoryManage extends Component {
	state = {
		keyword: null,
		categoryTree: null,
		isItemModel: false,
		itemId: null,
		itemParentId: null,
	};

	componentDidMount() {
		this.getList();
	}

	getList = () => {
		ContentCategoryManageService.getList({}).then((res) => {
			if (!res.success) return;

			this.setState({
				categoryTree: TreeHelper.parseTree(res.itemList),
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
				ContentCategoryPostService.delete(this.state.itemId).then((res) => {
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
				<Modal width={900} footer={null} destroyOnClose={true} visible={this.state.isItemModel} onCancel={this.onItemCancel}>
					<CategoryPost
						itemId={this.state.itemId}
						itemParentId={this.state.itemParentId}
						onOk={this.onItemOk}
						onCancel={this.onItemCancel}
						onGetList={this.getList}
					/>
				</Modal>
			</React.Fragment>
		);
	}
}
