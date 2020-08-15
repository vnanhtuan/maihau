import React, { Component } from "react";
import { Link } from "react-router-dom";
import Media from "react-media";
import { Row, Col, Modal, Button } from "antd";
import OwlCarousel from "react-owl-carousel2";
import * as Const from "../../common/const";
import getSlug from "speakingurl";

import { Format } from "../../common/format";

import CategoryHomeNav from "../product/categoryHomeNav";
import { ProductHomeService, ProductURL } from "../product/productService";
import { FileService } from "../file/fileService";

export default class Home extends Component {
	state = {
		isPopup: false,
		saleOffProductList: [],
		fundWalletProductList: [],
		originProductList: [],
		serviceHelpBankProductList: [],
		brandPopularList: [],
		categoryPopularList: [],
	};

	componentDidMount() {
		this.init();
	}

	init = () => {
		ProductHomeService.init().then((res) => {
			this.setState({
				saleOffProductList: res.saleOffProductList ? res.saleOffProductList : [],
				fundWalletProductList: res.fundWalletProductList ? res.fundWalletProductList : [],
				originProductList: res.originProductList ? res.originProductList : [],
				serviceHelpBankProductList: res.serviceHelpBankProductList ? res.serviceHelpBankProductList : [],
				categoryPopularList: res.categoryPopularList ? res.categoryPopularList : [],
				brandPopularList:  res.brandPopularList ? res.brandPopularList : [],
			});
		});
	};

	onClosePopup = () => {
		this.setState({ isPopup: false });
	};

	render() {
		const { saleOffProductList, categoryPopularList, brandPopularList, fundWalletProductList, originProductList, serviceHelpBankProductList } = this.state;
		const bannerOptions = {
			items: 1,
			rewind: true,
			autoplay: true,
			smartSpeed: 800,
			autoplayHoverPause: true,
		};

		const partnerOptions = {
			margin: 20,
			autoWidth: true,
			dots: false,
			nav: true,
			navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			rewind: true,
			smartSpeed: 500,
		};

		return (
			<React.Fragment>
				<section className="home-banner-main">
					<div className="container">
						<div className="home-banner-wrap">
							<Media query={Const.media.largeQuery} render={() => <CategoryHomeNav />} />
							<div className="banner">
								<OwlCarousel options={bannerOptions}>
									<div className="item" style={{ backgroundImage: "url(/image/banner/1.jpg)" }}></div>
									<div className="item" style={{ backgroundImage: "url(/image/banner/2.jpg)" }}></div>
									<div className="item" style={{ backgroundImage: "url(/image/banner/3.jpg)" }}></div>
								</OwlCarousel>
							</div>
						</div>
					</div>
				</section>

				{saleOffProductList.length > 0 && (
					<section className="product-saleoff">
						<div className="container">
							<div className="title">Khuyến mãi đặc biệt</div>
							<Row gutter={[10, 10]}>
								<Col xs={24} sm={24} md={24} lg={8}>
									<Link
										to={ProductURL.productDetailURL({}, { id: saleOffProductList[0].id, name: saleOffProductList[0].name })}
										className="product top1">
										<span className="image">
											<img src={FileService.imageURL(saleOffProductList[0].imageId, 384)} alt={saleOffProductList[0].name} />
										</span>
										<span className="name">{saleOffProductList[0].name}</span>
										<span className="saleoff">
											<span className="price-origin">{Format.number(saleOffProductList[0].priceSource)}</span>
											<span className="saleoff-percent">-{saleOffProductList[0].saleOffPercent}</span>
										</span>
										<span className="price">{Format.number(saleOffProductList[0].price)}</span>
									</Link>
								</Col>
								<Col xs={24} sm={24} md={24} lg={16}>
									<Row gutter={[10, 10]}>
										{saleOffProductList.slice(1).map((item) => (
											<Col xs={12} sm={8} md={8} lg={8} xl={6} key={item.id}>
												<Link to={ProductURL.productDetailURL({}, { id: item.id, name: item.name })} className="product">
													<span className="image">
														<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
													</span>
													<span className="name">{item.name}</span>
													<span className="saleoff">
														<span className="price-origin">{Format.number(item.priceSource)}</span>
														<span className="saleoff-percent">-{item.saleOffPercent}</span>
													</span>
													<span className="price">{Format.number(item.price)}</span>
												</Link>
											</Col>
										))}
									</Row>
								</Col>
							</Row>
						</div>
					</section>
				)}

				<section className="category-brand-popular">
					<div className="container">
						<Row gutter={40}>
							<Col xs={24} lg={12}>
								<div className="category-popular">
									<div className="title">Danh mục nổi bật</div>
									<Row gutter={[10, 10]}>
										{categoryPopularList.map((item) => (
											<Col xs={12} sm={8} md={6} lg={8} xl={6} key={item.id}>
												<Link to={ProductURL.productListURL({}, { categoryId: item.id, categoryName: item.name })} className="item">
													{item.imageId > 0 ? (
														<span className="image">
															<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
														</span>
														) : (
															<span className="icon" dangerouslySetInnerHTML={{ __html: Format.brToTag(item.icon) }}>
															</span>
														)
													}
													<span className="name">{item.name}</span>
												</Link>
											</Col>
										))}
									</Row>
								</div>
							</Col>
							<Col xs={24} lg={12}>
								<div className="brand-popular">
									<div className="title">Thương hiệu nổi bật</div>
									<Row gutter={[10, 10]}>
										{brandPopularList.map((item) => (
											<Col xs={12} sm={8} md={6} lg={8} xl={6} key={item.id}>
												<Link to="/" className="item">
													<span className="image">
														<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
													</span>
												</Link>
											</Col>
										))}
									</Row>
								</div>
							</Col>
						</Row>
					</div>
				</section>

				{fundWalletProductList.length > 0 && (
					<section className="product-fund">
						<div className="container">
							<div className="title">Sử dụng Ví Dịch vụ</div>
							<Row gutter={[10, 10]}>
								{fundWalletProductList.map((item) => (
									<Col xs={12} sm={12} md={8} lg={6} xl={4} key={item.id}>
										<Link to={ProductURL.productDetailURL({}, { id: item.id, name: item.name })} className="product" key={item.id}>
											<span className="image">
												<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
											</span>
											<span className="name">{item.name}</span>
											{item.priceSource && (
												<span className="saleoff">
													<span className="price-origin">{Format.number(item.priceSource)}</span>
													<span className="saleoff-percent">{item.saleOffPercent}</span>
												</span>
											)}
											<span className="price">{Format.number(item.price)}</span>
											{item.fundWallet && (
												<span className="fund">
													<span className="fund-wrap">
														<em>Ví DV:</em>
														<span>{Format.number(item.fundWallet)}</span>
													</span>
												</span>
											)}
										</Link>
									</Col>
								))}
							</Row>
						</div>
					</section>
				)}

				{originProductList.length > 0 && (
					<section className="product-origin">
						<div className="container">
							<div className="title">Sản phẩm giá gốc</div>
							<Row gutter={[10, 10]}>
								{originProductList.map((item) => (
									<Col xs={12} sm={12} md={8} lg={6} xl={4} key={item.id}>
										<Link to={ProductURL.productDetailURL({}, { id: item.id, name: item.name })} className="product" key={item.id}>
											
											<span className="image">
												<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
											</span>
											<span className="name">{item.name}</span>
											{item.priceSource && (
												<span className="saleoff">
													<span className="price-origin">{Format.number(item.priceSource)}</span>
													<span className="saleoff-percent">{item.saleOffPercent}</span>
												</span>
											)}
											<span className="price">{Format.number(item.price)}</span>
											{item.bonusPoint && (
												<span className="receive">
													<span className="receive-wrap">
														<em>Nhận:</em>
														<span>
															{Format.number(item.bonusPoint)} /{Format.number(item.numberOfReceive)} tháng
														</span>
													</span>
												</span>
											)}
										</Link>
									</Col>
								))}
							</Row>
						</div>
					</section>
				)}

				{serviceHelpBankProductList.length > 0 && (
					<section className="product-service">
						<div className="container">
							<div className="title">Gói dịch vụ HelpBank</div>
							<Row gutter={[10, 10]}>
								{serviceHelpBankProductList.map((item) => (
									<Col xs={12} sm={12} md={8} lg={6} xl={4} key={item.id}>
										<Link to={ProductURL.productDetailURL({}, { id: item.id, name: item.name })} className="product" key={item.id}>
											<span className="image">
												<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
											</span>
											<span className="name">{item.name}</span>
											{item.priceSource && (
												<span className="saleoff">
													<span className="price-origin">{Format.number(item.priceSource)}</span>
													<span className="saleoff-percent">{item.saleOffPercent}</span>
												</span>
											)}
											<span className="price">{Format.number(item.price)}</span>
											{item.memberTypeNameBonus && (
												<span className="memberType">
													<span className="memberType-wrap">
														<em>Gói dịch vụ:</em>
														<span>{item.memberTypeNameBonus}</span>
													</span>
												</span>
											)}
										</Link>
									</Col>
								))}
							</Row>
						</div>
					</section>
				)}

				<section className="partner">
					<div className="container">
						<OwlCarousel options={partnerOptions}>
							<div className="item">
								<img src="/image/partner/bds4.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/conggiaoduc.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/congnhadat.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/congnhanai.png" alt="" />
							</div>
							<div className="item helpbank">
								<img src="/image/partner/helpbank.png" alt="" />
							</div>
							<div className="item helppay">
								<img src="/image/partner/helppay.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/otochinhhang.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/thegioiluutru.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/topdoanhnhan.png" alt="" />
							</div>
							<div className="item">
								<img src="/image/partner/topgroup.png" alt="" />
							</div>
						</OwlCarousel>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
