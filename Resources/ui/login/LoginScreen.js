function LoginScreen() {

}

LoginScreen.prototype.getTextField = function(hintText) {

	var loginWrapper = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
	});
	
	
	var textFieldWrapper = Ti.UI.createView({
		backgroundColor : '#f6f6f6',
		borderRadius : BI_BORDER_RADIUS,
		borderWidth : '1',
		borderColor : '#DDD',
		height : Ti.UI.SIZE,
		width : '85%',
	});
	
	var textField = Ti.UI.createTextField({
		hintText : hintText,
		color : '#000',
		width : '94%',
		height : 40,
		textAlign : 'left',
		font : {
			fontSize : '14dp',
			fontWeight : 'normal',
			fontFamily : 'Helvetica Neue'
		},
		autocorrect : false,
		enableReturnKey : true,
		keyboardType : KEYBOARD_EMAIL,
		clearButtonMode : Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
		noBlur :true
	});
	
	textFieldWrapper.add(textField);
	loginWrapper.add(textFieldWrapper);
	
	var spinner = Titanium.UI.createActivityIndicator({
		right: 0,
	});
	if (PLATFORM == IPHONE) {
		spinner.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
	} else {
		spinner.style = Titanium.UI.ActivityIndicatorStyle.DARK;
	}
	loginWrapper.add(spinner);
	
	var check = Ti.UI.createLabel({
		right : 0,
		text : "\uf00c",
		color : "#58dc77",
		font : {
			fontSize : '16dp',
			fontFamily : "FontAwesome"
		},
		visible : false
	});
	loginWrapper.add(check);
	
	loginWrapper.textfield = textField;
	
	loginWrapper.addEventListener("loadstatuschange", function(e) {
			loginWrapper.isloading = e.isloading;
			if (e.isloading) {
				spinner.show();
			} else {
				spinner.hide();
			}
		});
		
	loginWrapper.addEventListener("statuschange", function(e){
		if(e.checked){
			check.visible=true;
		}else{
			check.visible=false;
		}
	});

	loginWrapper.addEventListener("errorstate", function(e){
		if(e.has_error){
			textFieldWrapper.borderColor = "red";
		}else{
			textFieldWrapper.borderColor = "#DDD";
		}
	});
	return loginWrapper;
};

LoginScreen.prototype.getButton = function(title) {
	var button = Titanium.UI.createButton({
		title : title,
		color : '#FFF',
		backgroundColor : '#acacac',
		backgroundImage : 'none',
		backgroundSelectedColor : '#9B9B9B',
		backgroundFocusedColor : '#BCBCBC',
		borderWidth : '0',
		borderRadius : BI_BORDER_RADIUS,
		width : '94%',
		height : '40dp',
		top : '0dp',
		font : {
			fontSize : '16dp',
			fontWeight : 'bold',
			fontFamily : 'Helvetica Neue'
		},
	});

	button.addEventListener('pressed', function() {
		this.setBackgroundColor('#BCBCBC');
	});

	button.addEventListener('reset', function() {
		this.setBackgroundColor('#9B9B9B');
	});
	return button;
};

LoginScreen.prototype.companyScreen = function(params) {

    this.open("CompanyScreen", params);
};


LoginScreen.prototype.start = function(callback,fastlogin) {
	var self = this;
	
	var fastlogin,custom;
	this.callback = callback;
	if ( typeof CLIENT_DOMAIN != "undefined") {
		prop.setString("hostName", CLIENT_DOMAIN);
		custom=true;
	} else if (prop.getString("email") && prop.getString("hostName") && fastlogin) 
		fastlogin=true;
		
	this.companyScreen({
        custom:custom,
        fastlogin:fastlogin
    });
};

LoginScreen.prototype.open = function(screen_name, params) {
	var Screen = require("/ui/login/" + screen_name);
	var screen = new Screen(this, params);

	if (!Titanium.Network.online) {
	}

	var statusBarStyle = null;
	
	if(PLATFORM != ANDROID){
		statusBarStyle = Titanium.UI.iPhone.StatusBar.DEFAULT;
	}
	
	var loginWin = Ti.UI.createWindow({

		backgroundColor : WHITE,
		title : 'Login Screen',
		navBarHidden : true,
		navTintColor : WHITE,
		height : 'auto',
		width : 'auto',
		statusBarStyle : statusBarStyle
	});

	loginWin.add(screen);

	loginWin.addEventListener("open", function(e) {
		if (screen.openEvent)
			screen.openEvent();
	});

	if (PLATFORM != ANDROID) {
		if (this.navigationWin) {
			var options = {
				top : 20,
				left : 10,
				width : 30,
				height : Ti.UI.SIZE,
				back_color: 'gray'
			};

			bi.ui.leftNavButton(loginWin, options);
			this.navigationWin.openWindow(loginWin);

		} else {
			var navigationWin = Titanium.UI.iOS.createNavigationWindow({
				window : loginWin
			});
			this.navigationWin = navigationWin;
			navigationWin.open();
		}

	} else {
		loginWin.open();
		bi.ui.loginScreen[bi.ui.screenCount] = loginWin;
		bi.ui.screenCount +=1;
	}
	this.currentWindow = loginWin;

};

LoginScreen.prototype.loginSuccess = function() {

	this.callback();
	
	if(PLATFORM == ANDROID){
		for(var i=0 ; i<bi.ui.screenCount ; i++){
			bi.ui.loginScreen[i].close();
		}
	}
	
	
	
	if(this.navigationWin)
		this.navigationWin.close();
};

LoginScreen.prototype.back = function() {
	this.currentWindow.close();
};

module.exports = LoginScreen;
