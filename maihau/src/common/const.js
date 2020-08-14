export let domainName = "vnanhtuan.com";
export let domainURL = "http://" + domainName;
export let apiURL = "http://maihauapi.vnanhtuan.com/";

if (process.env.NODE_ENV === "development") {
	domainName = "localhost:44399";
	domainURL = "https://" + domainName;
	apiURL = "https://localhost:5001/";
}

export const beRoutePath = "/office";

export const languageDefault = "vi";

export const apiCode = {
	success: 1,
	validation: 2,
	error: 3,
	processing: 4,
};

export const media = {
	largeQuery: "(min-width: 992px)",
	smallQuery: "(max-width: 991px)",
};

export const pageCategory = 4;
export const pageMainMenu = [5];
export const pageSiderMenu = [5];
