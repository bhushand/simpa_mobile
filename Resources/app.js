Ti.include('/branding/Branding.js');
Ti.include('/libs/htmlentities.js');
Ti.include('/libs/md5.js');

prop = Titanium.App.Properties;
// Initialize global BI
bi = require("/ui/platformUtilities/bi");

//shortcut to format label
F = function(format, labels) {
    return bi.label.format(format, labels);
};
GL = function(text) {
    return bi.label.get(text);
};
var joli = {};
// load joli library using Ti.include()
Ti.include('/libs/vendor/joli/joli.js');
joli.connection = new joli.Connection('simpa');

Ti.include('/ui/platformUtilities/Constants.js');
Ti.include('/ui/platformUtilities/ScreenLabels.js');
Ti.include('/ui/platformUtilities/Messages.js');
Ti.include('/ui/platformUtilities/Utilities.js');
Ti.include('/ui/platformUtilities/cache.js');

(function() {

    // load the models definition file
    Ti.include('/libs/model/models.js');

    // initialize the model
    joli.models.initialize();

    var hostname = prop.getString("hostName");
    var session_id = prop.getString("session_id");

    var menu_bar_color = prop.getString("menu_bar_color");
    if (menu_bar_color) {
        NAV_BAR_COLOR = menu_bar_color;
    }
    var menu_bar_text_color = prop.getString("menu_bar_text_color");
    if (menu_bar_text_color) {
        NAV_BAR_TEXT_COLOR = menu_bar_text_color;
    }

    if (Ti.Platform.osname === 'android') {
        bi.ui.screenCount = 0;
        bi.ui.loginScreen = [];
    }

    //Microphone help alert (Access Denied) Popup not to run on first time.
    if (PLATFORM == IPHONE) {
        Titanium.App.Properties.setBool("microphoneAccessOnce", false);
    }

    if (hostname && session_id && 0) {
        bi.sdk.domain = hostname;
        bi.ui.landingPage();

    } else {
        var loginSuccess = function() {
            Ti.API.info("Login Successful");
            bi.ui.landingPage();
        };
        if (PLATFORM == ANDROID) {

            //handle android SSO intent
            var activity = Ti.Android.currentActivity;
            activity.addEventListener("create", function(e) {
                var cmd = activity.getIntent().getData();

                if (cmd) {
                    var arr = cmd.split('=');
                    if (arr[0].indexOf('://brightidea?code=')) {

                        var code = arr[1];
                        bi.sdk.request("https://" + bi.sdk.auth_domain + "/_oauth2/token", "POST", {
                            grant_type : "authorization_code",
                            code : code,
                            redirect_uri : REDIRECT_URI,
                            client_id : bi.sdk.client_id,
                            client_secret : bi.sdk.client_secret,
                        }, function(data) {
                            bi.sdk.access_token = data.access_token;
                            bi.sdk.refresh_token = data.refresh_token;

                            loginSuccess();
                        }, function(e) {

                        });
                    }
                }
            });
        }

        //login page
        var LoginScreen = require("/ui/login/LoginScreen");
        var loginScreen = new LoginScreen();

        var fastlogin = false;

        if (PLATFORM != ANDROID) {
            var cmd = Ti.App.getArguments();
            if (cmd && cmd.url && cmd.url.indexOf('://link') !== -1) {
                var url_parts = cmd.url.split("://");
                var obj = url_parts[0];
                var params = url_parts[1];
                params = getParameters(params);

                if (params.email && params.domain) {
                    prop.setString("email", params.email);
                    prop.setString("hostName", params.domain);
                    fastlogin = true;

                    if (params.idea_id) {
                        prop.setObject("smartbanner", params);
                    }
                }

            }
        }

        loginScreen.start(loginSuccess, fastlogin);

        if (PLATFORM != ANDROID) {
            Titanium.UI.iPhone.appBadge = 0;
        }
    }

})();
