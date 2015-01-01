function MemberLandingScreen() {
    var NappDrawerModule = require('dk.napp.drawer');

    function smartBannerLink() {
        if (PLATFORM != ANDROID) {
            var cmd = Ti.App.getArguments();
            if (cmd && cmd.url && cmd.url != bi.cmdurl) {
                bi.cmdurl = cmd.url;
                if (bi.cmdurl.indexOf('://link') !== -1) {
                    var url_parts = bi.cmdurl.split("://");
                    var obj = url_parts[0];
                    var params = url_parts[1];
                    params = getParameters(params);

                    if (params.email && params.domain && params.email.toLowerCase() != prop.getString("email").toLowerCase()) {
                        //different user, logout
                        bi.ui.logout(function() {
                            Ti.App.removeEventListener("resumed", resume);
                            Ti.App.removeEventListener("pause", pause);
                            //drawer.close();
                        }, function() {
                            prop.setString("email", params.email);
                            prop.setString("hostName", params.domain);

                            if (params.idea_id) {
                                prop.setObject("smartbanner", params);
                            }
                        });
                        return;
                    }

                    if (params.s && params.s != prop.getString("system_id")) {
                        //loading screen for member loading
                        var loadingScreen = Ti.UI.createWindow({
                            backgroundColor : WHITE,
                            navBarHidden : true,
                        });

                        //Put in wrapper in case spinner was necessary
                        var overlayContentWrapper = Ti.UI.createView({
                            height : Ti.UI.SIZE,
                            width : Ti.UI.SIZE,
                            top : 140,
                            layout : 'vertical'
                        });

                        var lightBulbWrapper = Ti.UI.createImageView({
                            image : '/images/login/bulb.png',
                            weight : 74,
                            height : 104
                        });
                        var spinner = Titanium.UI.createActivityIndicator({
                            top : 20,
                        });
                        if (PLATFORM == IPHONE) {
                            spinner.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
                        } else {
                            spinner.style = Titanium.UI.ActivityIndicatorStyle.BIG_DARK;
                        }

                        overlayContentWrapper.add(lightBulbWrapper);
                        overlayContentWrapper.add(spinner);
                        loadingScreen.add(overlayContentWrapper);
                        spinner.show();
                        loadingScreen.show = loadingScreen.open;
                        loadingScreen.hide = loadingScreen.close;
                        bi.login.switchAffiliate(params.domain, loadingScreen);

                        if (params.idea_id) {
                            prop.setObject("smartbanner", params);
                        }
                        return;
                    }

                    if (params.idea_id) {
                        bi.navigation.open("idea", null, params.idea_id);
                    }
                }
            }

        }
    }

    function resume(e) {
        smartBannerLink();

        //bi.notification.fetch();
        bi.isInBackground = false;
    }

    function pause(e) {
        bi.isInBackground = true;
        bi.current_idea = null;
    }

    function createMenuWindow() {
        var win = Ti.UI.createView({
            backgroundColor : NAV_BAR_COLOR,
            layout : 'vertical'
        });

        var self = this;

        var menuTitles = ['Customer Search', 'Advanced Customer Search', "Retry to upload Data", 'Sync Your Data', 'Settings', 'Logout'];
        var menuImages = [ICON1, ICON2, ICON3, ICON4, ICON7, ICON8];

        var navBack = Ti.UI.createView({
            backgroundColor : WHITE,
            height : Ti.UI.FULL
        });

        var tableView = Ti.UI.createTableView({
            top : 20,
            left : 0,
            height : '470dp',
            backgroundColor : WHITE,
            separatorInsets : {
                left : 0,
                right : 0
            },
            separatorColor : 'transparent',
            scrollable : false,
            showVerticalScrollIndicator : false
        });
        if (PLATFORM == ANDROID) {
            tableView.top = 0;
        }
        for (var i = 0; i < 6; i++) {

            var tableViewRow = Ti.UI.createTableViewRow({
                backgroundColor : WHITE,
                height : '45dp',
                clickName : 'row',
                selectedBackgroundColor : '#EFEEEC'
            });

            var navImageParentView = Ti.UI.createView({
                height : '30dp',
                width : '40dp',
                left : '5dp'
            });

            var customFont = {
                fontSize : 16,
                fontFamily : "Helvetica Neue",
                fontWeight : "normal"
            };

            var navImage = Ti.UI.createLabel({
                text : menuImages[i],
                color : '#d1d1d1',
                font : {
                    fontSize : 23,
                    fontFamily : "FontAwesome"
                }

            });
            customFont.fontWeight = "normal";

            navImageParentView.add(navImage);
            tableViewRow.add(navImageParentView);

            var navTitle = Titanium.UI.createLabel({
                text : menuTitles[i],
                width : 180,
                height : 23,
                left : 50,
                color : 'gray',
                font : customFont,
            });

            tableViewRow.add(navTitle);

            var hr = Ti.UI.createView({
                height : 1,
                width : Ti.UI.FILL,
                backgroundColor : BACKGROUND_GRAY,
                bottom : 0
            });
            tableViewRow.add(hr);
            tableView.appendRow(tableViewRow);
        }
        tableView.addEventListener("click", function(e) {
            var rowIndex = e.index;

            switch(rowIndex) {
            case 0:
                var newWin = createNavWindow("CustomerListView", 'Customer Search');
                drawer.setCenterWindow(newWin);
                drawer.toggleLeftWindow();

                break;

            case 1:
                var newWin = createNavWindow("CustomerListView", ' Advanced Customer Search');
                drawer.setCenterWindow(newWin);
                drawer.toggleLeftWindow();

                break;

            case 2:
                drawer.toggleLeftWindow();

                break;

            case 3:
                drawer.toggleLeftWindow();

                break;

            case 4:
                var newWin = createNavWindow("SettingsScreen", SETTINGS);
                drawer.setCenterWindow(newWin);
                drawer.toggleLeftWindow();

                break;

            case 5:
                bi.ui.logout(function() {
                    Ti.App.removeEventListener("resumed", resume);
                    Ti.App.removeEventListener("pause", pause);
                    //drawer.close();
                });
                break;
            }
        });

        win.add(navBack);

        var biLogo = Titanium.UI.createImageView({
            image : '/images/navigationImages/bi_logo_nav.png',
            width : '120dp',
            height : '15dp',
            bottom : '30dp'
        });

        navBack.add(tableView);
        navBack.add(biLogo);
        return win;
    }

    function createNavWindow(screen, title, param) {

        var self = this;

        //clear global notification list view
        //bi.notification.list_view = null;

        if (PLATFORM == IPHONE) {
            var memberLandingWin = Ti.UI.createWindow({
                backgroundColor : LIGHT_GRAY,
                navTintColor : WHITE,
                barColor : NAV_BAR_COLOR,
                translucent : false,
                fromDrawer : 1,
            });

            // NavigationWindow
            navWindow = Titanium.UI.iOS.createNavigationWindow({
                window : memberLandingWin
            });
            memberLandingWin.navWindow = navWindow;
            memberLandingWin.drawer = drawer;

            var leftNavView = Ti.UI.createView({
                height : 40,
                width : 40,
                left : 0,
                visible : true, //Set this visible false if you need to remove the whole globe icon.
            });

            // Top left button
            if (screen == 'PostIdeaScreen') {
                var menuLabel = Ti.UI.createLabel({
                    text : "Cancel",
                    color : NAV_BAR_TEXT_COLOR,
                    left : 0,
                    font : {
                        fontSize : '18dp',
                    }
                });
            } else {
                var menuLabel = Ti.UI.createLabel({
                    text : "\uf0c9",
                    color : NAV_BAR_TEXT_COLOR,
                    left : 0,
                    font : {
                        fontSize : '25dp',
                        fontFamily : "FontAwesome"
                    }
                });
            }
            leftNavView.add(menuLabel);
            memberLandingWin.setLeftNavButton(leftNavView);

            var rightNavView = Ti.UI.createView({
                height : 40,
                width : 40,
                right : 0,
                backgroundColor : 'transparent',
                visible : true, //Set this visible false if you need to remove the whole globe icon.
                borderRadius : 3,
            });
            memberLandingWin.setRightNavButton(rightNavView);

            leftNavView.addEventListener('click', function(e) {
                drawer.toggleLeftWindow();
            });

            //construct UI
            if (screen == 'CustomerListView') {

                var CustomerListView = require('/ui/common/' + screen);
                var customerList = new CustomerListView(memberLandingWin, title);

                memberLandingWin.add(customerList);
            } else {
                //load component dependencies
                var SimpaScreen = require('/ui/common/' + screen);
                //construct UI
                if (screen == 'ProfileScreen') {

                    var simpaScreen = new SimpaScreen(memberLandingWin, "me");
                } else if (screen == 'GlobalFeedScreen') {
                    var simpaScreen = new SimpaScreen(memberLandingWin, title);
                } else {
                    memberLandingWin.titleControl = titleControl(title);
                    var simpaScreen = new SimpaScreen(memberLandingWin, {
                        returnView : true
                    });
                }

                memberLandingWin.add(simpaScreen);
            }

            return navWindow;

        } else {
            var memberLandingWin = Ti.UI.createView({
                fromDrawer : 1,
                layout : 'vertical'
            });

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

            if (screen == 'PostIdeaScreen') {
                var menuLabel = Ti.UI.createLabel({
                    text : "Cancel",
                    color : NAV_BAR_TEXT_COLOR,
                    left : '5dp',
                    font : {
                        fontSize : '18dp',
                    }
                });
            } else {
                var menuLabel = Ti.UI.createLabel({
                    text : "\uf0c9",
                    color : NAV_BAR_TEXT_COLOR,
                    font : {
                        fontSize : '25dp',
                        fontFamily : "FontAwesome"
                    }
                });
            }

            menuButtonWrapper.add(menuLabel);
            if (screen == 'ProfileScreen') {
                bi.ui.leftNavButtonWrapper = menuButtonWrapper;
                bi.ui.leftNavButton = menuLabel;
            }
            menuButtonWrapper.addEventListener("click", function() {
                Ti.App.fireEvent('profileChanged');
                Titanium.UI.Android.hideSoftKeyboard();
                setTimeout(function() {
                    drawer.toggleLeftWindow();
                }, 200);

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
            if (screen == CustomerListView) {
                var searchBarHeight = '31dp';
                if (PLATFORM == ANDROID) {
                    searchBarHeight = Ti.UI.SIZE;
                }
                var searchBar = Titanium.UI.createTextField({
                    left : '10dp',
                    right : '10dp',
                    hintText : 'Search',
                    borderColor : 'transparent',
                    height : searchBarHeight,
                    width : Ti.UI.FILL,
                    backgroundColor : '#f0f0f0',
                    backgroundImage : 'none',
                    borderRadius : 8,
                    borderWidth : 0,
                    font : {
                        fontSize : '13dp'
                    },
                    paddingLeft : '30dp',
                    clearButtonMode : Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
                    returnKeyType : Titanium.UI.RETURNKEY_SEARCH,
                    keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
                    editable : false,
                });
                this.searchBar = searchBar;

                var searchView = Ti.UI.createView({
                    left : 0,
                    height : '44dp',
                    backgroundColor : NAV_BAR_COLOR,

                });

                if (PLATFORM == IPHONE) {
                    var ios_ver = Titanium.Platform.version.split(".");
                    if (ios_ver[0] == 7)
                        searchView.top = "20dp";
                }

                var searchIcon = Ti.UI.createLabel({
                    left : '20dp',
                    text : "\uf002",
                    color : "#b6b6b6",
                    font : {
                        fontSize : '13dp',
                        fontFamily : "FontAwesome"
                    }

                });

                searchView.add(searchBar);
                if (PLATFORM == IPHONE)
                    searchView.add(searchIcon);

                searchBar.addEventListener('touchend', function(e) {

                });

                actionBar.add(searchView);

            } else {
                actionBar.add(centerLabel);
            }

            memberLandingWin.add(actionBar);
            memberLandingWin.actionBar = actionBar;
            //load component dependencies
            var SimpaScreen = require('/ui/common/' + screen);
            //construct UI
            if (screen == 'ProfileScreen') {
                centerLabel.addEventListener('click', function(e) {
                    if ( typeof (bi.ui.ideaListScollToTop) === "function") {
                        bi.ui.ideaListScollToTop();
                    }
                    if ( typeof (bi.ui.tagListScollToTop) === "function") {
                        bi.ui.tagListScollToTop();
                    }
                });
                var simpaScreen = new SimpaScreen(memberLandingWin, "me");
            } else if (screen == 'GlobalFeedScreen') {
                centerLabel.addEventListener('click', function(e) {
                    bi.ui.activityListScollToTop();
                });
                var simpaScreen = new SimpaScreen(memberLandingWin, {});
            } else if (screen == 'CustomerListView') {
                centerLabel.addEventListener('click', function(e) {
                    bi.ui.customerListScollToTop();
                });
                var simpaScreen = new SimpaScreen(memberLandingWin, {});
            } else {
                var simpaScreen = new SimpaScreen(memberLandingWin, {
                    returnView : true
                });
            }

            memberLandingWin.add(simpaScreen);

            return memberLandingWin;
        }

    }

    function createCenterNavWindow() {
        return createNavWindow("CustomerListView", 'Customer Search');
    }

    var drawer;

    if (Ti.Geolocation.locationServicesEnabled) {
        locationUpdate();
    }

    //loading screen for member loading
    var loadingScreen = Ti.UI.createWindow({
        backgroundColor : WHITE,
        navBarHidden : true,
    });

    var spinner = Titanium.UI.createActivityIndicator({
        top : 20,
    });
    if (PLATFORM == IPHONE) {
        spinner.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
    } else {
        spinner.style = Titanium.UI.ActivityIndicatorStyle.BIG_DARK;
    }

    loadingScreen.open();
    spinner.show();

    Ti.API.info("Access Token: " + bi.sdk.access_token);

    var mainWindow = createCenterNavWindow();

    if (PLATFORM == IPHONE) {
        drawer = NappDrawerModule.createDrawer({
            leftWindow : createMenuWindow(),
            centerWindow : mainWindow,
            closeDrawerGestureMode : NappDrawerModule.CLOSE_MODE_ALL,
            openDrawerGestureMode : NappDrawerModule.OPEN_MODE_PANNING_CENTERWINDOW,
            showShadow : true, //no shadow in iOS7
            leftDrawerWidth : '250dp',
            orientationModes : [Ti.UI.PORTRAIT],
            animationMode : NappDrawerModule.ANIMATION_PARALLAX_FACTOR_3
        });
    } else {
        drawer = NappDrawerModule.createDrawer({
            fullscreen : false,
            navBarHidden : true,
            leftWindow : createMenuWindow(),
            centerWindow : mainWindow,
            fading : 0.3, // 0-1
            parallaxAmount : 0.4, //0-1
            shadowWidth : "40dp",
            leftDrawerWidth : "250dp",
            animationMode : NappDrawerModule.ANIMATION_NONE,
            closeDrawerGestureMode : NappDrawerModule.MODE_MARGIN,
            openDrawerGestureMode : NappDrawerModule.MODE_ALL,
            orientationModes : [Ti.UI.PORTRAIT],
            exitOnClose : true
        });
    }

    //This Event Listener is used to perform any operation on left window Open.
    if (PLATFORM == ANDROID) {
        drawer.addEventListener("windowDidOpen", function(e) {
            setTimeout(function() {
                Titanium.UI.Android.hideSoftKeyboard();
            }, 350);
        });
    }

    //This Event Listener is used to perform any operation on left window Close.
    drawer.addEventListener("windowDidClose", function(e) {
        //Implement the logic if any, to perform on drawer close.
    });

    drawer.open();

    bi.drawer = drawer;

    Ti.App.fireEvent('profileChanged');

    //smartBannerLink();

    //bi.notification.registerForPushNotifications();
    //bi.notification.fetch();

    /*setTimeout(function() {
     bi.isInBackground = false;

     var smartbanner = prop.getObject("smartbanner");
     if (smartbanner) {

     if (smartbanner.s == prop.getString("system_id")) {
     if (smartbanner.idea_id) {
     bi.navigation.open("idea", null, smartbanner.idea_id);
     }
     }
     prop.setObject("smartbanner", null);
     }
     }, 1000);*/

    Ti.App.addEventListener("resumed", resume);
    Ti.App.addEventListener("pause", pause);

    loadingScreen.close();

    /*function(e) {
     //failed to refresh access token, redirect to login page
     bi.ui.logout(function() {
     Ti.App.removeEventListener("resumed", resume);
     Ti.App.removeEventListener("pause", pause);
     //drawer.close();
     });
     });*/

}

module.exports = MemberLandingScreen;
