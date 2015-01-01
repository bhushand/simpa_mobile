bi.utils = {};
bi.utils.addMedia = function(callback, support_format, crop, selectCallback, cancelCallback) {
	//to support all format
	//support_format : ["take_photo", "choose_from_library", "record", "draw"]

	var buttonNames = [];
	var buttonActions = ["take_photo", "choose_from_library", "cancel"];

	if (support_format) {
		buttonActions = support_format.slice(0);
		buttonActions.push("cancel");
	}

	for (var i = 0; i < buttonActions.length; i++) {
		buttonNames.push(L(buttonActions[i]));
	};
	var attachment_Alert = Titanium.UI.createAlertDialog({
		title : L('attach_media'),
		buttonNames : buttonNames,
		cancel : buttonNames.length - 1
	});
	attachment_Alert.show();
	attachment_Alert.addEventListener('click', function(e) {
		switch (buttonActions[e.index]) {
			case "take_photo": {
				if (selectCallback)
					selectCallback();
				bi.utils.showCamera(callback, crop, cancelCallback);
				break;
			}
			case "choose_from_library": {
				if (selectCallback)
					selectCallback();
				bi.utils.chooseFromGallery(callback, crop, cancelCallback);

				break;
			}
			case "record": {

				break;
			}
			case "draw": {
				if (selectCallback)
					selectCallback();
				var parent = {};
				parent.fromAddButton = true;
				parent.fromCommentAttachmentClip = true;
				bi.navigation.open('draw', parent, {
					fromAddButton : true
				});
				bi.ui.cancelCallback = function() {
					cancelCallback();
				};
				bi.ui.attachDrawing = function(drawImage, fromLibrary) {
					callback(drawImage, fromLibrary);
				};
				break;
			}
		}
	});
};

bi.utils.chooseFromGallery = function(callback, crop, cancelCallback) {

	var options = {
		success : function(event) {
			var resizedImage = resizeImage(800, 800, event.media);

			callback(resizedImage, true);
		},
		cancel : function() {
			if (cancelCallback)
				cancelCallback();
		},
		error : function(error) {
			bi.ui.alert("Photo", "Failed to open media");
		},

		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	};

	if (crop == true) {
		options.allowEditing = true;
	} else {
		options.allowEditing = false;
	}
	Titanium.Media.openPhotoGallery(options);
};
bi.utils.showCamera = function(callback, crop, cancelCallback) {
	var options = {
		success : function(event) {
			var resizedImage = resizeImage(800, 800, event.media);

			callback(resizedImage, true);
		},
		cancel : function() {
			if (cancelCallback)
				cancelCallback();
		},
		error : function(error) {
			bi.ui.alert("Camera", "Failed to take picture");
		},
		allowEditing : true,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	};
	if (crop == true) {
		options.allowEditing = true;
	} else {
		options.allowEditing = false;
	}
	Titanium.Media.showCamera(options);
};

bi.utils.delayInput = function(textField, callback, delay) {
	if (!delay)
		delay = 1000;

	var keyword = textField.value;
	if (keyword == "") {
		callback(keyword);
	}
	setTimeout(function() {
		if (textField.value == keyword) {
			callback(keyword);
		}

	}, delay);

};