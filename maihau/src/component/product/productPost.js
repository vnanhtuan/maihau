import React, { Component } from "react";
import { Row, Col, Input, Button, TreeSelect, Switch, Tabs, Select, Divider } from "antd";

import { Popup, Msg, InputNumber } from "../../common/component";
import Editor from "../../common/editor";
import Upload from "../file/upload";

import { CategoryService, ProductPostService } from "./productService";

export default class ProductPost extends Component {
	state = {
		title: (this.props.id ? "Sửa" : "Thêm") + " sản phẩm",
		categoryList: [],
		brandList: [],
		memberTypeList: [],
	};

	componentDidMount() {
		Popup.spin.show();
		ProductPostService.init({ id: this.props.id }).then((res) => {
			if (res) {
				const item = res.item ? res.item : { allowOrder: true };

				this.setState({
					categoryList: CategoryService.parseTree(res.categoryList),
					brandList: res.brandList,
					memberTypeList: res.memberTypeList,
					id: item.id,
					name: item.name,
					categoryId: item.categoryId,
					brandId: item.brandId ? item.brandId.toString() : null,
					priceType: item.priceType ? item.priceType : "normal",
					price: item.price,
					priceSource: item.priceSource,
					saleOffPercent: item.saleOffPercent,
					priceSaleOff: item.priceSaleOff,
					fundWallet: item.fundWallet,
					communicationFund: item.communicationFund,
					commission: item.commission,
					memberTypeIdBonus: item.memberTypeIdBonus,
					bonusPoint: item.bonusPoint,
					numberOfReceive: item.numberOfReceive,
					isHidden: item.isHidden,
					allowOrder: item.allowOrder,
					summary: item.summary,
					description: item.description,
					quantity: item.quantity,
					fileList: item.fileList,
					descriptionFileList: item.descriptionFileList,
				});
			}
			Popup.spin.hide();
		});
	}

	onPriceSaleOff = (tab) => {
		switch (tab) {
			case "normal":
				let { price } = this.state;
				if (!price && this.state.priceSource) price = this.state.priceSource;
				this.setState({ price: price, priceType: tab });
				break;
			case "saleoff":
				let { priceSource } = this.state;
				if (!priceSource && this.state.price) priceSource = this.state.price;
				this.setState({ priceSource: priceSource, priceType: tab });
				break;
			default:
				break;
		}
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ProductPostService.submit({
			id: this.state.id,
			name: this.state.name,
			categoryId: this.state.categoryId,
			brandId: parseInt(this.state.brandId),
			priceType: this.state.priceType,
			price: this.state.price,
			priceSource: this.state.priceSource,
			saleOffPercent: this.state.saleOffPercent,
			priceSaleOff: this.state.priceSaleOff,

			isHidden: this.state.isHidden,
			allowOrder: this.state.allowOrder,
			summary: this.state.summary,
			description: this.state.description,
			quantity: this.state.quantity,
			fileList: this.state.fileList,
			descriptionFileList: this.state.descriptionFileList,
		});
		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.onOk();
		}

		this.setState({ msgs: res.msgs });
	};

	onCancel = () => {
		this.props.onCancel();
	};

	render() {
		return (
			<React.Fragment>
				<div className="form scroll">
					<h2>{this.state.title}</h2>
					<Row>
						<Col>
							<label>Tên sản phẩm</label>
							<Input value={this.state.name} onChange={({ target: { value } }) => this.setState({ name: value })} />
							<Msg target="name" msgs={this.state.msgs} className="errorMsg" />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Danh mục</label>
							<TreeSelect
								showSearch
								style={{ width: "100%" }}
								dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
								allowClear
								treeDefaultExpandAll
								treeNodeFilterProp="title"
								treeData={this.state.categoryList}
								value={this.state.categoryId}
								onChange={(value) => this.setState({ categoryId: value })}
							/>
							<Msg target="category" msgs={this.state.msgs} className="errorMsg" />
						</Col>
					</Row>
					<Row>
						<Col xs={18}>
							<label>Thương hiệu</label>
							<Select
								style={{ width: "100%" }}
								allowClear
								showSearch
								filterOption={(inputValue, option) => option.children.toString().toLowerCase().includes(inputValue.toLowerCase())}
								value={this.state.brandId}
								onChange={(value) => this.setState({ brandId: value })}
							>
								{this.state.brandList.map((item) => (
									<Select.Option key={item.id}>{item.name}</Select.Option>
								))}
							</Select>
						</Col>
						<Col xs={6}>
							<label>Số lượng</label>
							<InputNumber value={this.state.quantity} onChange={(values) => this.setState({ quantity: values.floatValue })} />
						</Col>
					</Row>
					<Row>
						<Col>
							<Tabs activeKey={this.state.priceType} type="card" onChange={this.onPriceSaleOff}>
								<Tabs.TabPane tab="Giá thường" key="normal">
									<Row>
										<Col xs={10}>
											<label>Giá bán</label>
											<InputNumber value={this.state.price} onChange={(values) => this.setState({ price: values.floatValue })} />
										</Col>
									</Row>
								</Tabs.TabPane>
								<Tabs.TabPane tab="Sale off" key="saleoff">
									<Row>
										<Col xs={10}>
											<label>Giá trước khi sale off</label>
											<InputNumber value={this.state.priceSource} onChange={(values) => this.setState({ priceSource: values.floatValue })} />
											<Msg target="priceSource" msgs={this.state.msgs} className="errorMsg" />
										</Col>
										<Col xs={4}>
											<label>%</label>
											<InputNumber value={this.state.saleOffPercent} onChange={(values) => this.setState({ saleOffPercent: values.floatValue })} />
										</Col>
										<Col xs={10}>
											<label>Giá bán</label>
											<InputNumber value={this.state.priceSaleOff} onChange={(values) => this.setState({ priceSaleOff: values.floatValue })} />
											<Msg target="priceSaleOff" msgs={this.state.msgs} className="errorMsg" />
										</Col>
									</Row>
								</Tabs.TabPane>
							</Tabs>
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Được đặt hàng</label>
							<Switch checked={this.state.allowOrder} onChange={(value) => this.setState({ allowOrder: value })} />
						</Col>
						<Col>
							<label>Ấn đi</label>
							<Switch checked={this.state.isHidden} onChange={(value) => this.setState({ isHidden: value })} />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Hình ảnh</label>
							<Upload multiple={true} value={this.state.fileList} onChange={(value) => this.setState({ fileList: value })} />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Tóm tắt</label>
							<Input.TextArea
								autoSize={{ minRows: 2, maxRows: 10 }}
								value={this.state.summary}
								onChange={({ target: { value } }) => this.setState({ summary: value })}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Thông tin chi tiết</label>
							<Upload
								multiple={true}
								value={this.state.descriptionFileList}
								onChange={(value) => this.setState({ descriptionFileList: value })}
								filePicker={(value) => this.setState({ filePicker: value })}
							/>
							<Editor value={this.state.description} onChange={(value) => this.setState({ description: value })} filePicker={this.state.filePicker} />
						</Col>
					</Row>
					<div className="footer fixed">
						<Row>
							<Col>
								<Button type="primary" onClick={this.onSubmit}>
									Đồng ý
								</Button>
							</Col>
							<Col>
								<Button onClick={this.onCancel}>Đóng</Button>
							</Col>
						</Row>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
