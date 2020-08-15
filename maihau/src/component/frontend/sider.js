import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Row, Col } from "antd";
import getSlug from "speakingurl";

import * as Const from "../../common/const";
import * as Service from "../../common/serviceHelper";
import * as TreeHelper from "../../common/tree";

import { siderService } from "../../common/siderBase";

import { CurrentUserService } from "../user/currentUserService";
import { LoginService } from "../user/userService";
import { ProductHomeService, ProductURL } from "../product/productService";
import { MenuService, ContentURL } from "../content/contentService";

export default class Sider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userCurrent: CurrentUserService.getUser(),
			categoryTree: [],
			categoryList: [],
		};
	}

	componentDidMount() {
		this.userCurrentSubscription = CurrentUserService.getObservable().subscribe(
			(user) => {
				this.setState({ userCurrent: user });
			}
		);

		ProductHomeService.categoryTree().then((res) => {
			if (!res.success) return;

			this.setState({ categoryTree: TreeHelper.parseTree(res.itemList) });
		});

		MenuService.categoryGetList({
			parentId: Const.pageCategory,
			idList: Const.pageSiderMenu,
		}).then((res) => {
			if (!res.success) return;

			this.setState({ categoryList: res.itemList ? res.itemList : [] });
		});
	}

	componentWillUnmount() {
		this.userCurrentSubscription.unsubscribe();
	}

	onOffice = () => {
		const token = Service.tokenGet();
		if (token) window.location = Const.apiURL + "/login/" + token;
	};

	onLogout = () => {
		LoginService.logoutSubmit();
		window.location = "/";
	};

	render() {
		const categoryTree = this.state.categoryTree
			? this.state.categoryTree
			: [];
		const { categoryList } = this.state;

		return (
			<React.Fragment>
				<div className="connect-sider">
					<Row className="nopadding">
						<Col flex={1}>
							<a href="">
								<i className="fab fa-facebook-f"></i>
							</a>
						</Col>
						<Col flex={1}>
							<a href="">
								<i className="fab fa-youtube"></i>
							</a>
						</Col>
						<Col flex={1}>
							<a href="">
								<i className="fas fa-envelope"></i>
							</a>
						</Col>
						<Col flex={1}>
							<a href="">
								<i className="fas fa-phone-alt"></i>
							</a>
						</Col>
					</Row>
				</div>
				<Menu
					className="sider-menu"
					defaultOpenKeys={["productCategory"]}
					mode="inline"
					inlineIndent={20}
					onSelect={() => siderService.visible()}
				>
					<Menu.SubMenu
						key="productCategory"
						title={<span>Danh mục sản phẩm</span>}
					>
						{categoryTree.map((item_1) =>
							item_1.children.length > 0 ? (
								<Menu.SubMenu
									key={item_1.key}
									title={
										<span>
											<i className="icon fal fa-check-square"></i>
											<span>{item_1.title}</span>
										</span>
									}
								>
									{item_1.children.map((item_2) =>
										item_2.children.length > 0 ? (
											<Menu.SubMenu
												key={item_2.key}
												title={
													<span>
														<i className="icon fal fa-check-square"></i>
														<span>{item_2.title}</span>
													</span>
												}
											>
												{item_2.children.map((item_3) => (
													<Menu.Item key={item_3.key}>
														<Link to={ProductURL.productListURL({}, { categoryId: item_3.value, categoryName: item_3.title })}>
															<i className="icon fal fa-check-square"></i>
															<span>{item_3.title}</span>
														</Link>
													</Menu.Item>
												))}
											</Menu.SubMenu>
										) : (
											<Menu.Item key={item_2.key}>
												<Link to={ProductURL.productListURL({}, { categoryId: item_2.value, categoryName: item_2.title })}>
													<i className="icon fal fa-check-square"></i>
													<span>{item_2.title}</span>
												</Link>
											</Menu.Item>
										)
									)}
								</Menu.SubMenu>
							) : (
								<Menu.Item key={item_1.key}>
									<Link to={ProductURL.productListURL({}, { categoryId: item_1.value, categoryName: item_1.title })}>
										<i className="icon fal fa-check-square"></i>
										<span>{item_1.title}</span>
									</Link>
								</Menu.Item>
							)
						)}
					</Menu.SubMenu>
					<Menu.Divider />
					<Menu.Item key="000001">
						<Link to="/">
							<i className="icon fal fa-file"></i>
							<span>Trang chủ</span>
						</Link>
					</Menu.Item>
					{categoryList.map((item) => (
						<Menu.Item key={item.id}>
							<Link
								key={item.id}
								to={ContentURL.contentListURL(
									{},
									{ categoryName: item.name, categoryId: item.id }
								)}
							>
								<i className="icon fal fa-file"></i>
								<span>{item.name}</span>
							</Link>
						</Menu.Item>
					))}
					<Menu.Item key="000002">
						<Link to="/lien-he">
							<i className="icon fal fa-file"></i>
							<span>Liên hệ</span>
						</Link>
					</Menu.Item>
					<Menu.Divider />
				</Menu>
			</React.Fragment>
		);
	}
}
