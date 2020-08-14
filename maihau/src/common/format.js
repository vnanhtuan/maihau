import { Locale } from "./locale";

const truncate = (value, fractionDigits) => {
	let multiplier = Math.pow(10, fractionDigits),
		adjustedNum = value * multiplier,
		truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

	return truncatedNum / multiplier;
};

const brToTag = (value, tag) => {
	if (!value) return value;

	if (!tag) tag = "div";

	let text = "";
	let textList = value.split("\n");
	for (var i = 0; i < textList.length; i++) {
		text += "<" + tag + ">" + textList[i] + "</" + tag + ">";
	}

	return text;
};

export const Format = {
	truncate: truncate,
	number: (value, fractionDigits) => {
		if (value == null) return "";

		const format = Locale.getFormat();

		if (fractionDigits == null) fractionDigits = format.fractionDigits;

		value = truncate(value, fractionDigits);

		let text = new Intl.NumberFormat(format.language, {
			maximumFractionDigits: fractionDigits,
		}).format(value);

		return text;
	},
	coinNumber: (value) => {
		return Format.number(value, 8);
	},
	date: (value) => {
		if (value == null) return "";

		const format = Locale.getFormat();

		let text = new Intl.DateTimeFormat(
			format.language,
			format.dateOption
		).format(value);

		return text;
	},
	time: (value) => {
		if (value == null) return "";

		const format = Locale.getFormat();

		let text = new Intl.DateTimeFormat("en", format.timeOption).format(value);

		return text;
	},
	brToTag: brToTag,
};
