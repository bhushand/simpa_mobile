bi.navigation = {};

bi.navigation.open = function(obj, parent, params, attachment) {

    var window = null;

    //handle open window without parent (notification)
    var navWindow = null;
    var popupWindow = false;
    var cancelText = '';

    if (Titanium.Platform.name != 'android' && parent == null) {
        popupWindow = true;
        parent = Ti.UI.createWindow({
            backgroundColor : LIGHT_GRAY,
            title : "",
            navTintColor : WHITE,
            barColor : NAV_BAR_COLOR,
            translucent : false,
        });
        var navWindow = Titanium.UI.iOS.createNavigationWindow({
            window : parent,
        });
        navWindow.open({
            animated : false
        });
        parent.navWindow = navWindow;
    }

    //clear current idea when leaving an idea page
    if (obj != "idea") {
        bi.current_idea = null;
    }

    switch(obj) {
    case 'customerDetailView':
        var customerDetailView = require('/ui/common/CustomerDetailView');
        window = new customerDetailView(parent, params);
        break;

    case 'customerTabDetail' :
        var customerTabDetail = require('ui/common/CustomerTabDetail');
        window = new customerTabDetail(parent, params);
        break;

    case 'NotificationScreen' :
        var NotificationScreen = require('/ui/common/NotificationScreen');
        window = new NotificationScreen(parent, params);
        break;

    case 'uploadedPhotoGallery':
        var uploadedPhotoGallery = require('/ui/common/UploadedPhotoGallery');
        window = new uploadedPhotoGallery(parent, params);
        break;

    case 'photo':
        var PhotoScreen = require('/ui/common/PhotoScreen');
        window = new PhotoScreen(parent, params);
        break;

    case 'map':
        if (params.latitude && params.longitude) {
            var MapScreen = require('/ui/common/MapScreen');
            window = new MapScreen(parent, params);
        }
        break;
    default :
        var tabDetail = require('ui/common/' + obj);
        window = new tabDetail(parent, params);
        break;

    }

    bi.navigation.close = function() {
        window.close();
    };

    if (Titanium.Platform.name != 'android') {
        if (parent.navWindow) {
            if (popupWindow) {

                var tappingArea = Titanium.UI.createView({
                    height : Titanium.UI.FILL,
                    width : 40,
                    left : 0
                });

                if (cancelText != '') {
                    var backButton = Ti.UI.createLabel({
                        text : "Cancel",
                        color : NAV_BAR_TEXT_COLOR,
                        font : {
                            fontSize : 18,
                            fontWeight : 'normal',
                            fontFamily : 'Helvetica Neue'
                        },
                    });

                    tappingArea.width = Ti.UI.SIZE;
                } else {
                    var backButton = Ti.UI.createLabel({
                        left : 0,
                        text : "\uf104",
                        color : NAV_BAR_TEXT_COLOR,
                        font : {
                            fontSize : '35dp',
                            fontFamily : "FontAwesome"
                        }
                    });
                }

                tappingArea.add(backButton);

                if (PLATFORM == IPHONE) {
                    window.setLeftNavButton(tappingArea);
                }

                tappingArea.addEventListener('click', function(e) {
                    parent.navWindow.close();
                    if (obj == 'advancedComment') {
                        if (params && params.callback) {
                            params.callback(null, null, null, true);
                        }
                    }
                });
                bi.navigation.close = function() {
                    parent.navWindow.close();
                };
            }

            parent.navWindow.openWindow(window, {
                animated : false
            });
        }
    } else {
        window.open();
    }
};

//this function is for android only
bi.navigation.setLeftNavButton = function(btn) {
    bi.ui.leftNavButtonWrapper.remove(bi.ui.leftNavButton);
    bi.ui.leftNavButtonWrapper.add(btn);
    bi.ui.leftNavButton = btn;
};
