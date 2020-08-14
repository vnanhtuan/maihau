import React, { Component } from "react";
import { Row, Col, Tooltip, Button } from "antd";

import { Popup } from "../../common/component";
import { Format } from "../../common/format";
import { FileService } from "../file/fileService";

import { MemberGroupService } from "./userService";

export default class MemberGroup extends Component {
	state = {
		memberList: [],
		group: {},
	};

	componentDidMount() {
		Popup.spin.show();
		MemberGroupService.init().then((res) => {
			if (res) {
				if (!res.memberList) res.memberList = [];

				let mainMemberList = res.memberList.filter((item) => item.memberTypeId !== res.subMemberTypeId);
				const mainMemberListLength = mainMemberList.length;
				for (let i = 0; i < 30 - mainMemberListLength; i++) mainMemberList.push({});
				let mainGroup_1 = {
					group: res.group
						? {
								...res.group,
								subMemberTypeSymbol: res.subMemberTypeSymbol,
						  }
						: null,
					memberList: mainMemberList.filter((item, index) => index < 10),
					itemHeight: 40,
					maxItem: 10,
					maxRadius: 110,
					minRadius: 110,
					className: "group_1",
				};

				let mainGroup_2 = {
					memberList: mainMemberList.filter((item, index) => index >= 10),
					itemHeight: 40,
					maxItem: 20,
					maxRadius: 180,
					minRadius: 180,
					className: "group_1",
				};

				let subMemberList = res.memberList.filter((item) => item.memberTypeId === res.subMemberTypeId);
				const subMemberListLength = subMemberList.length;
				for (let i = 0; i < 60 - subMemberListLength; i++) subMemberList.push({});
				let mainGroup_3 = {
					memberList: subMemberList,
					maxItem: 60,
					maxRadius: 320,
					minRadius: 320,
					className: "group_2",
				};

				this.setState({ group: res.group, mainGroup_1, mainGroup_2, mainGroup_3 });
			}
			Popup.spin.hide();
		});
	}

	drawCircle = (option) => {
		if (!option || !option.memberList) return;

		let config = {
			group: option.group,
			memberList: option.memberList,
			itemHeight: option.itemHeight ? option.itemHeight : 24,
			maxItem: option.maxItem ? option.maxItem : 200,
			maxDeg: 360,
			startDeg: 90,
			maxRadius: option.maxRadius ? option.maxRadius : 260,
			minRadius: option.minRadius ? option.minRadius : 150,
			itemRadius: 0,
			groupHeight: option.groupHeight ? option.groupHeight : 0,
			className: option.className,
			padding: 30,
		};

		// const degStep = config.maxDeg / config.memberList.length;
		const degStep = config.maxDeg / config.maxItem;

		config.itemRadius = (config.maxRadius / config.maxItem) * config.memberList.length;
		if (config.itemRadius < config.minRadius) config.itemRadius = config.minRadius;

		if (!config.groupHeight) config.groupHeight = config.itemRadius * 2 + config.itemHeight + config.padding;

		for (let i = 0; i < config.memberList.length; i++) {
			let item = config.memberList[i];
			item.deg = degStep * i + config.startDeg;
		}

		return (
			<div className="groupmember-wrap">
				<div className={"groupmember-content " + config.className} style={{ width: config.groupHeight, height: config.groupHeight }}>
					<div className="member-list" style={{ width: config.itemHeight, height: config.itemHeight }}>
						{config.group && (
							<div className="rotater center">
								<div className="circle">
									{config.group.name && <div className="main-name">{config.group.mainMemberCount + " " + config.group.name}</div>}
									<div className="sub-name">{config.group.subMemberCount + " " + config.group.subMemberTypeSymbol}</div>
								</div>
							</div>
						)}
						{config.memberList.map((item, index) => (
							<div key={index} className="rotater" style={{ transform: "rotate(" + item.deg + "deg)" }}>
								{item.userName ? (
									<div
										className={"circle" + (item.isCompany ? " company" : "")}
										style={{ transform: "translateX(-" + config.itemRadius + "px) rotate(-" + item.deg + "deg)" }}
									>
										<Tooltip overlayClassName="groupinfo-page" title={<div className="item-info">{item.fullName}</div>} color="#fff">
											{item.imageId ? (
												<div className={"item"} style={{ backgroundImage: "url(" + FileService.imageURL(item.imageId, 384) + ")" }} />
											) : (
												<div className={"item"}>
													<i className="fa fa-user-circle" />
												</div>
											)}
										</Tooltip>
									</div>
								) : (
									<div
										className={"circle" + (item.isCompany ? " company" : "")}
										style={{ transform: "translateX(-" + config.itemRadius + "px) rotate(-" + item.deg + "deg)" }}
									></div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	};

	render() {
		return (
			<div className="groupinfo-page">
				<ul className="group-menu">
					<li className="active">Nhóm của bạn</li>
					<li>Nhóm bạn quản lý</li>
					<li>Chat nhóm</li>
				</ul>
				<Row align="middle" justify="center">
					<Col>
						{this.state.group && (
							<div className="groupinfo">
								<div className="group-name">Nhóm {this.state.group.name}</div>
								<div className="group-revenue">TK nhóm: 0</div>
								<div className="group-revenue">Đồng hưởng nhóm: 0</div>
								<div className="top-group">
									<div className="title">Top 03 thu nhập tháng 07/2020</div>
									<table>
										<thead>
											<tr>
												<th>Thành viên</th>
												<th>Thu nhập hiện tại</th>
												<th>Thu nhập nhóm</th>
											</tr>
										</thead>
										<tbody>
											{[1, 2, 3].map((item) => (
												<tr key={item}>
													<td>
														<div className="member">
															<span className="image">
																<i className="fas fa-user-circle" />
															</span>
															<span className="name">Đang cập nhật</span>
														</div>
													</td>
													<td></td>
													<td></td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="group-manager">
									<div className="title">Top 03 quản lý nhóm</div>
									<table>
										<thead>
											<tr>
												<th>Thành viên</th>
												<th>Thu nhập 06/2020</th>
												<th>Thu nhập</th>
											</tr>
										</thead>
										<tbody>
											{[1, 2, 3].map((item) => (
												<tr key={item}>
													<td>
														<div className="member">
															<span className="image">
																<i className="fas fa-user-circle" />
															</span>
															<span className="name">Đang cập nhật</span>
														</div>
													</td>
													<td></td>
													<td></td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</Col>
					<Col>
						<div style={{ overflowX: "auto", overflowY: "hidden", width: "100%", height: 700 }}>
							<div className="groupmember">
								{this.drawCircle(this.state.mainGroup_3)}
								{this.drawCircle(this.state.mainGroup_2)}
								{this.drawCircle(this.state.mainGroup_1)}
							</div>
						</div>
					</Col>
				</Row>
				<div className="group-revenue-history">
					<div className="title">Lịch sử thu nhập nhóm</div>
					<div>Đang cập nhật</div>
				</div>
			</div>
		);
	}
}
