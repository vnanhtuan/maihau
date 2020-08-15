import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Input, Button } from "antd";
import ReCAPTCHA from "react-google-recaptcha";

import * as Const from "../../common/const";

import { Popup, Msg } from "../../common/component";
import { HomeContentService } from "../content/contentService";
import { ContactService } from "../user/userService";

export default class Contact extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fullName: null,
			email: null,
			title: null,
			content: null,
		};

		this.reCaptchaRef = React.createRef();
	}

	componentDidMount() {
		HomeContentService.getList({ idList: [42], hasDescription: true }).then((res) => {
			if (!res.success) return;

			this.setState({
				contactInfo: res.itemList[0],
			});
		});
	}

	onSubmit = async () => {
		const token = await this.reCaptchaRef.current.executeAsync();
		Popup.spin.show();

		let { title } = this.state;
		if (title) title += " - " + Const.domainName;

		const res = await ContactService.submit({
			fullName: this.state.fullName,
			email: this.state.email,
			title,
			content: this.state.content,
			recaptchaToken: token,
		});
		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
		} else {
			this.reCaptchaRef.current.reset();
		}
		this.setState({ msgs: res.msgs });
	};

	render() {
		return (
			<section className="contact-page">
				<div className="container">
					<div className="map">
						<iframe src="https://www.google.com/maps/d/embed?mid=1MwI6ECy0Qykcr6C0wGDuoA5hV7yOaq6i" width="100%" height="480"></iframe>
					</div>
					<Row gutter={64}>
						<Col xs={24} md={12}>
							{this.state.contactInfo && (
								<div className="contact-info">
									<h1>Thông tin liên hệ</h1>
									<div dangerouslySetInnerHTML={{ __html: this.state.contactInfo.description }} />
								</div>
							)}
						</Col>
						<Col xs={24} md={12}>
							<div className="contact-form">
								<h2>Gửi email</h2>
								<div className="form">
									<Row>
										<Col>
											<Input
												placeholder="Họ và tên"
												value={this.state.fullName}
												onChange={({ target: { value } }) => this.setState({ fullName: value })}
											/>
											<Msg target="fullName" msgs={this.state.msgs} className="errorMsg" />
										</Col>
										<Col>
											<Input placeholder="Email" value={this.state.email} onChange={({ target: { value } }) => this.setState({ email: value })} />
											<Msg target="email" msgs={this.state.msgs} className="errorMsg" />
										</Col>
									</Row>
									<Row>
										<Col>
											<Input placeholder="Tiêu đề" value={this.state.title} onChange={({ target: { value } }) => this.setState({ title: value })} />
											<Msg target="title" msgs={this.state.msgs} className="errorMsg" />
										</Col>
									</Row>
									<Row>
										<Col>
											<Input.TextArea
												placeholder="Nội dung"
												value={this.state.content}
												onChange={({ target: { value } }) => this.setState({ content: value })}
												autoSize={{ minRows: 3, maxRows: 10 }}
											/>
											<Msg target="content" msgs={this.state.msgs} className="errorMsg" />
										</Col>
									</Row>
									<Button type="primary" onClick={this.onSubmit}>
										<i className="far fa-envelope" /> Đồng ý gửi
									</Button>
									<Msg target="denyRobot" msgs={this.state.msgs} className="errorMsg" />
									<ReCAPTCHA
										ref={this.reCaptchaRef}
										sitekey="6LfOWroZAAAAAL9i-OycuMzL3cEuXua3Ubr3PQCT"
										size="invisible"
										/>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</section>
		);
	}
}
