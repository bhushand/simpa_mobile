function SettingsScreen(parent) {

	var settingsWindow = Ti.UI.createView({
		
	});
	
	var settingsView = Ti.UI.createView({
		backgroundColor : WHITE,
		top : 0,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});
	
	settingsWindow.add(settingsView);
	
	var overlay = require("/libs/overlayHUD");
	overlay.load(settingsWindow);

	/**********************************************************************************************************
	 *                                 notification switch
	 **********************************************************************************************************/

	function showAccountInfo(notificationStatus) {

		var settingsContainer = Ti.UI.createView({
			backgroundColor : '#FFF',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : 0,
			layout : 'vertical'
		});

		var settingsHeaderOptions = {
			title : 'Site Settings'
		};

		var settingsScreenHeader = bi.ui.headerBar(settingsHeaderOptions);

		//settingsContainer.add(settingsScreenHeader);

		//AFFILIATE INFO/CHANGE AFFILIATE
		var affiliateId = prop.getString("affiliateId"), affiliateName = prop.getString("affiliateName");

		var affiliateWrapper = Ti.UI.createView({
			height : 60,
			width : '100%',
			top : 0
		});

		var affiliateLabel = Titanium.UI.createLabel({
			text : S01001 + affiliateName,
			color : TEXT_DARK,
			left : 12,
			font : {
				fontSize : '14dp',
				fontFamily : 'Helvetica Neue'
			},
			width : '60%'
		});

		var changeAffiliateButton = Titanium.UI.createLabel({
			text : 'Change',
			color : NIELSEN_BLUE,
			right : 20,
			font : {
				fontSize : '14dp',
				fontFamily : 'Helvetica Neue'
			},
			width : Ti.UI.SIZE
		});

		affiliateWrapper.add(affiliateLabel);

		if(prop.getBool("multipleAffiliates")!==false){
			affiliateWrapper.add(changeAffiliateButton);
		}

		//settingsContainer.add(affiliateWrapper);

		changeAffiliateButton.addEventListener('click', function(){
			overlay.show();
			bi.sdk.request("https://" + bi.sdk.auth_domain + "/_oauth2/tokenInfo", "GET", {access_token:bi.sdk.access_token}, function(data){
				
				var rows = [];
				var domains = [];
				for (var i=0; i < data.systems.length; i++) {
					var system = data.systems[i];
					if(system.system_id == prop.getString("system_id"))
						system.client_name = "\u2713 "+system.client_name;
					rows.push(system.client_name);
					domains.push(system.host_name);
				};
				rows.push("Cancel");
				var opts = {
				  cancel: rows.length-1,
				  options: rows,
				  title: 'Select Affiliate'
				};
				overlay.hide();
				var dialog = Ti.UI.createOptionDialog(opts);
				dialog.show();
				
				dialog.addEventListener("click", function(e){
					if(e.index==rows.length-1)
						return;
						
					var domain = domains[e.index];
					bi.login.switchAffiliate(domain,overlay);

					
				});
				
			});
		});

		//NOTIFICATION SETTINGS
		var notificationsHeaderOptions = {
			title : 'Notifications Settings'
		};

		var notificationsHeader = bi.ui.headerBar(notificationsHeaderOptions);

		settingsContainer.add(notificationsHeader);

		var notificationWrapper = Ti.UI.createView({
			height : 50,
			width : '100%',
			top : 0
		});

		var notificationLabel = Titanium.UI.createLabel({
			text : 'Notifications On',
			height : '30dp',
			color : TEXT_DARK,
			font : {
				fontSize : '14dp',
				fontFamily : 'Helvetica Neue'
			},
			left : 12,
			width : Ti.UI.SIZE
		});

		var notificationSwitch = Ti.UI.createSwitch({
			right : '20dp',
			value : notificationStatus
		});

		notificationWrapper.add(notificationLabel);
		notificationWrapper.add(notificationSwitch);

		settingsContainer.add(notificationWrapper);

		notificationSwitch.addEventListener('change', function(e) {

			if (notificationSwitch.value == false) {
				flurry.logEvent('Disabled notifications', {affiliate: prop.getString("affiliateName")});
				//Delete mobile device token
				bi.sdk.call("mobileDevice/" + prop.getString("deviceId"), "DELETE", {}, function(data) {
					if (data.message != "success") {
						notificationSwitch.value = true;
					} else {
						notificationSwitch.value = false;
						prop.setString("deviceId", null);
					}
				}, function(e) {
					//fail
				});

			} else if (notificationSwitch.value == true) {
				flurry.logEvent('Enabled notifications', {affiliate: prop.getString("affiliateName")});

				bi.notification.registerForPushNotifications(function(e) {
					if (e.enabled)
						notificationSwitch.value = true;
					else
						notificationSwitch.value = false;
				});

			}
		});

		//SOUND SETTINGS

		var soundHeaderOptions = {
			title : 'Sound Settings'
		};

		var soundHeader = bi.ui.headerBar(soundHeaderOptions);

		settingsContainer.add(soundHeader);

		var soundWrapper = Ti.UI.createView({
			height : 50,
			width : Ti.UI.FILL,
			top : 0
		});

		var soundStatus = true;
		if(prop.getBool("soundOn") == false) {
			soundStatus = false;
		}

		var soundLabel = Titanium.UI.createLabel({
			text : 'Sounds On',
			height : '30dp',
			color : TEXT_DARK,
			font : {
				fontSize : '14dp',
				fontFamily : 'Helvetica Neue'
			},
			left : 12,
			width : Ti.UI.SIZE,
			value : true
		});

		var soundSwitch = Ti.UI.createSwitch({
			right : '20dp',
			value :  soundStatus
		});

		soundWrapper.add(soundLabel);
		soundWrapper.add(soundSwitch);

		soundSwitch.addEventListener('change', function(e) {
			if(soundStatus == false) {
				soundStatus = true;
				prop.setBool("soundOn", true);
			} else {
				soundStatus = false;
				prop.setBool("soundOn", false);
			}	
		});


		settingsContainer.add(soundWrapper);

		//LOGOUT

		var logoutButton = Titanium.UI.createButton({
			title : 'Log Out',
			color : '#FFF',
			backgroundColor : NIELSEN_BLUE,
			backgroundImage : 'none',
			backgroundSelectedColor : NIELSEN_DARK_BLUE,
			backgroundFocusedColor : NIELSEN_DARK_BLUE,
			borderColor : NIELSEN_BLUE,
			borderWidth : '.5',
			width : '95%',
			height : '40dp',
			top : 8,
			borderRadius : BI_BORDER_RADIUS,
		});

		settingsContainer.add(logoutButton);

		logoutButton.addEventListener('touchstart', function() {
			this.setBackgroundColor(NIELSEN_DARK_BLUE);
		});

		logoutButton.addEventListener('touchend', function() {
			this.setBackgroundColor(NIELSEN_BLUE);
		});

		logoutButton.addEventListener('click', function(){
			bi.ui.logout(function() {
				//parent.drawer.close();
			});
		});

		//TERMS/ATRIBUTIONS
		var termsLabel = Titanium.UI.createLabel({
			text : 'Terms of Service',
			height : 20,
			color : NIELSEN_BLUE,
			font : {
				fontSize : '11dp',
				fontFamily : 'Helvetica Neue'
			},
			top : 8,
			left : 12,
			width : Ti.UI.FILL
		});

		/***************************************************************
		 *  Label Styling Listeners
		 ***************************************************************/
		termsLabel.addEventListener('touchstart', function(e) {
			setTimeout(function(e) {
				termsLabel.setColor(NIELSEN_BLUE);
			}, 400);
			termsLabel.setColor(NIELSEN_DARK_BLUE);
		});


		/***************************************************************
		 *
		 ***************************************************************/

		var versionLabel = Titanium.UI.createLabel({
			text : 'Version: ' + Ti.App.version,
			height : 20,
			font : {
				fontSize : '11dp',
				fontFamily : 'Helvetica Neue'
			},
			top : 5,
			left : 12,
			color : "#888",
			width : Ti.UI.FILL
		});


		settingsContainer.add(termsLabel);

		settingsContainer.add(versionLabel);
		settingsView.add(settingsContainer);


		termsLabel.addEventListener('click', function() {
			overlay.show();
			bi.sdk.call("affiliate/this", "GET", {}, function(data) {
				if (data.affiliate) {
				    var termsText = "No terms of service is available.";
					if (data.affiliate.terms_and_condition) {
						termsText = data.affiliate.terms_and_condition.terms_text;
					}
					
                    overlay.hide();
                    bi.ui.createAlertDialogOverlay({
                        title : 'Terms of Service',
                        message : stripHtmlTags(termsText)
                    });
				}
			}, function(e) {
				//fail
			});
			
		});

	}

	function callToMobileDevice() {
		//call to api layer
		if (prop.getString("deviceId") == null) {
			showAccountInfo(false);
		}
		bi.sdk.call("mobileDevice/" + prop.getString("deviceId"), "GET", {}, function(data) {

			if (data.mobileDevice != undefined) {
				flurry.logEvent('Device Token: ', {
					deviceToken : prop.getString("deviceToken")
				});
				showAccountInfo(true);
			} else {
				showAccountInfo(false);
			}

		}, function(e) {
			//fail
		});
	}
    showAccountInfo(true);
	//callToMobileDevice();

	return settingsWindow;
}

module.exports = SettingsScreen;
