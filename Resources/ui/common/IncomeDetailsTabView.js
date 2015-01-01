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

    var args = ["salary_lines", "business_lines", "agriculture_lines", "contract_lines", "desc", "net_profit", "avg_income"];
    this.GetTabDataFromOdoo(args);

    return customerTabDetailWin;

}

PersonalInfoTabView.prototype.GetTabDataFromOdoo = function(args) {
    var self = this;
    var request_params = {
        "jsonrpc" : "2.0",
        "method" : "call",
        "params" : {
            "model" : "res.partner",
            "method" : "read",
            "args" : [[self.customer.id], args],
            "kwargs" : {
                "context" : {
                    "lang" : "en_US",
                    "tz" : false,
                    "uid" : prop.getString("uid"),
                    "search_default_customer" : 1,
                    "rms" : 1,
                    "default_customer" : 1,
                    "bin_size" : true,
                    "future_display_name" : true
                }
            },
            "session_id" : prop.getString("session_id"),
            "context" : {
                "lang" : "en_US",
                "tz" : false,
                "uid" : prop.getString("uid")
            }
        },
        "id" : "r516"
    };
    bi.sdk.call('dataset/call_kw', "POST", request_params, function(data) {
        self.UI(data);
    }, function(e) {
        //on fail, do nothing
        return e;
    }, "application/json");
};
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
	
	var vline = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '62%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline1 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '62%',
		backgroundColor:'#000',
		top : '-100%'
    });
	
	//display data from data[0].result
    var labelWrapperView = Ti.UI.createView({
        width : Ti.UI.SIZE,
        height : Ti.UI.SIZE,
        left : 0,
        top : '10dp',
        layout : 'horizontal'
    });
    
    var group_view = Ti.UI.createView({
    	 layout : 'horizontal',
    	 height: '100dp'	  
 	});
        
    var header_view = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
	 });

    var Label_header = Titanium.UI.createLabel({
        text : 'Other sources',
        width : '100%',
        color : 'blue',
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
     
    var label_view_wrapper = Ti.UI.createView({
	 top : '10dp',
	 layout : 'horizontal',
	 height:'40dp',
    });
    var label_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label_title = Titanium.UI.createLabel({
        text : 'Description',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
	var label_view1 = Ti.UI.createView({
     	 width : '35%',
     	 left: '4%',
     	 layout : 'horizontal',
	});
    var Label = Titanium.UI.createLabel({
        text : data.result[0].desc,
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
        
    var label1_view_wrapper = Ti.UI.createView({
	 top : '10dp',
	 layout : 'horizontal',
	 height:'40dp',
    });
    var label1_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label1_title = Titanium.UI.createLabel({
        text : 'Net profit/month (Rs.)',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label1_view1 = Ti.UI.createView({
     	 width : '35%',
     	 left: '4%',
     	 layout : 'horizontal',
	});
    var Label1 = Titanium.UI.createLabel({
        text : data.result[0].net_profit,
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var group_view1 = Ti.UI.createView({
    	 layout : 'horizontal',
    	 height: '50dp'	  
 	});
 	
	var header1_view = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
	 });

    var Label1_header = Titanium.UI.createLabel({
        text : 'Total Income',
        width : '100%',
        color : 'blue',
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
	
	var label2_view_wrapper = Ti.UI.createView({
	 top : '10dp',
	 layout : 'horizontal',
	 height:'40dp',
    });
    var label2_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label2_title = Titanium.UI.createLabel({
        text : 'Average Monthly Income (Rs.)',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
   	 });
   	var label2_view1 = Ti.UI.createView({
     	 width : '35%',
     	 left: '4%',
     	 layout : 'horizontal',
	});
	var Label2 = Titanium.UI.createLabel({
        text : data.result[0].avg_income,
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    header_view.add(Label_header);
    
    
    label_view.add(Label_title);
    label_view1.add(Label);
    label_view_wrapper.add(label_view);
    label_view_wrapper.add(label_view1);
    group_view.add(label_view_wrapper);
    
   
    label1_view.add(Label1_title);
    label1_view1.add(Label1);
    label1_view_wrapper.add(label1_view);
    label1_view_wrapper.add(label1_view1);
    group_view.add(label1_view_wrapper);
    
    header1_view.add(Label1_header);
	
    label2_view.add(Label2_title);
    label2_view1.add(Label2);
    label2_view_wrapper.add(label2_view);
    label2_view_wrapper.add(label2_view1);
    group_view1.add(label2_view_wrapper);
    
    labelWrapperView.add(header_view);
    group_view.add(vline);
	labelWrapperView.add(group_view);
	
	labelWrapperView.add(header1_view);
    group_view1.add(vline1);
	labelWrapperView.add(group_view1);
        
    var scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true
	});


        
    tabInfoContainer.add(labelWrapperView);
	scrollView.add(tabInfoContainer);
    tabView.add(scrollView);
    self.customerTabDetailWin.add(tabView);

};
module.exports = PersonalInfoTabView;
