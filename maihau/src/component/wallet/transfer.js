import React, { Component } from "react";
import { Row, Col, Input, Button, Select } from 'antd';

import { Popup, Msg, InputNumber, NumberFormat } from '../../common/component';
import VerificationCode from '../user/verificationCode';
import { RepositoryService } from "../user/userService";

import { TransferService } from "./walletService";

export default class Transfer extends Component {
	defaultState = () => ({
		value: null,
		userName: null,
		userInfo: null,
		note: null,
		verificationCode: "",
		msgs: [],
	})

	state = this.defaultState();

	componentDidMount() {
		Popup.spin.show();
		TransferService.init().then(res => {
			if (res) { 
				this.setState({ walletList: res.walletList, wallet: res.walletList[0].id });
			}
			Popup.spin.hide();
		});
	}

	onSubmit = async () => {
		Popup.spin.show();
		const res = await TransferService.submit({
			wallet: this.state.wallet,
			value: this.state.value,
			userName: this.state.userName,
			note: this.state.note,
			verificationCode: this.state.verificationCode,
		});
		Popup.spin.hide();
		if (res.success) {
			this.setState(this.defaultState());
			Popup.info({ autoClose: true });
		} else
			this.setState({ msgs: res.msgs });
	}

	onUserCheck = userName => {
		this.setState({ userName: userName, isUserCheck: true });

		clearTimeout(this.userCheckHandle);
		this.userCheckHandle = setTimeout(() => this.userCheck(), 800);
	}

	userCheck = () => {
		RepositoryService.userCheck({ userName: this.state.userName, notCurrent: true }).then(res => {
			var msgs = this.state.msgs;
			var userInfo = null;
			if (res.success) {
				msgs = msgs.filter(item => item.target !== "userCheck");
				userInfo = res.data;
			}
			else
				if (msgs.indexOf(item => item.target === "userCheck") < 0)
					msgs.push(res.msgs[0]);

			this.setState({ isUserCheck: false, msgs, userInfo });
		});
	}

	render() {
		return (
			<div className="transfer-page">
				<h1>Transfer</h1>
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				<div className="box">
					<div className="form">
						<Row>
							<Col>
								<Select placeholder="Transfer wallet" className="wallet-list-select" dropdownClassName="wallet-list-select" style={{ width: "100%" }}
									value={this.state.wallet}
									onChange={value => this.setState({ wallet: value })}
								>
									{this.state.walletList && this.state.walletList.map(item => 
										<Select.Option className="wallet" key={item.id} value={item.id}>{item.name} Wallet<span><NumberFormat value={item.value} /></span></Select.Option>
									)}
								</Select>
								<Msg target="wallet" msgs={this.state.msgs} className="errorMsg" />
							</Col>
							<Col>
								<InputNumber placeholder="Transfer value" value={this.state.value}
									onChange={result => this.setState({ value: result.floatValue })}
								/>
								<Msg target="value" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<Input.Search placeholder="To member" value={this.state.userName}
									prefix={<i className="fal fa-user-tag"></i>}
									onChange={({ target: { value } }) => this.onUserCheck(value)}
									loading={this.state.isUserCheck}
								/>
								{this.state.userInfo &&
									<div className="successMsg">Member "{this.state.userInfo.userName}" is valid</div>
								}
								<Msg target="userCheck" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<Input.TextArea placeholder="Note" value={this.state.note}
									onChange={({ target: { value } }) => this.setState({ note: value })}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<VerificationCode value={this.state.verificationCode} category="transfer" onChange={value => this.setState({ verificationCode: value })} />
								<Msg target="verificationCode" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<Button type="primary" onClick={this.onSubmit}>Submit</Button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}