function OfficeUseTabView(parent, customer) {
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

    var args = ["roof_type", "applied_before", "last_recharge_date", "ujra_mitra", "ujra_mitra_id", "sale_name", "sale_remark", "submission_date", "asm_name", "asm_remark", "asm_form_date", "asm_receipt_date", "rsa_name", "rsa_remark", "rsa_form_date", "rsa_receipt_date", "credit_remark", "credit_score", "status", "completed_caf", "kyc_complaint", "op_lease", "credit_name", "credit_state", "creation_date", "approved_date", "rejected_date", "paid_date", "cancelled_date"];
    this.GetTabDataFromOdoo(args);

    return customerTabDetailWin;

}

OfficeUseTabView.prototype.GetTabDataFromOdoo = function(args) {
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
OfficeUseTabView.prototype.UI = function(data) {
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
		left : '55%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline1 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '55%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline2 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '55%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline3 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '55%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline4 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '55%',
		backgroundColor:'#000',
		top : '-100%'
    });
    
    var vline5 = Titanium.UI.createView({
    	height:'100%',
		width:1,
		left : '55%',
		backgroundColor:'#000',
		top : '-100%'
    });
	
    
        var labelWrapperView = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0,
            top : '10dp',
            layout : 'horizontal'
        });
        //Only For Urja Mitra
        
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
	        text : 'Only For Urja Mitra',
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
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label_title = Titanium.UI.createLabel({
	        text : 'Type of Roof',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	    });
    	var label_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label = Titanium.UI.createLabel({
            text : data.result[0].roof_type[0],
            
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
        text : 'Material of Roof',
        
        color : BLACK,
        font : {
            fontSize : '15dp',
            fontFamily : 'Helvetica Neue'
        },
    });
    var label1_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
    var Label1 = Titanium.UI.createLabel({
            text : '',
            
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
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label2_title = Titanium.UI.createLabel({
	        text : 'Has the applicant applied before',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
    	var label2_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var anImageView2 = Ti.UI.createImageView({
	        image : '', 
	    });
	    if(data.result[0].applied_before == '0')
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
    	 height:'50dp',
	    });
	    var label3_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label3_title = Titanium.UI.createLabel({
	        text : 'Form Handover from Customer to UM',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label3_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label3 = Titanium.UI.createLabel({
            text : '',
            
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
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label4_title = Titanium.UI.createLabel({
	        text : 'Last Recharge Date',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label4_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label4 = Titanium.UI.createLabel({
            text : data.result[0].last_recharge_date,
            
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
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label5_title = Titanium.UI.createLabel({
	        text : 'Urja Mitra Name',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label5_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label5 = Titanium.UI.createLabel({
            text : data.result[0].ujra_mitra[1],
            
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
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label6_title = Titanium.UI.createLabel({
	        text : 'Ujra Mitra ID',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label6_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label6 = Titanium.UI.createLabel({
            text : data.result[0].ujra_mitra_id,
            
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
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label7_title = Titanium.UI.createLabel({
	        text : 'Receipt Handover from Customer to UM',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label7_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label7 = Titanium.UI.createLabel({
            text : '',
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        //For RSA use only
        var group_view1 = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '300dp'	  
     	});
     	
        var header1_view = Ti.UI.createView({
	    	 top : '10dp',
	    	 layout : 'horizontal',
	    	 height:'50dp',
   		 });
    
	    var Label1_header = Titanium.UI.createLabel({
	        text : 'For RSA use only',
	        width : '100%',
	        color : 'blue',
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	    });
        
        var label8_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label8_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label8_title = Titanium.UI.createLabel({
	        text : 'Name',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	 var label8_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var Label8 = Titanium.UI.createLabel({
            text : data.result[0].rsa_name,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label9_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label9_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label9_title = Titanium.UI.createLabel({
	        text : 'Remark',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label9_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label9 = Titanium.UI.createLabel({
            text : data.result[0].rsa_remark,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label10_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label10_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label10_title = Titanium.UI.createLabel({
	        text : 'Receipt Handover from UM to RSA',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label10_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label10 = Titanium.UI.createLabel({
            text : data.result[0].rsa_receipt_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label11_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label11_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label11_title = Titanium.UI.createLabel({
	        text : 'Form Handover from UM to RSA',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label11_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label11 = Titanium.UI.createLabel({
            text : data.result[0].rsa_form_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
		
		//For ASM use only
		var group_view2 = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '300dp'	  
     	});
     	
		var header2_view = Ti.UI.createView({
	    	 top : '10dp',
	    	 layout : 'horizontal',
	    	 height:'50dp',
   		 });
    
	    var Label2_header = Titanium.UI.createLabel({
	        text : 'For ASM use only',
	        width : '100%',
	        color : 'blue',
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	    });
		
		var label12_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label12_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label12_title = Titanium.UI.createLabel({
	        text : 'Name',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label12_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var Label12 = Titanium.UI.createLabel({
            text : data.result[0].asm_name[1],
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label13_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label13_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label13_title = Titanium.UI.createLabel({
	        text : 'Remark',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label13_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label13 = Titanium.UI.createLabel({
            text : data.result[0].asm_remark,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
	   	 
	   	var label14_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label14_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label14_title = Titanium.UI.createLabel({
	        text : 'Receipt Handover from RSA to Simpa office rep',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label14_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label14 = Titanium.UI.createLabel({
            text : data.result[0].asm_receipt_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label15_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label15_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label15_title = Titanium.UI.createLabel({
	        text : 'Form Handover from RSA to Simpa office rep',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label15_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label15 = Titanium.UI.createLabel({
            text : data.result[0].asm_form_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        
		//For Sales Op use only
		var group_view3 = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '200dp'	  
     	});
     	
     	var header3_view = Ti.UI.createView({
    	 layout : 'horizontal',
    	 height:'50dp',
   		 });
	    var Label3_header = Titanium.UI.createLabel({
	        text : 'For Sales Op use only',
	        width : '100%',
	        color : 'blue',
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	    });
     	
		var label16_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label16_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label16_title = Titanium.UI.createLabel({
	        text : 'Name',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label16_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var Label16 = Titanium.UI.createLabel({
            text : data.result[0].sale_name,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label17_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label17_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label17_title = Titanium.UI.createLabel({
	        text : 'Remark',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label17_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label17 = Titanium.UI.createLabel({
            text : data.result[0].sale_remark,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label18_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label18_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label18_title = Titanium.UI.createLabel({
	        text : 'Date of Submission',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label18_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label18 = Titanium.UI.createLabel({
            text : data.result[0].submission_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        
		//For Credit Use Only
		
		var group_view4 = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '420dp'	  
     	});
		
		var header4_view = Ti.UI.createView({
    	 layout : 'horizontal',
    	 height:'50dp',
   		 });
	    var Label4_header = Titanium.UI.createLabel({
	        text : 'For Credit Use Only',
	        width : '100%',
	        color : 'blue',
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	    });
		
		var label19_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label19_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label19_title = Titanium.UI.createLabel({
	        text : 'Name',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label19_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var Label19 = Titanium.UI.createLabel({
            text : data.result[0].credit_name,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label20_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label20_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label20_title = Titanium.UI.createLabel({
	        text : 'Remark',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	 var label20_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label20 = Titanium.UI.createLabel({
            text : data.result[0].credit_remark,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label21_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label21_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label21_title = Titanium.UI.createLabel({
	        text : 'Credit Score',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label21_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label21 = Titanium.UI.createLabel({
            text : data.result[0].credit_score,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label22_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label22_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label22_title = Titanium.UI.createLabel({
	        text : 'Status',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label22_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label22 = Titanium.UI.createLabel({
            text : data.result[0].status,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label23_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label23_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label23_title = Titanium.UI.createLabel({
	        text : 'Completed CAF',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label23_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var anImageView23 = Ti.UI.createImageView({
	        image : '', 
	    });
	    if(data.result[0].completed_caf == '0')
	    {
	    	anImageView23.image = 'images/checkboxUnchecked.png';
	    }
	    else
	    {
	    	anImageView23.image = 'images/checkboxChecked.png';
	    }
        
        var label24_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label24_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label24_title = Titanium.UI.createLabel({
	        text : 'Op Lease Sign Off',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label24_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var anImageView24 = Ti.UI.createImageView({
	        image : '', 
	    });
	    if(data.result[0].op_lease == '0')
	    {
	    	anImageView24.image = 'images/checkboxUnchecked.png';
	    }
	    else
	    {
	    	anImageView24.image = 'images/checkboxChecked.png';
	    }
        
        var label25_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label25_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label25_title = Titanium.UI.createLabel({
	        text : 'KYC Complaint',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label25_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var anImageView25 = Ti.UI.createImageView({
	        image : '', 
	    });
	    if(data.result[0].kyc_complaint == '0')
	    {
	    	anImageView25.image = 'images/checkboxUnchecked.png';
	    }
	    else
	    {
	    	anImageView25.image = 'images/checkboxChecked.png';
	    }
        
        
		//Stage Dates
		var group_view5 = Ti.UI.createView({
        	 layout : 'horizontal',
        	 height: '300dp'	  
     	});
     	
		var header5_view = Ti.UI.createView({
	         top : '10dp',
	    	 layout : 'horizontal',
	    	 height:'50dp',
         });
        var Label5_header = Titanium.UI.createLabel({
            text : 'Stage Dates',
            width : '100%',
            color : 'blue',
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
		var label26_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label26_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label26_title = Titanium.UI.createLabel({
	        text : 'Creation Date',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label26_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
		var Label26 = Titanium.UI.createLabel({
            text : data.result[0].creation_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label27_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label27_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label27_title = Titanium.UI.createLabel({
	        text : 'Approved Date',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label27_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label27 = Titanium.UI.createLabel({
            text : data.result[0].approved_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label28_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label28_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label28_title = Titanium.UI.createLabel({
	        text : 'Rejected Date',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label28_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label28 = Titanium.UI.createLabel({
            text : data.result[0].rejected_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label29_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label29_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label29_title = Titanium.UI.createLabel({
	        text : 'Paid Off Date',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label29_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label29 = Titanium.UI.createLabel({
            text : data.result[0].paid_date,
            
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        
        var label30_view_wrapper = Ti.UI.createView({
    	 top : '10dp',
    	 layout : 'horizontal',
    	 height:'50dp',
	    });
	    var label30_view = Ti.UI.createView({
			 width : '53%',
			 layout : 'horizontal'
	    });
	    var Label30_title = Titanium.UI.createLabel({
	        text : 'Cancelled Date',
	        
	        color : BLACK,
	        font : {
	            fontSize : '15dp',
	            fontFamily : 'Helvetica Neue'
	        },
	   	 });
	   	var label30_view1 = Ti.UI.createView({
         	 width : '43%',
         	 left: '4%',
         	 layout : 'horizontal',
		});
        var Label30 = Titanium.UI.createLabel({
            text : data.result[0].cancelled_date,
            
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
    
    //For RSA use only 
	header1_view.add(Label1_header);
	
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
      
    //For ASM use only
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
    
    //For Sales Op use only
    header3_view.add(Label3_header);
    
    label16_view.add(Label16_title);
    label16_view1.add(Label16);
    label16_view_wrapper.add(label16_view);
    label16_view_wrapper.add(label16_view1);
    group_view3.add(label16_view_wrapper);
    
    label17_view.add(Label17_title);
    label17_view1.add(Label17);
    label17_view_wrapper.add(label17_view);
    label17_view_wrapper.add(label17_view1);
    group_view3.add(label17_view_wrapper);
    
    label18_view.add(Label18_title);
    label18_view1.add(Label18);
    label18_view_wrapper.add(label18_view);
    label18_view_wrapper.add(label18_view1);
    group_view3.add(label18_view_wrapper);
    
    //For Credit Use Only
    header4_view.add(Label4_header);
    
    label19_view.add(Label19_title);
    label19_view1.add(Label19);
    label19_view_wrapper.add(label19_view);
    label19_view_wrapper.add(label19_view1);
    group_view4.add(label19_view_wrapper);
	
	label20_view.add(Label20_title);
    label20_view1.add(Label20);
    label20_view_wrapper.add(label20_view);
    label20_view_wrapper.add(label20_view1);
    group_view4.add(label20_view_wrapper);
    
    label21_view.add(Label21_title);
    label21_view1.add(Label21);
    label21_view_wrapper.add(label21_view);
    label21_view_wrapper.add(label21_view1);
    group_view4.add(label21_view_wrapper);
    
    label22_view.add(Label22_title);
    label22_view1.add(Label22);
    label22_view_wrapper.add(label22_view);
    label22_view_wrapper.add(label22_view1);
    group_view4.add(label22_view_wrapper);
    
    label23_view.add(Label23_title);
    label23_view1.add(anImageView23);
    label23_view_wrapper.add(label23_view);
    label23_view_wrapper.add(label23_view1);
    group_view4.add(label23_view_wrapper);
    
    label24_view.add(Label24_title);
    label24_view1.add(anImageView24);
    label24_view_wrapper.add(label24_view);
    label24_view_wrapper.add(label24_view1);
    group_view4.add(label24_view_wrapper);
    
    label25_view.add(Label25_title);
    label25_view1.add(anImageView25);
    label25_view_wrapper.add(label25_view);
    label25_view_wrapper.add(label25_view1);
    group_view4.add(label25_view_wrapper);
	
	//Stage Dates
	header5_view.add(Label5_header);
    
    label26_view.add(Label26_title);
    label26_view1.add(Label26);
    label26_view_wrapper.add(label26_view);
    label26_view_wrapper.add(label26_view1);
    group_view5.add(label26_view_wrapper);
    
    label27_view.add(Label27_title);
    label27_view1.add(Label27);
    label27_view_wrapper.add(label27_view);
    label27_view_wrapper.add(label27_view1);
    group_view5.add(label27_view_wrapper);
    
    label28_view.add(Label28_title);
    label28_view1.add(Label28);
    label28_view_wrapper.add(label28_view);
    label28_view_wrapper.add(label28_view1);
    group_view5.add(label28_view_wrapper);
    
    label29_view.add(Label29_title);
    label29_view1.add(Label29);
    label29_view_wrapper.add(label29_view);
    label29_view_wrapper.add(label29_view1);
    group_view5.add(label29_view_wrapper);
    
    
    label30_view.add(Label30_title);
    label30_view1.add(Label30);
    label30_view_wrapper.add(label30_view);
    label30_view_wrapper.add(label30_view1);
    group_view5.add(label30_view_wrapper);
    
    labelWrapperView.add(header_view);
    group_view.add(vline);
	labelWrapperView.add(group_view);
	
	labelWrapperView.add(header1_view);
    group_view1.add(vline1);
	labelWrapperView.add(group_view1);
	
	labelWrapperView.add(header2_view);
    group_view2.add(vline2);
	labelWrapperView.add(group_view2);
	
	labelWrapperView.add(header3_view);
    group_view3.add(vline3);
	labelWrapperView.add(group_view3);
	
	labelWrapperView.add(header4_view);
    group_view4.add(vline4);
	labelWrapperView.add(group_view4);
	
	labelWrapperView.add(header5_view);
    group_view5.add(vline5);
	labelWrapperView.add(group_view5);
	
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
module.exports = OfficeUseTabView;
