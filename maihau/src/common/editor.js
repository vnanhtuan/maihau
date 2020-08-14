import React, { Component } from "react";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";

export default class Editor extends Component {
	render() {
		return (
			<TinyEditor
				value={this.props.value}
				init={{
					height: 600,
					plugins: [
						"advlist autolink lists link image charmap print preview anchor",
						"searchreplace visualblocks code fullscreen",
						"insertdatetime media table paste code help wordcount hr textcolor",
					],
					toolbar:
						"formatselect fontsizeselect | bold italic underline strikethrough forecolor backcolor | image media link unlink | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code",
					toolbar_mode: "wap",
					file_picker_callback: (callback, value, meta) => {
						this.props.filePicker(callback);
					},
				}}
				onEditorChange={(value) => this.props.onChange(value)}
			/>
		);
	}
}
