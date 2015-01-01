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

    var args = ["name", "last_name", "full_name", "caf", "amc", "rms", "system_id", "product_id", "amt_down_pay", "partial_downpayment", "exp_mon", "payment_type", "dio_type", "create_dio", "Branch", "company_id", "payment_rec"];
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
	
	//Now displaying data from data.result[0]
    
    var labelWrapperView = Ti.UI.createView({
        width : Ti.UI.SIZE,
        height : Ti.UI.SIZE,
        left : 0,
        top : '10dp',
        layout : 'horizontal'
    });
    
    var group_view = Ti.UI.createView({
        	 layout : 'horizontal'
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
        text : 'CAF',
        
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
        text : data.result[0].caf,
        
        textAlign:'left',
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
        text : 'RMS ID',
        
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
        text : data.result[0].rms,
        
        textAlign:'left',
        color : BLACK,
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
        text : 'Product',
        
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
        text : data.result[0].product_id[1],
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label3_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label3_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label3_title = Titanium.UI.createLabel({
        text : 'Downpayment Received',
        
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
    var anImageView = Ti.UI.createImageView({
        image : '', 
    });
    if(data.result[0].payment_rec == '0')
    {
    	anImageView.image = 'images/checkboxUnchecked.png';
    }
    else
    {
    	anImageView.image = 'images/checkboxChecked.png';
    }
    
    var label4_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label4_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label4_title = Titanium.UI.createLabel({
        text : 'Partial Downpayment',
        
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
    var anImageView4 = Ti.UI.createImageView({
        image : '',  
    });
    if(data.result[0].caf == '0')
    {
    	anImageView4.image = 'images/checkboxUnchecked.png';
    }
    else
    {
    	anImageView4.image = 'images/checkboxChecked.png';
    }
    
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
        text : 'Downpayment Received By Create DIO',
        
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
    var anImageView5 = Ti.UI.createImageView({
        image : 'images/checkboxUnchecked.png'
     });
    
    var label6_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label6_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });  
    var Label6_title = Titanium.UI.createLabel({
        text : 'DIO Type',
        
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
    var Label6  = Titanium.UI.createLabel({
        text : data.result[0].dio_type,
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label7_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label7_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label7_title = Titanium.UI.createLabel({
        text : 'AMC',
        
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
    var Label7  = Titanium.UI.createLabel({
        text : data.result[0].amc,
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label8_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label8_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label8_title = Titanium.UI.createLabel({
        text : 'System Id',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label8_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label8  = Titanium.UI.createLabel({
        text : data.result[0].system_id,
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label9_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label9_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label9_title = Titanium.UI.createLabel({
        text : 'Amount of Downpayment',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label9_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label9 = Titanium.UI.createLabel({
        text : data.result[0].amt_down_pay,
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label10_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label10_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label10_title = Titanium.UI.createLabel({
        text : 'Expected Monthly',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label10_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label10 = Titanium.UI.createLabel({
        text : data.result[0].exp_mon,
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label11_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label11_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label11_title = Titanium.UI.createLabel({
        text : 'Payment Type',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label11_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label11 = Titanium.UI.createLabel({
        text : data.result[0].payment_type[1],
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label12_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label12_view = Ti.UI.createView({
		 width : '60%',
		 layout : 'horizontal'
    });
    var Label12_title = Titanium.UI.createLabel({
        text : 'Branch',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label12_view1 = Ti.UI.createView({
         	 width : '35%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label12 = Titanium.UI.createLabel({
        text : data.result[0].company_id[1],
        
        textAlign:'left',
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
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
    label3_view1.add(anImageView);
    label3_view_wrapper.add(label3_view);
    label3_view_wrapper.add(label3_view1);
    group_view.add(label3_view_wrapper);
    
    label4_view.add(Label4_title);
    label4_view1.add(anImageView4);
    label4_view_wrapper.add(label4_view);
    label4_view_wrapper.add(label4_view1);
    group_view.add(label4_view_wrapper);
    
    label5_view.add(Label5_title);
    label5_view1.add(anImageView5);
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
    
    label8_view.add(Label8_title);
    label8_view1.add(Label8);
    label8_view_wrapper.add(label8_view);
    label8_view_wrapper.add(label8_view1);
    group_view.add(label8_view_wrapper);
    
    label9_view.add(Label9_title);
    label9_view1.add(Label9);
    label9_view_wrapper.add(label9_view);
    label9_view_wrapper.add(label9_view1);
    group_view.add(label9_view_wrapper);
    
    label10_view.add(Label10_title);
    label10_view1.add(Label10);
    label10_view_wrapper.add(label10_view);
    label10_view_wrapper.add(label10_view1);
    group_view.add(label10_view_wrapper);
    
    label11_view.add(Label11_title);
    label11_view1.add(Label11);
    label11_view_wrapper.add(label11_view);
    label11_view_wrapper.add(label11_view1);
    group_view.add(label11_view_wrapper);
    
    label12_view.add(Label12_title);
    label12_view1.add(Label12);
    label12_view_wrapper.add(label12_view);
    label12_view_wrapper.add(label12_view1);
    group_view.add(label12_view_wrapper);
    
    var scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	});
    
    group_view.add(vline);
    labelWrapperView.add(group_view);
    tabInfoContainer.add(labelWrapperView);
	scrollView.add(tabInfoContainer);
    tabView.add(scrollView);

    self.customerTabDetailWin.add(tabView);

};
module.exports = PersonalInfoTabView;
