import React, { Component } from "react";

import ScrollBooster from "scrollbooster";

export default class ScrollBox extends Component {
	constructor(props) {
		super(props);

		this.thisElement = React.createRef();
	}

	componentDidMount() {
		setTimeout(() => {
			if (this.updater.isMounted(this))
				new ScrollBooster({
					viewport: this.thisElement.current,
					scrollMode: "native",
					pointerMode: "mouse",
					bounce: false,
				});
		}, 1000);
	}

	render() {
		let { className, scrollbar, ...attrs } = this.props;

		className = (className ? className : "") + " scrollbox";

		if (!scrollbar) className += " scrollbar-hidden";

		return <div ref={this.thisElement} {...attrs} className={className} />;
	}
}
