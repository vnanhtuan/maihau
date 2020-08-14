import React, { Component } from "react";
import { Row, Col, Button, Input, Modal, Switch } from "antd";

import { Popup, PopMessage } from "../../common/component";

import { ProductBrandManageServices, ProductBrandPostServices } from "./productService";

import BrandPost from "./brandPost";

export default class BrandManage extends Component {
	state = {
		itemList: [],
		isShowModalItem: false,
		itemId: null,
		isPopular: null,
	};

	componentDidMount() {
		this.getList();
	}

	getList = () => {
		ProductBrandManageServices.getList({
			popularOrderNumber: this.state.isPopular === true ? 1 : null,
		}).then((res) => {
			if (!res.success) return;

			this.setState({
				itemList: res.itemList,
				itemId: null,
			});
		});
	};

	onAddItem = () => {
		this.setState({
			itemId: null,
			isShowModalItem: true,
		});
	};

	onEditItem = (id) => {
		if (!id) return;

		this.setState({
			itemId: id,
			isShowModalItem: true,
		});
	};

	onDeleteItem = (id) => {
		if (!id) return;

		Popup.confirm({
			onOk: () => {
				ProductBrandPostServices.delete(id).then((res) => {
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
			isShowModalItem: false,
		});
	};

	onItemOk = () => {
		this.getList();

		this.setState({
			isShowModalItem: false,
		});
	};

	onItemOkAndContinue = () => {
		this.getList();
	};

	render() {
		return (
			<React.Fragment>
				<div className="brandManage-page">
					<h1>Quản lý thương hiệu</h1>
					<Row align="middle">
						<Col>
							<Button onClick={this.onAddItem}>
								<i className="fa fa-plus" />
							</Button>
						</Col>
						<Col flex="auto">
							<Input.Search
								placeholder="Từ khóa"
								value={this.state.keyword}
								onChange={({ target: { value } }) => this.setState({ keyword: value })}
								onSearch={() => this.getList()}
							/>
						</Col>
						<Col>
							<Switch onChange={(value) => this.setState({ isPopular: value }, () => this.getList())} /> Nổi bật
						</Col>
					</Row>
					<div className="box">
						<div className="table">
							{this.state.itemList
								.filter((item) => !this.state.keyword || item.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) >= 0)
								.map((item) => (
									<ul key={item.id}>
										{this.state.isPopular == true && <li className="collapsing">{item.popularOrderNumber}</li>}
										<li>
											<a onClick={() => this.onEditItem(item.id)}>{item.name}</a>
										</li>
										<li className="collapsing">
											<Button onClick={() => this.onEditItem(item.id)}>
												<i className="fa fa-edit" />
											</Button>
											<Button onClick={() => this.onDeleteItem(item.id)}>
												<i className="fa fa-trash" />
											</Button>
										</li>
									</ul>
								))}
						</div>
					</div>
				</div>
				<Modal footer={null} destroyOnClose={true} visible={this.state.isShowModalItem} onCancel={this.onItemCancel}>
					<BrandPost itemId={this.state.itemId} onOk={this.onItemOk} onCancel={this.onItemCancel} onItemOkAndContinue={this.onItemOkAndContinue} />
				</Modal>
			</React.Fragment>
		);
	}
}
