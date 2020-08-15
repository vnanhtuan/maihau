import React, { Component } from "react";
import { Row, Col, Input, Button, Spin, Breadcrumb, Tabs } from "antd";
import { Link } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";

import { Popup } from "../../common/component";
import ScrollBox from "../../common/scrollBox";
import { Format } from "../../common/format";

import { ProductDetailService, CartService, ProductURL } from "./productService";
import { FileService } from "../file/fileService";

export default class ProductDetail extends Component {
	constructor(props) {
		super(props);

		let id = parseInt(this.props.match.params.id);
		if (isNaN(id)) id = 0;

		this.state = {
			id,
			item: {},
			qty: 1,
			imageMagnify: {
				smallImage: {
					isFluidWidth: true,
					src: FileService.imageURL(0, 1024, true),
					onLoad: () => this.setState({ isImageMagnify: false }),
				},
				largeImage: {
					src: FileService.imageURL(0, 2048, true),
					width: 1024,
					height: 1024,
				},
			},
			isImageMagnify: true,
		};
	}

	componentDidMount() {
		Popup.spin.show();
		ProductDetailService.init({ id: this.state.id }).then((res) => {
			if (res.item) {
				let item = res.item;
				let mainImageId = 0;
				if (item.imageList && item.imageList.length > 0) mainImageId = item.imageList[0].id;

				this.setState({
					item,
					imageMagnify: this.setImageMagnify(mainImageId),
				});
			}
			Popup.spin.hide();
		});

		this.categoryGetList();
	}

	categoryGetList = () => {
		ProductDetailService.categoryGetList({
			productId: this.state.id,
		}).then((res) => {
			this.setState({
				navList: res.parentList,
			});
		});
	};

	setImageMagnify = (id) => {
		let { imageMagnify } = this.state;
		imageMagnify.smallImage.src = FileService.imageURL(id, 1024, true);
		imageMagnify.largeImage.src = FileService.imageURL(id, 2048, true);

		return imageMagnify;
	};

	onImageThumbChange = (item) => {
		this.setState({ imageMagnify: this.setImageMagnify(item.id), isImageMagnify: true });
	};

	onAddToCart = async () => {
		let qty = parseInt(this.state.qty);
		if (isNaN(qty) || qty < 1) qty = 1;
		const addCartRes = await CartService.addCart({ id: this.state.id, qty: qty });

		if (addCartRes.hasMemberTypeError) {
			Popup.error({ title: "Không thể thêm sản phẩm, vì giỏ hàng đang có sản phẩm kèm Gói dịch vụ" });
		} else if (addCartRes.onlyBuyOne) {
			Popup.error({ title: "Mỗi đơn hàng chỉ mua được một sản phẩm" });
		} else if (addCartRes.enough === false) {
			Popup.error({ title: "Quá số lượng hiện có là: " + addCartRes.inStock });
		} else Popup.info({ title: "Sản phẩm đã được thêm vào giỏ hàng", autoClose: true });

		return addCartRes.enough && addCartRes.onlyBuyOne === false;
	};

	onBuyNow = async () => {
		CartService.clearCart();
		const isOK = await this.onAddToCart();
		if (isOK) this.props.history.push("/cart");
	};

	render() {
		const item = this.state.item ? this.state.item : {};
		let itemThumbList = [];
		if (item.imageList && item.imageList.length > 0) itemThumbList = item.imageList;

		return (
			<React.Fragment>
				<div className="producDetail-page">
					<div className="container">
						<Breadcrumb className="page-nav">
							<Breadcrumb.Item>
								<a href="/">Trang chủ</a>
							</Breadcrumb.Item>
							{this.state.navList &&
								this.state.navList.map((item) => (
									<Breadcrumb.Item key={item.id}>
										<Link to={ProductURL.productListURL({}, { categoryId: item.id, categoryName: item.name })}>{item.name}</Link>
									</Breadcrumb.Item>
								))}
						</Breadcrumb>
						<Row>
							<Col xs={24} md={11}>
								<div className="image-box">
									<Spin spinning={this.state.isImageMagnify}>
										<div className="main-image">
											<ReactImageMagnify {...this.state.imageMagnify} />
										</div>
									</Spin>
									<ScrollBox className="thumb-list" scrollbar={true}>
										<div className="thumb-list-wrap">
											{itemThumbList.map((item) => (
												<div className="thumb" key={item.id}>
													<div
														className="image image-1-1"
														style={{ backgroundImage: "url(" + FileService.imageURL(item.id, 128) + ")" }}
														onClick={() => this.onImageThumbChange(item)}
													></div>
												</div>
											))}
										</div>
									</ScrollBox>
								</div>
							</Col>
							<Col xs={24} md={13}>
								<div className="info-box">
									<h1 className="page-title">{item.name}</h1>
									<ul className="summary" dangerouslySetInnerHTML={{ __html: Format.brToTag(item.summary, "li") }}></ul>
									{item.price && (
										<React.Fragment>
											<div className="price-box">
												<em>Giá: </em>
												<span className="price">{Format.number(item.price)}</span>
												{item.priceSource && <span className="price-source">${Format.number(item.priceSource)}</span>}
												{item.saleOffPercent && (
													<span className="saleoff">
														SALEOFF: <b>{item.saleOffPercent}%</b>
													</span>
												)}
											</div>
											{item.fundWallet && (
												<div className="fund">
													<em>Ví dịch vụ: </em>
													{Format.number(item.fundWallet)}
												</div>
											)}
											{item.bonusPoint && (
												<div className="fund">
													<em>Nhận: </em>
													{Format.number(item.bonusPoint)} / {item.numberOfReceive} tháng
												</div>
											)}
											{item.memberTypeNameBonus && (
												<div className="fund">
													<em>Gói dịch vụ HelpBank: </em>
													{item.memberTypeNameBonus}
												</div>
											)}
											{item.allowOrder && (
												<Row className="tool">
													{!item.memberTypeNameBonus && (
														<>
															<Col>
																<Input
																	addonBefore="SL"
																	className="qty"
																	value={this.state.qty}
																	onChange={({ target: { value } }) => this.setState({ qty: value })}
																/>
															</Col>
															<Col>
																<Button type="primary" ghost onClick={this.onAddToCart}>
																	<i className="far fa-cart-plus" />
																	Giỏ hàng
																</Button>
															</Col>
														</>
													)}
													<Col flex="auto">
														<Button type="primary" onClick={this.onBuyNow}>
															Mua ngay
														</Button>
													</Col>
												</Row>
											)}
										</React.Fragment>
									)}
								</div>
							</Col>
						</Row>
						<Row>
							<Col xs={24}>
								<Tabs defaultActiveKey="1" centered className="description-menu">
									<Tabs.TabPane tab="Thông tin sản phẩm" key="description">
										<div className="description" dangerouslySetInnerHTML={{ __html: item.description }}></div>
									</Tabs.TabPane>
									<Tabs.TabPane tab="Nhà cung cấp" key="2">
										Thông tin đang cập nhật
									</Tabs.TabPane>
								</Tabs>
							</Col>
						</Row>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
