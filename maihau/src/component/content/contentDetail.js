import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Breadcrumb } from "antd";

import * as Const from "../../common/const";
import { ContentListService, ContentDetailService, ContentURL } from "./contentService";
import { FileService } from "../file/fileService";

import { Popup } from "../../common/component";

export default class ContentDetail extends Component {
	constructor(props) {
		super(props);

		let id = parseInt(this.props.match.params.id);
		if (isNaN(id)) id = 0;

		this.state = {
			categoryList: [],
			id,
			item: {},
			itemList: [],
		};
	}

	componentDidMount() {
		this.getDetail();
		this.categoryGetList();
	}

	getDetail = () => {
		Popup.spin.show();
		ContentDetailService.init({ id: this.state.id }).then((res) => {
			if (!res.success) return;

			this.setState({ item: res.item, itemList: res.itemList ? res.itemList : [] });

			Popup.spin.hide();
		});
	};

	shouldComponentUpdate(nextProps) {
		if (this.props.match.params.id !== nextProps.match.params.id) {
			this.state.id = nextProps.match.params.id;
			this.getDetail();
		}

		return true;
	}

	categoryGetList = () => {
		ContentListService.categoryGetList({ parentId: Const.pageCategory }).then((res) => {
			if (!res.success) return;

			this.setState({ categoryList: res.itemList ? res.itemList : [] });
		});
	};

	render() {
		const item = this.state.item ? this.state.item : {};
		const { categoryList, itemList } = this.state;

		return (
			<div className="content-detail-page">
				<div className="content-category-title">
					{categoryList
						.filter((category) => category.id == item.categoryId)
						.map((category) =>
							category.imageId > 0 ? (
								<img src={FileService.imageURL(category.imageId, 2048)} alt={category.name} key={category.id} />
							) : (
								<img src="/image/content-category-default.jpg" key={category.id} />
							)
						)}
					<div className="content-title">
						<div className="title">{item.categoryName}</div>
					</div>
				</div>

				<div className="container">
					<Breadcrumb className="page-nav">
						<Breadcrumb.Item>
							<a href="/">Trang chủ</a>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link to={ContentURL.contentListURL({}, { categoryName: item.categoryName, categoryId: item.categoryId })}>{item.categoryName}</Link>
						</Breadcrumb.Item>
					</Breadcrumb>
					<Row>
						<Col xs={0} lg={6}>
							<div className="categorySider">
								<div className="list">
									{categoryList.map((category) => (
										<Link
											key={category.id}
											className={category.id == item.categoryId ? "active" : ""}
											to={ContentURL.contentListURL({}, { categoryName: category.name, categoryId: category.id })}
										>
											{category.name}
										</Link>
									))}
								</div>
							</div>
						</Col>
						<Col xs={24} lg={18}>
							<div className="box">
								<h1 className="name">{item.name}</h1>
								<h2 className="category">{item.categoryName}</h2>
								<div className="description" dangerouslySetInnerHTML={{ __html: item.description }}></div>
							</div>
							{itemList.length > 0 && (
								<>
									<h1 className="name">Bài viết mới nhất</h1>
									<div className="contentList">
										{itemList.map((item) => (
											<Col lg={24} key={item.id} className="item">
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
									</div>
								</>
							)}
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
