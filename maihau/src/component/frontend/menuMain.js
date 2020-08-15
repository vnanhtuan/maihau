import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as Const from "../../common/const";

import { MenuService, ContentURL } from "../content/contentService";
import { Format } from "../../common/format";

export default class MenuMain extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categoryList: [],
		};
	}

	componentDidMount() {
		MenuService.categoryGetList({ parentId: Const.pageCategory, idList: Const.pageMainMenu }).then((res) => {
			if (!res.success) return;

			this.setState({ categoryList: res.itemList ? res.itemList : [] });
		});
	}

	render() {
		const { categoryList } = this.state;

		return (
			<div className="header-mainbar-menu">
				<Link to="/">
					<i className="fal fa-home-lg-alt"></i>
					<span>Trang chủ</span>
				</Link>
				{categoryList.map((item) => (
					<Link key={item.id} to={ContentURL.contentListURL({}, { categoryName: item.name, categoryId: item.id })}>
						<div dangerouslySetInnerHTML={{ __html: Format.brToTag(item.icon) }}></div>
						<span>{item.name}</span>
					</Link>
				))}
				<Link to="/lien-he">
					<i className="fal fa-question-circle"></i>
					<span>Liên hệ</span>
				</Link>
			</div>
		);
	}
}
