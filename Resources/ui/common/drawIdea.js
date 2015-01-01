function drawIdeaScreen(parent, navigation) {
	Titanium.Painter = require("ti.paint");
	var iphone = false;

	if (PLATFORM == IPHONE) {
		iphone = true;
	}

	var drawWindow = Titanium.UI.createWindow({
		backgroundColor : '#FFF',
		navBarHidden : true,
	});

	var closeButton = Ti.UI.createLabel({
		text : "\uf00d",
		borderRadius : bi.ui.getRadius(30),
		backgroundColor : GRAY,
		width : 30,
		height : 30,
		top : 25,
		left : 20,
		textAlign : "center",
		font : {
			fontSize : '25dp',
			fontFamily : "FontAwesome"
		},
		zIndex : 500
	});

	closeButton.addEventListener("click", function(e) {
		if (parent && parent.cancel) {
			parent.cancel();
		}

		if (PLATFORM == IPHONE) {
			navigation.navWindow.close();
		} else {
			drawWindow.close();
		}

		if(parent) {
			if(parent.fromCommentAttachmentClip) {
				bi.ui.cancelCallback();
			}
		}
	});

	var checkButton = Ti.UI.createLabel({
		text : "\uf00c",
		borderRadius : bi.ui.getRadius(30),
		backgroundColor : GRAY,
		width : 30,
		height : 30,
		top : 25,
		right : 20,
		textAlign : "center",
		font : {
			fontSize : '25dp',
			fontFamily : "FontAwesome"
		},
		zIndex : 500
	});

	checkButton.addEventListener('click', debounce(function(e) {
		attachDrawing();
	}, 500, true));

	drawWindow.add(closeButton);
	drawWindow.add(checkButton);

	//var data = params.data;
	var self = this;
	//this.data = data;

	var drawView = Titanium.UI.createView({
		top : 20,
		backgroundColor : '#FFF',
	});

	function attachDrawing() {
		var drawImage = paintView.toImage();
		
		if(PLATFORM==ANDROID){
		    drawImage = drawImage.media;
		}
		
		drawImage.attachment_type = "drawing";

		flurry.logEvent('Added sketch', {
			affiliate : prop.getString("affiliateName")
		});

		if (parent && parent.callback) {
			if (PLATFORM == IPHONE) {
				navigation.navWindow.close();
			} else {
				drawWindow.close();
			}

			parent.callback(drawImage);
		} else if (parent.fromAddButton) {

			if (parent.setIdeaImage) {

				if (PLATFORM == IPHONE) {
					navigation.navWindow.close();
				} else {
					drawWindow.close();
				}
				bi.ui.setIdeaImage(drawImage, false);
				flurry.logEvent('Draw Screen - Attached as Idea Image', {
					affiliate : prop.getString("affiliateName")
				});
			} else {
				if (PLATFORM == IPHONE) {
					navigation.navWindow.close();
				} else {
					drawWindow.close();
				}
				bi.ui.attachDrawing(drawImage, false);
				flurry.logEvent('Draw Screen - Attached as Idea Attachment', {
					affiliate : prop.getString("affiliateName")
				});
			}
		} else {
			flurry.logEvent('Draw Screen - Idea Created with Drawing', {
				affiliate : prop.getString("affiliateName")
			});

			if (parent.fromChallengeTopic == 1) {
				bi.navigation.open("webstormPostIdea", parent, parent, drawImage);

			} else {
				bi.navigation.open("postIdea", parent, drawImage);
			}
			if (PLATFORM == IPHONE) {
				navigation.navWindow.close();
			} else {
				drawWindow.close();
			}
		}

	}

	var paintView = Titanium.Painter.createPaintView({
		top : 0,
		left : 0,
		right : 0,
		bottom : 0,
		strokeColor : '#000',
		backgroundColor : '#FFF',
		strokeAlpha : 255,
		strokeWidth : 5,
	});

	var toolBarSep = Titanium.UI.createView({
		backgroundColor : "#EFEFEF",
		height : 2,
		bottom : 54,
		width : '95%',
		zIndex : 100
	});

	var drawToolbar = Titanium.UI.createView({
		backgroundColor : "#FFF",
		height : 54,
		bottom : 0,
		width : '100%',
		zIndex : 100
	});

	var colorPicker = Titanium.UI.createView({
		bottom : 0,
		left : 10,
		layout : 'horizontal',
	});

	var colorArray = [];

	colorArray.push({
		hex : '#000',
		image : '/images/drawIdeaImages/picker-black-50x50.png'
	});
	colorArray.push({
		hex : '#FE0201',
		image : '/images/drawIdeaImages/picker-red-50x50.png'
	});
	colorArray.push({
		hex : '#FFD503',
		image : '/images/drawIdeaImages/picker-yellow-50x50.png'
	});
	colorArray.push({
		hex : '#63DB6E',
		image : '/images/drawIdeaImages/picker-green-50x50.png'
	});
	colorArray.push({
		hex : '#062BFE',
		image : '/images/drawIdeaImages/picker-blue-50x50.png'
	});

	drawView.add(toolBarSep);
	drawView.add(drawToolbar);
	drawToolbar.add(colorPicker);

	for ( i = 0; i < colorArray.length; i++) {

		var colorSwitchBtn = Titanium.UI.createView({
			backgroundColor : '#FFF',
			color : colorArray[i].hex,
			borderRadius : 22,
			height : 44,
			width : 44,
			top : 5,
			bottom : 5,
		});

		var colorSwitchImage = Titanium.UI.createImageView({
			image : colorArray[i].image,
			height : 28,
			width : 28,
		});

		colorSwitchBtn.add(colorSwitchImage);

		if (i == 0) {
			colorSwitchBtn.setBackgroundColor('#DFDFDF');
		}

		colorSwitchBtn.addEventListener('click', function(e) {
			var color = this.color;
			paintView.setStrokeColor(color);
			for (i in colorPicker.children) {
				colorPicker.children[i].setBackgroundColor('#FFF');
			}
			this.setBackgroundColor('#DFDFDF');
		});

		colorPicker.add(colorSwitchBtn);
	}

	if (iphone) {
		var undoWrapper = Ti.UI.createView({
			height : 50,
			width : 40,
			right : 45
		});
		var undoIcon = Ti.UI.createLabel({
			text : "\uf0e2",
			color : "#535353",
			font : {
				fontSize : '28dp',
				fontFamily : "FontAwesome"
			}
		});
		undoWrapper.add(undoIcon);
		drawToolbar.add(undoWrapper);

		undoWrapper.addEventListener('click', function(e) {
			paintView.undo();
		});
	}

	var clear_Alert = Titanium.UI.createAlertDialog({
		title : L('are_you_sure'),
		buttonNames : [L('clear_drawing'), L('cancel')],
		cancel : 1
	});

	clear_Alert.addEventListener('click', function(e) {
		switch (e.index) {
			case 0: {
				paintView.clear();
				break;
			}
		}
	});

	var clearWrapper = Ti.UI.createView({
		height : 50,
		width : 40,
		right : 5
	});

	var clearIcon = Ti.UI.createLabel({
		text : "\uf12D",
		color : "#535353",
		font : {
			fontSize : '28dp',
			fontFamily : "FontAwesome"
		}
	});

	clearWrapper.add(clearIcon);
	drawToolbar.add(clearWrapper);

	clearWrapper.addEventListener('click', function(e) {
		clear_Alert.show();
	});

	drawView.add(paintView);
	flurry.logEvent('Draw Screen Viewed', {
		affiliate : prop.getString("affiliateName")
	});
	drawWindow.add(drawView);
	return drawWindow;
}

module.exports = drawIdeaScreen;
