import React, { Component } from "react";
import { message, Button, Upload as AntdUpload } from "antd";

import { Popup } from "../../common/component";
import { Locale } from "../../common/locale";

import * as Service from "../../common/serviceHelper";

import { FileService } from "./fileService";

export default class Upload extends Component {
	constructor(props) {
		super(props);

		this.thisElement = React.createRef();

		let isFilePicker = null;
		if (this.props.filePicker != null) {
			isFilePicker = false;

			this.props.filePicker(this.onFilePickerShow);
		}

		let multiple = this.props.multiple === true;
		if (this.props.type === "avatar") multiple = false;

		this.state = {
			fileList: this.props.value ? this.props.value : [],
			isFilePicker: isFilePicker,
			type: this.props.type,
			multiple: multiple,
			readonly: this.props.readonly === true,
		};
	}

	uploadHeader = () => ({ authorization: "Bearer " + Service.tokenGet() });

	componentDidMount() {
		if (this.props.filePicker != null) document.body.appendChild(this.thisElement.current);
	}

	componentWillUnmount() {
		if (this.props.filePicker != null) document.body.removeChild(this.thisElement.current);
	}

	onFilePickerShow = (callback) => {
		this.setState({ isFilePicker: true, filePickerCallback: callback });
	};

	onItemClick = (item) => {
		const url = FileService.imageURL(item.id, 1024);
		if (this.state.isFilePicker != null) {
			this.state.filePickerCallback(url);

			this.setState({ isFilePicker: false });
		}
	};

	onChange = (info) => {
		if (info.file.status === "done") {
			if (info.file.response.msgs.length > 0) message.error(info.file.response.msgs[0].text);
			else {
				let fileList = this.state.fileList;
				const file = {
					id: info.file.response.data.fileList[0].id,
				};
				if (this.state.multiple) fileList.push(file);
				else fileList = [file];

				this.props.onChange(fileList);

				this.setState({ fileList });
			}
		}
	};

	onMove = (index, step) => {
		const from = index;
		const to = index + step;
		if (to < 0) return;

		let fileList = this.state.fileList;
		fileList.splice(to, 0, fileList.splice(from, 1)[0]);

		this.props.onChange(fileList);

		this.setState({ fileList });
	};

	onDelete = (index, item) => {
		Popup.confirm({
			title: Locale.getText("common.delete_confirm"),
			onOk: () => {
				let fileList = this.state.fileList;
				fileList.splice(index, 1);

				this.props.onChange(fileList);

				this.setState({ fileList });
			},
		});
	};

	onDeleteAll = () => {
		Popup.confirm({
			title: Locale.getText("common.delete_confirm"),
			onOk: () => {
				let fileList = [];

				this.props.onChange(fileList);

				this.setState({ fileList });
			},
		});
	};

	onView = (item) => {};

	static getDerivedStateFromProps(props, state) {
		let newState = {};
		let hasChange = false;

		if (props.value !== state.fileList) {
			newState.fileList = props.value ? props.value : [];
			hasChange = true;
		}

		if (props.readonly !== state.readonly) {
			newState.readonly = props.readonly;
			hasChange = true;
		}

		if (hasChange) return newState;
		else return null;
	}

	render() {
		let rootClassName = "upload-component";
		if (this.state.isFilePicker != null) {
			rootClassName += " filepicker";

			if (this.state.isFilePicker) rootClassName += " show";
		}

		if (this.state.type === "avatar") rootClassName += " avatar";

		return (
			<div ref={this.thisElement} className={rootClassName}>
				<div className="upload-component-wrap">
					<div className="filelist">
						<ul>
							{this.state.fileList.map((item, index) => (
								<li key={item.id}>
									<a
										onClick={() => this.onItemClick(item)}
										className="image"
										style={{ backgroundImage: "url(" + FileService.imageURL(item.id, 256) + ")" }}
									/>
									<a href={FileService.imageURL(item.id, 0)} target="_blank" className="view-btn">
										<i className="fa fa-eye" />
									</a>
									{this.state.multiple && !this.state.readonly && (
										<div className="tool">
											<Button type="dashed" icon={<i className="fa fa-arrow-left" />} onClick={() => this.onMove(index, -1)}></Button>
											<Button type="dashed" icon={<i className="fa fa-trash" />} onClick={() => this.onDelete(index, item)}></Button>
											<Button type="dashed" icon={<i className="fa fa-arrow-right" />} onClick={() => this.onMove(index, 1)}></Button>
										</div>
									)}
								</li>
							))}
							{this.state.type === "avatar" && this.state.fileList.length === 0 && (
								<li>
									<a className="image" style={{ backgroundImage: "url(" + FileService.imageURL(0, 512) + ")" }} />
								</li>
							)}
						</ul>
					</div>
					<div className="maintool">
						{!this.state.readonly && (
							<>
								<AntdUpload
									action={FileService.uploadApi}
									headers={this.uploadHeader()}
									showUploadList={false}
									multiple={this.state.multiple}
									onChange={this.onChange}
								>
									<Button>
										<i className="fa fa-plus" />
										Upload
									</Button>
								</AntdUpload>
								{!this.state.multiple && this.state.fileList.length > 0 && (
									<Button type="dashed" icon={<i className="fa fa-trash" />} onClick={() => this.onDeleteAll()}></Button>
								)}
							</>
						)}
						<Button className="close-button" icon={<i className="fa fa-times" />} onClick={() => this.setState({ isFilePicker: false })}></Button>
					</div>
				</div>
			</div>
		);
	}
}
