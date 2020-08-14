import React, { Component } from "react";
import { Row, Col, Input, Select, DatePicker, Pagination, Drawer, Button } from "antd";

import { Locale } from "../../common/locale";
import { Format } from "../../common/format";
import { Popup } from "../../common/component";

import { OrdersManageService } from "./productService";
import { FileService } from "../file/fileService";

export default class Orders extends Component {
	state = {
		isAdmin: false,
		statusList: [],
		stateProvinceList: [],
		districtCityList: [],
		itemList: [],
		pageIndex: 1,
		pageSize: 20,
		totalPages: 0,
		totalItems: 0,
		type: this.props.match.params.type,
		keyword: null,
		dateFrom: null,
		dateTo: null,
		orderBy: "dateCreatedDec",
		itemDetail: null,
	};

	componentDidMount() {
		OrdersManageService.init().then((res) => {
			if (res.success) {
				this.setState({
					isAdmin: res.isAdmin,
					statusList: res.statusList,
					stateProvinceList: res.stateProvinceList,
					districtCityList: res.districtCityList,
				});

				this.getList();
			}
		});
	}

	getList = () => {
		Popup.spin.show();
		OrdersManageService.getList({
			type: this.state.type,
			keyword: this.state.keyword,
			dateFrom: this.state.dateFrom,
			dateTo: this.state.dateTo,
			statusId: this.state.statusId,
			stateProvinceId: this.state.stateProvinceId,
			districtCityId: this.state.districtCityId,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then((res) => {
			if (res.success) {
				for (var i = 0; i < res.itemList.length; i++) {
					const item = res.itemList[i];
					item.dateCreated = new Date(item.dateCreated);
					item.date = Format.date(item.dateCreated);
					item.time = Format.time(item.dateCreated);
					item.statusName = this.state.statusList.find((m) => m.id === item.statusId).name;
				}
				this.setState({
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
				});
			}
			Popup.spin.hide();
		});
	};

	onItemDetail = (item) => {
		const itemDetail = item;
		this.setState({
			isItemDrawer: true,
			itemDetailStatusId: itemDetail.statusId,
			itemDetailNote: itemDetail.note,
		});

		if (itemDetail.itemList) {
			this.setState({ itemDetail });
			return;
		}

		Popup.spin.show();
		OrdersManageService.getDetail({
			id: item.id,
			type: this.state.type,
		}).then((res) => {
			if (res.success) {
				itemDetail.address = res.address;
				itemDetail.itemList = res.itemList;
				itemDetail.statusList = res.statusList;
				itemDetail.isCancel = res.isCancel;
				itemDetail.isBuyerCancel = res.isBuyerCancel;
				itemDetail.isSellerCancel = res.isSellerCancel;
				itemDetail.isClose = res.isClose;
				this.setState({ itemDetail });
			}
			Popup.spin.hide();
		});
	};

	onItemClose = () => {
		this.setState({ isItemDrawer: false });
	};

	onItemDetailSubmit = async () => {
		Popup.spin.show();
		const res = await OrdersManageService.update({
			id: this.state.itemDetail.id,
			type: this.state.type,
			statusId: this.state.itemDetailStatusId,
		});
		Popup.spin.hide();

		if (res.success) {
			this.getList();

			Popup.info({ autoClose: true });

			this.onItemClose();
		}
	};

	onItemDetailCancel = async () => {
		Popup.confirm({
			title: "Bạn muốn huỷ đơn hàng đang chọn?",
			onOk: async () => {
				Popup.spin.show();
				const res = await OrdersManageService.cancel({
					id: this.state.itemDetail.id,
					type: this.state.type,
				});
				Popup.spin.hide();

				if (res.success) {
					this.getList();

					Popup.info({ autoClose: true });

					this.onItemClose();
				}
			},
		});
	};

	shouldComponentUpdate(nextProps) {
		let hasChange = false;
		if (this.props.match.params.type != nextProps.match.params.type) {
			this.state.type = nextProps.match.params.type;
			hasChange = true;
		}

		if (hasChange) this.getList();

		return true;
	}

	render() {
		return (
			<React.Fragment>
				<h1>{this.state.type === "buyer" ? "Hoá đơn mua hàng" : "Đơn đặt hàng"}</h1>
				<Row align="middle">
					<Col flex="auto">
						<Input.Search
							placeholder="Từ khoá"
							value={this.state.keyword}
							onChange={({ target: { value } }) => this.setState({ keyword: value })}
							onSearch={this.getList}
						/>
					</Col>
					<Col flex="auto">
						<Select style={{ width: "100%" }} placeholder="Trạng thái" onChange={(value) => this.setState({ statusId: value }, this.getList)} allowClear>
							{this.state.statusList.map((item) => (
								<Select.Option key={item.id} value={item.id}>
									{item.name}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker
							placeholder="Từ ngày"
							format={Locale.getFormat().dateFormat}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateFrom: value ? value.format("YYYY-MM-DD") : null }, this.getList)}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker
							placeholder="Đến ngày"
							format={Locale.getFormat().dateFormat}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateTo: value ? value.format("YYYY-MM-DD") : null }, this.getList)}
						/>
					</Col>
					<Col flex="auto">
						<Select
							style={{ width: "100%" }}
							placeholder="Tỉnh thành"
							onChange={(value) => this.setState({ stateProvinceId: value, districtCityId: null }, this.getList)}
							value={this.state.stateProvinceId}
							allowClear
							showSearch
							optionFilterProp="children"
						>
							{this.state.stateProvinceList.map((item) => (
								<Select.Option key={item.id} value={item.id}>
									{item.name}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col flex="auto">
						<Select
							style={{ width: "100%" }}
							placeholder="Quận huyện"
							onChange={(value) => this.setState({ districtCityId: value }, this.getList)}
							value={this.state.districtCityId}
							allowClear
							showSearch
							optionFilterProp="children"
						>
							{this.state.districtCityList.map(
								(item) =>
									item.stateProvinceId === this.state.stateProvinceId && (
										<Select.Option key={item.id} value={item.id}>
											{item.name}
										</Select.Option>
									)
							)}
						</Select>
					</Col>
				</Row>
				<Row align="middle" justify="end">
					<Col flex="auto">{this.state.totalItems} mục</Col>
					<Col>
						<Select
							placeholder="Sắp xếp"
							style={{ width: "140px" }}
							value={this.state.orderBy}
							onChange={(value) => this.setState({ orderBy: value }, () => this.getList())}
						>
							<Select.Option value="dateCreatedDec">Mới nhất</Select.Option>
							<Select.Option value="dateCreatedInc">Cũ nhất</Select.Option>
						</Select>
					</Col>
					<Col style={{ marginLeft: "auto" }}>
						<Pagination
							current={this.state.pageIndex}
							total={this.state.totalItems}
							pageSize={this.state.pageSize}
							showSizeChanger={false}
							onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
						/>
					</Col>
				</Row>
				<div className="box">
					<div className="table has-click">
						<ol>
							<li>#</li>
							<li>Ngày tạo</li>
							<li>Người mua</li>
							<li>Người bán</li>
							<li className="right">Giá trị</li>
							<li>Trạng thái</li>
							<li>Ghi chú</li>
							<li></li>
						</ol>
						{this.state.itemList.map((item) => (
							<ul key={item.id} onClick={() => this.onItemDetail(item)}>
								<li data-title="#">{item.id}</li>
								<li data-title="Ngày tạo">
									<div>{Format.date(item.dateCreated)}</div>
									<em>{Format.time(item.dateCreated)}</em>
								</li>
								<li data-title="Người mua">
									<div>{item.buyer.userName}</div>
									<em>{item.buyer.fullName}</em>
								</li>
								<li data-title="Người bán">
									<div>{item.seller.userName}</div>
									<em>{item.seller.fullName}</em>
								</li>
								<li data-title="Giá trị" className="right">
									<div>Tổng: {Format.number(item.value)}</div>
									<div>Ví HelpPay: {Format.number(item.primaryWallet)}</div>
									<div>Ví Dịch vụ: {Format.number(item.fundWallet)}</div>
								</li>
								<li data-title="Status" className={"status-" + item.statusId}>
									{item.statusName}
									{item.isBuyerCancel && <div>Người mua huỷ bỏ</div>}
									{item.isSellerCancel && <div>Người bán huỷ bỏ</div>}
								</li>
								<li data-title="Note">
									<div style={{ whiteSpace: "pre-wrap", maxWidth: 300 }}>{item.note}</div>
								</li>
								<li className="menu-col">
									<a>
										<i className="fal fa-info-circle" />
									</a>
								</li>
							</ul>
						))}
					</div>
				</div>
				<Row gutter={[0, 10]}>
					<Col style={{ marginLeft: "auto" }}>
						<Pagination
							current={this.state.pageIndex}
							total={this.state.totalItems}
							pageSize={this.state.pageSize}
							showSizeChanger={false}
							onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
						/>
					</Col>
				</Row>
				<Drawer placement="right" onClose={this.onItemClose} visible={this.state.isItemDrawer} width={768} className="drawer">
					{this.state.itemDetail && this.state.itemDetail.statusList && (
						<div className="box">
							<h2>
								{this.state.type === "buyer" ? "Hoá đơn mua hàng" : "Đơn đặt hàng"} #{this.state.itemDetail.id}
							</h2>
							<div className="divider small" />
							<Row>
								<Col xs={24} md={12}>
									<div>
										<em>Ngày tạo</em>
										<div>{this.state.itemDetail.date}</div>
									</div>
									<div className="divider" />
									<Row justify="space-between">
										<Col>
											<div>
												<em>Người mua</em>
												<div>{this.state.itemDetail.buyer.userName}</div>
												<div>{this.state.itemDetail.buyer.fullName}</div>
											</div>
										</Col>
										<Col>
											<div>
												<em>Người bán</em>
												<div>{this.state.itemDetail.seller.userName}</div>
												<div>{this.state.itemDetail.seller.fullName}</div>
											</div>
										</Col>
									</Row>
									<div className="divider" />
									<Row justify="space-between">
										<Col>
											<div>
												<em>Tổng</em>
												<div>{Format.number(this.state.itemDetail.value)}</div>
											</div>
										</Col>
										<Col>
											<div>
												<em>Ví HelpPay</em>
												<div>{Format.number(this.state.itemDetail.value - this.state.itemDetail.fundWallet)}</div>
											</div>
										</Col>
										<Col>
											<div>
												<em>Ví DV</em>
												<div>{Format.number(this.state.itemDetail.fundWallet)}</div>
											</div>
										</Col>
									</Row>
									<div className="divider" />
									<div>
										<em>Địa chỉ</em>
										<div>{this.state.itemDetail.address}</div>
									</div>
								</Col>
								<Col xs={24} md={12}>
									<em>Trạng thái</em>
									{this.state.itemDetail.isClose ? (
										<>
											<div>{this.state.itemDetail.statusName}</div>
											{this.state.itemDetail.isBuyerCancel && <div>Người mua huỷ bỏ</div>}
											{this.state.itemDetail.isSellerCancel && <div>Người bán huỷ bỏ</div>}
										</>
									) : (
										<Select
											style={{ width: "100%" }}
											placeholder="Status"
											value={this.state.itemDetailStatusId}
											onChange={(value) => this.setState({ itemDetailStatusId: value })}
											allowClear
										>
											{this.state.itemDetail.statusList.map((item) => (
												<Select.Option key={item.id} value={item.id} disabled={item.disabled}>
													{item.name}
													{item.id === 4 && <div style={{ color: "#0a0" }}>Khi bạn đã nhận được sản phẩm</div>}
												</Select.Option>
											))}
										</Select>
									)}
									<div className="divider" />
									<em>Ghi chú</em>
									<Input.TextArea readOnly rows={3} value={this.state.itemDetailNote} />
									<div className="divider" />
									{this.state.itemDetail.isClose == false && (
										<Row justify="space-between">
											<Col>
												<Button type="primary" onClick={this.onItemDetailSubmit}>
													Cập nhật
												</Button>
											</Col>
											<Col>
												{this.state.itemDetail.isCancel && (
													<Button danger onClick={this.onItemDetailCancel}>
														Hủy đơn hàng
													</Button>
												)}
											</Col>
										</Row>
									)}
								</Col>
							</Row>
							<div className="divider" />
							<div className="table has-left-col">
								<ol>
									<li className="collapsing">Hình ảnh</li>
									<li>Sản phẩm</li>
									<li className="right collapsing">Giá / Ví DV</li>
									<li className="right">SL</li>
									<li className="right">Tổng</li>
								</ol>
								{this.state.itemDetail.itemList &&
									this.state.itemDetail.itemList.map((item, index) => (
										<ul key={item.productId}>
											<li className="left-col">
												<div
													className="image-1-1"
													style={{ width: "80px", backgroundImage: "url(" + FileService.imageURL(item.imageId, 128) + ")" }}
												></div>
											</li>
											<li className="name-col">
												<a>{item.productName}</a>
												{item.bonusPoint && (
													<div className="fund">
														<em>Nhận:</em> {Format.number(item.bonusPoint)} / {item.numberOfReceive} tháng
													</div>
												)}
												{item.memberTypeNameBonus && (
													<div className="fund">
														<em>Gói:</em> {item.memberTypeNameBonus}
													</div>
												)}
											</li>
											<li className="right collapsing price-col">
												<div className="price">{Format.number(item.price)}</div>
												{item.fundWallet && (
													<div className="fund">
														<em>Ví DV:</em> {Format.number(item.fundWallet)}
													</div>
												)}
											</li>
											<li className="right" data-title="Quantity">
												{item.qty}
											</li>
											<li className="right collapsing total-col" data-title="Total">
												<div className="price">{Format.number(item.price * item.qty)}</div>
												{item.bonusPoint && <div className="fund">{Format.number(item.fundWallet * item.qty)}</div>}
											</li>
										</ul>
									))}
							</div>
						</div>
					)}
				</Drawer>
			</React.Fragment>
		);
	}
}
