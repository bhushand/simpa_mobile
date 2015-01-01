bi.ui.createAlertDialogOverlay = function(options) {

	if (PLATFORM != ANDROID) {
		var mode = null;
		var keyboard_focus = null;
	} else {
		var keyboard_focus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		var mode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	}

	var window = Ti.UI.createWindow({
		backgroundColor : "none",
		windowSoftInputMode : mode,
		navBarHidden : true,
		navTintColor : WHITE,
	});

	var view = Ti.UI.createView({
		top : 0
	});
	var overlay = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.5,
	});

	var alertView = Ti.UI.createView({
		width : '85%',
		height : Ti.UI.SIZE,
		borderRadius : BI_BORDER_RADIUS,
		borderColor : BORDER_GRAY,
		backgroundColor : '#FFF',
		opacity : 0.90
	});

	function createLabel(options, parent) {

		var alertLabel = Ti.UI.createLabel({
			text : options.text,
			height : Ti.UI.SIZE,
			top : options.top,
			left : 5,
			right : 5,
			bottom : options.bottom,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : BLACK,
			font : {
				fontSize : options.fontSize,
				fontWeight : options.fontWeight,
			}
		});

		parent.add(alertLabel);

		return alertLabel;
	}

	function alertMessageText(text, parent) {

		function identifyAlertUrl(text) {
			regex = /(https?:\/\/[^\s]+)/g;
			return text.replace(regex, function(url) {
				return ":::" + url + ":::";
			});
		};

		text = identifyAlertUrl(text);

		var arr_text = [];
		arr_text = text.split(":::");

		for (var i = 0, j = arr_text.length; i < j; i++) {
			arr_text[i] = arr_text[i].replace(/ +(?= )/g, '');
			if (arr_text[i] != null && arr_text[i] != '' && arr_text[i] != ' ') {
				var label1 = Titanium.UI.createLabel({
					text : arr_text[i],
					top : 5,
					left : 5,
					right : 5,
					bottom : 5,
					height : Ti.UI.SIZE,
					font : {
						fontSize : 15,
					},
					color : BLACK,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				});
				if (arr_text[i].substring(0, 4) == 'http' || arr_text[i].substring(0, 4) == 'https') {

					label1.color = NIELSEN_BLUE;

					label1.addEventListener('click', function(e) {
						Ti.Platform.openURL(e.source.text);
					});
				}
				parent.add(label1);

			}
		}
	}

	if ( typeof options.message == "string") {

		var tableview = Ti.UI.createTableView({
			separatorColor : 'transparent',
			top : 0,
			height : Ti.UI.SIZE,
			bottom : 55
		});

		var row = Ti.UI.createTableViewRow({
			selectionStyle : 'transparent',
			layout : 'vertical'
		});

		createLabel({
			top : 15,
			text : options.title,
			fontWeight : 'bold',
			fontSize : 18
		}, row);

		alertMessageText(options.message, row);

		tableview.appendRow(row);

		alertView.add(tableview);

	} else {

		var tableview = Ti.UI.createTableView({
			separatorColor : 'transparent',
			top : 0,
			height : Ti.UI.SIZE,
			bottom : 55
		});

		for ( i = 0; i < options.message.length; i++) {
			if (options.message[i].terms) {
				var row = Ti.UI.createTableViewRow({
					selectionStyle : 'transparent',
					layout : 'vertical'
				});

				if (i == 0) {
					createLabel({
						top : 15,
						text : options.title,
						fontWeight : 'bold',
						fontSize : 18
					}, row);
				}

				if (options.message[i].terms.terms_text) {
					createLabel({
						top : 5,
						text : '\n' + options.message[i].name,
						fontWeight : 'bold',
						fontSize : 15
					}, row);

					var terms_text = stripHtmlTags(options.message[i].terms.terms_text);

					alertMessageText('----------------------\n' + terms_text, row);

				}

				tableview.appendRow(row);
			}
		}

		alertView.add(tableview);

	}

	var okButtonView = Ti.UI.createView({
		bottom : 0,
		height : 45,
		backgroundSelectedColor : GRAY
	});

	var hrline = Ti.UI.createView({
		top : 0,
		height : '0.5',
		backgroundColor : GRAY
	});
	okButtonView.add(hrline);
	var okButton = createLabel({
		text : 'OK',
		fontWeight : 'bold',
		fontSize : 16,
	}, okButtonView);
	if (PLATFORM == IPHONE) {
		okButton.color = BLUE_EYES;
	} else {
		okButton.color = BLACK;
	}
	okButtonView.addEventListener('click', function(e) {
	    if(options.callback)
	       options.callback();
		window.close();
	});
	alertView.add(okButtonView);

	view.add(overlay);
	view.add(alertView);

	window.add(view);

	if (PLATFORM != ANDROID)
		window.open();
	else
		window.open({
			modal : true
		});
};
