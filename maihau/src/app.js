import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Spin, BackTop } from "antd";

import * as Const from "./common/const";

import { Popup } from "./common/component";

import { default as LayoutBE } from "./component/backend/layout";
import { default as LayoutFE } from "./component/frontend/layout";

import "react-owl-carousel2/lib/styles.css";
import "react-owl-carousel2/src/owl.theme.default.css";
import "./theme/style-frontend.scss";
import "./theme/style-backend.scss";

export default class App extends Component {
	state = {
		isSpinVisible: false,
	};

	componentDidMount() {
		this.spinSubscription = Popup.spin.getObservable().subscribe((option) => {
			if (!option || option.isVisible == null) option = { isVisible: !this.state.isSpinVisible };

			if (option.isVisible !== this.state.isSpinVisible) this.setState({ isSpinVisible: option.isVisible });
		});
	}

	componentWillUnmount() {
		this.spinSubscription.unsubscribe();
	}

	render() {
		return (
			<Spin spinning={this.state.isSpinVisible} size="large" wrapperClassName="spin">
				<Switch>
					<Route path={Const.beRoutePath + "/"} component={LayoutBE} />
					<Route path="/" component={LayoutFE} />
				</Switch>
				<BackTop />
			</Spin>
		);
	}
}
