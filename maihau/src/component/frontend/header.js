import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Affix } from "antd";
import Media from "react-media";

import * as Const from "../../common/const";

import { CurrentUserService } from "../user/currentUserService";
import { LoginService } from "../user/userService";

import MenuMain from "./menuMain";
import Searchbox from "./searchbox";
import SiderBase, { siderService } from "../../common/siderBase";
import Sider from "./sider";

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userCurrent: CurrentUserService.getUser(),
			mainbarAffix: "",
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

	mainbarAffixChange = (affixed) => this.setState({ mainbarAffix: affixed ? "affix" : "un-affix" });

	onLogout = () => {
		LoginService.logoutSubmit();
		window.location = "/";
	};

	render() {
		const { mainbarAffix } = this.state;

		return (
			<header className="header">
				
				<Affix onChange={this.mainbarAffixChange} offsetTop={-100} className="ant-affix-wrapper">
					<div className={"mainbar " + mainbarAffix}>
						<div className="container">
							<div className="left">
								<Media
									query={Const.media.smallQuery}
									render={() => (
										<a
											className="sider-button"
											onClick={() => {
												siderService.visible();
											}}
										>
											<i className="fal fa-bars"></i>
										</a>
									)}
								/>
							</div>
							<div className="center">
								<Link to="/" className="site-logo">
									<img src="/image/logo.png" />
								</Link>
								<Searchbox />
							</div>
							<div className="right">
								<Media query={Const.media.largeQuery} render={() => <MenuMain />} />
							</div>
						</div>
					</div>
				</Affix>
				<SiderBase colapse>
					<Sider />
				</SiderBase>
			</header>
		);
	}
}
