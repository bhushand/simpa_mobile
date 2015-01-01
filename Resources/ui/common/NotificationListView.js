Ti.include('/libs/htmlentities.js');
function getRow(notification) {
	
	var self=this;
	var row = Ti.UI.createTableViewRow({
		backgroundColor : WHITE,
		data : notification,
		selectionStyle : 'none',
	});

	var imageUrl = notification.image_url;

	var profile = notification.profile,
		checkDefault = profile.substring(profile.length-17);

	if(checkDefault == 'profile_50x50.png') {
		imageUrl = null;
	}

	var profilePhotoOptions = {
		photoUrl : imageUrl, 
		screenName : notification.screen_name[0],
		wrapperTop : 8,
		wrapperLeft : 5,
		fontSize : 22,
		wrapperSize : 53,
		photoSize : 53,
		border : false
	};

	var profilePhotoWrapper = bi.ui.getProfilePhoto(profilePhotoOptions);

	profilePhotoWrapper.addEventListener("click", function(e) {
		e.cancelBubble = true;
		if(notification.sender_member_id)
			bi.navigation.open("member", self.parent, notification.sender_member_id);
	});
	
	row.add(profilePhotoWrapper);

	var notificationDataView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		left : 66,
		top : 0,
		layout : 'vertical'
	});

	var activityView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		left : 0,
		top : 0,
		layout : 'vertical'
	});
	notificationDataView.add(activityView);

	switch(notification.action_type) {
		case 1:
			//ACTION_TYPE_IDEA
			activity_icon = "\uf02b";
			break;

		case 2:
			//ACTION_TYPE_IDEA_TAG
			activity_icon = "\uf02b";
			break;

		case 3:
			//ACTION_TYPE_COMMENT_IDEA
			activity_icon = "\uf075";
			break;

		case 4:
			//ACTION_TYPE_VOTE_IDEA
			activity_icon = "\uF0DC";
			break;

		case 5:
			//ACTION_TYPE_COMMENT_IDEA
			activity_icon = "\uf075";
			break;

		case 6:
			//ACTION_TYPE_COMMENT_IDEA
			activity_icon = "\uf075";
			break;

		case 18:
			//ACTION_TYPE_USER_ACTIVITY_TAG
			activity_icon = "\uf075";
			break;

		case 19:
			//ACTION_TYPE_USER_IDEA_TAG
			activity_icon = "\uf075";
			break;

		case 31:
			//ACTION_TYPE_WEBSTORM_BLOG_POSTED
			activity_icon = "/images/other/blogiconccc.png";
			break;

		case 34:
			//ACTION_TYPE_VOTE_COMMENT
			activity_icon = "\uf0dc";
			break;

		case 35:
			//ACTION_TYPE_IDEA_FAVORITE
			activity_icon = "\uf0eb";
			break;

		case 36:
			//ACTION_TYPE_IDEA_SUBSCRIBE
			activity_icon = "\uf0eb";
			break;

		case 37:
			//ACTION_TYPE_USER_ACTIVITY_COMMENT
			activity_icon = "\uf075";
			break;

		case 38:
			//ACTION_TYPE_USER_ACTIVITY_COMMENT_GROUP
			activity_icon = "\uf075";
			break;

		case 39:
			//TYPE_COMMENT_IDEA_SUBSCRIBED
			activity_icon = "\uf075";
			break;

		case 40:
			//ACTION_TYPE_WEBSTORM_CREATE
			activity_icon = "\uf0e7";
			break;

		case 43:
			//ACTION_TYPE_WEBSTORM_BLOG_POSTED
			activity_icon = "/images/other/blogiconccc.png";
			break;
			
		case 44:
            //ACTION_TYPE_NEW_WEBSTORM_CUSTOM_NOTIFICATION
            activity_icon = "\uf0e7";
            break;

		default:
			activity_icon = "\uf02b";
			break;
	}

	var screenNameLabel = Ti.UI.createLabel({
		text : notification.screen_name[0],
		left : 0,
		height : '25dp',
		top : 2,
		color : TEXT_DARK,
		font : {
			fontSize : 16,
			fontFamily : 'Helvetica Neue',
			fontWeight : 'bold'
		},
	});

	activityView.add(screenNameLabel);

	var bodyView = Ti.UI.createView({
		top : 2,
		left : 0,
		right : '5dp',
		height : Ti.UI.SIZE,
		layout : 'horizontal'
	});

	activityView.add(bodyView);

	var excluded_tag = ["COMMENT","TWEET","TAG"];
	
	notification.description = notification.description.replace(/'@/g, "'");
    notification.description = notification.description.replace(/ @/g, " ");
	if(PLATFORM!=ANDROID){
		var attributes = [];
		if(notification.tags){
			for (var i=0; i < notification.tags.length; i++) {
				var tag=notification.tags[i];
				if(excluded_tag.indexOf(tag.type)==-1){
					attributes.push({
						type: Ti.UI.iOS.ATTRIBUTE_FONT,
		           		value: { fontWeight: 'bold' },
		            	range: [tag.start, tag.length]
					});
				}
				
			};
		}
		
		var attr = Titanium.UI.iOS.createAttributedString({
		    text: notification.description,
		    attributes: attributes
		});
		
		var bodyLabel = Ti.UI.createLabel({
			height : Ti.UI.SIZE,
			top : 0,
			left : 0,
			attributedString : attr,
			color : GRAY,
			font : {
				fontSize : '14dp',
				fontFamily : 'Helvetica Neue'
			}
		});
	
		bodyView.add(bodyLabel);
	}else{
		var text = notification.description;
		var attributes = [];
		if(notification.tags){
			for (var i=0; i < notification.tags.length; i++) {
				var tag=notification.tags[i];
				if(excluded_tag.indexOf(tag.type)==-1){
					var replace = text.substring(tag.start, tag.start+tag.length);
					attributes.push(replace);
				}
			};
			
			for (var i=0; i < attributes.length; i++) {
				var attr=attributes[i];
				text=text.replace(attr,"<b>"+attr+"</b>");
			};
		}
		
		var font_size = 14 * (Titanium.Platform.displayCaps.dpi / 160);
		var baseCSS = '<style type="text/css">body { font-size: ' + font_size + 'px; color: #C0C0C0;} a { color: #00B2FF; } </style>';
		var StyledLabel = require('ti.styledlabel');
		var bodyLabel = StyledLabel.createLabel({
			height : Ti.UI.SIZE || 'auto',
			top : 5,
			right : 5,
			bottom : 5,
			left : 5,
			html : baseCSS + text
		});

		bodyView.add(bodyLabel);
	}
	
	var bottomFont = 12;

	if(PLATFORM == ANDROID) {
		bottomFont = 14;
	}

	//Shows Activity Image, Campaign Name and Posted Date
	var bottomContainer = Titanium.UI.createView({
		top : '10dp',
		height : '25dp',
		width : '100%',
		left : 0,
		layout : 'horizontal'
	});

	if(notification.action_type == 31 || notification.action_type == 43) {
		var activity_icon = Ti.UI.createImageView({
			image: activity_icon,
			height : 12,
			width : 12
		});
	} else {
		var activity_icon = Ti.UI.createLabel({
			text : activity_icon,
			color : TAG_BORDER,
			font : {
				fontSize : bottomFont,
				fontFamily : "FontAwesome"
			},
		});
	}

	bottomContainer.add(activity_icon);

	var campaignName = Titanium.UI.createLabel({
		text : notification.campaign_name,
		left : 5,
		width : '45%',
		height : 20,
		color : TAG_BORDER,
		font : {
			fontSize : bottomFont,
			fontFamily : 'Helvetica Neue'
		},
		elliptize : true
	});
	bottomContainer.add(campaignName);

	var dateLabel = Titanium.UI.createLabel({
		text : notification.date,
		textAlign : Titanium.UI.TEXT_ALIGNMENT_RIGHT,
		right : 5,
		width : '40%',
		height : 20,
		color : TAG_BORDER,
		font : {
			fontSize : bottomFont,
			fontFamily : 'Helvetica Neue'
		}
	});

	bottomContainer.add(dateLabel);

	notificationDataView.add(bottomContainer);

	row.add(notificationDataView);

	var line = Ti.UI.createView({
		backgroundColor : COMMENT_BACK,
		top : 0,
		bottom : 4,
		left : 4,
		right : 4,
		width : Ti.UI.FILL,
		height : 1
	});

	row.add(line);

	if (!notification.read) {
		row.backgroundColor = UNREAD_ROW_COLOR;
	}

	return row;
}

function rowClick(notification, e) {
	if (notification.reference_type) {
		var params = notification.reference_id;

		if ([3, 5, 18, 19, 37, 38, 39].indexOf(notification.action_type) > -1) {
			params = {
				id : notification.reference_id,
				comment_id : notification.comment_id
			};
		}
		bi.navigation.open(notification.reference_type, this.parent, params);
		
		flurry.logEvent('Tapped on a notification', {
			affiliate : prop.getString("affiliateName"),
			notificationType : notification.reference_type
		});
	}

	if (e.row.backgroundColor==WHITE) {
		return;
	}

	e.row.backgroundColor = WHITE;
	
	//update cache
	var cached_obj = Ti.App.Cache.get(this.list_key);
	if(cached_obj){
		var cached_list = cached_obj.notification_list;
		for (var i=0; i < cached_list.length; i++) {
			var item = cached_list[i];
			if(item.id==notification.id){
				item.read = true;
			}
		};
		Ti.App.Cache.put(this.list_key, cached_obj, 259200);
	}
		

	bi.notification.notificationCount--;
	bi.notification.updateCount();

	bi.sdk.call("notification/" + notification.id, "PUT", {
		read : 1
	}, function(data) {
		//success
	}, function(e) {
		//fail
	});
}

function NotificationListView(parent, params) {

	this.parent = parent;
	var self = this;
	var request_params = {};
	if ( typeof params["request"] != "undefined") {
		request_params = params["request"];
	}

	var notificationListView = Titanium.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		left : 0,
		top : 0,
		bottom : 0
	});
	var emptyStates = {
		icon : '\uf0ac',
		text : "You do not have any notifications."
	};

	var tableObj = this.getTable({
		model : "notification",
		request_params : request_params,
		get_row : getRow,
		row_click : rowClick,
		container : notificationListView,
		on_refresh : function(data) {
			bi.notification.notificationCount = data.stats.unread;
			bi.notification.updateCount();
			
			params.on_refresh();
		},
		emptyStates : emptyStates,
		cache: true,
		cache_strategy: "fetch_new"
	});
	
	
	notificationListView.add(tableObj.container);
	
	notificationListView.tableObj = tableObj;

	return notificationListView;
}

var advancedTableView = require('/ui/common/AdvancedTableView');
NotificationListView.prototype = new advancedTableView();

module.exports = NotificationListView;

