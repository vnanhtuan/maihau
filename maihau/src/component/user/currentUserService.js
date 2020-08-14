import { Subject } from "rxjs";

import * as Service from "../../common/serviceHelper";

const subject = new Subject();
let currentUser = null;

export const CurrentUserService = {
	checkUser: async () => {
		var token = Service.tokenGet();

		if (!token)
			currentUser = null;
		else {
			const res = await Service.get("api/user/currentuser/check");
			if (res.success && res.data != null)
				currentUser = res.data;
			else {
				currentUser = null;
				if (res.unauthorized)
					window.location = "/login";
			}
			
			subject.next(currentUser);
		}

		return currentUser;
	},
	getUser: () => currentUser,
	setUser: user => {
		currentUser = user;
		subject.next(currentUser);
	},
	getObservable: () => subject.asObservable(),
}