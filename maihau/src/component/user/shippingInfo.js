import React, { Component } from "react";
import { Row, Col, Input, Button, Select } from "antd";

import { ProfileService, LocationService } from "./userService";

import { Popup, Msg } from "../../common/component";
import VerificationCode from "./verificationCode";

export default class ShippingInfo extends Component {
	state = {
		stateProvinceList: [],
		districtCityList: [],
		wardList: [],
	};

	componentDidMount() {
		Popup.spin.show();
		ProfileService.shippingInfoInit().then((res) => {
			if (res) {
				let newState = {
					fullName: res.fullName,
					phoneNumber: res.phoneNumber,
					address: res.address,
					stateProvinceList: res.stateProvinceList,
					districtCityList: res.districtCityList,
				};
				if (res.stateProvinceId) newState.stateProvinceId = res.stateProvinceId;
				if (res.districtCityId) newState.districtCityId = res.districtCityId;
				if (res.wardId) newState.wardId = res.wardId;

				this.setState(newState, () => {
					if (res.districtCityId) this.wardGetList();
				});
			}
			Popup.spin.hide();
		});
	}

	wardGetList = async () => {
		Popup.spin.show();
		LocationService.wardGetList({ districtCityId: this.state.districtCityId }).then((res) => {
			if (res) {
				this.setState({
					wardList: res,
				});
			}
			Popup.spin.hide();
		});
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ProfileService.shippingInfoSubmit({
			fullName: this.state.fullName,
			phoneNumber: this.state.phoneNumber,
			stateProvinceId: this.state.stateProvinceId,
			districtCityId: this.state.districtCityId,
			wardId: this.state.wardId,
			address: this.state.address,
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
			<div className="shipping-page">
				<h1>Shipping info</h1>
				<input type="text" className="input-hidden" />
				<input type="password" className="input-hidden" />
				<div className="box">
					<div className="form">
						<Row>
							<Col>
								<Input
									placeholder="Full name"
									value={this.state.fullName}
									prefix={<i className="far fa-user"></i>}
									onChange={(event) => {
										this.setState({ fullName: event.target.value });
									}}
								/>
								<Msg target="fullName" msgs={this.state.msgs} className="errorMsg" />
							</Col>
							<Col>
								<Input
									placeholder="Phone number"
									value={this.state.phoneNumber}
									prefix={<i className="far fa-phone-alt"></i>}
									onChange={(event) => {
										this.setState({ phoneNumber: event.target.value });
									}}
								/>
								<Msg target="phoneNumber" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<Select
									style={{ width: "100%" }}
									placeholder="State / Province"
									onChange={(value) => this.setState({ stateProvinceId: value, districtCityId: null, wardId: null, wardList: [] })}
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
							<Col>
								<Select
									style={{ width: "100%" }}
									placeholder="District / City"
									onChange={(value) => this.setState({ districtCityId: value, wardId: null, wardList: [] }, this.wardGetList)}
									value={this.state.districtCityId}
									allowClear
									showSearch
									optionFilterProp="children"
								>
									{this.state.districtCityList.map(
										(item) =>
											item.stateProvinceId == this.state.stateProvinceId && (
												<Select.Option key={item.id} value={item.id}>
													{" "}
													{item.name}
												</Select.Option>
											)
									)}
								</Select>
							</Col>
							<Col xs={24} sm={8}>
								<Select
									style={{ width: "100%" }}
									placeholder="Ward"
									onChange={(value) => this.setState({ wardId: value })}
									value={this.state.wardId}
									allowClear
									showSearch
									optionFilterProp="children"
								>
									{this.state.wardList.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.name}
										</Select.Option>
									))}
								</Select>
							</Col>
							<Col xs={24} style={{ marginTop: "-1rem" }}>
								<Msg target="location" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<Input
									placeholder="Address"
									value={this.state.address}
									prefix={<i className="far fa-map-marker-alt"></i>}
									onChange={(event) => {
										this.setState({ address: event.target.value });
									}}
								/>
								<Msg target="address" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
						<Row>
							<Col>
								<VerificationCode
									value={this.state.verificationCode}
									category="shipping"
									onChange={(value) => this.setState({ verificationCode: value })}
								/>
								<Msg target="verificationCode" msgs={this.state.msgs} className="errorMsg" />
							</Col>
						</Row>
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
