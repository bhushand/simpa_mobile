function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

function CompanyScreen(master, params) {
    if (!params) {
        params = {};
    }

    var self = this;

    var companyLogo,
        loginView;

    if (PLATFORM != ANDROID) {
        loginView = Ti.UI.createScrollView({
            flag : 1,
            externalClick : 2,
        });
    } else {
        loginView = Ti.UI.createView({
            flag : 1,
            externalClick : 2,
        });
    }
    this.loginView = loginView;

    var loginMasterContainer = Ti.UI.createView({
        height : Ti.UI.SIZE,
        width : '100%',
    });

    this.loginMasterContainer = loginMasterContainer;

    var loginContainer = Ti.UI.createView({
        height : '90%',
        width : '90%',
        flag : 1,
        layout : "vertical",
        externalClick : 2,
    });
    this.loginContainer = loginContainer;

    loginMasterContainer.add(loginContainer);

    loginView.add(loginMasterContainer);

    Ti.API.info(' check 1');

    loginView.addEventListener('singletap', function(e) {
        hideKeyboard(e);
    });

    loginContainer.addEventListener('singletap', function(e) {
        hideKeyboard(e);
    });

    var biLogoTemp = Ti.UI.createView({
        top : "5%",
        height : 130,
        width : 230,
    });

    var logoImage = Titanium.UI.createImageView({
        image : '/images/simpa-networks.gif',
        height : 90,
    });

    biLogoTemp.add(logoImage);
    this.logoImage = logoImage;
    this.logoContainer = biLogoTemp;

    loginContainer.add(biLogoTemp);

    var emailField = this.getTextField("Username");
    emailField.accessibilityLabel = "Username Field";
    this.emailField = emailField;
    emailField.visible = true;

    emailField.textfield.returnKeyType = Titanium.UI.RETURNKEY_NEXT;
    emailField.textfield.autocapitalization = Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE;

    Ti.API.info(' check 2');
    loginContainer.add(emailField);

    var passwordField = this.getTextField("Password");
    passwordField.accessibilityLabel = "Password Field";
    passwordField.textfield.passwordMask = true;
    passwordField.textfield.returnKeyType = Titanium.UI.RETURNKEY_DONE;
    this.passwordField = passwordField;
    passwordField.visible = true;
    passwordField.top = 10;

    function hideKeyboard(e) {
        if (PLATFORM == IPHONE && e.source.noBlur !== true) {
            emailField.textfield.blur();
            passwordField.textfield.blur();
        } else if (PLATFORM == ANDROID && e.source.flag == 1)
            Titanium.UI.Android.hideSoftKeyboard();
    }


    loginContainer.add(passwordField);

    var bottomWrapper = Ti.UI.createView({
        width : '90%',
        top : '10dp',
        layout : 'vertical',
        height : Ti.UI.SIZE
    });
    this.bottomWrapper = bottomWrapper;

    var loginButton = this.getButton("Login");
    loginButton.accessibilityLabel = "Login Button";
    this.loginButton = loginButton;

    bottomWrapper.add(loginButton);
    loginContainer.add(bottomWrapper);

    var errorFontSize = '14dp';
    if (PLATFORM == IPHONE) {
        var ios_ver = Titanium.Platform.version.split(".");
        if (ios_ver[0] < 7)
            errorFontSize = '11dp';
    }

    var errorLabel = Ti.UI.createLabel({
        color : 'red',
        top : 10,
        height : Ti.UI.SIZE,
        width : '80%',
        font : {
            fontSize : errorFontSize,
            fontWeight : 'normal',
            fontFamily : 'Helvetica Neue'
        }
    });
    this.errorLabel = errorLabel;

    passwordField.textfield.addEventListener('return', function() {
        loginButton.fireEvent("click");
    });
    passwordField.textfield.addEventListener('change', function() {
        self.update_error(null, passwordField.textfield);
    });
    emailField.textfield.addEventListener('change', function() {
        self.update_error(null, emailField.textfield);
    });

    loginButton.addEventListener('click', function() {
        self.update_error();
        Ti.API.info(" Clicking on login button");

        var session_id = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyz');

        prop.setString("hostName", 'https://simpademo.simpanetworks.com');
        var url = 'session/authenticate'; 
        bi.sdk.call(url, "POST", {
            "jsonrpc" : "2.0",
            "method" : "call",
            "params" : {
                "db" : "simpademo",
                "login" : emailField.textfield.value,
                "password" : passwordField.textfield.value,
                "base_location" : prop.getString("hostName"),
                "session_id" : session_id,
                "context" : {}
            },
            "id" : "r8"
        }, function(jsonObj) {
            if (jsonObj.result.uid) {
                prop.setString("session_id", session_id);
                prop.setString("uid", jsonObj.result.uid);
                master.loginSuccess();
            } else {
                self.update_error("There was an error with your Username/Password combination. Please try again.", self.passwordField);
            }
        }, function(e) {
            Ti.API.info(e);
        }, "application/json");

    });

    return loginView;
}

var LoginScreen = require('/ui/login/LoginScreen');
CompanyScreen.prototype = new LoginScreen();

CompanyScreen.prototype.update_error = function(error_text, error_view) {
    var self = this;
    if (!error_text) {
        self.errorLabel.text = "";
        if (self.errorLabel.visible) {
            self.loginContainer.remove(self.errorLabel);
            self.errorLabel.visible = false;
        }
        return;
    }

    self.errorLabel.text = error_text;

    if (!self.errorLabel.visible) {
        self.loginContainer.add(self.errorLabel);
        self.errorLabel.visible = true;
    }
};
module.exports = CompanyScreen;
