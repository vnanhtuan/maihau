import React, { Component } from "react";
import { Row, Col, Select, Pagination } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import QRCode from "qrcode.react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Format } from "../../common/format";
import { Popup } from '../../common/component';

import { DepositService } from "./walletService";

export default class Deposit extends Component {
	state = {
		depositAddress: "",
		isAddressCopy: false,
		itemList: [],
		pageIndex: 1,
		totalPages: 0,
		totalItems: 0,
		keyword: null,
		dateFrom: null,
		dateTo: null,
		statusId: null,
		orderBy: "dateCreatedDec",
	}

	componentDidMount() {
		Popup.spin.show();
		DepositService.init().then(res => {
			if (res) {
				this.setState({
					completedConfirmed: res.completedConfirmed,
					depositAddress: res.depositAddress,
				});
			}
			Popup.spin.hide();
		});

		this.getList();
	}

	getList = () => {
		const isMounted = this.updater.isMounted(this);
		if (isMounted === false)
			return;

		Popup.spin.show();
		DepositService.getList({
			keyword: this.state.keyword,
			statusId: this.state.statusId,
			dateFrom: this.state.dateFrom,
			dateTo: this.state.dateTo,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then(res => {
			if (res.success && isMounted)
				this.setState({
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
				});
			Popup.spin.hide();

			if (isMounted)
				setTimeout(this.getList, 10000);
		});
	}

	onAddressCopy = () => {
		this.setState({ isAddressCopy: true });
	}

	render() {
		return (
			<div className="deposit-page">
				<h1>Deposit</h1>
				<div className="box">
					<div className="deposit-form form">
						{this.state.depositAddress &&
							<Row align="middle">
								<Col className="qrCode-box">
									<QRCode size={160} value={this.state.depositAddress} />
								</Col>
								<Col className="address-box">
									<h2>Deposit Bitcoin Address</h2>
									<CopyToClipboard text={this.state.depositAddress}
										onCopy={this.onAddressCopy}>
										<div className="address">
											<span>{this.state.depositAddress}</span>
											<i className={"fal fa-" + (this.state.isAddressCopy ? "check" : "copy")} />
										</div>
									</CopyToClipboard>
								</Col>
							</Row>
						}
					</div>
				</div>
				<div className="deposit-history">
					<Row align="middle" justify="end">
						<Col flex="auto"><b>Deposit history</b> - {this.state.totalItems} items</Col>
						<Col>
							<Select placeholder="Sort" style={{ width: "140px" }}
								value={this.state.orderBy}
								onChange={(value) => this.setState({ orderBy: value }, () => this.getList())}
							>
								<Select.Option value="dateCreatedDec">Latest date</Select.Option>
								<Select.Option value="dateCreatedInc">Oldest date</Select.Option>
							</Select>
						</Col>
						<Col style={{ marginLeft: "auto" }}>
							<Pagination current={this.state.pageIndex} total={this.state.totalItems} defaultPageSize={this.state.pageSize}
								onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
							/>
						</Col>
					</Row>
					<div className="box">
						<div className="table">
							<ol>
								<li>Date</li>
								<li>Member</li>
								<li>Amount</li>
								<li>Value</li>
								<li>Status</li>
							</ol>
							{this.state.itemList.map(item => (
								<ul key={item.hash}>
									<li className="collapsing">{Format.date(new Date(item.date))} <em>{Format.time(new Date(item.date))}</em></li>
									<li><a onClick={() => { }}>{item.userName}</a></li>
									<li>{Format.coinNumber(item.amount)} BTC</li>
									<li>
										{item.statusId === 1 ?
											<LoadingOutlined style={{ fontSize: 24 }} spin />
											:
											<div>${Format.number(item.value)}</div>
										}
									</li>
									<li>
										{item.statusId === 1 ?
											<div>
												{item.statusName}: {item.confirmed} / {this.state.completedConfirmed}
											</div>
											:
											<div>{item.statusName}</div>
										}
									</li>
								</ul>
							))}
						</div>
					</div>
					<Row gutter={[0, 10]}>
						<Col style={{ marginLeft: "auto" }}>
							<Pagination current={this.state.pageIndex} total={this.state.totalItems} defaultPageSize={this.state.pageSize}
								onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
							/>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}
