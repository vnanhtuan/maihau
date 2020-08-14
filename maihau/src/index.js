import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import * as serviceWorker from './serviceWorker';

import "antd/dist/antd.min.css";
import "./theme/antd.scss";
import "./theme/common.scss";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
ReactDOM.render(
	<BrowserRouter basename={baseUrl}>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
