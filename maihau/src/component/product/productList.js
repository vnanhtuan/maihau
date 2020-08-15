import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Select, Pagination, Breadcrumb } from "antd";
import getSlug from "speakingurl";

import { Format } from "../../common/format";
import { Popup } from "../../common/component";

import { ProductListService, ProductURL } from "./productService";
import { FileService } from "../file/fileService";

export default class ProductList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			itemList: [],
			pageIndex: this.props.match.params.pageIndex,
			totalPages: 0,
			totalItems: 0,
			pageSize: 0,
			keyword: null,
			categoryId: this.props.match.params.categoryId,
			brandId: this.props.match.params.brandId,
			userId: this.props.match.params.userId,
			orderBy: this.props.match.params.orderBy ? this.props.match.params.orderBy : "latest",
			categorySider: null,
			brandList: [],
		};
	}

	getQuery = () => ({
		categoryId: this.state.categoryId,
		categoryName: this.state.categorySider.name,
		brandId: this.state.brandId,
		userId: this.state.userId,
		pageIndex: this.state.pageIndex,
		orderBy: this.state.orderBy,
	});

	componentDidMount() {
		ProductListService.init().then((res) => {});
		this.categoryGetList();
	}

	categoryGetList = () => {
		ProductListService.categoryGetList({
			categoryId: this.state.categoryId,
		}).then((res) => {
			this.setState(
				{
					categorySider: {
						name: res.categoryName,
						childrenList: res.childrenList,
					},
					navList: res.parentList,
					brandList: res.brandList,
				},
				this.getList
			);
		});
	};

	getList = () => {
		Popup.spin.show();
		ProductListService.getList({
			keyword: this.state.keyword,
			categoryId: this.state.categoryId != 0 ? this.state.categoryId : null,
			brandId: this.state.brandId != 0 ? this.state.brandId : null,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then((res) => {
			this.setState({
				categoryName: res.categoryName,
				itemList: res.itemList ? res.itemList : [],
				pageIndex: res.pageIndex,
				totalPages: res.totalPages,
				totalItems: res.totalItems,
				pageSize: res.pageSize,
			});
			Popup.spin.hide();
		});
	};

	onBrandClick = (brandId) => {
		this.setState({ brandId }, this.getList);
	};

	onBrandClear = (e) => {
		this.setState({ brandId: null }, this.getList);
	};

	shouldComponentUpdate(nextProps) {
		let hasChange = false;
		if (this.props.match.params.categoryId != nextProps.match.params.categoryId) {
			this.state.categoryId = nextProps.match.params.categoryId;
			hasChange = true;
		}

		if (this.props.match.params.brandId != nextProps.match.params.brandId) {
			this.state.brandId = nextProps.match.params.brandId;
			hasChange = true;
		}

		if (this.props.match.params.userId != nextProps.match.params.userId) {
			this.state.userId = nextProps.match.params.userId;
			hasChange = true;
		}

		if (this.props.match.params.pageIndex != nextProps.match.params.pageIndex) {
			this.state.pageIndex = nextProps.match.params.pageIndex;
			hasChange = true;
		}

		if (this.props.match.params.orderBy != nextProps.match.params.orderBy) {
			this.state.orderBy = nextProps.match.params.orderBy;
			hasChange = true;
		}

		if (hasChange) this.categoryGetList();

		return true;
	}

	render() {
		const itemList = this.state.itemList ? this.state.itemList : [];

		return (
			<React.Fragment>
				<section className="productList-page">
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
							<Col xs={0} md={6}>
								{this.state.categorySider && (
									<div className="categorySider">
										<div className="title">{this.state.categorySider.name}</div>
										<div className="list">
											{this.state.categorySider.childrenList.map((item) => (
												<Link
													key={item.id}
													className={item.id == this.state.categoryId ? "active" : ""}
													to={ProductURL.productListURL(this.getQuery(), {
														categoryId: item.id,
														categoryName: item.name,
														brandId: 0,
														brandName: "",
													})}
												>
													{item.name}
												</Link>
											))}
										</div>
									</div>
								)}
								{this.state.brandList.length > 0 && (
									<div className="brandSider">
										<div className="title">Thương hiệu</div>
										<div className="list">
											{this.state.brandList.map((item) => (
												<Link
													className={item.id == this.state.brandId ? "active" : ""}
													key={item.id}
													to={ProductURL.productListURL(this.getQuery(), { brandId: item.id, brandName: item.name })}
												>
													<span>{item.name}</span>
													<i className="fa fa-times" onClick={this.onBrandClear} />
												</Link>
											))}
										</div>
									</div>
								)}
							</Col>
							<Col xs={24} md={18}>
								{this.state.categorySider && (
									<>
										<Row className="productTool">
											<Col flex="auto">
												<div className="page-title">
													<h1>{this.state.categorySider.name}</h1>: <em>{this.state.totalItems} kết quả</em>
												</div>
											</Col>
											<Col>
												<Select
													style={{ width: "140px" }}
													value={this.state.orderBy}
													onChange={(value) => this.props.history.push(ProductURL.productListURL(this.getQuery(), { orderBy: value }))}
												>
													<Select.Option value="latest">Mới nhất</Select.Option>
													<Select.Option value="oldest">Cũ nhất</Select.Option>
												</Select>
											</Col>
											<Col style={{ marginLeft: "auto" }}>
												<Pagination
													current={this.state.pageIndex}
													total={this.state.totalItems}
													pageSize={this.state.pageSize}
													onChange={(value) => this.props.history.push(ProductURL.productListURL(this.getQuery(), { pageIndex: value }))}
												/>
											</Col>
										</Row>
										<Row className="productList">
											{itemList.map((item) => (
												<Col xs={12} sm={12} md={8} lg={6} key={item.id}>
													<Link to={ProductURL.productDetailURL({}, { id: item.id, name: item.name })} className="product" key={item.id}>
														<span className="image">
															<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
														</span>
														<span className="name">{item.name}</span>
														{item.priceSource && (
															<span className="saleoff">
																<span className="price-origin">{Format.number(item.priceSource)}</span>
																<span className="saleoff-percent">-{item.saleOffPercent}</span>
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
														{item.bonusPoint && (
															<span className="receive">
																<span className="receive-wrap">
																	<em>Nhận:</em>
																	<span>
																		{Format.number(item.bonusPoint)}/{item.numberOfReceive} tháng
																	</span>
																</span>
															</span>
														)}
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
										<Row className="productTool">
											<Col style={{ marginLeft: "auto" }}>
												<Pagination
													current={this.state.pageIndex}
													total={this.state.totalItems}
													pageSize={this.state.pageSize}
													onChange={(value) => this.props.history.push(ProductURL.productListURL(this.getQuery(), { pageIndex: value }))}
												/>
											</Col>
										</Row>
									</>
								)}
							</Col>
						</Row>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
