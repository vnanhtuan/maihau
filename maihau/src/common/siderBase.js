import React, { Component } from "react";
import Media from "react-media";
import { Subject } from "rxjs";

import * as Const from "./const";

const subject = new Subject();
export const siderService = {
	visible: (isVisible) => subject.next({ isVisible: isVisible }),
	getObservable: () => subject.asObservable(),
};

export default class SiderBase extends Component {
	constructor(props) {
		super(props);

		this.state = { isVisible: false };
	}

	componentDidMount() {
		this.siderSubscription = siderService.getObservable().subscribe((option) => {
			if (!option || option.isVisible == null) option = { isVisible: !this.state.isVisible };

			let isSiderChange = false;
			let siderState = {};

			if (option.isVisible !== this.state.isVisible) {
				siderState.isVisible = option.isVisible;
				isSiderChange = true;
			}

			if (isSiderChange) this.setState(siderState);
		});
	}

	componentWillUnmount() {
		this.siderSubscription.unsubscribe();
	}

	visible = (isVisible) => {
		if (isVisible == null) this.setState({ isVisible: !this.state.isVisible });
		else if (isVisible !== this.state.isVisible) this.setState({ isVisible: isVisible });
	};

	sider = (visible) => {
		const { colapse } = this.props;
		const visibleMedia = Const.media.smallQuery;
		if (colapse) return <Media query={visibleMedia} render={() => <aside className={"sider " + visible}>{this.props.children}</aside>} />;
		else return <aside className={"sider " + visible}>{this.props.children}</aside>;
	};

	backdrop = (visible) => {
		return (
			<div
				onClick={() => {
					this.setState({ isVisible: false });
				}}
				className={"backdrop " + visible}
			></div>
		);
	};

	render() {
		const visible = this.state.isVisible === true ? "visible" : "";
		if (visible) document.body.classList.add("sider-visible");
		else document.body.classList.remove("sider-visible");

		return (
			<React.Fragment>
				{this.sider(visible)}
				{this.backdrop(visible)}
			</React.Fragment>
		);
	}
}
