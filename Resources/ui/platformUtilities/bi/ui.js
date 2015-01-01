bi.ui = {};

bi.ui.loadingWindow = function(options) {

	var defaults = {
		currentWindow : null,
		maxTime : 2000, 
		complete : function() {}
	};

	var o = extend(defaults, options);

	var currentWindow = o.currentWindow;

	if(PLATFORM == IPHONE) {
		var loadingWindow = Ti.UI.createWindow({
			tabBarHidden : true,
			navBarHidden : false,
			zIndex : 200
		});
	} else {
		var loadingWindow = Ti.UI.createView({
			zIndex : 200
		});
	}

	var whiteOverlay = Ti.UI.createView({
		top : 64,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		backgroundColor : NAV_BAR_COLOR,
		opacity : 1
	});

    if (PLATFORM == IPHONE) {
        var ios_ver = Titanium.Platform.version.split(".");
        if (ios_ver[0] < 7) { 
            whiteOverlay.top = 44;
            }
    }else{
        whiteOverlay.top = 44;
    }

	//Put in wrapper in case spinner was necessary
	var overlayContentWrapper = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		top : 100,
		layout : 'vertical'
	});

	if(PLATFORM == IPHONE) {
		var lightBulbWrapper = Ti.UI.createView({
			width : 74,
			height : 104
		});

		var lightBulb = Ti.UI.createMaskedImage({
			mask : '/images/other/lightbulb.png',
			tint : NAV_BAR_TEXT_COLOR,
			mode : Ti.UI.iOS.BLEND_MODE_SOURCE_IN
		});

		lightBulbWrapper.add(lightBulb);
	} else {
		var lightBulbWrapper = Ti.UI.createImageView({
			image : '/images/other/lightbulb.png',
			weight: 74,
			height : 104
		});
	}

 	var spinner = Titanium.UI.createActivityIndicator({
   		top : 20
   	});

   	if (PLATFORM == IPHONE) {
  		spinner.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
   	} else {
   		spinner.style = Ti.UI.ActivityIndicatorStyle.PLAIN;
  	}
  
  	this.spinner = spinner;
	
	overlayContentWrapper.add(lightBulbWrapper);
	overlayContentWrapper.add(spinner);

	whiteOverlay.add(overlayContentWrapper);

	loadingWindow.add(whiteOverlay);

	if(PLATFORM == IPHONE) {
		loadingWindow.open();
	} else {
		currentWindow.add(loadingWindow);
	}

	this.spinner.show();

	loadingWindow.done = function() {
		bi.ui.fade({element:whiteOverlay, opacity : 0, duration : 200});
		setTimeout(function() {
			spinner.hide();

			if(PLATFORM == IPHONE) {
				loadingWindow.close();
			} else {
				currentWindow.remove(loadingWindow);
			}

			o.complete.call(this);
			
		}, 200);
	};

	//right now this is based off idea image being loaded since that generally takes the longest, built this way as we may need to check if other elements on page are loaded as well
	var loadingInterval = setInterval(function() {
		checkIfLoaded();
	}, 100), loadingTime = 0; 

	function checkIfLoaded()
	{
		loadingTime += 100;
		if(currentWindow.ideaImageLoaded && currentWindow.scrolledToComment) {
			loadingWindow.done();
			clearInterval(loadingInterval);
		} else if (loadingTime > o.maxTime){
			loadingWindow.done();
			clearInterval(loadingInterval);
		} else {
			return;
		}
	}		
};

bi.ui.getProfilePhoto = function(options) {
	
	var defaults = {
		anonymous : false, 
		photoUrl : undefined, 
		screenName : undefined,
		wrapperSize : 40, //Used for height, width, and radius
		photoSize : 40, //Increase to zoom in on photo
		border : true,
		wrapperTop : undefined,
		wrapperLeft : undefined,
		wrapperRight : undefined,
		wrapperBottom : undefined,
		fontSize : 16, //Used when first letter is used in place of missing photo
		touchEnabled : true //Only used if passing touchEnabled as false (was needed for advanced user tagging)
	};

	var o = extend(defaults, options);

	var profilePhotoUrl;
	
	if (o.anonymous || screenName == "Anonymous") {
		profilePhotoUrl = '/images/navigationImages/defaultProfilePic.png';
	} else if (o.photoUrl) {
		profilePhotoUrl = bi.sdk.get_link(o.photoUrl);
	}

	var wrapperSizeWithBorder = o.wrapperSize+3; //border from profilePhotoWrapper

	var profilePhotoContainer = Ti.UI.createView({
		height : wrapperSizeWithBorder,
		width : wrapperSizeWithBorder,
		borderRadius : getCircularBorder(wrapperSizeWithBorder)
	});

	if (o.border) {
		profilePhotoContainer.borderWidth = 1;
		profilePhotoContainer.borderColor = TAG_BACK;
	}

	//I would prefer to keep this function agnostic to the layout but because of inconsistent layout across pages this is used allowing the passage of layout props
	if (o.wrapperTop != undefined) { profilePhotoContainer.top = o.wrapperTop; } 
	if (o.wrapperLeft != undefined) { profilePhotoContainer.left = o.wrapperLeft; }
	if (o.wrapperRight != undefined) { profilePhotoContainer.right = o.wrapperRight; }
	if (o.wrapperBottom != undefined) { profilePhotoContainer.bottom = o.wrapperBottom; }

	var profilePhotoWrapper = Ti.UI.createView({
		backgroundColor : BACKGROUND_GRAY,
		borderWidth : 3,
		borderColor : WHITE,
		height : o.wrapperSize,
		width : o.wrapperSize,
		externalClick : 1,
		borderRadius : getCircularBorder(o.wrapperSize)
	});

	//If anonymous use default picture, otherwise if photo exists for user use that, if not use first letter of screen name
	if (o.anonymous || o.photoUrl) {
		var profilePhoto = Titanium.UI.createImageView({
			image : profilePhotoUrl,
			height : o.photoSize,
			width : o.photoSize,
			touchEnabled : false
		});

		profilePhotoWrapper.add(profilePhoto);
	} else {
		//Grab first letter of screen name, force upper case
		var screenName = 'Bhushan',
			firstLetter = screenName.substring(0, 1).toUpperCase();

		var firstLetterLabel = Ti.UI.createLabel({
			text : firstLetter,
			color : SUBMITTER_LETTER,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			font : {
				fontSize : o.fontSize,
				fontWeight : 'bold',
				fontFamily : 'Helvetica Neue'
			},
			touchEnabled : false
		});

		profilePhotoWrapper.add(firstLetterLabel);
	}

	if(o.touchEnabled == false) {
		profilePhotoWrapper.touchEnabled = false;
		profilePhotoContainer.touchEnabled = false;
	}

	profilePhotoContainer.add(profilePhotoWrapper);

	return profilePhotoContainer;

};

bi.ui.headerBar = function(options) {
	//SECTION HEADER
	var defaults = {
		title : undefined,
		type : undefined,
		icon : undefined, 
		count : undefined, 
		rightLabel: undefined, 
		rightLabelColor : '#05B2FE', 
		rightLabelClick : function(){}
	};

	var o = extend(defaults, options), element = o.element;
	
	if (options) {
		var headerBar = Titanium.UI.createView({
			backgroundColor : HEADER_BACK,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			container : 'headerBar'
		});

		var headerBarLeft = Titanium.UI.createView({
			width : '60%',
			left : 0,
			height : Ti.UI.SIZE,
			layout : 'horizontal'
		});

		if (o.icon == 'blogicon') {
			var headerBarIcon = Ti.UI.createImageView({
				left : 8,
				image : '/images/other/blogicon.png',
				height : 16,
			    width : 16,
			});

			headerBarLeft.add(headerBarIcon);

		} else if (o.icon) {	
			var headerBarIcon = Titanium.UI.createLabel({
				left : 8,
				text : o.icon,
				color : GRAY,
				height : Ti.UI.SIZE,
				font : {
					fontSize : 14,
					fontFamily : "FontAwesome"
				}
			});

			headerBarLeft.add(headerBarIcon);
		}

		if (o.title) {
			var headerBarLabel = Titanium.UI.createLabel({
				top : 6,
				bottom : 6,
				text : o.title,
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				left : 3,
				font : {
					fontSize : '15dp',
					fontWeight : 'bold',
					fontFamily : 'Helvetica Neue'
				}
			});

			if(!o.icon) {
				headerBarLabel.left = 12;
			}

			headerBarLeft.add(headerBarLabel);
		}

		if (o.count) {

			var count = 0;
			if(o.count != true || o.count == 1) {
				count = o.count;
			}

			var headerBarNumberLabel = Titanium.UI.createLabel({
				top : 5,
				bottom : 5,
				color : GRAY,
				text : '(' + count + ')',
				left : 3,
				height : 20,
				width : Titanium.UI.SIZE,
				font : {
					fontSize : '15dp',
					fontWeight : 'bold',
					fontFamily : 'Helvetica Neue'
				}
			});

			headerBarLeft.add(headerBarNumberLabel);

			if(o.type == 'campaign') {
				bi.ui.updateChallengeCountOnheader = function(count) {
					if(count == 'removeOne') {
						var currentLabel = headerBarNumberLabel.text,
							currentCount = currentLabel.substring(1,currentLabel.length-1),
							newCount = parseInt(currentCount) - 1;

						headerBarNumberLabel.text = '(' + newCount + ')';
					} else {
						headerBarNumberLabel.text = '(' + count + ')';
					}
				};
			} else if (o.type == 'idea') {
				bi.ui.updateIdeaCountOnheader = function(count) {
					if(count == 'removeOne') {
						var currentLabel = headerBarNumberLabel.text,
							currentCount = currentLabel.substring(1,currentLabel.length-1),
							newCount = parseInt(currentCount) - 1;

						headerBarNumberLabel.text = '(' + newCount + ')';
					} else {
						var ideaCount = count;

						if(!ideaCount) {
							ideaCount = bi.ui.currentIdeaCount;
						}

						headerBarNumberLabel.text = '(' + ideaCount + ')';
					}
				};
			} else if (o.type == 'member') {
				bi.ui.updateUserCountOnheader = function(count) {
					if(count == 'removeOne') {
						var currentLabel = headerBarNumberLabel.text,
							currentCount = parseInt(currentLabel.substring(1,currentLabel.length-1)),
							newCount = parseInt(currentCount) - 1;

						headerBarNumberLabel.text = '(' + newCount + ')';
					} else {
						headerBarNumberLabel.text = '(' + count + ')';
					}
				};
			} else if (o.type == 'tag') {
				bi.ui.updateTagCountOnheader = function(count) {
					var currentLabel = headerBarNumberLabel.text,
						currentCount = parseInt(currentLabel.substring(1,currentLabel.length-1));

					if(count == 'removeOne') {
						var newCount = parseInt(currentCount) - 1;

						headerBarNumberLabel.text = '(' + newCount + ')';
					} else if(count == 'addOne') {
						var newCount = parseInt(currentCount) + 1;

						headerBarNumberLabel.text = '(' + newCount + ')';
					} else {
						headerBarNumberLabel.text = '(' + count + ')';
					}
				};
			}		
		}

		if(o.rightLabel) {
			var headerBarRight = Titanium.UI.createView({
				width : '30%',
				right : 0,
				height : Ti.UI.SIZE
			});

			var headerBarRightLabel = Ti.UI.createLabel({
				text : o.rightLabel,
				color : o.rightLabelColor,
				width : Titanium.UI.SIZE,
				height : Titanium.UI.SIZE,
				right : 8,
				font : {
					fontSize : '14dp',
					fontFamily : 'Helvetica Neue'
				}
			});

			headerBarRight.add(headerBarRightLabel);

			if(o.rightLabelClick) {
				headerBarRight.addEventListener('click', debounce(function(e) {
					o.rightLabelClick;
				}, 500, true));
			}

			headerBar.add(headerBarRight);
		} else {
			headerBarLeft.width = Ti.UI.FILL;
		}

		headerBar.add(headerBarLeft);

		return headerBar;
	
	} else {
		return;
	}
};

bi.ui.challengeInfoBar = function(name, id, parentWindow, fromPostIdea, fromIdeaList) {

	var challengeInfoView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : 80,
		backgroundImage : '/images/other/challengeSmallGradient.png',
	});

	if(PLATFORM == ANDROID && fromIdeaList) {
		challengeInfoView.top = 40;
	}

	var challengeHome = Titanium.UI.createLabel({
		text : bi.label.format('Go to Challenge Home',['Challenge']),
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : LINK_COLOR,
		left : 8,
		top : 8,
		font : {
			fontSize : '12dp',
			fontFamily : 'Helvetica Neue'
		}
	});

	var campaignName = truncateString(45, name);

	var challengeName = Titanium.UI.createLabel({
		text : campaignName,
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		color : '#FFF',
		left : 10,
		font : {
			fontSize : '24dp',
			fontFamily : 'Helvetica Neue',
			fontWeight : 'bold'
		},
		shadowColor : '#000',
		shadowRadius : 1,
		shadowOffset : {
			x : 1,
			y : 1
		},
		verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});

	//challengeInfoView.add(challengeHome);
	challengeInfoView.add(challengeName);

	if (!name) {
		//load the campaign dynamtically
		bi.sdk.get("campaign/" + id, function(data) {
			challengeName.text = data.campaign.name;
		});
	}

	challengeInfoView.addEventListener('click', function(e) {
		if(fromPostIdea) {
			bi.navigation.open("challengeTopic", parentWindow, id);
		} else {
			parentWindow.close();
		}
	});

return challengeInfoView;

};

bi.ui.blackOverlay = function() {

	var window = Ti.UI.createWindow({
		backgroundColor : "transparent",
		navBarHidden : true,
		navTintColor : WHITE,
	});
	var view = Ti.UI.createView({
		top : 0,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL
	});
	var overlay = Ti.UI.createView({
		backgroundColor : 'black',
	});
	if (PLATFORM == IPHONE)
		overlay.opacity = 0.5;
	else
		overlay.opacity = 0.0;

	bi.ui.spinner = bi.ui.getSpinner();

	view.add(overlay);
	view.add(bi.ui.spinner);
	window.add(view);

	if (PLATFORM != ANDROID)
		window.open();
	else
		window.open({
			modal : true
		});

	return window;
};

bi.ui.getSpinner = function() {

	var spinner = Titanium.UI.createActivityIndicator();

	if (PLATFORM == IPHONE)
		spinner.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
	else
		spinner.style = Titanium.UI.ActivityIndicatorStyle.BIG;

	return spinner;
};

bi.ui.getRadius = function(width) {
	if (PLATFORM != ANDROID) {
		return width / 2;
	} else {
		return width;
	}
};

bi.ui.emptyStates = function(parent, data) {

	var emptyStatesContainer = Ti.UI.createView({
		backgroundColor : WHITE,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		top : 0
	});
	if (data.icon != null) {
		var emptyStatesImage = Titanium.UI.createLabel({
			text : data.icon,
			color : BORDER_GRAY,
			font : {
				fontSize : '50dp',
				fontFamily : 'FontAwesome'
			},
			top : '100dp',
			height : '50dp'
		});
		emptyStatesContainer.add(emptyStatesImage);
	}

	var emptyStatesLabel = Ti.UI.createLabel({
		top : '160dp',
		text : data.text,
		color : DARK_GRAY_COLOR,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : '15dp',
			fontFamily : 'Helvetica Neue'
		}
	});
	if (data.icon == null) {
		emptyStatesLabel.top = '100dp';

	}
	emptyStatesContainer.add(emptyStatesLabel);

	parent.add(emptyStatesContainer);
	
	return emptyStatesContainer;
};
bi.ui.actionBar = function(title, screen, view, options, callback) {
	if (PLATFORM != ANDROID)
		return;
	screen.navBarHidden = true;
	var actionBar = Ti.UI.createView({
		top : 0,
		height : "44dp",
		backgroundColor : NAV_BAR_COLOR
	});

	var menuButtonWrapper = Ti.UI.createView({
		top : 0,
		left : 0,
		width : '60dp',
		height : "44dp",
	});

	bi.ui.leftNavButtonWrapper = menuButtonWrapper;

	if (options && options.left) {
		menuButtonWrapper.width = 80;
		var menuLabel = Ti.UI.createLabel({
			text : options.left,
			color : NAV_BAR_TEXT_COLOR,
			font : {
				fontSize : "16dp",
			},
			left : 5
		});
	} else {
		var menuLabel = Ti.UI.createLabel({
			text : "\uf053",
			color : NAV_BAR_TEXT_COLOR,
			font : {
				fontSize : '25dp',
				fontFamily : "FontAwesome"
			}
		});
	}

	bi.ui.leftNavButton = menuLabel;

	menuButtonWrapper.add(menuLabel);
	menuButtonWrapper.addEventListener("click", function() {
		if (options && options.left_action)
			options.left_action();
		else
			screen.close();
	});

	var centerLabel = Ti.UI.createLabel({
		text : title,
		font : {
			fontSize : "16dp",
			fontWeight : "bold"
		},
		color : NAV_BAR_TEXT_COLOR
	});
	actionBar.add(menuButtonWrapper);
	actionBar.add(centerLabel);
	if (callback) {
		centerLabel.addEventListener('click', function() {
			callback();
		});
	}
	if (options && options.right) {
		var rightLabel = Ti.UI.createLabel({
			text : options.right,
			color : NAV_BAR_TEXT_COLOR,
			font : {
				fontSize : "16dp",
			},
			right : 5
		});

		rightLabel.addEventListener("click", function(e) {
			options.right_action();
		});

		actionBar.add(rightLabel);
	}

	if (view)
		view.add(actionBar);
	else
		screen.add(actionBar);

	if (PLATFORM == ANDROID)
		return actionBar;
};
bi.ui.addGlobeIcon = function(win, callback, clearGlobeQueue, params) {

	var rightNavView = Ti.UI.createView({
		height : 40,
		width : 40,
		right : 0,
		backgroundColor : 'transparent',
		visible : true, //Set this visible false if you need to remove the whole globe icon.
		borderRadius : 3,
	});

	if (PLATFORM == ANDROID)
		rightNavView.right = 10;

	var globeIcon = Ti.UI.createLabel({
		text : "\uf0ac",
		color : NAV_BAR_TEXT_COLOR,
		right : 4,
		font : {
			fontSize : '30dp',
			fontFamily : "FontAwesome"
		}
	});

	rightNavView.add(globeIcon);

	//Red View Start
	var notificationCount = Ti.UI.createView({
		height : '20dp',
		right : 0,
		top : '0dp',
		backgroundColor : '#f23d1f',
		visible : false,
		borderRadius : 9,
		width : Ti.UI.SIZE,
	});

	if (PLATFORM == ANDROID)
		notificationCount.borderRadius = 18;

	var notificationCountLabel = Ti.UI.createLabel({
		color : 'white',
		width : Ti.UI.SIZE,
		left : 5,
		right : 5,
		textAlign : "center",
		font : {
			fontSize : '11dp',
			fontWeight : 'bold',
			fontFamily : 'Helvetica Neue'
		}
	});

	if (PLATFORM == ANDROID) {
		notificationCountLabel.left = 6;
		notificationCountLabel.right = 6;
	}

	if (bi.notification.notificationCount) {
		notificationCountLabel.text = bi.notification.notificationCount;
		notificationCount.visible = true;
	}

	notificationCount.add(notificationCountLabel);
	rightNavView.add(notificationCount);

	rightNavView.update = function(e) {
		count = bi.notification.notificationCount;
		if (PLATFORM != ANDROID) {
			Titanium.UI.iPhone.appBadge = bi.notification.notificationCount;
		}
		if (count > 0) {

			notificationCount.visible = true;

			if (count <= 99) {
				notificationCountLabel.text = count;
			} else {
				notificationCountLabel.text = '99+';
			}
		} else {
			notificationCount.visible = false;
		}

	};

	rightNavView.addEventListener('click', debounce(function(e) {
		if (!callback) {
			if(params && params.ideaView) {
				bi.navigation.open("NotificationScreen", null);
			} else {
				bi.navigation.open("NotificationScreen", win);
			}
		} else {
			//If notification globe is clicked in Notification window.
			callback();
		}
	}, 500, true));

	if (PLATFORM == IPHONE)
		win.setRightNavButton(rightNavView);
	else
		win.add(rightNavView);

	if (clearGlobeQueue)
		bi.notification.globe = {};

	//generate ID to identify this globe for deregistration
	var timestamp = Date.now();
	rightNavView.id = timestamp;
	//register to global
	bi.notification.globe[timestamp] = rightNavView;

	return rightNavView;
};

//deregister is necessary to avoid memory leak!
bi.ui.deregisterGlobeIcon = function(rightNavView) {
	delete bi.notification.globe[rightNavView.id];
};

bi.ui.alert = function(title, body) {
	var alert = Titanium.UI.createAlertDialog({
		title : title,
		buttonNames : ['OK']
	});
	alert.setMessage(body);
	alert.show();
};

function getUpdatedMemberImage() {
	bi.sdk.get("member/me", null, function(data) {
		bi.member = data.member;
	});
}

function memberImage(member) {
	var image = '/images/navigationImages/defaultProfilePic.png';
	if (member.image) {
		image = member.image;
	} else if (bi.member.photo_url) {
		image = bi.sdk.get_link(member.photo_url);
	}
	return image;
}

bi.ui.getMemberImage = function(options) {
	getUpdatedMemberImage();
	var image = memberImage(bi.member);
	options.image = image;
	var profileImage = Ti.UI.createImageView(options);
	Ti.App.addEventListener('profileChanged', function(e) {
		getUpdatedMemberImage();
		profileImage.image = memberImage(bi.member);
	});
	return profileImage;
};

bi.ui.termsPage = function(callback) {
    var WhiteWindow = Ti.UI.createWindow({
        backgroundColor : WHITE,
        navBarHidden : true,
        translucent : false
    });
    WhiteWindow.open();
    bi.sdk.get("affiliate/this",{}, function(data){
       var terms = data.affiliate.terms_and_condition;
       if(!terms || terms.accepted){
           callback();
           WhiteWindow.close();
           return;
       }
       
       var TermsScreen = require('/ui/common/TermsScreen');
       new TermsScreen(callback, terms,WhiteWindow);
    }, function(e){
        bi.ui.createAlertDialogOverlay({
            title : 'Terms of Service',
            message : "Failed to accept terms. Please try again."
        });
    });
    
};

bi.ui.landingPage = function() {
	var MemberLandingScreen = require('/ui/common/MemberLandingScreen');
	new MemberLandingScreen();
};

bi.ui.logout = function(callback,prepareLogin) {
	bi.sdk.clear_session();
	
	prop.setBool("terms",null);

	Ti.App.Cache.delAll();

	//reset notification
	if (prop.getString("deviceId")) {
		bi.sdk.call("mobileDevice/" + prop.getString("deviceId"), "DELETE", {}, function(data) {
			prop.setString("deviceId", null);
		}, function(e) {
			prop.setString("deviceId", null);
		});
	}

	if(prepareLogin){
		prepareLogin();	
	}

	var LoginScreen = require("/ui/login/LoginScreen");
	var loginScreen = new LoginScreen();
	loginScreen.start(function() {
		bi.ui.landingPage();
	}, true);

	if (callback)
		callback();

};
bi.ui.createOptionDialogOverlay = function(options, callback) {

	if (PLATFORM != ANDROID) {
		var mode = null;
		var keyboard_focus = null;
	} else {
		var keyboard_focus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		var mode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	}

	var window = Ti.UI.createWindow({
		backgroundColor : "transparent",
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
	overlay.addEventListener("click", function(e) {
		window.close();
	});

	var optionDialogtableView = Ti.UI.createTableView({
		height : Ti.UI.SIZE,
		left : 5,
		right : 5,
		bottom : 5,
		borderRadius : BI_BORDER_RADIUS,
		backgroundColor : '#FFF',
		minRowHeight : 40,
	});
	function createRow(text, color, fontWeight) {
		var row = Ti.UI.createTableViewRow();

		var optionLabel = Ti.UI.createLabel({
			text : text,
			height : Ti.UI.SIZE,
			top : 5,
			left : 5,
			right : 5,
			bottom : 5,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : color,
			font : {
				fontSize : '18dp',
				fontWeight : fontWeight,
				fontFamily : 'Helvetica Neue'
			}
		});
		row.add(optionLabel);

		optionDialogtableView.appendRow(row);
	}

	createRow('Select Option', DARK_GRAY_COLOR, 'normal');

	for (var i = 0, j = options.length; i < j; i++) {
		createRow(options[i], TEXT_DARK, 'normal');
	}
	createRow('Cancel', TEXT_DARK, 'bold');
	optionDialogtableView.addEventListener('click', function(e) {
		if (e.index == 0) {
			return;
		} else if (options.length == e.index - 1) {
			window.close();
		} else {
			window.close();
			callback(e.index - 1);
		}
	});
	view.add(overlay);
	view.add(optionDialogtableView);
	window.add(view);
	if (PLATFORM != ANDROID)
		window.open();
	else
		window.open({
			modal : true
		});
};
bi.ui.saveToPhotoGalleryOverlay = function(img, originalFilename) {
    if (PLATFORM != ANDROID) {
        var mode = null;
        var keyboard_focus = null;
    } else {
        var keyboard_focus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
        var mode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
    }

    var window = Ti.UI.createWindow({
        backgroundColor : "transparent",
        windowSoftInputMode : mode,
        navBarHidden : true,
        navTintColor : WHITE,
    });
    var view = Ti.UI.createView({
        top : 0,
        width : Ti.UI.FILL,
        height : Ti.UI.FILL
    });
    var overlay = Ti.UI.createView({
        backgroundColor : 'black',
        opacity : 0.5,
    });
    overlay.addEventListener("click", function(e) {
        window.close();
    });

    var postIdeaDontSaveButton = Titanium.UI.createButton({
        title : SAVE_IMAGE_TO_PG,
        color : '#Ff5858',
        backgroundColor : '#F0F0F0',
        backgroundSelectedColor : GRAY,
        backgroundFocusedColor : GRAY,
        font : {
            fontSize : 22,
            fontWeight : 'normal',
            fontFamily : 'Helvetica Neue'
        },
        borderWidth : '.5',
        borderColor : BORDER_GRAY,
        height : 45,
        left : 8,
        right : 8,
        bottom : 56,
        borderRadius : BI_BORDER_RADIUS,
    });

    postIdeaDontSaveButton.addEventListener('click', function(e) {
        if(PLATFORM == IPHONE){
            Titanium.Media.saveToPhotoGallery(img, {
                "success" : function(e) {
                    Titanium.API.info('Saved to your camera roll.');
                },
                "error" : function(e) {
                    Titanium.API.info(e.error);
                }
            });
        }
        else{
            if (Titanium.Filesystem.isExternalStoragePresent()) {
                    var temp_target = Titanium.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, originalFilename);
                    temp_target.write(img);
                    Ti.Media.Android.scanMediaFiles([temp_target.nativePath], null, function(e){});
            }
        }
        window.close();
    });

    var postIdeaCancelButton = Titanium.UI.createButton({
        title : CANCEL_TO_SAVE_IMAGE_TO_PG,
        color : NAVY,
        backgroundColor : '#F0F0F0',
        backgroundSelectedColor : GRAY,
        backgroundFocusedColor : GRAY,

        font : {
            fontSize : 22,
            fontWeight : 'normal',
            fontFamily : 'Helvetica Neue'
        },
        borderWidth : '.5',
        borderColor : BORDER_GRAY,
        height : 45,
        left : 8,
        right : 8,
        bottom : 8,
        borderRadius : BI_BORDER_RADIUS,
    });

    postIdeaCancelButton.addEventListener('click', function(e) {
        window.close();
    });
    view.add(overlay);
    view.add(postIdeaDontSaveButton);
    view.add(postIdeaCancelButton);
    window.add(view);

    if (PLATFORM != ANDROID)
        window.open();
    else
        window.open({
            modal : true
        });
};
bi.ui.postCancelOverlay = function(callback) {
	if (PLATFORM != ANDROID) {
		var mode = null;
		var keyboard_focus = null;
	} else {
		var keyboard_focus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		var mode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	}

	var window = Ti.UI.createWindow({
		backgroundColor : "transparent",
		windowSoftInputMode : mode,
		navBarHidden : true,
		navTintColor : WHITE,
	});
	var view = Ti.UI.createView({
		top : 0,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL
	});
	var overlay = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.5,
	});
	overlay.addEventListener("click", function(e) {
		window.close();
	});

	var postIdeaDontSaveButton = Titanium.UI.createButton({
		title : CANCEL_SUBMISSION,
		color : '#Ff5858',
		backgroundColor : '#F0F0F0',
		backgroundSelectedColor : GRAY,
		backgroundFocusedColor : GRAY,
		font : {
			fontSize : 22,
			fontWeight : 'normal',
			fontFamily : 'Helvetica Neue'
		},
		borderWidth : '.5',
		borderColor : BORDER_GRAY,
		height : 45,
		left : 8,
		right : 8,
		bottom : 56,
		borderRadius : BI_BORDER_RADIUS,
	});

	postIdeaDontSaveButton.addEventListener('click', function(e) {
		window.close();
		callback();
	});

	var postIdeaCancelButton = Titanium.UI.createButton({
		title : RETURN_SUBMISSION,
		color : NAVY,
		backgroundColor : '#F0F0F0',
		backgroundSelectedColor : GRAY,
		backgroundFocusedColor : GRAY,

		font : {
			fontSize : 22,
			fontWeight : 'normal',
			fontFamily : 'Helvetica Neue'
		},
		borderWidth : '.5',
		borderColor : BORDER_GRAY,
		height : 45,
		left : 8,
		right : 8,
		bottom : 8,
		borderRadius : BI_BORDER_RADIUS,
	});

	postIdeaCancelButton.addEventListener('click', function(e) {
		window.close();
	});
	view.add(overlay);
	view.add(postIdeaDontSaveButton);
	view.add(postIdeaCancelButton);
	window.add(view);

	if (PLATFORM != ANDROID)
		window.open();
	else
		window.open({
			modal : true
		});
};
bi.ui.fade = function(options) {
	var defaults = {
		element : undefined,
		opacity : 1,
		duration : 400,
		startDelay : 0,
		complete : function() {
		}
	};

	var o = extend(defaults, options), element = o.element;

	var fade = Titanium.UI.createAnimation({
		opacity : o.opacity,
		duration : o.duration,
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN
	});

	setTimeout(function() {
		element.animate(fade);
	}, o.startDelay);

	fade.addEventListener('complete', function() {
		o.complete.call(this);
	});
};

bi.ui.slide = function(options) {
	var defaults = {
		element : undefined,
		top : undefined,
		left : undefined,
		right : undefined,
		bottom : undefined,
		duration : 300,
		startDelay : 0,
		ease : Ti.UI.ANIMATION_CURVE_EASE_IN,
		complete : function() {
		}
	};

	var o = extend(defaults, options), element = o.element;

	var slide = Titanium.UI.createAnimation({
		top : o.top,
		bottom : o.bottom,
		left : o.left,
		right : o.right,
		duration : o.duration,
		curve : o.ease
	});

	setTimeout(function() {
		element.animate(slide);
	}, o.startDelay);

	slide.addEventListener('complete', function() {
		o.complete.call(this);
	});
};

bi.ui.buttonPop = function(options) {
	var defaults = {
		element : undefined,
		duration : 180,
		reverseDelay : 150,
		startDelay : 0,
		bounce : true
	};

	var o = extend(defaults, options), btn = o.element;

	if (o.element) {
		//Transform
		var trBtn = Ti.UI.create2DMatrix();
		if (o.element.scale != undefined) {
			trBtn = trBtn.scale(o.element.scale);
		} else {
			trBtn = trBtn.scale(1.4);
		}

		var trBtnReverse = Ti.UI.create2DMatrix();
		trBtnReverse = trBtnReverse.scale(0.8);

		var trBounce = Ti.UI.create2DMatrix();
		trBounce = trBounce.scale(1);

		//Animations
		var btnPopOut = Titanium.UI.createAnimation({
			transform : trBtn,
			duration : 150,
			curve : Ti.UI.ANIMATION_CURVE_EASE_IN
		});

		var btnPopBack = Titanium.UI.createAnimation({
			transform : trBtnReverse,
			duration : o.duration,
			curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		var btnBounce = Titanium.UI.createAnimation({
			transform : trBounce,
			//autoreverse : true,
			duration : 100,
			curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		btnPopOut.addEventListener('complete', function() {
			setTimeout(function() {
				btn.animate(btnPopBack);
			}, o.reverseDelay);
		});

		if (o.bounce) {
			btnPopBack.addEventListener('complete', function() {
				btn.animate(btnBounce);
			});
		}

		btn.animate(btnPopOut);
	}
};

bi.ui.leftNavButton = function(win, options) {

	var dimensions, tappingArea, backButton;
	var backButtonProperties = {
		text : "\uf104",
		color : NAV_BAR_TEXT_COLOR,
		font : {
			fontSize : '35dp',
			fontFamily : "FontAwesome"
		}
	};

	if (options) {
		tappingArea = Titanium.UI.createView(options);

		if (options.back_color)
			backButtonProperties.color = options.back_color;

		backButton = Ti.UI.createLabel(backButtonProperties);
	} else {
		dimensions = {
			height : Titanium.UI.FILL,
			width : 40,
			left : 0,
		};
		backButtonProperties.left = 0;
		tappingArea = Titanium.UI.createView(dimensions);
		backButton = Ti.UI.createLabel(backButtonProperties);
	}

	tappingArea.addEventListener('click', function() {
		win.close();
	});

	tappingArea.add(backButton);

	if (options)
		win.add(tappingArea);
	else
		win.setLeftNavButton(tappingArea);

	if (!options) {
		var rightNavTappingArea = Titanium.UI.createView({
			width : 40
		});
		win.setRightNavButton(rightNavTappingArea);
	}
};

bi.ui.loginIntro = function(options) {
	var defaults = {
		element : undefined,
		view : undefined,
		top : 0,
		duration : 200,
		startDelay : 0,
		complete : function() {

		}
	};

	var o = extend(defaults, options);

	var logo = o.element, view = o.view;

	bi.ui.slide({
		element : logo,
		startDelay : o.startDelay,
		top : o.top,
		duration : o.duration,
		complete : function() {
			bi.ui.fade({
				element : view,
				opacity : 1,
				duration : o.duration,
				startDelay : 800,
				complete : o.complete
			});
		}
	});
};

bi.ui.getAudioPlayer = function(audioFile, size) {
	var small = false;

	if (size == 'small') {
		small = true;
	}

	var extension = "m4a";
	if(PLATFORM==ANDROID){
		extension = "mp4";
	}
	//Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
	         

	// if (PLATFORM != ANDROID) {
		// videoPlayer.media = audioFile;
	// } else {
		// videoPlayer.url = audioFile.nativePath;
	// }

	var loaded = false;
	var playing = false;
	var loader = null;
	var videoPlayerView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : "horizontal",
		borderWidth : 1,
		borderColor : "white",
		top:5,
		bottom:5
	});
	var playIcon = Ti.UI.createLabel({
		borderRadius : bi.ui.getRadius(30),
		width : 30,
		height : 30,
		top : 5,
		bottom : 5,
		left : 5,
		text : " \uf04b",
		backgroundColor : "#e0e0e0",
		font : {
			fontSize : '11dp',
			fontFamily : "FontAwesome"
		},
		textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
	});
	
	var timerLeft = Ti.UI.createLabel({
		text: "00:00",
		left :5,
		font : {
			fontSize : '12dp',
		},
	});
	
	var timerRight = Ti.UI.createLabel({
		text: "00:00",
		left :5,
		font : {
			fontSize : '12dp',
		},
	});
	
	var progressBarBg = Ti.UI.createView({
		backgroundColor: "#e0e0e0",
		height: 5,
		left : 5,
		width : "55%",
	});

	if(small) {
		playIcon.width = 25;
		playIcon.height = 25;
		timerLeft.font.fontSize = 11;
		timerRight.font.fontSize = 11;
		progressBarBg.width = '50%';
	}
	
	videoPlayerView.progressBar = progressBarBg;
	
	var progressBar = Ti.UI.createView({
		backgroundColor: "#6d6d6d",
		width: 0,
		left : 0
	});
	
	var player,duration,playbackTime;
	
	function callTimer() {
		//Checking the time is higher than the previous before setting the timer.text. For some reason the player was reported times that were not consistent.
		var currentPlaybackTime = 0;
		playbackTime = setInterval(function() {
			if ( player.time > currentPlaybackTime) {
				timerLeft.text = msToMS(player.time + 1000);	
				timerRight.text = "-"+msToMS(duration*1000-player.time + 1000);	
				progressBar.width = (player.time/duration/10)+"%";
			}
			currentPlaybackTime = player.time;
		}, 100);
	}

	function msToMS(ms) {
		var M = parseInt(Math.floor(ms / 60000));
		ms -= M * 60000;
		var S = parseInt(Math.floor(ms / 1000) - 0.499);

		//if (S <= 0)
		//	S = 1;

		if (M < 10) {
			M = "0" + M;
		}
		if (S < 10) {
			S = "0" + S;
		}

		return M + ":" + S;
	}
	
	
	
	videoPlayerView.add(playIcon);
	videoPlayerView.add(timerLeft);
	videoPlayerView.add(progressBarBg);
	progressBarBg.add(progressBar);
	videoPlayerView.add(timerRight);
	
	function startPlay(f){
		player = Ti.Media.createSound({url:f});
		
		
		
		player.addEventListener("complete", function(){
			clearInterval(playbackTime);
			playing = false;
			playIcon.text="\uf04b";
		});
		
		if(PLATFORM==ANDROID){
			player.addEventListener("change", function(e){
				if(e.state == 4){
				 	duration = player.duration/1000;
					callTimer();
				
				}
			});
			player.play();
		}else{
			duration = player.duration;
			callTimer();
		
			player.play();
		}
		
		loaded=true;
		playing = true;
	}
	
	playIcon.addEventListener("click", debounce(function(){
		playIcon.text="\uf04d";
		
		if(loader){
			playIcon.text="\uf04b";
			loader.abort();
			loader=null;
			
			return;
		}
		
		if(loaded){
			if(playing){
				
				player.stop();
				playIcon.text="\uf04b";
				playing=false;
				
			}else{
				callTimer();
				player.play();
				playing=true;
			}
			
		}else{
			if(typeof audioFile != "string"){
				startPlay(audioFile);
			}else{
				var hash = md5(audioFile);
				var xhr = Titanium.Network.createHTTPClient({
					onload : function() {
						// first, grab a "handle" to the file where you'll store the downloaded data
						var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, hash+'_recording.' + extension);
						if (f.exists()) {
							f.deleteFile();
						}
						f.write(this.responseData);
						loader = null;
						// write to the file
						startPlay(f);
					},
					timeout : 10000
				});
				
				loader = xhr;
				xhr.open('GET', audioFile);
				xhr.send();
			}
			
		}
		
	}, 500, true));


	return videoPlayerView;
	

};

bi.ui.getAttachmentFile = function(parent, attachments, attachmentIndex) {
	var fileContainer = Titanium.UI.createView({
		top : 0,
		width : '100%',
		height : '40dp',
		layout : 'horizontal',
		backgroundColor : 'transparent',
		index : attachmentIndex,
	});

	var fileTypeView = Titanium.UI.createView({
		backgroundColor : '#E42020',
		height : '30dp',
		width : '50dp',
		top : '5dp',
		left : '5dp',
		bottom : '5dp',
		borderRadius : 3,
		index : attachmentIndex,
	});

	if (["xls", "xlsx", "mov"].indexOf(attachments[attachmentIndex].extension) == -1) {
		fileTypeView.backgroundColor = '#3B81DC';
	} else {
		fileTypeView.backgroundColor = '#21DF73';
	}

	var fileTypeLabel = Titanium.UI.createLabel({
		text : attachments[attachmentIndex].extension.toUpperCase(),
		color : WHITE,
		font : {
			fontSize : '15dp',
			fontWeight : 'bold',
			fontFamily : 'Helvetica Neue'
		},
		textAlign : 'center',
		index : attachmentIndex,
	});
	fileTypeView.add(fileTypeLabel);

	var fileName = Titanium.UI.createLabel({
		text : attachments[attachmentIndex].original_filename,
		height : '22dp',
		left : '5dp',
		top : '5dp',
		color : NIELSEN_BLUE,
		width : Titanium.UI.FILL,
		font : {
			fontSize : '15dp',
			fontFamily : 'Helvetica Neue'
		},
		index : attachmentIndex,
	});

	fileContainer.addEventListener('click', function(e) {
		bi.navigation.open('ViewImageScreen', parent, attachments, e.source.index);
	});

	fileContainer.add(fileTypeView);
	fileContainer.add(fileName);
	return fileContainer;
};

bi.ui.addNewUserOverlay = function(options) {
	var defaults = {
		view : undefined,
		type : undefined,
		backgroundImage : undefined,
		image : undefined,
		imageWidth : 102,
		imageBottom : 140,
		headerText : undefined,
		headerFontSize : 16,
		headerWidth : '85%',
		infoText : undefined,
		infoTop : 24,
		infoFontSize : 14,
		infoWidth : '85%',
		instructionText : undefined,
		instructionFontSize : 14,
		instructionBottom : 80,
		instructionWidth : '85%'
	};

	var runOnce = false;

	var o = extend(defaults, options),
		view = o.view;

	if(o.type) {
		runOnce = Ti.App.Properties.getBool(o.type);
	}
	
	//Only run once, if it has not been run then
	if (!runOnce) {

		if(PLATFORM == IPHONE) {
			var overlayWin = Ti.UI.createWindow({
				title : "",
				navBarHidden : true,
				height : Ti.UI.FULL,
				width : '100%',
				right : 0,
				top : 0
			});
		}		

		var overlayWrapper = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			opacity : 0,
			zIndex : 500
		});

		if(o.type) {
			var overlay = Ti.UI.createView({
				height : Ti.UI.FILL,
				width : Ti.UI.FILL
			});

			var closeBtn = Ti.UI.createLabel({
				text : "\uf00d",
				borderRadius : bi.ui.getRadius(30),
				backgroundColor : WHITE,
				width : 30,
				height : 30,
				top : 20,
				right: 20,
				textAlign : "center",
				font : {
					fontSize : '25dp',
					fontFamily : "FontAwesome"
				},
				touchEnabled : false
			});

			overlay.add(closeBtn);

			if(o.backgroundImage){
				overlay.backgroundImage = o.backgroundImage;
			} else {
				overlay.opacity = 0.85;
				overlay.backgroundColor = '#000';

				if(o.image) {
					var overlayImage = Ti.UI.createImageView({
						image : o.image,
						width : o.imageWidth,
						height : Ti.UI.SIZE,
						bottom : o.imageBottom,
						touchEnabled : false
					});

					overlay.add(overlayImage);
				} else if(o.type == 'challengeHome') {
					var subscribeView = Titanium.UI.createView({
						backgroundColor : '#00b32d',
						height : 40,
						width : '92%',
						left : '4%',
						right : '4%',
						bottom : 137,
						borderRadius : getCircularBorder(4),
						touchEnabled : false,
						zIndex : 510
					});

					var subscribeLabel = Titanium.UI.createLabel({
						text : F('Subscribe to Challenge', ["Challenge"]),
						color : 'white',
						font : {
							fontSize : '20dp',
							fontFamily : 'Helvetica Neue'
						},
						touchEnabled : false
					});

					subscribeView.add(subscribeLabel);

					overlayWrapper.add(subscribeView);
				}
			}
		}

		overlayWrapper.add(overlay);

		//Main message container
		var messageWrapper = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '30%',
			touchEnabled : false
		});

		var messageInner = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'vertical',
			touchEnabled : false
		});
	
		//If header text exists, add to main message container
		if (o.headerText) {

			var headerText = Ti.UI.createLabel({
				text : o.headerText,
				color : WHITE,
				font : {
					fontSize : o.headerFontSize,
					fontWeight : 'bold',
					fontFamily : 'Helvetica Neue'
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				height : Ti.UI.SIZE,
				width :  o.headerWidth,
				touchEnabled : false
			});

			messageInner.add(headerText);
		}

		//If info text exists, add to main message container
		if (o.infoText) {

			var infoText = Ti.UI.createLabel({
				text : o.infoText,
				color : WHITE,
				font : {
					fontSize : o.infoFontSize,
					fontWeight : 'normal',
					fontFamily : 'Helvetica Neue'
				},
				height : Ti.UI.SIZE,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				width :  o.infoWidth,
				top : o.infoTop,
				touchEnabled : false
			});

			messageInner.add(infoText);

		}

		messageWrapper.add(messageInner);
		overlay.add(messageWrapper);

		//If instruction text exists, add to overlay
		if (o.instructionText) {

			var instructionText = Ti.UI.createLabel({
				text : o.instructionText,
				color : WHITE,
				font : {
					fontSize : o.instructionFontSize,
					fontFamily : 'Helvetica Neue'
				},
				height : Ti.UI.SIZE,
				width :  o.instructionWidth,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				bottom : o.instructionBottom,
				touchEnabled : false
			});

			overlayWrapper.add(instructionText);
		}

		//Close overlay when clicking anywhere
		overlayWrapper.addEventListener('click', function(e) {
			if (o.type) {
				onlyRunOnce(o.type);
			}

			bi.ui.fade({
				element : overlayWrapper,
				opacity : 0,
				duration : 200
			});

			setTimeout(function() {
				if(PLATFORM == IPHONE) {
					overlayWin.close();
				} else {
					view.remove(overlayWrapper);
				}
			}, 200);
		});

		if(PLATFORM == IPHONE) {
			overlayWin.add(overlayWrapper);
			overlayWin.open();
		} else {
			//Add the overlay to the view
			view.add(overlayWrapper);
		}

		//Fade the overlay in
		bi.ui.fade({
			element : overlayWrapper,
			opacity : 1,
			duration : 200
		});
	}
};

bi.ui.displayMedia = function(mediaObj, id, remove_callback) {
	var media = mediaObj;
	var mediaView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
	});
	var image = Ti.UI.createImageView({
		image : media,
		width : '150',
	});
	mediaView.add(image);

	if (remove_callback) {
		var deleteImage = Titanium.UI.createLabel({
			text : '\uf057',
			color : TEXT_DARK,
			right : 2,
			top : 0,
			font : {
				fontSize : 35,
				fontFamily : "FontAwesome"
			},
		});
		mediaView.add(deleteImage);

		deleteImage.addEventListener("click", function(e) {
			remove_callback(id);
		});
	}

	return mediaView;
};

bi.ui.typeahead = function(container, top, params, onclick, textfield, exclude) {
	var originalValue = textfield.value;
	var searchView;
	if (container.has_overlay) {
		searchView = container.searchView;

		if (params.query == "") {
			searchView.clear();
			return;
		}
	} else {
		if (params.query == "") {
			return;
		}
		container.has_overlay = true;
		var SearchView = require("/ui/common/SearchView");
		var sview = new SearchView();

		var overlay = Ti.UI.createView({
			top : top['overlay'],
			backgroundColor : "white",
			layout : "vertical"
		});
		sview.clear = function() {
			container.remove(overlay);
			container.has_overlay = false;
			container.searchView = null;
			container.scrollingEnabled = true;
		};
		sview.addOverlay = function() {
			container.scrollTo(0, top['scroll']);
			container.add(overlay);
			container.scrollingEnabled = false;
		};
		sview.onclick = function(obj, param) {
			sview.clear();
			onclick(obj, param);
		};
		var resutView = sview.resultView();
		resutView.height = 220;

		container.searchView = sview;
		searchView = sview;

		overlay.add(resutView);

	}

	textfield.fireEvent("loadstatuschange", {
		isloading : 1
	});

	bi.sdk.get("search", params, function(data) {
		textfield.fireEvent("loadstatuschange", {
			isloading : 0
		});

		searchView.result_list.backgroundColor = "white";
		var currentSection = Titanium.UI.createListSection();
		searchView.result_list.sections = [currentSection];
		var items = [];
		for (var i = 0; i < data["search"].length; i++) {
			var d = data["search"][i];
			if(exclude && exclude.indexOf(d.name)!=-1){
				continue;
			}
			var item = searchView.formatData(d);
			item.properties.height = 35;
			item.data = d;
			items.push(item);
		};

		if (items.length > 0 && originalValue == textfield.value) {
			searchView.addOverlay();
		} else {
			searchView.clear();
		}

		currentSection.setItems(items);
	});

};

var hudVisible = false;

bi.ui.tagButton = function(tag_name,subscribed,parent,overlay,readOnly,hasFirstTimeOverlay,hasHeader) {
	var tagsSingleView = Titanium.UI.createView({
		top : 5,
		right : 5,
		left :5,
		height : 23,
		width : Ti.UI.SIZE,
		backgroundColor : TAG_BACK,
		borderWidth : 1,
		borderColor : TAG_BORDER,
		borderRadius : getCircularBorder(8),
		bottom : 5,
		tag_name : tag_name
	});

	var tagLabel = Titanium.UI.createLabel({
		left : 5,
		right : 5,
		text : tag_name,
		height : Ti.UI.SIZE,
		color : GRAY,
		width : Ti.UI.SIZE,
		font : {
			fontSize : '12dp',
			fontFamily : 'Helvetica Neue'
		},
		tag_name : tag_name
	});
	
	if(PLATFORM == IPHONE) {
		tagLabel.width = tagLabel.toImage().width;
	}
	
	tagsSingleView.add(tagLabel);

	function setSubscribed(subscribed) {
		if (subscribed) {
			tagsSingleView.borderColor = '#28AC41';
			tagsSingleView.backgroundColor = CURRENT_USER_BACK;
		} else {
			tagsSingleView.borderColor = TAG_BORDER;
			tagsSingleView.backgroundColor = TAG_BACK;
		}
		tagsSingleView.subscribed = subscribed;
	}
	
	setSubscribed(subscribed);
	tagsSingleView.setSubscribed = setSubscribed;
	
	
	var runOnce=true;
	if(hasFirstTimeOverlay)
	   runOnce = Ti.App.Properties.getBool('tagSubscription');
	   

	if(!readOnly) {
		tagsSingleView.addEventListener("click", debounce(function(e) {
		    var HUDview = Ti.UI.createView({
                layout:"vertical",
                height : 100,
                width: 180
            });
            
            var checkmark = Ti.UI.createLabel({
                    text : "\uf00c",
                    color : "white",
                    font : {
                        fontSize : '40',
                        fontFamily : "FontAwesome"
                    },
                    top:10
        
                });
            HUDview.add(checkmark);
            
            var HUDText = Ti.UI.createLabel({
                text: "Subscribed",
                color : "white",
                font : {
                    fontSize : '18',
                },
                top: 15
            });
            
            HUDview.add(HUDText);
            
			if (runOnce) {
				if(this.longpress){
					this.longpress=false;
					return;
				}
					
				if (tagsSingleView.subscribed) {
					HUDText.text="Unsubscribed";

					if(hasHeader) {
						bi.ui.updateTagCountOnheader('removeOne');
					} 


				}else{
					HUDText.text="Subscribed";

					if(hasHeader) {
						bi.ui.updateTagCountOnheader('addOne');
					} 

				}

				if(!hudVisible) {
					overlay.show(HUDview);
				}
				hudVisible = true;
				setTimeout(function(){
					HUDText.text="";
					overlay.hide();
					hudVisible = false;
				},1000);
			}
			
			runOnce = true;

			this.scale = 1.1;

			bi.ui.buttonPop({
				element : this
			});
			var method;
			if (tagsSingleView.subscribed) {
				method = "DELETE";
				setSubscribed(false);
			} else {
				method = "POST";
				setSubscribed(true);
			}

			bi.sdk.call("tagSubscription", method, {
				tag_name : tag_name
			}, function(e) {

			});
		},1000,true));
	}

	if(readOnly) {
		tagsSingleView.addEventListener("click", function(e){
			bi.navigation.open("ideaListScreen", parent, {
				title : "Tag",
				request : {
					tag_name : e.source.tag_name
				},
				parentTag : tagsSingleView
			});
		});
	} else {
		tagsSingleView.addEventListener("longpress", function(e){
			this.longpress=true;
			
			bi.navigation.open("ideaListScreen", parent, {
				title : "Tag",
				request : {
					tag_name : e.source.tag_name
				},
				parentTag : tagsSingleView
			});
		});
		
		tagsSingleView.addEventListener("touchstart", function(e) {
			this.longpress = false;
		});
	}
	
	return tagsSingleView;
};

