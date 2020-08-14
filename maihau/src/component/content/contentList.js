import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Select, Pagination, Breadcrumb } from "antd";

import * as Const from "../../common/const";
import { ContentListService, ContentURL } from "./contentService";
import { FileService } from "../file/fileService";

import { Popup } from "../../common/component";

export default class ContentList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categoryList: [],
			categoryName: null,
			itemList: null,
			pageIndex: this.props.match.params.pageIndex,
			totalPages: 0,
			totalItems: 0,
			pageSize: 0,
			categoryId: this.props.match.params.categoryId,
			orderBy: this.props.match.params.orderBy ? this.props.match.params.orderBy : "latest",
		};
	}

	getQuery = () => ({
		categoryName: this.state.categoryName,
		categoryId: this.state.categoryId,
		pageIndex: this.state.pageIndex,
		orderBy: this.state.orderBy,
	});

	componentDidMount() {
		this.getList();
		this.categoryGetList();
	}

	shouldComponentUpdate(nextProps) {
		let hasChange = false;
		if (this.props.match.params.categoryId != nextProps.match.params.categoryId) {
			this.state.categoryId = nextProps.match.params.categoryId;
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

		if (hasChange) this.getList();

		return true;
	}

	categoryGetList = () => {
		ContentListService.categoryGetList({ parentId: Const.pageCategory }).then((res) => {
			if (!res.success) return;

			this.setState({ categoryList: res.itemList });
		});
	};

	getList = () => {
		Popup.spin.show();
		ContentListService.getList({
			categoryId: this.state.categoryId,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then((res) => {
			if (res.totalItems === 1) this.props.history.push(ContentURL.contentDetailURL({}, { name: res.itemList[0].name, id: res.itemList[0].id }));
			else
				this.setState({
					categoryName: res.categoryName,
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
					pageSize: res.pageSize,
				});
			Popup.spin.hide();
		});
	};

	render() {
		const { categoryName, categoryId, totalItems, itemList, categoryList } = this.state;

		if (!itemList) return null;

		return (
			<React.Fragment>
				<section className="contentList-page">
					<div className="content-category-title">
						{categoryList
							.filter((item) => item.id == categoryId)
							.map((category) =>
								category.imageId > 0 ? (
									<img src={FileService.imageURL(category.imageId, 2048)} alt={category.name} key={category.id} />
								) : (
									<img src="/image/content-category-default.jpg" key={category.id} />
								)
							)}
						<div className="content-title">
							<div className="title">{categoryName}</div>
						</div>
					</div>
					<div className="container">
						<Breadcrumb className="page-nav">
							<Breadcrumb.Item>
								<a href="/">Trang chủ</a>
							</Breadcrumb.Item>
							<Breadcrumb.Item>
								<Link to={ContentURL.contentListURL({}, { categoryName: categoryName, categoryId: categoryId })}>{categoryName}</Link>
							</Breadcrumb.Item>
						</Breadcrumb>
						<Row>
							<Col xs={0} lg={6}>
								<div className="categorySider">
									<div className="list">
										{categoryList.map((item) => (
											<Link
												key={item.id}
												className={item.id == this.state.categoryId ? "active" : ""}
												to={ContentURL.contentListURL({}, { categoryName: item.name, categoryId: item.id })}
											>
												{item.name}
											</Link>
										))}
									</div>
								</div>
							</Col>
							<Col xs={24} lg={18}>
								<Row className="contentTool">
									<Col flex="auto">
										<div className="page-title">
											<h1>{categoryName}</h1>
										</div>
									</Col>
									{totalItems > 0 && (
										<Col style={{ marginLeft: "auto" }}>
											<Pagination
												current={this.state.pageIndex}
												total={this.state.totalItems}
												pageSize={this.state.pageSize}
												onChange={(value) => this.props.history.push(ContentURL.contentListURL(this.getQuery(), { pageIndex: value }))}
											/>
										</Col>
									)}
								</Row>
								<Row className="contentList">
									{itemList.map((item) => (
										<Col xs={24} key={item.id} className="item">
											<Row>
												<Col xs={24} md={8} lg={6}>
													<Link className="image" to={ContentURL.contentDetailURL({}, { name: item.name, id: item.id })}>
														<img src={FileService.imageURL(item.imageId, 384)} alt={item.name} />
													</Link>
												</Col>
												<Col xs={24} md={16} lg={18}>
													<div className="info">
														<h2 className="name">
															<Link to={ContentURL.contentDetailURL({}, { name: item.name, id: item.id })}>{item.name}</Link>
														</h2>
														<div className="summary">{item.summary}</div>
													</div>
												</Col>
											</Row>
										</Col>
									))}
								</Row>
								{totalItems > 0 && (
									<Row className="contentTool">
										<Col style={{ marginLeft: "auto" }}>
											<Pagination
												current={this.state.pageIndex}
												total={this.state.totalItems}
												pageSize={this.state.pageSize}
												onChange={(value) => this.props.history.push(ContentURL.contentListURL(this.getQuery(), { pageIndex: value }))}
											/>
										</Col>
									</Row>
								)}
							</Col>
						</Row>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
