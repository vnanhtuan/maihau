import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";

import * as Const from "../../common/const";
import { MenuService, HomeContentService, ContentURL } from "../content/contentService";

export default class Footer extends Component {
	state = {
		categoryList: [],
		contactInfo: {},
	};

	componentDidMount() {
		MenuService.categoryGetList({ parentId: Const.pageCategory, idList: Const.pageMainMenu }).then((res) => {
			if (!res.success) return;

			this.setState({ categoryList: res.itemList ? res.itemList : [] });
		});

		HomeContentService.getList({ idList: [2], hasDescription: true }).then((res) => {
			if (!res.success) return;

			this.setState({
				contactInfo: res.itemList[0],
			});
		});
	}

	render() {
		const { categoryList, contactInfo } = this.state;

		return (
			<footer className="footer">
				<div className="container">
					<Row>
						<Col xs={24} sm={24} md={{ span: 12, offset: 2 }} lg={{ span: 7, offset: 0 }}>
							<div className="footer-menu">
								<img src="/image/logo.png" className="footer-logo" />
								{contactInfo && (
									<div dangerouslySetInnerHTML={{ __html: contactInfo.description }} />
								)}
							</div>
						</Col>
						<Col xs={24} sm={24} md={{ span: 10, offset: 0 }} lg={{ span: 6, offset: 0 }}>
							<div className="footer-menu">
								<div className="title">MAI HẬU</div>
								{ categoryList && 
									categoryList.map((item) => (
									<Link key={item.id} to={ContentURL.contentListURL({}, { categoryName: item.name, categoryId: item.id })}>
										<span>{item.name}</span>
									</Link>
									))
								}
								<Link to="/lien-he">
										<span>Liên hệ</span>
								</Link>
							</div>
						</Col>
						<Col xs={12} sm={12} md={{ span: 12, offset: 2 }} lg={{ span: 6, offset: 0 }}>
							<div className="footer-menu">
								<div className="title">Luôn kết nối</div>
								<a href="">
									<i className="fab fa-facebook-f"></i>
									<span>Facebook</span>
								</a>
								<a href="">
									<i className="fab fa-youtube"></i>
									<span>Youtube</span>
								</a>
								<a href="">
									<i className="fab fa-telegram-plane"></i>
									<span>Telegram</span>
								</a>
								<a href="">
									<i className="fab fa-twitter"></i>
									<span>twitter</span>
								</a>
							</div>
						</Col>
						<Col xs={12} sm={12} md={{ span: 10, offset: 0 }} lg={{ span: 5, offset: 0 }}>
							<div className="footer-menu">
								<div className="title">Thanh toán</div>
								<a href="">
									<i className="fab fa-cc-mastercard"></i>
									<span>Master Card</span>
								</a>
								<a href="">
									<i className="fab fa-cc-visa"></i>
									<span>Visa Card</span>
								</a>
								<a href="">
									<i className="fab fa-cc-paypal"></i>
									<span>Paypal</span>
								</a>
								<a href="">
									<i className="fas fa-credit-card-front"></i>
									<span>Thẻ ATM</span>
								</a>
							</div>
						</Col>
					</Row>
				</div>
				<div className="copyright">Copyright by helpbank.vn. All rights reserved.</div>
			</footer>
		);
	}
}
