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

    var args = ["nick_name", "gender", "alternate_ph", "father_name", "age", "purpose", "mobile", "sec_mob"];
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
		//Display data from data[0]
        var labelWrapperView = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0,
            top : '10dp',
            layout : 'horizontal'
        });
        var group_view = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '500dp'	  
     	});
        
        var header_view = Ti.UI.createView({
	    	 top : '10dp',
	    	 layout : 'horizontal',
	    	 height:'50dp',
   		 });
    
	    var Label_header = Titanium.UI.createLabel({
	        text : 'Applicant Information',
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
    	 height:'50dp',
	    });
	    var label_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label_title = Titanium.UI.createLabel({
	        text : 'Nick Name',
	        
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
            text : data.result[0].nick_name,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
    var label1_view_wrapper = Ti.UI.createView({
	 top : '10dp',
	 layout : 'horizontal',
	 height:'50dp',
    });
    var label1_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label1_title = Titanium.UI.createLabel({
        text : 'Gender',
        
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
            text : data.result[0].gender,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label2_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label2_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label2_title = Titanium.UI.createLabel({
	        text : 'Alternate Phone Num',
	        
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
            text : data.result[0].alternate_ph,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label3_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label3_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label3_title = Titanium.UI.createLabel({
	        text : "Father's/Husband's Name",
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label3_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label3 = Titanium.UI.createLabel({
            text : data.result[0].father_name,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label4_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label4_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label4_title = Titanium.UI.createLabel({
	        text : 'Age',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label4_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label4 = Titanium.UI.createLabel({
            text : data.result[0].age,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label5_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label5_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label5_title = Titanium.UI.createLabel({
	        text : 'Purpose',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label5_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label5 = Titanium.UI.createLabel({
            text : data.result[0].purpose,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
       
        var label6_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label6_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label6_title = Titanium.UI.createLabel({
	        text : 'Mobile',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label6_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label6 = Titanium.UI.createLabel({
            text : data.result[0].mobile,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label7_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label7_view = Ti.UI.createView({
			 width : '60%',
			 layout : 'horizontal'
	    });
	    var Label7_title = Titanium.UI.createLabel({
	        text : 'Secondary Mobile',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label7_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label7 = Titanium.UI.createLabel({
            text : data.result[0].sec_mob,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        ////Only For Urja Mitra

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
    
	label2_view.add(Label2_title);
    label2_view1.add(Label2);
    label2_view_wrapper.add(label2_view);
    label2_view_wrapper.add(label2_view1);
    group_view.add(label2_view_wrapper);
    
    label3_view.add(Label3_title);
    label3_view1.add(Label3);
    label3_view_wrapper.add(label3_view);
    label3_view_wrapper.add(label3_view1);
    group_view.add(label3_view_wrapper);
    
    label4_view.add(Label4_title);
    label4_view1.add(Label4);
    label4_view_wrapper.add(label4_view);
    label4_view_wrapper.add(label4_view1);
    group_view.add(label4_view_wrapper);
    
    label5_view.add(Label5_title);
    label5_view1.add(Label5);
    label5_view_wrapper.add(label5_view);
    label5_view_wrapper.add(label5_view1);
    group_view.add(label5_view_wrapper);
    
    label6_view.add(Label6_title);
    label6_view1.add(Label6);
    label6_view_wrapper.add(label6_view);
    label6_view_wrapper.add(label6_view1);
    group_view.add(label6_view_wrapper);
    
    label7_view.add(Label7_title);
    label7_view1.add(Label7);
    label7_view_wrapper.add(label7_view);
    label7_view_wrapper.add(label7_view1);
    group_view.add(label7_view_wrapper);
    
    labelWrapperView.add(header_view);
    group_view.add(vline);
	labelWrapperView.add(group_view);
    
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
