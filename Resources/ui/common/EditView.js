function EditView(parent, params) {

	var data = params.data;
	var self = this;
	this.data = data;

	var editView = Titanium.UI.createScrollView({
		contentWidth : Titanium.UI.FILL,
		layout : 'vertical',
		backgroundColor : BACKGROUND_GRAY,

	});

	var table_index = 0;
	for (var key in data) {
		var top = 10;
		if (table_index == 0) {
			top = 20;
		}

		var key_label = Ti.UI.createLabel({
			text : key,
			color : '#000000',
			height : Ti.UI.SIZE,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			width : Titanium.UI.FILL,
			left : '10dp',
			top : '20dp',
			right : '10dp',
			font : {
				fontSize : '18dp',
				fontFamily : 'Helvetica Neue'
			}
		});
		editView.add(key_label);

		for (var i = 0; i < data[key].length; i++) {
			var data_item = data[key][i];

			if ( typeof data_item.editable != "undefined" && !data_item.editable)
				continue;

			var data_label_text = data_item.data;
			var data_text = null;
			if (data_label_text && data_label_text.trim() != "") {
				data_text = data_label_text;
			}

			if ( typeof data_item.type == "undefined" || data_item.type == "Short_text") {
				var editField = Titanium.UI.createTextField({
					value : data_text,
					hintText : data_item.title,
					backgroundImage : 'none',
					backgroundColor : 'white',
					width : Ti.UI.FILL,
					top : 5,
					left : 10,
					right : 10,
					height : 50,
					paddingLeft : 15,
					data_key : key,
					data_index : i,
					color : "#000",
					borderRadius : BI_BORDER_RADIUS,
					font : {
						fontSize : '14dp',
						fontFamily : 'Helvetica Neue'
					},
					keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
				});
			} else {
				var editField = Titanium.UI.createTextArea({
					value : data_text,
					hintText : data_item.title,
					backgroundImage : 'none',
					backgroundColor : 'white',
					width : Ti.UI.FILL,
					top : 5,
					left : 10,
					right : 10,
					height : 150,
					paddingLeft : 15,
					suppressReturn : false,
					data_key : key,
					data_index : i,
					color : "#000",
					borderRadius : BI_BORDER_RADIUS,
					font : {
						fontSize : '14dp',
						fontFamily : 'Helvetica Neue'
					},
					keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
				});
			}

			editView.add(editField);
			editField.addEventListener("change", function(e) {

				self.data[this.data_key][this.data_index].data = this.value;
			});

		}

		table_index++;

	}

	var saveButton = Titanium.UI.createButton({
		title : 'Save',
		color : '#FFF',
		backgroundColor : NIELSEN_BLUE,
		backgroundImage : 'none',
		backgroundSelectedColor : NIELSEN_DARK_BLUE,
		backgroundFocusedColor : NIELSEN_DARK_BLUE,
		borderColor : NIELSEN_DARK_BLUE,
		borderWidth : '.5',
		width : '95%',
		height : '40dp',
		top : '20dp',
		borderRadius : BI_BORDER_RADIUS,
	});
	editView.add(saveButton);

	saveButton.addEventListener("click", function(e) {
		saveButton.backgroundColor = NIELSEN_DARK_BLUE;
		saveButton.enabled = false;
		params.callback(data);
	});

	return editView;
}

module.exports = EditView;
