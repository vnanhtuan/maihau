import React, { Component } from "react";
import { Row, Col, Input, Select, Button, DatePicker, TreeSelect, Pagination, Menu, Dropdown, Drawer, Switch } from "antd";

import { Locale } from "../../common/locale";
import { Format } from "../../common/format";
import { Popup } from "../../common/component";

import { CategoryService, ContentManageService, ContentPostService } from "./contentService";
import { FileService } from "../file/fileService";

import ContentPost from "./contentPost";

export default class ContentManage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isItemDrawer: false,
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
			orderBy: "latest",
		};
	}

	componentDidMount() {
		ContentManageService.init().then((res) => {
			if (res.success) this.setState({ categoryList: CategoryService.parseTree(res.categoryList) });
		});

		this.getList();
	}

	getList = () => {
		Popup.spin.show();
		ContentManageService.getList({
			keyword: this.state.keyword,
			categoryId: this.state.categoryId,
			isHidden: this.state.isHidden,
			dateFrom: this.state.dateFrom,
			dateTo: this.state.dateTo,
			orderBy: this.state.orderBy,
			pageIndex: this.state.pageIndex,
		}).then((res) => {
			if (res.success)
				this.setState({
					itemList: res.itemList,
					pageIndex: res.pageIndex,
					totalPages: res.totalPages,
					totalItems: res.totalItems,
				});
			Popup.spin.hide();
		});
	};

	deleteItem = (item) => {
		Popup.spin.show();
		ContentPostService.delete(item.id).then((res) => {
			Popup.spin.hide();

			this.getList();
		});
	};

	onItemCancel = () => {
		this.setState({
			isItemDrawer: false,
		});
	};

	onItemOk = () => {
		this.getList();

		this.setState({
			isItemDrawer: false,
		});
	};

	onAddItem = () => {
		this.setState({
			itemId: null,
			isItemDrawer: true,
		});
	};

	onEditItem = (item) => {
		this.setState({
			itemId: item.id,
			isItemDrawer: true,
		});
	};

	onDeleteItem = (item) => {
		Popup.confirm({
			title: Locale.getText("common.delete_confirm"),
			content: item.name,
			onOk: () => this.deleteItem(item),
		});
	};

	render() {
		return (
			<React.Fragment>
				<h1>Quản lý nội dung</h1>
				<Row align="middle">
					<Col xs={24} sm={12} xl={6}>
						<Input.Search
							placeholder="Từ khóa"
							value={this.state.keyword}
							onChange={({ target: { value } }) => this.setState({ keyword: value })}
							onSearch={() => this.getList()}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker
							placeholder="Từ ngày"
							format={Locale.getFormat().dateFormat}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateFrom: value ? value.format("YYYY-MM-DD") : null }, () => this.getList())}
						/>
					</Col>
					<Col xs={12} sm={6} xl={4}>
						<DatePicker
							placeholder="Đến ngày"
							format={Locale.getFormat().dateFormat}
							style={{ width: "100%" }}
							onChange={(value) => this.setState({ dateTo: value ? value.format("YYYY-MM-DD") : null }, () => this.getList())}
						/>
					</Col>
					<Col flex="auto">
						<TreeSelect
							placeholder="Danh mục"
							showSearch
							style={{ width: "100%" }}
							dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
							allowClear
							treeDefaultExpandAll
							treeData={this.state.categoryList}
							treeNodeFilterProp="title"
							onChange={(value) => this.setState({ categoryId: value }, () => this.getList())}
						/>
					</Col>
					<Col>
						<Switch onChange={(value) => this.setState({ isHidden: value }, () => this.getList())} /> Ẩn đi
					</Col>
				</Row>
				<Row align="middle" justify="end">
					<Col flex="auto">{this.state.totalItems} Kết quả</Col>
					<Col>
						<Button type="primary" onClick={this.onAddItem}>
							<i className="fa fa-plus" />
							<span>Thêm</span>
						</Button>
					</Col>
					<Col>
						<Select
							placeholder="Sắp xếp"
							style={{ width: "140px" }}
							value={this.state.orderBy}
							onChange={(value) => this.setState({ orderBy: value }, () => this.getList())}
						>
							<Select.Option value="latest">Mới nhất</Select.Option>
							<Select.Option value="oldest">Cũ nhất</Select.Option>
						</Select>
					</Col>
					<Col style={{ marginLeft: "auto" }}>
						<Pagination
							current={this.state.pageIndex}
							total={this.state.totalItems}
							pageSize={this.state.pageSize}
							showSizeChanger={false}
							onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
						/>
					</Col>
				</Row>
				<div className="box">
					<div className="table has-left-col has-menu">
						<ol>
							<li>#</li>
							<li>Hình ảnh</li>
							<li>Tên</li>
							<li>Danh mục</li>
							<li>Ngày đăng</li>
							<li></li>
						</ol>
						{this.state.itemList.map((item) => (
							<ul key={item.id}>
								<li className="id-col collapsing">{item.id}</li>
								<li className="left-col collapsing">
									<div className="image-1-1" style={{ width: "80px", backgroundImage: "url(" + FileService.imageURL(item.imageId, 128) + ")" }}></div>
								</li>
								<li>
									<a onClick={() => this.onEditItem(item)}>{item.name}</a>
								</li>
								<li>{item.categoryName}</li>
								<li>
									{item.dateCreated && (
										<>
											{Format.date(new Date(item.dateCreated))}
											<br />
											<em>{Format.time(new Date(item.dateCreated))}</em>
										</>
									)}
								</li>
								<li className="menu-col">
									<Dropdown
										placement="bottomRight"
										trigger={["click"]}
										overlay={
											<Menu>
												<Menu.Item onClick={() => this.onEditItem(item)}>
													<span>
														<i className="icon fas fa-pencil-alt"></i>
														<span>Sửa</span>
													</span>
												</Menu.Item>
												<Menu.Item onClick={() => this.onDeleteItem(item)}>
													<span>
														<i className="icon fas fa-trash-alt"></i>
														<span>Xoá</span>
													</span>
												</Menu.Item>
											</Menu>
										}
									>
										<a onClick={(e) => e.preventDefault()}>
											<i className="far fa-ellipsis-v" />
										</a>
									</Dropdown>
								</li>
							</ul>
						))}
					</div>
				</div>
				<Row gutter={[0, 10]}>
					<Col style={{ marginLeft: "auto" }}>
						<Pagination
							current={this.state.pageIndex}
							total={this.state.totalItems}
							pageSize={this.state.pageSize}
							showSizeChanger={false}
							onChange={(value) => this.setState({ pageIndex: value }, () => this.getList())}
						/>
					</Col>
				</Row>
				<Drawer
					placement="right"
					onClose={this.onItemCancel}
					visible={this.state.isItemDrawer}
					maskClosable={false}
					destroyOnClose={true}
					width={768}
					className="drawer"
				>
					<ContentPost id={this.state.itemId} categoryId={this.state.categoryId} onOk={this.onItemOk} onCancel={this.onItemCancel} />
				</Drawer>
			</React.Fragment>
		);
	}
}
