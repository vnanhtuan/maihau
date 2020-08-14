import React, { Component } from "react";
import { Link } from 'react-router-dom';
import getSlug from "speakingurl";

import * as TreeHelper from "../../common/tree";

import { ProductHomeService, ProductURL } from "./productService";

export default class CategoryHomeNav extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categoryTree: [],
		};
	}

	componentDidMount() {
		ProductHomeService.categoryTree().then((res) => {
			if (!res.success) return;

			this.setState({ categoryTree: TreeHelper.parseTree(res.itemList) });
		});
	}

	render() {
		const categoryTree = this.state.categoryTree ? this.state.categoryTree : [];
		return (
			<nav className="category-home-nav">
				<ul>
					{categoryTree.map((item) => (
						<li key={item.key}>
							<Link to={ProductURL.productListURL({}, { categoryId: item.value, categoryName: item.title })}>{item.title}</Link>
							{item.children.length > 0 && (
								<div className="category-sub">
									<div className="category-sub-wrap">
										{item.children.map((item_1) => (
											<ul key={item_1.key}>
												<li>
													<Link to={ProductURL.productListURL({}, { categoryId: item_1.value, categoryName: item_1.title })} className="title">
														{item_1.title}
													</Link>
												</li>
												{item_1.children.length > 0 &&
													item_1.children.map((item_2) => (
														<li key={item_2.key}>
															<Link to={ProductURL.productListURL({}, { categoryId: item_2.value, categoryName: item_2.title })}>
																{item_2.title}
															</Link>
														</li>
													))}
											</ul>
										))}
									</div>
								</div>
							)}
						</li>
					))}
				</ul>
			</nav>
		);
	}
}