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

    var args = ["spend_energy", "energy_bal", "arable_land", "no_tv", "no_fan", "no_tractors", "no_cars", "no_inverters", "cows_buffaloes", "goats_sheeps", "two_wheelers", "no_chickens", "lender_name", "loan_amount", "outstanding_amount", "emi", "loan_amount2", "emi2", "outstanding_amount2", "lender_name2"];
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
		left : '75%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline1 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '75%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline2 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '75%',
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
    
    //Household Assets and Liabilities
    
     var header_view = Ti.UI.createView({
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var Label_header = Titanium.UI.createLabel({
        text : 'Household Assets and Liabilities',
        width : '100%',
        color : 'blue',
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
     var group_view = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '100dp'	  
     });
    
    var label_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label_title = Titanium.UI.createLabel({
        text : 'Willingness to spend on energy per month',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label = Titanium.UI.createLabel({
        text : data.result[0].spend_energy,
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label1_title = Titanium.UI.createLabel({
        text : 'Energy Days Balance',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label1_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label1 = Titanium.UI.createLabel({
        text : data.result[0].energy_bal,
        
        color : BLACK,
        textAlign:'left',
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    //Household Assets
    var header1_view = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var Label1_header = Titanium.UI.createLabel({
        text : 'Household Assets',
        width : '100%',
        color : 'blue',
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var group_view1 = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '500dp'
    });
    
    var label2_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label2_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label2_title = Titanium.UI.createLabel({
        text : 'Arable land',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
            },
        });
   		var label2_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var Label2 = Titanium.UI.createLabel({
            text : data.result[0].arable_land,
           
        color : BLACK,
        textAlign:'left',
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label3_title = Titanium.UI.createLabel({
        text : 'No. of Cows/Buffaloes',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label3_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label3 = Titanium.UI.createLabel({
        text : data.result[0].cows_buffaloes,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label4_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label4_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label4_title = Titanium.UI.createLabel({
        text : 'No. of Goats/Sheeps',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label4_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label4 = Titanium.UI.createLabel({
        text : data.result[0].goats_sheeps,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label5_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label5_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label5_title = Titanium.UI.createLabel({
        text : 'No. of Chicken',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label5_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label5 = Titanium.UI.createLabel({
        text : data.result[0].no_chickens,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label6_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label6_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label6_title = Titanium.UI.createLabel({
        text : 'No. of Cars',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label6_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label6 = Titanium.UI.createLabel({
        text : data.result[0].no_cars,
       
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label7_title = Titanium.UI.createLabel({
        text : 'No of Two Wheeler',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label7_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label7 = Titanium.UI.createLabel({
        text : data.result[0].two_wheelers,
       
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label8_title = Titanium.UI.createLabel({
        text : 'No of Tractors',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label8_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label8 = Titanium.UI.createLabel({
        text : data.result[0].no_tractors,
       
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label9_title = Titanium.UI.createLabel({
        text : 'No. of T.Vs',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label9_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label9 = Titanium.UI.createLabel({
        text : data.result[0].no_tv,
       
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label10_title = Titanium.UI.createLabel({
        text : 'No. of Inverters',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label10_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label10 = Titanium.UI.createLabel({
        text : data.result[0].no_inverters,
       
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
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label11_title = Titanium.UI.createLabel({
        text : 'No. of Fans',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label11_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label11 = Titanium.UI.createLabel({
        text : data.result[0].no_fan,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    //Household Liabilities
    
    var header2_view = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var Label2_header = Titanium.UI.createLabel({
        text : 'Household Liabilities',
        width : '100%',
        color : 'blue',
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var group_view2 = Ti.UI.createView({
        	 layout : 'horizontal',
        	
        	 width : 'auto'
    });
    
    var label12_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label12_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label12_title = Titanium.UI.createLabel({
        text : 'Lender Name',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label12_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label12 = Titanium.UI.createLabel({
        text : data.result[0].lender_name,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label13_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label13_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label13_title = Titanium.UI.createLabel({
        text : 'Loan Amount',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label13_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label13 = Titanium.UI.createLabel({
        text : data.result[0].loan_amount,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label14_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label14_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label14_title = Titanium.UI.createLabel({
        text : 'Outstanding amount',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label14_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label14 = Titanium.UI.createLabel({
        text : data.result[0].outstanding_amount,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label15_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label15_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label15_title = Titanium.UI.createLabel({
        text : 'E.M.I',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label15_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label15 = Titanium.UI.createLabel({
        text : data.result[0].emi,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label16_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label16_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label16_title = Titanium.UI.createLabel({
        text : 'Lender Name2',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label16_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label16 = Titanium.UI.createLabel({
        text : data.result[0].lender_name2,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label17_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label17_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label17_title = Titanium.UI.createLabel({
        text : 'Loan Amount',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label17_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label17 = Titanium.UI.createLabel({
        text : data.result[0].loan_amount2,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label18_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label18_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label18_title = Titanium.UI.createLabel({
        text : 'Outstanding amount',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label18_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label18 = Titanium.UI.createLabel({
        text : data.result[0].outstanding_amount2,
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    
    var label19_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
    });
    var label19_view = Ti.UI.createView({
		 width : '73%',
		 layout : 'horizontal'
    });
    var Label19_title = Titanium.UI.createLabel({
        text : 'E.M.I',
       
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label19_view1 = Ti.UI.createView({
         	 width : '20%',
         	 left: '4%',
         	 layout : 'horizontal',
	});
    var Label19 = Titanium.UI.createLabel({
        text : data.result[0].emi2,
       
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
	
    //Household Assets and Liabilities

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
    
    
    
	//Household Assets
	header1_view.add(Label1_header);
    
    
	label2_view.add(Label2_title);
    label2_view1.add(Label2);
    label2_view_wrapper.add(label2_view);
    label2_view_wrapper.add(label2_view1);
    group_view1.add(label2_view_wrapper);
    
    label3_view.add(Label3_title);
    label3_view1.add(Label3);
    label3_view_wrapper.add(label3_view);
    label3_view_wrapper.add(label3_view1);
    group_view1.add(label3_view_wrapper);
    
    label4_view.add(Label4_title);
    label4_view1.add(Label4);
    label4_view_wrapper.add(label4_view);
    label4_view_wrapper.add(label4_view1);
    group_view1.add(label4_view_wrapper);
    
    label5_view.add(Label5_title);
    label5_view1.add(Label5);
    label5_view_wrapper.add(label5_view);
    label5_view_wrapper.add(label5_view1);
    group_view1.add(label5_view_wrapper);
    
    label6_view.add(Label6_title);
    label6_view1.add(Label6);
    label6_view_wrapper.add(label6_view);
    label6_view_wrapper.add(label6_view1);
    group_view1.add(label6_view_wrapper);
    
    label7_view.add(Label7_title);
    label7_view1.add(Label7);
    label7_view_wrapper.add(label7_view);
    label7_view_wrapper.add(label7_view1);
    group_view1.add(label7_view_wrapper);
    
    label8_view.add(Label8_title);
    label8_view1.add(Label8);
    label8_view_wrapper.add(label8_view);
    label8_view_wrapper.add(label8_view1);
    group_view1.add(label8_view_wrapper);
    
    label9_view.add(Label9_title);
    label9_view1.add(Label9);
    label9_view_wrapper.add(label9_view);
    label9_view_wrapper.add(label9_view1);
    group_view1.add(label9_view_wrapper);
    
    label10_view.add(Label10_title);
    label10_view1.add(Label10);
    label10_view_wrapper.add(label10_view);
    label10_view_wrapper.add(label10_view1);
    group_view1.add(label10_view_wrapper);
    
    label11_view.add(Label11_title);
    label11_view1.add(Label11);
    label11_view_wrapper.add(label11_view);
    label11_view_wrapper.add(label11_view1);
    group_view1.add(label11_view_wrapper);
      
    //HouseHold Libraries
   	header2_view.add(Label2_header);

    label12_view.add(Label12_title);
    label12_view1.add(Label12);
    label12_view_wrapper.add(label12_view);
    label12_view_wrapper.add(label12_view1);
    group_view2.add(label12_view_wrapper);
    
    label13_view.add(Label13_title);
    label13_view1.add(Label13);
    label13_view_wrapper.add(label13_view);
    label13_view_wrapper.add(label13_view1);
    group_view2.add(label13_view_wrapper);
    
    label14_view.add(Label14_title);
    label14_view1.add(Label14);
    label14_view_wrapper.add(label14_view);
    label14_view_wrapper.add(label14_view1);
    group_view2.add(label14_view_wrapper);
    
    label15_view.add(Label15_title);
    label15_view1.add(Label15);
    label15_view_wrapper.add(label15_view);
    label15_view_wrapper.add(label15_view1);
    group_view2.add(label15_view_wrapper);
    
    label16_view.add(Label16_title);
    label16_view1.add(Label16);
    label16_view_wrapper.add(label16_view);
    label16_view_wrapper.add(label16_view1);
    group_view2.add(label16_view_wrapper);
    
    label17_view.add(Label17_title);
    label17_view1.add(Label17);
    label17_view_wrapper.add(label17_view);
    label17_view_wrapper.add(label17_view1);
    group_view2.add(label17_view_wrapper);
    
    label18_view.add(Label18_title);
    label18_view1.add(Label18);
    label18_view_wrapper.add(label18_view);
    label18_view_wrapper.add(label18_view1);
    group_view2.add(label18_view_wrapper);
    
    label19_view.add(Label19_title);
    label19_view1.add(Label19);
    label19_view_wrapper.add(label19_view);
    label19_view_wrapper.add(label19_view1);
    group_view2.add(label19_view_wrapper);
	
	
    
    labelWrapperView.add(header_view);
    group_view.add(vline);
	labelWrapperView.add(group_view);
	
	labelWrapperView.add(header1_view);
    group_view1.add(vline1);
	labelWrapperView.add(group_view1);
	
	labelWrapperView.add(header2_view);
    group_view2.add(vline2);
	labelWrapperView.add(group_view2);
	
   var scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	});
	
    tabInfoContainer.add(labelWrapperView);
	scrollView.add(tabInfoContainer);
    tabView.add(scrollView);

    self.customerTabDetailWin.add(tabView);

};
module.exports = PersonalInfoTabView;
