import React, { Component } from "react";
import { Route, Switch } from "react-router";

import * as Const from "../../common/const";

import { CurrentUserService } from "../user/currentUserService";

import Header from "./header";
import ContentManage from "../content/contentManage";
import ContentCategoryManage from "../content/categoryManage";
import ProductManage from "../product/productManage";
import BrandManage from "../product/brandManage";
import CategoryManage from "../product/categoryManage";
import Orders from "../product/orders";
import Profile from "../user/profile";
import Bank from "../user/bank";
import ShippingInfo from "../user/shippingInfo";
import Register from "../user/register";
import UserManage from "../user/userManage";
import UserTree from "../user/userTree";
import MemberGroup from "../user/memberGroup";
import UserSponsorList from "../user/userSponsorList";
import WorkHistoryManage from "../workHistory/workHistoryManage";
import Deposit from "../wallet/deposit";
import Withdraw from "../wallet/withdraw";
import Transfer from "../wallet/transfer";

export default class Layout extends Component {
	state = {
		isCurrentUser: false,
	};

	componentDidMount() {
		CurrentUserService.checkUser().then((res) => {
			if (res) this.setState({ isCurrentUser: true });
			else this.props.history.push("/login");
		});
	}

	render() {
		return (
			this.state.isCurrentUser && (
				<section className="layout layout-backend">
					<Header />
					<main className="main">
						<Switch>
							<Route path={Const.beRoutePath + "/userManage"} component={UserManage} />
							<Route path={Const.beRoutePath + "/contentManage"} component={ContentManage} />
							<Route path={Const.beRoutePath + "/contentCategoryManage"} component={ContentCategoryManage} />
							<Route path={Const.beRoutePath + "/productManage"} component={ProductManage} />
							<Route path={Const.beRoutePath + "/productCategoryManage"} component={CategoryManage} />
							<Route path={Const.beRoutePath + "/productBrandManage"} component={BrandManage} />
							<Route path={Const.beRoutePath + "/orders/:type"} component={Orders} />
							<Route path={Const.beRoutePath + "/orders"} component={Orders} />
							<Route path={Const.beRoutePath + "/register"} component={Register} />
							{/* <Route path={Const.beRoutePath + "/userList"} component={UserTree} />
						<Route path={Const.beRoutePath + "/deposit"} component={Deposit} /> */}
							<Route path={Const.beRoutePath + "/withdraw"} component={Withdraw} />
							<Route path={Const.beRoutePath + "/transfer"} component={Transfer} />
							<Route path={Const.beRoutePath + "/bank"} component={Bank} />
							<Route path={Const.beRoutePath + "/memberGroup"} component={MemberGroup} />
							<Route path={Const.beRoutePath + "/userSponsorList"} component={UserSponsorList} />
							{/* <Route path={Const.beRoutePath + "/workHistoryManage"} component={WorkHistoryManage} /> */}
							<Route path={Const.beRoutePath + "/profile"} component={Profile} />
							{/* <Route path={Const.beRoutePath + "/shippingInfo"} component={ShippingInfo} /> */}
							<Route exact path={Const.beRoutePath} component={Register} />
						</Switch>
					</main>
				</section>
			)
		);
	}
}
