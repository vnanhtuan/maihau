import React, { Component } from "react";
import { Tree } from "antd";

export class TreeView extends Component {
	constructor(props) {
		super(props);

		const { treeData } = this.props;

		this.state = {
			keyword: "",
			expandedKeys: [],
			autoExpandParent: true,
			treeRendered: null,
			dataList: [],
		};
	}

	componentDidMount() {
		const { treeData } = this.props;
		this.init(treeData);
	}

	shouldComponentUpdate(nextProps) {
		const { searchText, treeData } = nextProps;
		const { dataList } = this.state;

		if (this.props.searchText !== searchText) {
			const expandedKeys = dataList
				.map((item) => {
					if (item.title.indexOf(searchText.toLowerCase()) > -1) {
						return this.getParentKey(item.key, this.props.treeData);
					}
					return null;
				})
				.filter((item, i, self) => item && self.indexOf(item) === i);
			this.setState({
				expandedKeys,
				keyword: searchText,
				autoExpandParent: true,
			});
		}

		if (this.props.treeData !== treeData) {
			this.init(treeData);
		}

		return true;
	}

	init = (treeData) => {
		const treeRendered = treeData;
		let dataList = [];
		dataList = this.generateList(treeData, dataList);
		this.setState({
			treeRendered: treeRendered,
			dataList: dataList,
		});
	};

	loopFindKeywordAndFillColor = (data, keyword = "") => {
		var treeRender = data.map((item) => {
			const index = item.title.indexOf(keyword);
			const beforeStr = item.title.substr(0, index);
			const afterStr = item.title.substr(index + keyword.length);
			const title =
				index > -1 ? (
					<span>
						{beforeStr}
						<span
							style={{ color: "red" }}
							className="site-tree-search-value"
						>
							{keyword}
						</span>
						{afterStr}
					</span>
				) : (
					<span>{item.title}</span>
				);
			if (item.children) {
				return {
					title,
					key: item.key,
					value: item.value,
					children: this.loopFindKeyword(item.children, keyword),
				};
			}

			return {
				title,
				key: item.key,
				value: item.value,
			};
		});

		return treeRender;
	};

	generateList = (data, dataList) => {
		for (let i = 0; i < data.length; i++) {
			const node = data[i];
			const { key, title } = node;
			dataList.push({ key, title: title.toLowerCase() });
			if (node.children) {
				this.generateList(node.children, dataList);
			}
		}
		return dataList;
	};

	getParentKey = (key, tree) => {
		let parentKey;
		for (let i = 0; i < tree.length; i++) {
			const node = tree[i];
			if (node.children) {
				if (node.children.some((item) => item.key === key)) {
					parentKey = node.key;
				} else if (this.getParentKey(key, node.children)) {
					parentKey = this.getParentKey(key, node.children);
				}
			}
		}
		return parentKey;
	};

	onExpand = (expandedKeys) => {
		this.setState({
			expandedKeys,
			autoExpandParent: false,
		});
	};

	render() {
		const { ...attrs } = this.props;
		const { treeRendered } = this.state;
		return (
			<Tree
				{...attrs}
				onExpand={this.onExpand}
				treeData={treeRendered}
				expandedKeys={this.state.expandedKeys}
				autoExpandParent={this.state.autoExpandParent}
			/>
		);
	}
}
