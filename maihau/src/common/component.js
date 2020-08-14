import React, { Component } from "react";
import { Modal, message } from 'antd';
import { default as ReactNumberFormat } from 'react-number-format';
import { Subject } from "rxjs";

import { Locale } from "../common/locale";
import { Format } from '../common/format';

const spinSubject = new Subject();
const Spin = {
	visible: isVisible => spinSubject.next({ isVisible: isVisible }),
	show: () => spinSubject.next({ isVisible: true }),
	hide: () => spinSubject.next({ isVisible: false }),
	getObservable: () => spinSubject.asObservable(),
}

const Confirm = (option) => {
	if (option == null)
		option = {};

	option.okText = Locale.getText("common.OK");
	option.cancelText = Locale.getText("common.cancel");

	if (!option.title)
		option.title = Locale.getText("common.action_confirm");

	if (!option.icon)
		option.icon = <span className="anticon"><i className="fal fa-info-circle" /></span>;

	Modal.confirm(option);
}

const Info = (option) => {
	if (option == null)
		option = {};

	option.okText = Locale.getText("common.close");

	option.maskClosable = true;

	if (!option.title)
		option.title = Locale.getText("common.action_completed");

	if (!option.icon)
		option.icon = <span className="anticon"><i className="fal fa-check-circle" /></span>;

	const model = Modal.success(option);
	if (option.autoClose)
		setTimeout(() => {
			model.destroy();
			if (option.onCancel)
				option.onCancel();
		}, option.autoClose === true ? 1000 : option.autoClose);
}

const Error = (option) => {
	if (option == null)
		option = {};

	option.okText = Locale.getText("common.close");

	option.maskClosable = true;

	if (!option.title)
		option.title = Locale.getText("common.action_error");

	if (!option.icon)
		option.icon = <span className="anticon"><i className="fal fa-check-circle" /></span>;

	const model = Modal.error(option);
	if (option.autoClose)
		setTimeout(() => {
			model.destroy();
		}, option.autoClose === true ? 1000 : option.autoClose);
}

export const Popup = {
	spin: Spin,
	confirm: Confirm,
	info: Info,
	error: Error,
}

export const PopMessage = {
	success: title => {
		if (!title)
			title = Locale.getText("common.action_completed");
	
		message.success(title);
	},
}

export class InputNumber extends Component {
	constructor(props) {
		super(props);

		const localeFormat = Locale.getFormat();

		this.state = {
			thousandSeparator: localeFormat.thousandSeparator,
			decimalSeparator: localeFormat.decimalSeparator,
		}
	}

	render() {
		let { className, onChange, addonBefore, addonAfter, ...attrs } = this.props;
		addonBefore = addonBefore ? <span className="ant-input-group-addon">{addonBefore}</span> : null;
		addonAfter = addonAfter ? <span className="ant-input-group-addon">{addonAfter}</span> : null;
		return (
			<span className={"ant-input-group-wrapper" + (className ? " " + className : "")}>
				<span className="ant-input-wrapper ant-input-group">
					{addonBefore}
					<ReactNumberFormat thousandSeparator={this.state.thousandSeparator} decimalSeparator={this.state.decimalSeparator} className="ant-input" onValueChange={onChange} {...attrs} />
					{addonAfter}
				</span>
			</span>
		);
	}
}

export class NumberFormat extends Component {
	render() {
		let { value } = this.props;

		if (value == null || value == 0)
			return value;

		const localeFormat = Locale.getFormat();
		const decimalSeparator = localeFormat.decimalSeparator;

		const parse = Format.number(value).split(decimalSeparator);
		return (
			<React.Fragment>{parse[0]}{parse[1] ? <em>{decimalSeparator + parse[1]}</em> : ""}</React.Fragment>
		);
	}
}

export class CoinFormat extends Component {
	render() {
		let { value } = this.props;

		if (value == null || value == 0)
			return value;

		const localeFormat = Locale.getFormat();
		const decimalSeparator = localeFormat.decimalSeparator;

		const parse = Format.coinNumber(value).split(decimalSeparator);
		return (
			<React.Fragment>{parse[0]}{parse[1] ? <em>{decimalSeparator + parse[1]}</em> : ""}</React.Fragment>
		);
	}
}

export class Msg extends Component {
	render() {
		if (this.props.msgs != null && this.props.msgs.length > 0) {
			const { target, msgs, ...attr } = this.props;
			const msg = msgs.find(item => item.target === target);
			if (msg) {
				let text = Locale.getText(msg.code);
				if (text == null) text = target;
				return <div {...attr}>{text}</div>
			}
		}
		return null;
	}
}