import React, { Component } from "react";
import { Row, Col, Input, Button, Select, Pagination, Radio } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { Popup, Msg, InputNumber, NumberFormat } from "../../common/component";
import { Format } from "../../common/format";
import VerificationCode from "../user/verificationCode";

import { CurrentUserService } from "../user/currentUserService";
import { WithdrawService } from "./walletService";

export default class Withdraw extends Component {
	constructor(props) {
		super(props);

		this.state = this.defaultState();
	}

	defaultState = () => ({
		userCurrent: CurrentUserService.getUser(),
		value: null,
		verificationCode: "",
		msgs: [],
		feeVND: 0,
		itemList: [],
		bankList:[],	
		pageIndex: 1,
		totalPages: 0,
		totalItems: 0,
		pageSize: 20,
		bankId: null,
		bankBranch: null,
		bankAccountName: null,
		bankAccountNumber: null,
		keyword: null,
		dateFrom: null,
		dateTo: null,
		statusId: null,
		orderBy: "dateCreatedDec",		
	})

	init = () => {
		Popup.spin.show();
		WithdrawService.init().then((res) => {
			if (res) {
				this.setState({
					walletList: res.walletList,
					wallet: res.walletList[0].id,
					bankList: res.bankList,
					bankId: res.userInfo.bankId,
					bankBranch: res.userInfo.bankBranch,
					bankAccountName: res.userInfo.bankAccountName,
					bankAccountNumber: res.userInfo.bankAccountNumber,
					fee: res.fee,
					min: res.min,
				});
			}
			Popup.spin.hide();
		});

		this.getList();
	};

	componentDidMount() {
		this.init();
	}

	onValueChange = (value) => {
		if (!value) value = 0;
		let feeVND = (value * this.state.fee) / 100;
		this.setState({
			value: value > 0 ? value : null,
			feeVND: Format.number(feeVND),
		});
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await WithdrawService.submit({
			value: this.state.value,
			verificationCode: this.state.verificationCode,
			bankId: this.state.bankId,
			bankBranch: this.state.bankBranch,
			bankAccountName: this.state.bankAccountName,
			bankAccountNumber: this.state.bankAccountNumber,
		});
		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.setState(this.defaultState());
			this.init();
		} else this.setState({ msgs: res.msgs });
	};

	getList = () => {
		const isMounted = this.updater.isMounted(this);
		if (isMounted === false) return;

		Popup.spin.show();
		WithdrawService.getList({
			statusId: this.state.statusId,
			dateFrom: this.state.dateFrom,
			dateTo: this.state.dateTo,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then((res) => {
			if (res.success && isMounted)
				this.setState({
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					pageSize: res.pageSize,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
				});
			Popup.spin.hide();

			if (isMounted) setTimeout(this.getList, 1000000);
		});
	};

	onChangeStatus = (e) => {
		this.setState({statusId: e.target.value},
			() => this.getList()
		)
	}

	render() {
		return (
			<div className="withdraw-page">
				<h1>Rút tiền</h1>
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				<div className="form">
					<Row>
						<Col xs={{ span: 24, order: 1 }} md={{ span: 8, order: 1 }}>
							<div className="box">
								<Row>
									<Col xs={24} md={24}>
										<label required>Ví chính</label>
										<Select placeholder="--Chọn ví rút tiền--" className="wallet-list-select" dropdownClassName="wallet-list-select" style={{ width: "100%" }}
											value={this.state.wallet}
											onChange={(value) => this.setState({ wallet: value })}>
											{this.state.walletList &&
												this.state.walletList.map((item) => (
													<Select.Option className="wallet" key={item.id} value={item.id}>
														Ví {item.name}
														<span>
															<NumberFormat value={item.value} />
														</span>
													</Select.Option>
												))}
										</Select>
										<Msg target="wallet" msgs={this.state.msgs} className="errorMsg" />
									</Col>
									<Col xs={24} md={24}>
										<label required>Giá trị nhận</label>
										<InputNumber value={this.state.value}
											onChange={(result) => this.onValueChange(result.floatValue)}/>
										<Msg target="value" msgs={this.state.msgs} className="errorMsg"/>
									</Col>
								</Row>
								<Row>
									<Col>Giá trị nhận tối thiểu: {this.state.min}</Col>
									<Col style={{ textAlign: "right" }}>
										Phí ({this.state.fee}%): {this.state.feeVND}
									</Col>
								</Row>
								{this.state.hasVerificationCode && (
								<Row>
									<Col>
										<VerificationCode value={this.state.verificationCode} category="withdraw" onChange={(value) => this.setState({ verificationCode: value, })}/>
										<Msg target="verificationCode" msgs={this.state.msgs} className="errorMsg"/>
									</Col>
								</Row>
								)}
								<Row>
									<Col>
										<Button type="primary" onClick={this.onSubmit}>
											Submit
										</Button>
									</Col>
								</Row>
							</div>
						</Col>
						<Col xs={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }}>
							<div className="box">
								<Row>
									<Col xs={24} md={12}>
										<label required>Chọn ngân hàng</label>
										<Select
											showSearch
											filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											value={this.state.bankId}
											onChange={(value) => this.setState({ bankId: value })}>
												{this.state.bankList &&
													this.state.bankList.map((item) => (
														<Select.Option key={item.id} value={item.id}>
															{item.name}
														</Select.Option>
													))}
										</Select>
										<Msg target="bankId" msgs={this.state.msgs} className="errorMsg" />
									</Col>
									<Col xs={24} md={12}>
										<label>Chi nhánh</label>
										<Input
											value={this.state.bankBranch}
											onChange={(event) => {
												this.setState({ bankBranch: event.target.value });
											}}
										/>
									</Col>
								</Row>
								<Row>
									<Col xs={24} md={12}>
										<label required>Chủ tài khoản</label>
										<Input value={this.state.bankAccountName} onChange={(event) => {
															this.setState({
																bankAccountName: event.target.value,
															});
										}}/>
										<Msg target="bankAccountName" msgs={this.state.msgs} className="errorMsg" />
									</Col>
									<Col xs={24} md={12}>
										<label required>Số tài khoản</label>
										<Input
											value={this.state.bankAccountNumber}
											onChange={(event) => {
												this.setState({
													bankAccountNumber: event.target.value,
												});
											}}
										/>
										<Msg target="bankAccountNumber" msgs={this.state.msgs} className="errorMsg" />
									</Col>
								</Row>
								{this.state.hasVerificationCode && (
									<Row>
										<Col>
										<label>Mã xác thực</label>
											<VerificationCode value={this.state.verificationCode} category="bank" onChange={value => this.setState({ verificationCode: value })} />
											<Msg target="verificationCode" msgs={this.state.msgs} className="errorMsg" />
										</Col>
									</Row>
								)}
							</div>
						</Col>
					</Row>
				</div>
				
				<div className="deposit-history">
					
					<Row align="middle" justify="end">
						<Col flex="auto">
							<b>Lịch sử rút tiền</b> - {this.state.totalItems} giao dịch
						</Col>
						<Col>
							<Radio.Group defaultValue="" onChange={this.onChangeStatus}>
								<Radio.Button value="">Tất Cả</Radio.Button>
								<Radio.Button value="1">Chờ Xử Lý</Radio.Button>
								<Radio.Button value="2">Đang Xử Lý</Radio.Button>
								<Radio.Button value="3">Hoàn Tất</Radio.Button>
								<Radio.Button value="4">Hủy Bỏ</Radio.Button>
							</Radio.Group>
						</Col>
						<Col>
							<Select
								placeholder="Sort"
								style={{ width: "140px" }}
								value={this.state.orderBy}
								onChange={(value) =>
									this.setState({ orderBy: value }, () =>
										this.getList()
									)
								}
							>
								<Select.Option value="dateCreatedDec">
									Mới nhất
								</Select.Option>
								<Select.Option value="dateCreatedInc">
									Cũ nhất
								</Select.Option>
							</Select>
						</Col>
						<Col style={{ marginLeft: "auto" }}>
							<Pagination
								current={this.state.pageIndex}
								total={this.state.totalItems}
								pageSize={this.state.pageSize}
								showSizeChanger={false}
								onChange={(value) =>
									this.setState({ pageIndex: value }, () =>
										this.getList()
									)
								}
							/>
						</Col>
					</Row>
					<div className="box">
						<div className="table">
							<ol>
								<li>Ngày</li>
								{ this.state.userCurrent.isAdmin && (
									<li>Thành viên</li>
								)}
								<li>Giá trị nhận</li>
								<li>Thụ hưởng</li>
								<li>Ngân hàng</li>
								<li>Trạng thái</li>
								<li>Thao tác</li>
							</ol>
							{this.state.itemList.map((item) => (
								<ul key={item.id}>
									<li className="collapsing">
										{Format.date(new Date(item.dateCreated))}{" "}
										<em>{Format.time(new Date(item.dateCreated))}</em>
									</li>
									{ this.state.userCurrent.isAdmin && (
										<li>
											<a onClick={() => {}}>{item.userName}</a>
										</li>
									)}
									<li>
										<div>{Format.number(item.receiveValue)} VND</div>
										<div>({Format.number(item.fees)} - {this.state.fee}%)</div>
									</li>
									<li>
										<div>{item.bankAccountNumber}</div>
										<div>{item.bankAccountName}</div>
									</li>
									<li>
										<div>{item.bankName}</div>
										<em>{item.bankBranch}</em>
									</li>
									<li className={"status-" + item.statusId}>
										{item.statusName}
									</li>
									<li>
										<Button
											type="primary"
											icon={<i className="fas fa-times"></i>}
											onClick={() => console.log("Huy")}>
											Hủy bỏ
										</Button>
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
								onChange={(value) =>
									this.setState({ pageIndex: value }, () =>
										this.getList()
									)
								}
							/>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
