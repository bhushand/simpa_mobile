function PersonalInfoTabView(parent, customer) {
    this.parent = parent;
    this.customer = customer;
    var self = this;

    var customerTabDetailWin = Ti.UI.createWindow({
        title : customer.tabName,
        barColor : NAV_BAR_COLOR,
        backgroundColor : WHITE,
        navBarHidden : false,
        translucent : false,
        navTintColor : WHITE,
        layout : 'vertical'
    });
    this.customerTabDetailWin = customerTabDetailWin;
    var actionBar;
    if (PLATFORM == IPHONE) {
        customerTabDetailWin.navWindow = parent.navWindow;
        customerTabDetailWin.titleControl = titleControl(customer.tabName, activityListScollToTop);
        bi.ui.leftNavButton(customerTabDetailWin);
    } else {
        actionBar = bi.ui.actionBar(customer.tabName, customerTabDetailWin, null, null, activityListScollToTop);
    }

    function activityListScollToTop() {
        bi.ui.activityListScollToTop();
    }

    var request_params = {
        "jsonrpc" : "2.0",
        "method" : "call",
        "params" : {
            "model" : "simpa.ticket",
            "method" : "read",
            "args" : [self.customer.ticket_ids, ["name", "date", "problem_desc", "state"]],
            "kwargs" : {
                "context" : {
                    "lang" : "en_US",
                    "tz" : false,
                    "uid" : prop.getString("uid")
                }
            },
            "session_id" : prop.getString("session_id"),
            "context" : {
                "lang" : "en_US",
                "tz" : false,
                "uid" : prop.getString("uid")
            }
        },
        "id" : "r154"
    };
    bi.sdk.call('dataset/call_kw', "POST", request_params, function(data) {
        Ti.API.info(data);
        self.UI(data);
    }, function(e) {
        //on fail, do nothing

    }, "application/json");

    return customerTabDetailWin;

}

PersonalInfoTabView.prototype.UI = function(data) {
    var self = this;
    var tabView = Titanium.UI.createView({
        left : 0,
        right : 0,
        height : Ti.UI.SIZE,
        layout : 'vertical'
    });

    var tabInfoContainer = Titanium.UI.createView({
        top : 3,
        left : 8,
        right : 8,
        bottom : 8,
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout : 'vertical'
    });

    //for (var i = 0; i < data.result.length; i++) {
        var labelWrapperView = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0,
            top : '10dp',
            layout : 'horizontal'
        });
        var Label = Titanium.UI.createLabel({
            text : 'Page Under Construction.',
            width : '75%',
            height : '25dp',
            left : '5dp',
            top : '30dp',
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        labelWrapperView.add(Label);

        tabInfoContainer.add(labelWrapperView);
   //}

    tabView.add(tabInfoContainer);

    self.customerTabDetailWin.add(Label);

};
module.exports = PersonalInfoTabView;
