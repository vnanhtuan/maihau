import * as Const from "../../common/const";

export const FileService = {
	uploadApi: Const.apiURL + "api/file/upload",
	imageURL: (id, size, square) => {
		if (square)
			return Const.apiURL + "api/image/square/" + id + "/" + size;
		else
			return Const.apiURL + "api/image/" + id + "/" + size;
	}
}