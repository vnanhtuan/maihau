import React, { Component } from "react";
import { Row, Col, Input, Select, DatePicker, Pagination } from "antd";

import { Locale } from "../../common/locale";
import { Format } from "../../common/format";
import { Popup } from "../../common/component";

import { WorkHistoryManageService } from "./workHistoryService";

export default class WorkHistoryManage extends Component {
	state = {
		categoryList: [],
		itemList: [],
		pageIndex: 1,
		pageSize: 20,
		totalPages: 0,
		totalItems: 0,
		keyword: null,
		dateFrom: null,
		dateTo: null,
		categoryId: null,
		orderBy: "dateCreatedDec",
	};

	componentDidMount() {
		WorkHistoryManageService.init().then(res => {
			if (res.success)
				this.setState({ categoryList: res.categoryList });
		});

		this.getList();
	}

	getList = () => {
		Popup.spin.show();
		WorkHistoryManageService.getList({
			keyword: this.state.keyword,
			categoryId: this.state.categoryId,
			dateFrom: this.state.dateFrom,
			dateTo: this.state.dateTo,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then(res => {
			if (res.success)
				this.setState({
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
				});
			Popup.spin.hide();
		});
	}

	render() {
		return (
			<React.Fragment>
				<h1>Work history</h1>
				<Row align="middle">
					<Col xs={24} sm={12} xl={6}>
						<Input.Search
							placeholder="Keyword" value={this.state.keyword}
							onChange={({ target: { value } }) => this.setState({ keyword: value })}
							onSearch={() => this.getList()}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker placeholder="From date" format={Locale.getFormat().dateFormat} style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateFrom: value ? value.format("YYYY-MM-DD") : null }, () => this.getList())}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker placeholder="To date" format={Locale.getFormat().dateFormat} style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateTo: value ? value.format("YYYY-MM-DD") : null }, () => this.getList())}
						/>
					</Col>
					<Col flex="auto">
						<Select
							style={{ width: "100%" }}
							placeholder="History category"
							onChange={(value) => this.setState({ categoryId: value }, () => this.getList())}
							allowClear
						>
							{this.state.categoryList.map(item => (
								<Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
							))}
						</Select>
					</Col>
				</Row>
				<Row align="middle" justify="end">
					<Col flex="auto">{this.state.totalItems} items</Col>
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
						<Pagination current={this.state.pageIndex} total={this.state.totalItems} pageSize={this.state.pageSize} showSizeChanger={false}
							onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
						/>
					</Col>
				</Row>
				<div className="box">
					<div className="table">
						<ol>
							<li>Date</li>
							<li>Member</li>
							<li>Content</li>
							<li>Target</li>
							<li className="right">Value</li>
							<li>Note</li>
						</ol>
						{this.state.itemList.map(item => (
							<ul key={item.id}>
								<li data-title="Date" className="collapsing">{Format.date(new Date(item.dateCreated))} <em>{Format.time(new Date(item.dateCreated))}</em></li>
								<li data-title="Member">{item.userName}</li>
								<li data-title="Content"><div style={{minWidth:200}}>{item.categoryName}</div></li>
								<li data-title="Target">{item.targetName}</li>
								<li data-title="Value" className="right">{Format.number(item.value)}</li>
								<li data-title="Note"><div style={{maxWidth:400}}>{item.note}</div></li>
							</ul>
						))}
					</div>
				</div>
				<Row gutter={[0, 10]}>
					<Col style={{ marginLeft: "auto" }}>
						<Pagination current={this.state.pageIndex} total={this.state.totalItems} pageSize={this.state.pageSize} showSizeChanger={false}
							onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
						/>
					</Col>
				</Row>
			</React.Fragment >
		);
	}
}