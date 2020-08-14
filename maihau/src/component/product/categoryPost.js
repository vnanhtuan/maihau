import React, { Component } from "react";
import { Row, Col, Input, Button, TreeSelect, Select, Switch, InputNumber } from "antd";

import { Popup, Msg } from "../../common/component";
import * as TreeHelper from "../../common/tree";
import Upload from "../file/upload";

import { ProductCategoryPostService } from "./productService";

export default class CategoryPost extends Component {
	state = {
		isAdd: !this.props.itemId,
		parentList: [],
		id: this.props.itemId,
		name: null,
		parentId: this.props.itemParentId,
		orderNumber: null,
		orderList: [],
		isPopular: null,
		popularOrderNumber: null,
		icon: null,
	};

	componentDidMount() {
		this.init();
	}

	init = () => {
		ProductCategoryPostService.init({ id: this.state.id, parentId: this.state.parentId }).then((res) => {
			if (!res.success || !res.data || !res.data.categoryList) return;
			let newState = {};

			const treeData = res.data.categoryList;
			newState.parentList = TreeHelper.parseTree(treeData, 0);

			if (this.state.isAdd) {
				newState.name = "";
				newState.orderList = this.buildOrderList(res.data.orderList);
				newState.orderNumber = res.data.orderList.length;
			} else {
				const category = res.data.category;
				const parentId = category.parentId;

				newState.orderList = this.buildOrderList(res.data.orderList);
				newState.orderNumber = category.orderNumber;
				newState.id = category.id;
				newState.fileList = category.fileList;
				newState.name = category.name;
				newState.parentId = parentId;
				newState.isPopular = category.popularOrderNumber !== null;
				newState.popularOrderNumber = category.popularOrderNumber;
				newState.icon = category.icon;
			}

			this.setState(newState);
		});
	};

	onSelectParent = (value, node, extra) => {
		this.setState({
			parentId: value,
			orderNumber: null,
			orderList: [],
		});

		this.getOrderList(value);
	};

	getOrderList = (parentId) => {
		if (!parentId) return;

		ProductCategoryPostService.getOrderList({ parentId }).then((res) => {
			this.setState({
				orderNumber: res.length,
				orderList: this.buildOrderList(res),
			}, () => console.log(this.state.orderList));
		});
	};

	buildOrderList = (orderList) => {
		const orderListData = [...orderList];
		let newOrderList = [];
		if (orderListData.length) {
			orderListData.forEach((item) => {
				newOrderList.push({
					label: item.name,
					value: item.orderNumber,
				});
			});
		}
		newOrderList.push({
			label: <em>--- Vị trí cuối ---</em>,
			value: orderList.length,
		});
		return newOrderList;
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ProductCategoryPostService.submit({
			id: this.state.id,
			name: this.state.name,
			fileList: this.state.fileList,
			parentId: this.state.parentId,
			orderNumber: this.state.orderNumber,
			popularOrderNumber: this.state.popularOrderNumber,
			icon: this.state.icon,
		});

		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.onOk();
		}

		this.setState({ msgs: res.msgs });
	};

	onSubmitAndContinues = async () => {
		Popup.spin.show();
		const res = await ProductCategoryPostService.submit({
			name: this.state.name,
			fileList: this.state.fileList,
			parentId: this.state.parentId,
			orderNumber: this.state.orderNumber,
			popularOrderNumber: this.state.popularOrderNumber,
			icon: this.state.icon,
		});

		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.onItemOkAndContinue();
			this.init();
		}

		this.setState({ msgs: res.msgs });
	};

	onChangePopular = (value) => {
		if(value === false){
			this.setState({ popularOrderNumber: null });
		}
		this.setState({ isPopular: value });
	}

	render() {
		return (
			<div className="form">
				<h1>{this.state.isAdd ? "Thêm" : "Sửa"} danh mục</h1>
				<Row>
					<Col>
						<label>Hình ảnh</label>
						<Upload value={this.state.fileList} onChange={(value) => this.setState({ fileList: value })} />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Tên</label>
						<Input value={this.state.name} onChange={({ target: { value } }) => this.setState({ name: value })} autoFocus />
						<Msg target="name" msgs={this.state.msgs} className="errorMsg" />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Danh mục cha</label>
						<TreeSelect
							showSearch
							style={{ width: "100%" }}
							value={this.state.parentId}
							dropdownStyle={{ maxHeight: 400, overflow: "auto", zIndex: 1701 }}
							allowClear
							treeDefaultExpandAll
							onSelect={this.onSelectParent}
							treeData={this.state.parentList}
							treeNodeFilterProp="title"
						></TreeSelect>
						<Msg target="parent" msgs={this.state.msgs} className="errorMsg" />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Đứng trước</label>
						<Select
							showSearch
							style={{ width: "100%" }}
							dropdownStyle={{ zIndex: 1701 }}
							options={this.state.orderList}
							value={this.state.orderNumber}
							optionFilterProp="label"
							onSelect={(value, node, extra) => this.setState({ orderNumber: node.value })}
							filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							{this.state.orderList.map((item) => (
								<Select.Option key={item.value} value={item.value}>
									{item.label}
								</Select.Option>
							))}
						</Select>
						<Msg target="orderNumber" msgs={this.state.msgs} className="errorMsg" />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Icon danh mục</label>
						<Input value={this.state.icon} onChange={({ target: { value } }) => this.setState({ icon: value })} />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Danh mục nổi bật</label>
						<Switch checked={this.state.isPopular} onChange={(value) => this.onChangePopular(value)} />
					</Col>
					<Col>
						<label>Vị trí</label>
						<InputNumber min={1} value={this.state.popularOrderNumber} disabled={!this.state.isPopular}
							onChange={(value) => this.setState({ popularOrderNumber: value })} placeholder="Vị trí"/>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button type="primary" onClick={this.onSubmit}>
							Đồng ý
						</Button>
						<Button type="default" onClick={this.props.onCancel}>
							Đóng
						</Button>
						{this.state.isAdd ? (
							<Button type="primary" onClick={this.onSubmitAndContinues} style={{ float: "right" }}>
								Đồng ý & Tiếp tục
							</Button>
						) : null}
					</Col>
				</Row>
			</div>
		);
	}
}
