import React, { Component } from "react";
import { Row, Col, Input, Button, Select } from "antd";

import { Popup, Msg } from "../../common/component";
import Upload from "../file/upload";

import VerificationCode from "./verificationCode";
import { ProfileService } from "./userService";
import { CurrentUserService } from "./currentUserService";

export default class Profile extends Component {
	state = {
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	};

	componentDidMount() {
		Popup.spin.show();
		ProfileService.init().then((res) => {
			if (res) {
				this.setState({
					hasVerificationCode: res.hasVerificationCode,
					isAdmin: res.isAdmin,
					userName: res.userName,
					fullName: res.fullName,
					phoneNumber: res.phoneNumber,
					email: res.email,
					fileList: res.fileList,
				});
			}
			Popup.spin.hide();
		});
	}

	onIdCardLocationChange = (value) => {
		const tradingFloor = this.state.tradingFloorList.find((m) => m.locationId == value);
		this.setState({ idCardLocationId: value, originMarketId: tradingFloor.id, originMarketName: tradingFloor.name });
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ProfileService.submit({
			fullName: this.state.fullName,
			phoneNumber: this.state.phoneNumber,
			email: this.state.email,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			fileList: this.state.fileList,
			verificationCode: this.state.verificationCode,
		});
		Popup.spin.hide();

		const newState = {
			msgs: res.msgs,
		};

		if (res.success) {
			CurrentUserService.checkUser();
			Popup.info({ autoClose: true });

			newState.verificationCode = "";
		}

		this.setState(newState);
	};

	render() {
		return (
			<div className="profile-page">
				<h1>Thông tin thành viên</h1>
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				<div className="form">
					<Row>
						<Col xs={{ span: 24, order: 2 }} lg={{ span: 15, order: 1 }}>
							<div className="box">
								<div className="title">Thông tin cơ bản</div>
								<Row>
									<Col xs={24} sm={12}>
										<label>Tên đăng nhập</label>
										<Input value={this.state.userName} readOnly />
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
										</em>
									</Col>
								</Row>
								{this.state.hasVerificationCode && (
									<>
										<div className="title">Mã xác thực</div>
										<Row>
											<Col>
												<VerificationCode
													value={this.state.verificationCode}
													category="profile"
													onChange={(value) => this.setState({ verificationCode: value })}
												/>
												<Msg target="verificationCode" msgs={this.state.msgs} className="errorMsg" />
											</Col>
										</Row>
									</>
								)}
								<div className="divider" />
								<Row>
									<Col>
										<Button type="primary" onClick={this.onSubmit}>
											Đồng ý
										</Button>
									</Col>
								</Row>
							</div>
						</Col>
						<Col xs={{ span: 24, order: 1 }} lg={{ span: 9, order: 1 }}>
							<div className="box">
								<div className="title">Hình ảnh đại diện</div>
								<Upload value={this.state.fileList} type="avatar" onChange={(value) => this.setState({ fileList: value })} />
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
