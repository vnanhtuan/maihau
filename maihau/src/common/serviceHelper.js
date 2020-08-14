import * as Const from "./const";

export const tokenSet = token => {
	localStorage.setItem('token', token);
}

export const tokenGet = () => {
	return localStorage.getItem('token');
}

export const tokenRemove = () => {
	return localStorage.removeItem('token');
}

export const post = async (endpoint, param) => {
	let token = tokenGet();

	let headers = {
		"Content-Type": "application/json"
	};
	if (token)
		headers.authorization = "Bearer " + token;

	let response;
	try {
		const res = await fetch(Const.apiURL + endpoint, {
			method: 'POST',
			body: JSON.stringify(param),
			crossDomain: true,
			headers: headers,
		});
		response = await responseProcess(res);
	} catch (error) {
		response = { error: true, statusText: error };
		console.log(response.statusText);
	}

	return response;
}

export const get = async (endpoint, param) => {
	let token = tokenGet();

	let headers = {};
	if (token)
		headers.authorization = "Bearer " + token;

	let query = "";
	for (const key in param)
		if (param[key] != null) {
			if (Array.isArray(param[key])) {
				for (var i = 0; i < param[key].length; i++) {
					query += key + "=" + encodeURIComponent(param[key][i]) + "&";
				}
			} else
				query += key + "=" + encodeURIComponent(param[key]) + "&";
		}
	if (query)
		endpoint += "?" + query.substring(0, query.length - 1);

	let response;
	try {
		const res = await fetch(Const.apiURL + endpoint, {
			method: 'GET',
			crossDomain: true,
			headers: headers,
		});
		response = await responseProcess(res);
	} catch (error) {
		response = { error: true, statusText: error };
		console.log(response.statusText);
	}

	return response;
}

const responseProcess = async response => {
	switch (response.status) {
		case 200: {
			if (response.headers.get("content-type").indexOf("application/json") !== -1) {
				const responseJson = await response.json();
				switch (responseJson.code) {
					case Const.apiCode.success:
						responseJson.success = true;
						break;
					case Const.apiCode.validation:
						responseJson.validation = true;
						break;
					case Const.apiCode.error:
						responseJson.error = true;
						break;
					case Const.apiCode.processing:
						responseJson.processing = true;
						break;
					default:
						responseJson.success = true;
						break;
				}
				return responseJson;
			} else
				return response;
		}
		case 401:
			tokenRemove();
			response.unauthorized = true;
			response.error = true;
			window.location = "/login";
			return response;
		default:
			response.error = true;
			console.log(response.statusText);
			return response;
	}
}