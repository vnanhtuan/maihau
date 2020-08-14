import React, { Component } from "react";
import { Row, Col, Input, Button, TreeSelect, Switch, DatePicker } from "antd";
import moment from "moment";

import { Locale } from "../../common/locale";
import { Popup, Msg } from "../../common/component";
import Editor from "../../common/editor";
import Upload from "../file/upload";

import { CategoryService, ContentPostService } from "./contentService";

export default class ContentPost extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: (this.props.id ? "Sửa" : "Thêm") + " nội dung",
			categoryList: [],
		};
	}

	componentDidMount() {
		Popup.spin.show();
		ContentPostService.init({ id: this.props.id }).then((res) => {
			if (res) {
				const item = res.item ? res.item : {};

				this.setState({
					categoryList: CategoryService.parseTree(res.categoryList),
					id: item.id,
					categoryId: item.categoryId ? item.categoryId : this.props.categoryId,
					name: item.name,
					summary: item.summary,
					link: item.link,
					isHidden: item.isHidden,
					dateCreated: item.dateCreated,
					description: item.description,
					fileList: item.fileList,
					descriptionFileList: item.descriptionFileList,
				});
			}
			Popup.spin.hide();
		});
	}

	onSubmit = async () => {
		Popup.spin.show();
		const res = await ContentPostService.submit({
			id: this.state.id,
			categoryId: this.state.categoryId,
			name: this.state.name,
			summary: this.state.summary,
			isHidden: this.state.isHidden,
			dateCreated: this.state.dateCreated,
			description: this.state.description,
			link: this.state.link,
			fileList: this.state.fileList,
			descriptionFileList: this.state.descriptionFileList,
		});
		Popup.spin.hide();
		if (res.success) {
			Popup.info({ autoClose: true });
			this.props.onOk();
		}
		this.setState({ msgs: res.msgs });
	};

	onCancel = () => {
		this.props.onCancel();
	};

	render() {
		return (
			<React.Fragment>
				<div className="form scroll">
					<h2>{this.state.title}</h2>
					<Row>
						<Col>
							<label>Tên</label>
							<Input value={this.state.name} onChange={({ target: { value } }) => this.setState({ name: value })} />
							<Msg target="name" msgs={this.state.msgs} className="errorMsg" />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Danh mục</label>
							<TreeSelect
								showSearch
								style={{ width: "100%" }}
								dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
								allowClear
								treeDefaultExpandAll
								treeData={this.state.categoryList}
								value={this.state.categoryId}
								treeNodeFilterProp="title"
								onChange={(value) => this.setState({ categoryId: value })}
							/>
							<Msg target="category" msgs={this.state.msgs} className="errorMsg" />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Ẩn đi</label>
							<Switch checked={this.state.isHidden} onChange={(value) => this.setState({ isHidden: value })} />
						</Col>
						<Col>
							<label>Ngày đăng</label>
							<DatePicker
								showTime
								value={moment(this.state.dateCreated)}
								format={Locale.getFormat().dateFormat + " " + Locale.getFormat().timeFormat}
								style={{ width: "200px" }}
								onChange={(value) => this.setState({ dateCreated: value ? value.format() : null })}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Link</label>
							<Input value={this.state.link} onChange={({ target: { value } }) => this.setState({ link: value })} />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Tóm tắt</label>
							<Input.TextArea
								autoSize={{ minRows: 2, maxRows: 10 }}
								value={this.state.summary}
								onChange={({ target: { value } }) => this.setState({ summary: value })}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Hình ảnh</label>
							<Upload multiple={true} value={this.state.fileList} onChange={(value) => this.setState({ fileList: value })} />
						</Col>
					</Row>
					<Row>
						<Col>
							<label>Thông tin chi tiết</label>
							<Upload
								multiple={true}
								value={this.state.descriptionFileList}
								onChange={(value) => this.setState({ descriptionFileList: value })}
								filePicker={(value) => this.setState({ filePicker: value })}
							/>
							<Editor value={this.state.description} onChange={(value) => this.setState({ description: value })} filePicker={this.state.filePicker} />
						</Col>
					</Row>
					<div className="footer fixed">
						<Row>
							<Col>
								<Button type="primary" onClick={this.onSubmit}>
									Đồng ý
								</Button>
							</Col>
							<Col>
								<Button onClick={this.onCancel}>Đóng</Button>
							</Col>
						</Row>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
