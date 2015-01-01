/**
 * Global BI namespace
 */

bi = {};

bi.isInBackground = true;

bi.sdk = (function() {
	var bisdk = require('/ui/api/sdk');
	var sdk = new bisdk(CLIENT_ID, CLIENT_SECRET);
	sdk.auth_domain = "auth" + ROOT_DOMAIN;
	sdk.domain = sdk.auth_domain;
	return sdk;
})();

// Navigation functions
Ti.include('/ui/platformUtilities/bi/navigation.js');

// Utilities functions
Ti.include('/ui/platformUtilities/bi/utils.js');

bi.member = {};

// UI functions
Ti.include('/ui/platformUtilities/bi/ui.js');


bi.log = {};
bi.log.location = function(reference_id, latitude, longitude, member_id, type) {
	if (!longitude || !latitude) {
		var location = JSON.parse(prop.getString('last_known_location'));

		if (location) {
			latitude = location.latitude;
			longitude = location.longitude;
		}

	}

	function sendLocation(address) {
		bi.sdk.call("locationLog", "POST", {
			reference_id : reference_id,
			latitude : latitude,
			longitude : longitude,
			member_id : member_id,
			type : type,
			address : address
		}, function(data) {

		}, function(e) {
			//fail
		}, "application/json");
	}

	if (latitude && longitude) {
		//call google geocode service
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				var georesponse = JSON.parse(this.responseText);
				if (georesponse.results.length > 0) {
					var result = georesponse.results[0];
					if (result.address_components) {
						sendLocation(result.address_components);
					}
				} else {
					sendLocation();
				}
			},
			onerror : function(e) {
				sendLocation();
			},
			timeout : 1000 // in milliseconds
		});
		var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true";
		client.open("GET", url);
		client.send();

	}
};

bi.label = {};
bi.label.labels = prop.getObject("labels");
bi.label.get = function(text) {
	var label;
	var normalized = text.replace(/ /g,"_");
	var key = normalized.toLowerCase();
	
	if(bi.label.labels && bi.label.labels[key]){
		label = bi.label.labels[key];
		
		//use lowercase if text is lowercase
		//We can enhance this part if more robust solution is needed
		if(key==normalized){
			label = label.toLowerCase();
		}
	}
	
    if(typeof BRANDING_LABELS != "undefined" && BRANDING_LABELS[key]){
        label = BRANDING_LABELS[key];
    }
	
	if(!label)
		return text;
	else
		return label;
	
	return text;
};
bi.label.format = function(format, labels){
	for (var i=0; i < labels.length; i++) {
	  var label = labels[i];
	  format = format.replace(label,bi.label.get(label));
	};
	return format;
};

bi.login={};
bi.login.switchAffiliate = function(domain,overlay){
	overlay.show();
					
	
	Ti.App.Cache.delAll();
	
	//reset notification
	if (prop.getString("deviceId")) {
		bi.sdk.call("mobileDevice/" + prop.getString("deviceId"), "DELETE", {}, function(data) {
			prop.setString("deviceId", null);
		}, function(e) {
			prop.setString("deviceId", null);
		});
	}
	
	
	prop.setString("hostName", domain);
	bi.sdk.domain = domain;
	bi.sdk.get("mobileDesign", {email:prop.getString("email")}, function(mobileDesignData) {
		var mobileDesign = mobileDesignData.mobileDesign_list;
	
		prop.setString("affiliateName", mobileDesignData.affiliate_name);
		prop.setString("affiliateId", mobileDesignData.id);
		prop.setString("system_id", mobileDesignData.system_id);
	
		if (mobileDesignData.labels){
			prop.setObject("labels", mobileDesignData.labels);
			bi.label.labels = mobileDesignData.labels;
		}else{
			prop.setObject("labels", null);
			bi.label.labels = null;
		}
		Ti.include('/ui/platformUtilities/ScreenLabels.js');
	
		if (mobileDesignData.options){
			prop.setObject("options", mobileDesignData.options);
			bi.setting.options = mobileDesignData.options;
		}else {
			prop.setObject("options", {});
			bi.setting.options = {};
		}	
			
		NAV_BAR_COLOR = "#009dd9";
		NAV_BAR_TEXT_COLOR = "#ffffff";
		
		if (mobileDesign.length > 0) {
			mobileDesign = mobileDesign[0];
	
			if (mobileDesign.menu_bar_color && mobileDesign.menu_bar_color != "") {
				NAV_BAR_COLOR = "#" + mobileDesign.menu_bar_color;
				prop.setString("menu_bar_color", NAV_BAR_COLOR);
			} else {
				prop.setString("menu_bar_color", null);
			}
	
			if (mobileDesign.menu_bar_text_color && mobileDesign.menu_bar_text_color != "") {
				NAV_BAR_TEXT_COLOR = "#" + mobileDesign.menu_bar_text_color;
				prop.setString("menu_bar_text_color", NAV_BAR_TEXT_COLOR);
			} else {
				prop.setString("menu_bar_text_color", null);
			}
	
		}
		
		if (Ti.Geolocation.locationServicesEnabled) {
			locationUpdate();
			var location = JSON.parse(prop.getString('last_known_location'));
			if(location){
				bi.log.location(prop.getString("affiliateId"), location.latitude, location.longitude, prop.getString("memberId"), 'Login');
			}
		}
		
		overlay.hide();
		bi.ui.landingPage();
		
	}, function(e) {
		
	});

};

bi.setting = {};
bi.setting.options = prop.getObject("options");
bi.setting.isOptionOn = function(key) {
	if(!bi.setting.options)
		return false;
	return bi.setting.options[key];
};

module.exports = bi;
