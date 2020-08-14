import React, { Component } from "react";
import { Route, Switch } from "react-router";

import { CurrentUserService } from "../user/currentUserService";

import Header from "./header";
import Footer from "./footer";
import Home from "./home";
import Login from "../user/login";
import Contact from "./contact";
import ContentDetail from "../content/contentDetail";
import ContentList from "../content/contentList";
import ForgetPassword from "../user/forgetPassword";

export default class Layout extends Component {
	componentDidMount() {
		CurrentUserService.checkUser();
	}

	render() {
		return (
			<React.Fragment>
				<section className="layout layout-frontend colapse-sider">
					<Header />
					<main className="main">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/login/:token" component={Login} />
							<Route path="/login" component={Login} />
							<Route path="/contact" component={Contact} />
							<Route path="/chi-tiet-bai-viet/:text/:id(\d+)" component={ContentDetail} />
							<Route path="/bai-viet/:text/:categoryId(\d+)/:pageIndex(\d+)/:orderBy" component={ContentList} />
							<Route path="/bai-viet/:text/:categoryId(\d+)" component={ContentList} />
							<Route path={["/forgetPassword/:key", "/forgetPassword"]} component={ForgetPassword} />
						</Switch>
					</main>
					<Footer />
				</section>
			</React.Fragment>
		);
	}
}
