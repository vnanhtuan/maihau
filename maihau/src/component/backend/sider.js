import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Button } from "antd";

import * as Const from "../../common/const";

import { Popup } from "../../common/component";

import { CurrentUserService } from "../user/currentUserService";
import { LoginService, LoginToUserService } from "../user/userService";

import { siderService } from "../../common/siderBase";

export default class Sider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userCurrent: CurrentUserService.getUser(),
		};
	}

	componentDidMount() {
		this.userCurrentSubscription = CurrentUserService.getObservable().subscribe((user) => {
			this.setState({ userCurrent: user });
		});
	}

	componentWillUnmount() {
		this.userCurrentSubscription.unsubscribe();
	}

	onLogout = () => {
		LoginService.logoutSubmit();
		window.location = "/";
	};

	onBackToLogin = async () => {
		Popup.spin.show();
		const res = await LoginToUserService.backToLogin();
		Popup.spin.hide();

		if (res.success) {
			LoginService.tokenSet(res.data);
			window.location = "/office";
		} else {
			LoginService.logoutSubmit();
			window.location = "/";
		}
	};

	onFunctionUpdate = (e) => {
		e.preventDefault();

		Popup.info({
			title: "Tính năng đang tạm khoá",
		});
	};

	render() {
		return (
			<React.Fragment>
				<div className="link sider-header">
					<div className="sider-header-wrap">
						<Link to="/" className="site-logo">
							<img src="/image/logo-light.png" alt="" />
						</Link>
					</div>
				</div>
				<Menu
					className="sider-menu"
					defaultOpenKeys={["management", "office", "report", "productCategory", "account"]}
					mode="inline"
					inlineIndent={20}
					onSelect={() => siderService.visible()}
				>
					{this.state.userCurrent && this.state.userCurrent.loginUserName && (
						<Menu.Item>
							<div style={{ marginLeft: "-20px" }}>
								<Button type="primary" onClick={this.onBackToLogin} block>
									{this.state.userCurrent.loginUserName} Login
								</Button>
							</div>
						</Menu.Item>
					)}
					{this.state.userCurrent &&
						(this.state.userCurrent.isAdmin || this.state.userCurrent.isProductManager || this.state.userCurrent.isContentManager) && (
							<Menu.SubMenu
								key="management"
								title={
									<span>
										<span>Quản lý</span>
									</span>
								}
							>
								{this.state.userCurrent.isAdmin && [
									<Menu.Item key="contentManage">
										<Link to={Const.beRoutePath + "/contentManage"}>
											<i className="icon fas fa-file-exclamation"></i>
											<span>Nội dung web</span>
										</Link>
									</Menu.Item>,
									<Menu.Item key="contentCategoryManage">
										<Link to={Const.beRoutePath + "/contentCategoryManage"}>
											<i className="icon fal fa-file-edit"></i>
											<span>Danh mục nội dung</span>
										</Link>
									</Menu.Item>,
								]}
								{this.state.userCurrent.isContentManager && [
									<Menu.Item key="contentManage">
										<Link to={Const.beRoutePath + "/contentManage"}>
											<i className="icon fas fa-file-exclamation"></i>
											<span>Nội dung web</span>
										</Link>
									</Menu.Item>,
								]}
								{(this.state.userCurrent.isAdmin || this.state.userCurrent.isProductManager) && [
									<Menu.Item key="productManage">
										<Link to={Const.beRoutePath + "/productManage"}>
											<i className="icon fas fa-box-full"></i>
											<span>Sản phẩm</span>
										</Link>
									</Menu.Item>,
									<Menu.Item key="productCategoryManage">
										<Link to={Const.beRoutePath + "/productCategoryManage"}>
											<i className="icon fal fa-box-full"></i>
											<span>Danh mục sản phẩm</span>
										</Link>
									</Menu.Item>,
									<Menu.Item key="productBrandManage">
										<Link to={Const.beRoutePath + "/productBrandManage"}>
											<i className="icon fa fa-copyright"></i>
											<span>Thương hiệu</span>
										</Link>
									</Menu.Item>,
								]}
							</Menu.SubMenu>
						)}
					<Menu.SubMenu
						key="report"
						title={
							<span>
								<span>Thống kê</span>
							</span>
						}
					>
						<Menu.Item key="workHistoryManage">
							<Link to={Const.beRoutePath + "/workHistoryManage__"} onClick={this.onFunctionUpdate}>
								<i className="icon fas fa-history"></i>
								<span>Lịch sử hoạt động</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="orders">
							<Link to={Const.beRoutePath + "/orders"}>
								<i className="icon fas fa-usd-square"></i>
								<span>Đơn đặt hàng</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="clientList">
							<Link to={Const.beRoutePath + "/userList__"} onClick={this.onFunctionUpdate}>
								<i className="icon fas fa-address-card"></i>
								<span>Danh sách khách hàng</span>
							</Link>
						</Menu.Item>
					</Menu.SubMenu>
					<Menu.SubMenu
						key="account"
						title={
							<span>
								<span>Tài khoản</span>
							</span>
						}
					>
						<Menu.Item key="profile">
							<Link to={Const.beRoutePath + "/profile"}>
								<i className="icon fas fa-user"></i>
								<span>Thông tin thành viên</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="logout">
							<a onClick={this.onLogout}>
								<i className="icon fas fa-power-off"></i>
								<span>Đăng xuất</span>
							</a>
						</Menu.Item>
					</Menu.SubMenu>
				</Menu>
			</React.Fragment>
		);
	}
}
