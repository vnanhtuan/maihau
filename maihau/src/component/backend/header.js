import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Affix, Dropdown, Menu, Row, Col } from "antd";

import * as Const from "../../common/const";
import { Format } from "../../common/format";

import { CurrentUserService } from "../user/currentUserService";
import { LoginService } from "../user/userService";
import { CartService } from "../product/productService";

import SiderBase, { siderService } from "../../common/siderBase";
import Sider from "./sider";

export default class Header extends Component {
	state = {
		userCurrent: CurrentUserService.getUser(),
	};

	componentDidMount() {
		this.userCurrentSubscription = CurrentUserService.getObservable().subscribe((user) => {
			this.setState({ userCurrent: user });
		});

		this.cartSubscription = CartService.getObservable().subscribe((cart) => {
			let cartQty = 0;
			cart.forEach((item) => (cartQty += item.qty));
			this.setState({ cart: cart, cartQty });
		});
	}

	componentWillUnmount() {
		this.userCurrentSubscription.unsubscribe();
		this.cartSubscription.unsubscribe();
	}

	logoutHandle = () => {
		LoginService.logoutSubmit();
		window.location = "/";
	};

	render() {
		return (
			<header className="header">
				<Affix>
					<div className="mainbar">
						<span className="link sider-button" onClick={() => siderService.visible()}>
							<i className="far fa-bars"></i>
						</span>
						{this.state.userCurrent ? (
							<Dropdown
								trigger={["click"]}
								overlay={
									<Menu>
										<div className="header-user-info">
											<div className="avatar">
												<i className="fal fa-user-circle"></i>
											</div>
											<div className="info">
												<div className="username">{this.state.userCurrent.userName}</div>
												<div className="fullname">{this.state.userCurrent.fullName}</div>
											</div>
										</div>
										<Menu.Divider />
										<Menu.Item key="profile">
											<Link to={Const.beRoutePath + "/profile"}>
												<i className="icon fa fa-user"></i>
												<span>Thông tin thành viên</span>
											</Link>
										</Menu.Item>
										<Menu.Item key="logout">
											<span onClick={this.logoutHandle}>
												<i className="icon fa fa-power-off"></i>
												<span>Đăng xuất</span>
											</span>
										</Menu.Item>
									</Menu>
								}
							>
								<span className="mainbar-button user" onClick={(e) => e.preventDefault()}>
									<i className="fas fa-user-circle"></i>
								</span>
							</Dropdown>
						) : (
							<Link to="/login" className="mainbar-button">
								<i className="far fa-user-circle"></i>
								<span>Login</span>
							</Link>
						)}
					</div>
				</Affix>
				<SiderBase>
					<Sider />
				</SiderBase>
			</header>
		);
	}
}
