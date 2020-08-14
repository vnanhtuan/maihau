import React, { Component } from "react";
import { Input, Button, message } from 'antd';

import { VerificationCodeService } from "./userService";

export default class VerificationCode extends Component {
	state = {
		isGetCode: false,
	}

	onChange = ({ target: { value } }) => {
		if (this.props.onChange)
			this.props.onChange(value);
	}

	onCodeGet = async () => {
		this.setState({ isGetCode: true });
		const res = await VerificationCodeService.get({ categoryId: this.props.category });
		this.setState({ isGetCode: false });
		
		message.info("Mã xác thực đã gửi vào email của bạn");
	}

	render() {
		return (
			<Input placeholder="Mã xác thực" value={this.props.value} onChange={this.onChange} addonAfter={<Button loading={this.state.isGetCode} onClick={this.onCodeGet}>Lấy mã</Button>} />
		);
	}
}