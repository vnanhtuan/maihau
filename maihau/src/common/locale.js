import * as Const from "./const";

let currentLanguage = window.localStorage.getItem("language");
if (!currentLanguage) {
	currentLanguage = Const.languageDefault;
	window.localStorage.setItem("language", currentLanguage);
}
let languageData = require("./language/" + currentLanguage);

const getFormat = () => {
	switch (currentLanguage) {
		case "vi":
			return {
				language: currentLanguage,
				dateFormat: "D/M/YYYY",
				dateOption: {
					year: "numeric",
					month: "numeric",
					day: "numeric",
				},
				timeFormat: "H:m:s",
				timeOption: {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
				},
				fractionDigits: 2,
				thousandSeparator: ".",
				decimalSeparator: ",",
			};
		default:
			return {
				language: currentLanguage,
				dateFormat: "M/D/YYYY",
				dateOption: {
					year: "numeric",
					month: "numeric",
					day: "numeric",
				},
				timeFormat: "H:m:s",
				timeOption: {
					hour: "numeric",
					minute: "numeric",
				},
				fractionDigits: 2,
				thousandSeparator: ",",
				decimalSeparator: ".",
			};
	}
};

export const Locale = {
	getCurrentLanguage: () => currentLanguage,
	getText: (key) => eval("languageData." + key),
	setCurrentLanguage: (language) => {
		currentLanguage = language;
		window.localStorage.setItem("language", currentLanguage);
	},
	getFormat: () => getFormat(),
};
