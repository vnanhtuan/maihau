import React, { Component } from "react";
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { UserTreeService } from "./userService";

export default class UserTree extends Component {
	state = {
		treeData: null,
	}

	componentDidMount() {
		UserTreeService.init().then(res => {
			if (res.success) {
				const treeData = this.buildNodeList([res.currentUser]);
				treeData[0].children = this.buildNodeList(res.itemList);

				this.setState({ rootKey: res.currentUser.id, treeData: treeData });
			}
		});
	}

	buildNodeList = itemList => {
		return itemList.map(item => {
			return {
				title: item.userName + (item.count ? " (" + item.count + ")" : ""),
				key: item.id,
				isLeaf: item.count === 0,
				icon: <i className="fa fa-user-circle" />
			};
		});
	}

	findTreeNode = (nodeList, key) => {
		for (var i = 0; i < nodeList.length; i++) {
			let node = nodeList[i];
			if (node.key === key)
				return node;
			else if (node.children) {
				node = this.findTreeNode(node.children, key);
				if (node != null)
					return node;
			}
		}

		return null;
	}

	onLoadData = treeNode => {
		return new Promise(resolve => {
			let { treeData } = this.state;

			if (treeNode.children) {
				resolve();
				return;
			}

			const updateNode = this.findTreeNode(treeData, treeNode.key);
			if (updateNode)
				UserTreeService.getList({ parentId: treeNode.key }).then(res => {
					if (res.success) {
						updateNode.children = this.buildNodeList(res);
						this.setState({ treeData: [...treeData] });
					}
				});

			resolve();
		});
	};

	render() {
		return (
			<div className="user-list-page">
				<h1>Member list</h1>
				<div className="box">
					{this.state.treeData &&
						<Tree loadData={this.onLoadData} treeData={this.state.treeData}
							defaultExpandedKeys={[this.state.rootKey]}
							className="user-tree"
							switcherIcon={<DownOutlined />}
							showIcon={true}
							showLine={true}
						/>
					}
				</div>
			</div>
		)
	}
}