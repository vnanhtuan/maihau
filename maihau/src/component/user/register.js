import React, { Component } from "react";
import { Row, Col, Input, Button, Select, Switch } from "antd";

import OwlCarousel from "react-owl-carousel2";

import { Popup, Msg } from "../../common/component";
import { Format } from "../../common/format";

import VerificationCode from "./verificationCode";
import { RegisterService, RepositoryService } from "./userService";

export default class Register extends Component {
	defaultState = () => ({
		msgs: [],
		memberTypeList: [],
		stateProvinceList: [],
		tradingFloorList: [],
		sponsorInfo: null,
		originMarketName: null,
		memberTypeId: null,
		userName: null,
		email: null,
		fullName: null,
		phoneNumber: null,
		password: null,
		confirmPassword: null,
		sponsorName: null,
		idCardNumber: null,
		idCardLocationId: null,
		originMarketId: null,
		tradingMarketId: null,
		isCompany: null,
		verificationCode: null,
	});

	memverTypeOptions = {
		margin: 16,
		autoWidth: true,
		dots: false,
		nav: true,
		navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
		rewind: true,
		smartSpeed: 500,
	};

	state = this.defaultState();

	init = () => {
		Popup.spin.show();
		RegisterService.init({ id: this.props.id }).then((res) => {
			if (res) {
				this.setState({
					hasVerificationCode: res.hasVerificationCode,
					isSponsor: res.isSponsor,
					memberTypeList: res.memberTypeList,
					stateProvinceList: res.stateProvinceList,
					tradingFloorList: res.tradingFloorList,
				});
			}
			Popup.spin.hide();
		});
	};

	componentDidMount() {
		this.init();
	}

	onSponsorCheck = (sponsorName) => {
		this.setState({ sponsorName: sponsorName, isSponsorCheck: true });

		clearTimeout(this.sponsorCheckHandle);
		this.sponsorCheckHandle = setTimeout(() => this.sponsorCheck(), 800);
	};

	sponsorCheck = () => {
		RepositoryService.userCheck({ userName: this.state.sponsorName }).then((res) => {
			var msgs = this.state.msgs;
			var sponsorInfo = null;
			if (res.success) {
				msgs = msgs.filter((item) => item.target !== "userCheck");
				sponsorInfo = res.data;
			} else if (msgs.indexOf((item) => item.target === "userCheck") < 0) msgs.push(res.msgs[0]);

			this.setState({ isSponsorCheck: false, msgs, sponsorInfo });
		});
	};

	onIdCardLocationChange = (value) => {
		const tradingFloor = this.state.tradingFloorList.find((m) => m.locationId == value);
		this.setState({ idCardLocationId: value, originMarketId: tradingFloor.id, originMarketName: tradingFloor.name });
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await RegisterService.submit({
			memberTypeId: this.state.memberTypeId,
			userName: this.state.userName,
			// email: this.state.email,
			fullName: this.state.fullName,
			// phoneNumber: this.state.phoneNumber,
			// password: this.state.password,
			// confirmPassword: this.state.confirmPassword,
			sponsorName: this.state.sponsorName,
			// idCardNumber: this.state.idCardNumber,
			// idCardLocationId: parseInt(this.state.idCardLocationId),
			// originMarketId: this.state.originMarketId,
			// tradingMarketId: parseInt(this.state.tradingMarketId),
			// email: this.state.userName + "@domain.com",
			// fullName: this.state.userName,
			email: "info@helpbank.vn",
			phoneNumber: "-----",
			password: "123@Helpbank",
			confirmPassword: "123@Helpbank",
			// sponsorName: "SGD-HCM",
			idCardNumber: "-----",
			idCardLocationId: 79,
			originMarketId: 18,
			tradingMarketId: 18,
			isCompany: this.state.isCompany,
			verificationCode: this.state.verificationCode,
		});
		Popup.spin.hide();
		if (res.success) {
			this.setState(this.defaultState());
			this.init();
			Popup.info({ autoClose: true });
		} else this.setState({ msgs: res.msgs });
	};

	render() {
		return (
			<div className="register-page">
				<h1 className="page-title">Đăng ký</h1>
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				<div className="form">
					<div className="box">
						<div className="title">Thông tin cơ bản</div>
						<Row>
							<Col xs={24} sm={12}>
								<label>Tên đăng nhập</label>
								<Input
									value={this.state.userName}
									onChange={(event) => {
										this.setState({ userName: event.target.value });
									}}
								/>
								<Msg target="userName" msgs={this.state.msgs} className="errorMsg" />
							</Col>
							<Col xs={24} sm={12}>
								<label>Email</label>
								<Input
									value={this.state.email}
									onChange={(event) => {
										this.setState({ email: event.target.value });
									}}
								/>
								<Msg target="email" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col xs={24} sm={12}>
								<label>Họ và tên</label>
								<Input
									value={this.state.fullName}
									onChange={(event) => {
										this.setState({ fullName: event.target.value });
									}}
								/>
								<Msg target="fullName" msgs={this.state.msgs} className="errorMsg" />
							</Col>
							<Col xs={24} sm={12}>
								<label>Số điện thoại</label>
								<Input
									value={this.state.phoneNumber}
									onChange={(event) => {
										this.setState({ phoneNumber: event.target.value });
									}}
								/>
								<Msg target="phoneNumber" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<label>Mật khẩu</label>
								<Input.Password
									value={this.state.password}
									onChange={(event) => {
										this.setState({ password: event.target.value });
									}}
								/>
								<Msg target="password" msgs={this.state.msgs} className="errorMsg" />
							</Col>
							<Col>
								<label>Nhập lại mật khẩu</label>
								<Input.Password
									value={this.state.confirmPassword}
									onChange={(event) => {
										this.setState({ confirmPassword: event.target.value });
									}}
								/>
								<Msg target="confirmPassword" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<em>
									- Mật khẩu ít nhất 8 ký tự
									<br />
									- Phải có CHỮ HOA, chữ thường, con số
									<br />
									- Và các ký tự đặc biệt: ! @, #, $, %, ^, &amp;, *<br />
									<br />
								</em>
							</Col>
						</Row>
						<Row>
							<Col>
								<label>Thành viên hỗ trợ</label>
								<Input.Search
									value={this.state.sponsorName}
									onChange={({ target: { value } }) => this.onSponsorCheck(value)}
									loading={this.state.isSponsorCheck}
								/>
								{this.state.sponsorInfo && <div className="successMsg">Sponsor "{this.state.sponsorInfo.userName}" is valid</div>}
								<Msg target="userCheck" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}
