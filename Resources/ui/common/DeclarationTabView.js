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

    var args = ["signing_date", "signing_place", "secondary_name", "secondary_address", "op_lease", "ref_lines"];
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
	
  		//displaying data from data.result[0]
  		
        var labelWrapperView = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0,
            top : '10dp',
            layout : 'horizontal'
        });
        //Applicant Declaration 
         var header_view = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height:'40dp',
        });
        var Label_header = Titanium.UI.createLabel({
            text : 'Applicant Declaration',
            width : '100%',
            color : 'blue',
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
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
            text : 'Secondary Name Declaration Completed',
            
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
       	var anImageView = Ti.UI.createImageView({
	        image : '',
	    });
	    if(data.result[0].secondary_name == '0')
	    {
	    	anImageView.image = 'images/checkboxUnchecked.png';
	    }
	    else
	    {
	    	anImageView.image = 'images/checkboxChecked.png';
	    }
		
        var label1_view_wrapper = Ti.UI.createView({
        	 top : '10dp',
        	 layout : 'horizontal',
        	 height:'40dp',
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
            text : "Operating Lease Completed *",
            
            
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
       	var anImageView1 = Ti.UI.createImageView({
	        image : ''
	        
	    });
	    if(data.result[0].op_lease == '0')
	    {
	    	anImageView1.image = 'images/checkboxUnchecked.png';
	    }
	    else
	    {
	    	anImageView1.image = 'images/checkboxChecked.png';
	    }
		
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
            text : "Secondary Address Declaration Completed",
            
           
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
        	var anImageView2 = Ti.UI.createImageView({
	    	image : ''
		        
		    });
		    if(data.result[0].secondary_address == '0')
		    {
		    	anImageView2.image = 'images/checkboxUnchecked.png';
		    }
		    else
		    {
		    	anImageView2.image = 'images/checkboxChecked.png';
		    }

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
            text : "Signing Date",
            
            
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
            text : data.result[0].signing_date,
            
            textAlign : 'left',
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
			 width : '60%',
			 layout : 'horizontal'
        });
          var Label4_title = Titanium.UI.createLabel({
            text : "Signing Place",
            
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
            text : data.result[0].signing_place,
            
            textAlign : 'left',
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
         var header2_view = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'40dp',
	    });
	    var Label2_header = Titanium.UI.createLabel({
	        text : 'References',
	        width : '100%',
	        color : 'blue',
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	    });

        label_view.add(Label_title);
        label_view1.add(anImageView);
        label_view_wrapper.add(label_view);
        label_view_wrapper.add(label_view1);
        group_view.add(label_view_wrapper);
        
       
        label1_view.add(Label1_title);
        label1_view1.add(anImageView1);
        label1_view_wrapper.add(label1_view);
        label1_view_wrapper.add(label1_view1);
        group_view.add(label1_view_wrapper);
        
        label2_view.add(Label2_title);
        label2_view1.add(anImageView2);
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
       
        header_view.add(Label_header);
        labelWrapperView.add(header_view);
       
        group_view.add(vline);
        labelWrapperView.add(group_view);
        
        header2_view.add(Label2_header);
    	labelWrapperView.add(header2_view);
    	
        tabInfoContainer.add(labelWrapperView);

    tabView.add(tabInfoContainer);

    self.customerTabDetailWin.add(tabView);

};
module.exports = PersonalInfoTabView;
