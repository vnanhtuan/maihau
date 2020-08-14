import React, { Component } from "react";
import { Input } from 'antd';

const { Search } = Input;

export default class Searchbox extends Component {
	render() {
		return (
			<div className="searchbox">
				<Search placeholder="Nhập từ cần tìm ..." onSearch={value => console.log(value)} enterButton />
			</div>
		);
	}
}