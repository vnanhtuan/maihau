import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Input, Button } from "antd";

import { LoginService } from "./userService";
import { CurrentUserService } from "./currentUserService";

import { Popup, Msg } from "../../common/component";

export default class Login extends Component {
	constructor(props) {
		super(props);

		const token = this.props.match.params.token;
		if (token) {
			LoginService.tokenSet(token);
			CurrentUserService.checkUser().then(() => this.props.history.push("/office"));
		}

		this.state = {
			userName: "",
			password: "",
			msgs: [],
		};
		console.log(this.props.match.params.token);
	}

	onSubmit = async () => {
		Popup.spin.show();
		const res = await LoginService.loginSubmit({
			userName: this.state.userName,
			password: this.state.password,
		});
		Popup.spin.hide();
		if (res.success && res.data != null) {
			LoginService.tokenSet(res.data);
			CurrentUserService.checkUser().then(() => this.props.history.push("/office"));
		}
		this.setState({ msgs: res.msgs });
	};

	render() {
		return (
			<div className="login-page">
				<div className="login-form form">
					<Row>
						<Col>
							<h1>Đăng nhập</h1>
						</Col>
					</Row>
					<Row>
						<Col>
							<Input
								placeholder="Tên truy cập"
								value={this.state.userName}
								prefix={<i className="far fa-user"></i>}
								onChange={(event) => {
									this.setState({ userName: event.target.value });
								}}
								onPressEnter={this.onSubmit}
								autoFocus={true}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Input.Password
								placeholder="Mật khẩu"
								value={this.state.password}
								prefix={<i className="far fa-key"></i>}
								onChange={(event) => {
									this.setState({ password: event.target.value });
								}}
								onPressEnter={this.onSubmit}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Msg target="login" msgs={this.state.msgs} className="errorMsg" />
							<Button type="primary" onClick={this.onSubmit}>
								Đồng ý
							</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<Button type="link">
								<Link to="/forgetPassword">Quên mật khẩu</Link>
							</Button>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
