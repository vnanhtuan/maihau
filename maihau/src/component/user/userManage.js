import React, { Component } from "react";
import { Row, Col, Tag, Input, Select, DatePicker, Pagination, Menu, Dropdown, Switch } from "antd";

import { Locale } from "../../common/locale";
import { Format } from "../../common/format";
import { Popup } from "../../common/component";

import { UserManageService, LoginToUserService, LoginService } from "./userService";
import { FileService } from "../file/fileService";

export default class UserManage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			memberTypeList: [],
			itemList: [],
			pageIndex: 1,
			pageSize: 20,
			totalPages: 0,
			totalItems: 0,
			keyword: null,
			dateFrom: null,
			dateTo: null,
			memberTypeId: null,
			orderBy: "dateCreatedDec",
		};
	}

	componentDidMount() {
		UserManageService.init().then((res) => {
			if (res.success) {
				this.setState({ memberTypeList: res.memberTypeList });
			}
		});
		this.getList();
	}

	getList = () => {
		Popup.spin.show();
		UserManageService.getList({
			keyword: this.state.keyword,
			isBanned: this.state.isBanned,
			dateFrom: this.state.dateFrom,
			dateTo: this.state.dateTo,
			memberTypeId: this.state.memberTypeId,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then((res) => {
			if (res.success)
				this.setState({
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
					pageSize: res.pageSize,
				});
			Popup.spin.hide();
		});
	};

	banItem = (item) => {
		Popup.spin.show();
		UserManageService.ban(item.id).then((res) => {
			Popup.spin.hide();

			this.getList();
		});
	};

	onBanItem = (item) => {
		Popup.confirm({
			title: Locale.getText(item.isBanned ? "common.remove_ban_confirm" : "common.ban_confirm"),
			content: item.userName,
			onOk: () => this.banItem(item),
		});
	};

	loginToUser = async (item) => {
		Popup.spin.show();
		const res = await LoginToUserService.login({ userId: item.id });
		Popup.spin.hide();

		if (res.success) {
			LoginService.tokenSet(res.data);
			window.location = "/office";
		}
	};

	render() {
		return (
			<React.Fragment>
				<h1>Quản lý thành viên</h1>
				<Row align="middle">
					<Col flex="auto">
						<Input.Search
							placeholder="Từ khoá"
							value={this.state.keyword}
							onChange={({ target: { value } }) => this.setState({ keyword: value })}
							onSearch={() => this.getList()}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker
							placeholder="Từ ngày"
							format={Locale.getFormat().dateFormat}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateFrom: value ? value.format("YYYY-MM-DD") : null }, () => this.getList())}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker
							placeholder="Đến ngày"
							format={Locale.getFormat().dateFormat}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateTo: value ? value.format("YYYY-MM-DD") : null }, () => this.getList())}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<Select
							placeholder="Loại thành viên"
							allowClear={true}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ memberTypeId: value }, () => this.getList())}
						>
							{this.state.memberTypeList.map((item) => (
								<Select.Option key={item.id}>{item.name}</Select.Option>
							))}
						</Select>
					</Col>
					<Col>
						<Switch onChange={(value) => this.setState({ isBanned: value }, () => this.getList())} /> Bị cấm
					</Col>
				</Row>
				<Row align="middle" justify="end">
					<Col flex="auto">{this.state.totalItems} Thành viên</Col>
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
					<div className="table has-left-col has-menu">
						<ol>
							<li>Ảnh</li>
							<li>Thành viên</li>
							<li>Tham gia</li>
							<li>Giới thiệu</li>
							<li>HelpPay</li>
							<li>HelpBank</li>
							<li>Dịch vụ</li>
							<li>Nhóm</li>
							<li></li>
						</ol>
						{this.state.itemList.map((item) => (
							<ul key={item.id} className="small-left-col">
								<li className="left-col collapsing">
									<div className="image-1-1 image-circle" style={{ backgroundImage: "url(" + FileService.imageURL(item.imageId, 128) + ")" }}></div>
								</li>
								<li className="text-wrap">
									<span className="link" onClick={() => this.loginToUser(item)}>
										{item.userName}
									</span>
									&nbsp;
									{item.isBanned && <Tag color="error">Cấm</Tag>}
									{item.isSponsor && <Tag color="blue">Tài trợ</Tag>}
									{item.isCompany && <Tag color="green">Công ty</Tag>}
									<div>
										<em>{item.fullName}</em>
									</div>
									{item.email}
								</li>
								<li>
									{item.dateCreated && (
										<>
											{Format.date(new Date(item.dateCreated))}
											<br />
											<em>{Format.time(new Date(item.dateCreated))}</em>
										</>
									)}
								</li>
								<li className="text-wrap">
									{item.sponsor && (
										<React.Fragment>
											<span className="link" data-title="Sponsor">
												{item.sponsor.userName}
											</span>
											<div>
												<em>{item.sponsor.fullName}</em>
											</div>
											{item.sponsor.email}
										</React.Fragment>
									)}
								</li>
								<li data-title="Ví HelpPay">{Format.number(item.primaryWallet)}</li>
								<li data-title="Ví HelpBank">{Format.number(item.secondaryWallet)}</li>
								<li data-title="Ví Dịch vụ">{Format.number(item.fundWallet)}</li>
								<li data-title="Ví nhóm">{Format.number(item.groupWallet)}</li>
								<li className="menu-col">
									<Dropdown
										placement="bottomRight"
										trigger={["click"]}
										overlay={
											<Menu>
												<Menu.Item onClick={() => this.onBanItem(item)}>
													<span>
														<i className="icon fas fa-ban"></i>
														<span>{item.isBanned ? "Gỡ cấm" : "Cấm"}</span>
													</span>
												</Menu.Item>
											</Menu>
										}
									>
										<span className="link" onClick={(e) => e.preventDefault()}>
											<i className="far fa-ellipsis-v" />
										</span>
									</Dropdown>
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
			</React.Fragment>
		);
	}
}
