import React, { Component } from "react";
import { Row, Col, Input, Button, Switch, InputNumber } from "antd";

import { Popup, Msg } from "../../common/component";
import Upload from "../file/upload";

import { ProductBrandPostServices } from "./productService";

export default class BrandPost extends Component {
	state = {
		isAdd: !this.props.itemId,
		id: this.props.itemId,
		name: null,
		isPopular: null,
		popularOrderNumber: null,
	};

	componentDidMount() {
		this.init();
	}

	init = () => {
		if (!this.state.id) return;

		ProductBrandPostServices.init({ id: this.state.id }).then((res) => {
			if (!res.success || !res.item) return;

			this.setState({
				name: res.item.name,
				fileList: res.item.fileList,
				isPopular: res.item.popularOrderNumber !== null,
				popularOrderNumber: res.item.popularOrderNumber
			});
		});
	};

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ProductBrandPostServices.submit({
			id: this.state.id,
			name: this.state.name,
			fileList: this.state.fileList,
			popularOrderNumber: this.state.popularOrderNumber
		});

		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.onOk();
		}

		this.setState({ msgs: res.msgs });
	};

	onSubmitAndContinues = async () => {
		let updateState = {};
		Popup.spin.show();
		const res = await ProductBrandPostServices.submit({
			id: this.state.id,
			name: this.state.name,
			fileList: this.state.fileList,
			popularOrderNumber: this.state.popularOrderNumber
		});

		updateState.msgs = res.msgs;
		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.onItemOkAndContinue();
			this.init();
			updateState.name = "";
		}

		this.setState(updateState);
	};

	onChangePopular = (value) => {
		if(value === false){
			this.setState({ popularOrderNumber: null });
		}
		this.setState({ isPopular: value });
	}

	render() {
		return (
			<div className="form">
				<h1>{this.state.isAdd ? "Thêm" : "Sửa"} thương hiệu</h1>
				<Row>
					<Col>
						<label>Hình ảnh</label>
						<Upload value={this.state.fileList} onChange={(value) => this.setState({ fileList: value })} />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Tên</label>
						<Input value={this.state.name} onChange={({ target: { value } }) => this.setState({ name: value })} autoFocus />
						<Msg target="name" msgs={this.state.msgs} className="errorMsg" />
					</Col>
				</Row>
				<Row>
					<Col>
						<label>Thương hiệu nổi bật</label>
						<Switch checked={this.state.isPopular} onChange={(value) => this.onChangePopular(value)}/>
					</Col>
					<Col>
						<label>Vị trí</label>
						<InputNumber min={1} value={this.state.popularOrderNumber} disabled={!this.state.isPopular}
							onChange={(value) => this.setState({ popularOrderNumber: value })} placeholder="Vị trí"/>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button type="primary" onClick={this.onSubmit}>
							Đồng ý
						</Button>
						<Button type="default" onClick={this.props.onCancel}>
							Đóng
						</Button>
						{this.state.isAdd ? (
							<Button type="primary" onClick={this.onSubmitAndContinues} style={{ float: "right" }}>
								Đồng ý & Tiếp tục
							</Button>
						) : null}
					</Col>
				</Row>
			</div>
		);
	}
}
