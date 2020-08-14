import React, { Component } from "react";
import { Row, Col, Input, Button, Select } from "antd";

import { Popup, Msg } from "../../common/component";
import VerificationCode from '../user/verificationCode';

import { BankService } from "./userService";

export default class Bank extends Component {
	state = {
		value: null,
		msgs: [],
		itemList: [],
		bankId: null,
		bankBranch: null,
		bankAccountName: null,
		bankAccountNumber: null,
		verificationCode: "",
	};

	componentDidMount() {
		Popup.spin.show();
		BankService.init().then((res) => {
			if (res) {
				this.setState({ 
					bankId: res.bankId, 
					bankBranch: res.bankBranch, 
					bankAccountName: res.bankAccountName, 
					bankAccountNumber: res.bankAccountNumber, 
					itemList: res.itemList,
					hasVerificationCode: res.hasVerificationCode,
				});
			}
			Popup.spin.hide();
		});
	}

	onSubmit = async () => {
		Popup.spin.show();
		const res = await BankService.submit({
			bankId: parseInt(this.state.bankId),
			bankBranch: this.state.bankBranch,
			bankAccountName: this.state.bankAccountName,
			bankAccountNumber: this.state.bankAccountNumber,
			verificationCode: this.state.verificationCode,
		});
		Popup.spin.hide();

		const newState = {
			msgs: res.msgs,
		};

		if (res.success) {
			Popup.info({ autoClose: true });

			newState.verificationCode = "";
		}

		this.setState(newState);
	};

	render() {
		return (
			<div className="bank-page">
				<h1>Tài khoản ngân hàng</h1>
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				<div className="box">
					<div className="form">
						<Row>
							<Col>
								<label required>Chọn ngân hàng</label>
								<Select
									showSearch
									filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									value={this.state.bankId}
									onChange={(value) => this.setState({ bankId: value })}
								>
									{this.state.itemList &&
										this.state.itemList.map((item) => (
											<Select.Option key={item.id} value={item.id}>
												{item.name}
											</Select.Option>
										))}
								</Select>
								<Msg target="bankId" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
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
							<Col>
								<label required>Chủ tài khoản</label>
								<Input
									value={this.state.bankAccountName}
									onChange={(event) => {
										this.setState({
											bankAccountName: event.target.value,
										});
									}}
								/>
								<Msg target="bankAccountName" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
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
						<Row>
							<Col>
								<Button type="primary" onClick={this.onSubmit}>
									Submit
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}
