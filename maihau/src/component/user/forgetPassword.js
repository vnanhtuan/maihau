import React, { Component } from "react";
import { Row, Col, Input, Button } from 'antd';

import { ForgetPasswordService } from "./userService";

import { Popup, Msg } from '../../common/component';

export default class ForgetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: props.match.params.key ? "reset" : "forget",
			userName: "",
			email: "",
			msgs: [],
		};
	}

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ForgetPasswordService.submit({
			userName: this.state.userName,
			email: this.state.email,
		});
		Popup.spin.hide();
		if (res.success) {
			Popup.info({
				title: "Please check your mail for reset password"
			});
			this.props.history.push("/")
		}
		this.setState({ msgs: res.msgs });
	}

	onResetSubmit = async () => {
		Popup.spin.show();
		const res = await ForgetPasswordService.resetSubmit({
			key: this.props.match.params.key,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
		});
		Popup.spin.hide();
		console.log(res.msgs.indexOf(item => item.target === "forgetPassword"))
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.history.push("/login")
		} else
			if (res.msgs.indexOf(item => item.target === "forgetPassword") >= 0) {
				Popup.error({
					title: "Info is invalid. Please try forget password again",
					onOk: () => window.location = "/forgetPassword",
				});
			}

		this.setState({ msgs: res.msgs });
	}

	render() {
		return (
			<div className="login-page">
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				{this.state.mode === "forget" ?
					<div className="login-form form">
						<Row>
							<Col>
								<h1>Forget password</h1>
							</Col>
						</Row>
						<Row>
							<Col>
								<Input placeholder="User name" value={this.state.userName}
									prefix={<i className="far fa-user"></i>}
									onChange={(event) => { this.setState({ userName: event.target.value }) }}
									onPressEnter={this.onSubmit}
									autoFocus={true}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<Input placeholder="Email" value={this.state.email}
									prefix={<i className="far fa-envelope"></i>}
									onChange={(event) => { this.setState({ email: event.target.value }) }}
									onPressEnter={this.onSubmit}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<Msg target="forgetPassword" msgs={this.state.msgs} className="errorMsg" />
								<Button type="primary" onClick={this.onSubmit}>Submit</Button>
							</Col>
						</Row>
					</div>
					:
					<div className="login-form form">
						<Row>
							<Col>
								<h1>New password</h1>
							</Col>
						</Row>
						<Row>
							<Col>
								<Input.Password placeholder="New password" value={this.state.password}
									prefix={<i className="far fa-key"></i>}
									onChange={(event) => { this.setState({ password: event.target.value }) }}
									onPressEnter={this.onSubmit}
								/>
								<Msg target="password" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<Input.Password placeholder="Confirm password" value={this.state.confirmPassword}
									prefix={<i className="far fa-key"></i>}
									onChange={(event) => { this.setState({ confirmPassword: event.target.value }) }}
									onPressEnter={this.onSubmit}
								/>
								<Msg target="confirmPassword" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<em>
									- Password length must be least 8 characters<br />
									- UPPER, lowercase letters and Number<br />
									- Special characters ! @@, #, $, %, ^, &, *<br />
									<br />
								</em>
							</Col>
						</Row>
						<Row>
							<Col>
								<Msg target="forgetPassword" msgs={this.state.msgs} className="errorMsg" />
								<Button type="primary" onClick={this.onResetSubmit}>Submit</Button>
							</Col>
						</Row>
					</div>
				}
			</div>
		);
	}
}