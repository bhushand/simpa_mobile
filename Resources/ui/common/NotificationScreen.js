function NotificationScreen(parent, params) {
	var self=this;
	var title = "Notifications";
	var options = {
		title : title,
		barColor : NAV_BAR_COLOR,
		backgroundColor : BACKGROUND_GRAY,
		navBarHidden : false,
		translucent : false,
		navTintColor : WHITE
	};
	
	var notificationScreenView = Ti.UI.createView({
		backgroundColor : WHITE,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		left : 0,
		bottom : 0,
		layout : "vertical"
	});
	
	var notificationScreenWin;
	
	if(params && params.returnView){
		notificationScreenWin = Titanium.UI.createView(options);
	}else{
		notificationScreenWin = Titanium.UI.createWindow(options);
			
		var actionBar, globe;
	
		//Left navigation Button on top-left of window
		if (PLATFORM == IPHONE){
			notificationScreenWin.titleControl = titleControl(title);
			bi.ui.leftNavButton(notificationScreenWin);
		}
		else
			actionBar = bi.ui.actionBar(title, notificationScreenWin,notificationScreenView);
	
		//Globe on top-right of window
		if (PLATFORM == IPHONE)
			globe = bi.ui.addGlobeIcon(notificationScreenWin, function(){
					bi.notification.list_view.fireEvent("refresh");
				});
		else
			globe = bi.ui.addGlobeIcon(actionBar, function(){
					bi.notification.list_view.fireEvent("refresh");
				});
				
		notificationScreenWin.addEventListener("close", function(){
			//clear global notification list view
			bi.notification.list_view = null;
			bi.ui.deregisterGlobeIcon(globe);
		});
	}

	var notificationListWrapper = Ti.UI.createView({
		backgroundColor : WHITE,
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
	});

	notificationScreenWin.navWindow = parent.navWindow;

	var NotificationListView = require("/ui/common/NotificationListView");
	var notificationListView = new NotificationListView(notificationScreenWin, {
		request : {
			'type' : [1]
		},
		on_refresh : function(){
			if (bi.notification.notificationCount < 1) {
				markAsReadButton.hide();
				notificationScreenView.bottom = 0;
			} else {
				markAsReadButton.show();
				notificationScreenView.bottom = 50;
			}
		}
	});
	this.notificationListView = notificationListView;
	
	bi.notification.list_view = notificationListView;
	
	
	notificationListView.addEventListener("refresh", function(){
		notificationListView.tableObj.reload_data();
	});


	notificationListWrapper.add(notificationListView);
	notificationScreenView.add(notificationListWrapper);

	//Mark it all as read Using Mark all Button.
	var markAsReadButton = Ti.UI.createButton({
		title : MARK_ALL_AS_READ,
		color : WHITE,
		backgroundColor : NAV_BAR_COLOR,
		height : 50,
		width : Ti.UI.FILL,
		bottom : 0,
		style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
		visible : false
	});

	markAsReadButton.addEventListener('click', function(e) {
		//Immediately Update the UI for notificaiton count and Mark As Read Button.
		bi.notification.notificationCount = 0;
		bi.notification.updateCount();
		markAsReadButton.hide();
		notificationScreenView.bottom = 0;
		
		//update cache
		var list_key = notificationListView.tableObj.list_key;
		var cached_obj = Ti.App.Cache.get(list_key);
		if(cached_obj){
			var cached_list = cached_obj.notification_list;
			for (var i=0; i < cached_list.length; i++) {
				var item = cached_list[i];
				item.read = true;
			};
			Ti.App.Cache.put(list_key, cached_obj, 259200);
		}
		
		//update table
		var rows = notificationListView.tableObj.tableView.sections[0].rows;
		for (var i=0; i < rows.length; i++) {
			rows[i].backgroundColor=WHITE;
		};

		bi.sdk.call("notification/all", "PUT", {
			read : 1
		}, function(data) {
			//success, do nothing
		}, function(e) {
			//fail
			showAlertDialog("Notification", "Failed to mark all notifications as read");
		});
	});
	notificationScreenWin.add(markAsReadButton);

	if (bi.notification.notificationCount > 0) {
		notificationScreenView.bottom = 50;
		markAsReadButton.show();
	} else {
		notificationScreenView.bottom = 0;
		markAsReadButton.hide();
	}

	flurry.logEvent('Notifications screen', {
		affiliate : prop.getString("affiliateName")
	});

	notificationScreenWin.add(notificationScreenView);

	return notificationScreenWin;
}

var advancedTableView = require('/ui/common/AdvancedTableView');
NotificationScreen.prototype = new advancedTableView();
module.exports = NotificationScreen;

