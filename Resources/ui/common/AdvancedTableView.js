function AdvancedTableView() {
	this.has_more = false;
	this.first_loaded = false;
	this.data_list = [];
}

AdvancedTableView.prototype.getTable = function(options) {

	var self = this;
	this.options = options;
	this.rowClick = options.row_click;
	this.singleTap = options.single_tap;
	this.getRow = options.get_row;
	this.container = Ti.UI.createView({
		layout: 'vertical'
	});;
	this.refresh_callback = options.on_refresh;
	this.emptyStatesParams = options.emptyStates;
	this.emptyStatesView = options.container;
	this.addRowOnTop = options.addRowOnTop;
	this.cache = options.cache;
	this.cache_strategy = options.cache_strategy;
	this.popOutButton = options.popOutButton;
	this.updateCount = options.updateCount;

	var tableHeight = options.tableHeight;
	var scrollable = options.scrollable;

	var tableOptions = {
		backgroundColor : WHITE,
		separatorColor : 'transparent',
		height : tableHeight,
		scrollable : scrollable
	};
	if (options.backgroundColor) {
		this.backgroundColor = options.backgroundColor;
		tableOptions.backgroundColor = options.backgroundColor;
	}

	if (options.table) {
		tableOptions = options.table;
	}
	if (typeof options.tableVisible != "undefined")
		tableOptions.visible = options.tableVisible;

	var separatorColor = this.tableView = Titanium.UI.createTableView(tableOptions);

	var tableView = this.tableView;

	if (PLATFORM != ANDROID) {
		this.get_pull_refresher();
	}else{
		this.get_loading();
	}
	this.get_dynamic_scroll();

	var Navigator = require("/ui/api/ApiNavigator");
	var navigator = new Navigator(options.model, options.request_params);
	this.navigator = navigator;
	this.tableView.addEventListener('click', function(e) {
		navigator.data_list = self.data_list;
		navigator.total = self.total_item;
		navigator.nav_index = e.index;
		navigator.params = JSON.parse(JSON.stringify(self.options.request_params));
		
		e.navigator = navigator;
		self.rowClick(e.row.data, e);
	});

	if(this.singleTap) {
		this.tableView.addEventListener('singletap', function(e) {
			if(!e.source.cancelClick) {
				self.singleTap(e.row.data, e);
			}
		});
	}
	
	var hash = JSON.stringify(this.options.request_params);
	var list_key = md5(this.options.model+hash);
	this.list_key = list_key;

	setTimeout(function(){
		self.load_data_async();
	},0);
	
	this.container.add(this.tableView);

	return this;
};

AdvancedTableView.prototype.reload_data = function(){
	var self=this;
	
	self.load_data_async(true);
};

AdvancedTableView.prototype.load_data = function(refresh_only, force_reload) {
	var self = this;
	if (refresh_only)
		this.options.request_params["page"] = 1;
	else
		this.options.request_params["page"]++;

	if(typeof force_reload == "undefined") {force_reload = false;}

	

	function load_data_internal(data,cached){
		if (data[self.options.model + "_list"].length == 0 && data.stats.page_count == 0 && self.emptyStatesParams) {
			self.emptyState = bi.ui.emptyStates(self.emptyStatesView, self.emptyStatesParams);
		}

		var rows = [];
		var id_mapping = {};

		if (self.addRowOnTop && data.stats.current_page == 1) {
			rows.push(self.addRowOnTop);
		}

		var data_list = data[self.options.model + "_list"];
		
		if(refresh_only)
			self.data_list = data_list;
		else{
			var new_data_list = self.data_list.concat(data_list);
			self.data_list = new_data_list;
		}
		
		
		if(self.cache_strategy=="fetch_new" && data[self.options.model + "_list"].length>0 && data.stats.current_page == 1){
			self.timestamp = data[self.options.model + "_list"][0].timestamp;
		}
		
		for (var i = 0; i < data[self.options.model + "_list"].length; i++) {
			var rowdata = data[self.options.model+"_list"][i];
			var row = self.getRow(rowdata);
			rows.push(row);
			
			if(!self.first_loaded && rowdata.id){
				id_mapping[rowdata.id] = i;
			}
		}

		var total = data["stats"]["page_count"];
		self.total_item = data["stats"]["total"];

		if(self.updateCount) {
			self.updateCount(data[self.options.model + "_list"].length);
		}

		if (data.stats.current_page == total && self.popOutButton == true) {

			var extra_row = Ti.UI.createTableViewRow({
				backgroundColor : WHITE,
				height : 80,
				selectionStyle : 'transparent',
			});
			rows.push(extra_row);
		}

		if (total > self.options.request_params["page"]) {
			self.has_more = true;
		} else {
			self.has_more = false;
		}		

		if (refresh_only)
			self.tableView.data = [];
		
			
		self.tableView.appendRow(rows);
		

		if (refresh_only) {
			self.end_pull_refresher();
			if (self.refresh_callback && !cached)
				self.refresh_callback(data);
		} else {
			self.end_update();
		}
		
		
		if(!self.first_loaded)	{
			self.id_mapping = id_mapping;
			
			if(self.start_id)
				self.scrollToId(self.start_id);
		}
			
		self.first_loaded=true;

		if(!cached && self.cache && self.options.request_params["page"]==1){
			Ti.App.Cache.put(self.list_key, data, 259200);
		}
	}
	
	
	function prepend_data_internal(data){
		if (self.emptyState) {
			self.emptyStatesView.remove(self.emptyState);
		}

		var rows = [];
		var id_mapping = {};


		var data_list = data[self.options.model + "_list"];
		
		if(data[self.options.model + "_list"].length == 0){
			self.end_pull_refresher();
			return;
		}
			
		
		if(self.cache_strategy=="fetch_new"){
			self.timestamp = data[self.options.model + "_list"][0].timestamp;
		}
		
		for (var i = 0; i < data[self.options.model + "_list"].length; i++) {
			var rowdata = data[self.options.model+"_list"][i];
			var row = self.getRow(rowdata);
			rows.push(row);
			
			if(!self.first_loaded && rowdata.id){
				id_mapping[rowdata.id] = i;
			}
		}
		
		//do regular appendrows if table is empty
		if(self.tableView.data.length==0){
			self.tableView.appendRow(rows);
		}else{
			for (var i = rows.length - 1; i >= 0; i--){
				self.tableView.insertRowBefore(0, rows[i]);  
			};
		}
		
		
		
		self.end_pull_refresher();
		if (self.refresh_callback)
			self.refresh_callback(data);

		var total = data["stats"]["page_count"];
		self.total_item = data["stats"]["total"];

		//update cache
		var cached_list = self.cached_obj[self.options.model + "_list"];
		cached_list.unshift.apply(cached_list,data_list);
		if(cached_list.length>20){
			self.cached_obj[self.options.model + "_list"] = cached_list.slice(0,20);
		}
		self.cached_obj.stats.total += data.stats.total;
		Ti.App.Cache.put(self.list_key, self.cached_obj, 259200);
		
	}

	//only cache first page	
	var etag = null;
	if(this.cache && this.options.request_params["page"]==1){
		var cached_obj = Ti.App.Cache.get(self.list_key);
		if(cached_obj){
			etag = cached_obj.etag;
			self.cached_obj = cached_obj;
			
			//restrict the cached list to 20 items. (fix existing issue with oversize cache)
			var cached_list = self.cached_obj[self.options.model + "_list"];
			if(cached_list.length>20){
                self.cached_obj[self.options.model + "_list"] = cached_list.slice(0,20);
                Ti.App.Cache.put(self.list_key, self.cached_obj, 259200);
            }
		}
			
	}	
		
		
	if(!force_reload && cached_obj){
		load_data_internal(cached_obj,true);
	}

	
	if(!this.cache_strategy || !refresh_only || !cached_obj){
		
		if(!cached_obj && refresh_only){
			self.begin_reloading(false);
		}
		
	
		//based on etag only
		bi.sdk.get(this.options.model, this.options.request_params, function(data) {
			if(data.no_update){
				self.end_pull_refresher();
			}else{
				load_data_internal(data);
			}
			
			
		}, function(e) {
			//on fail, do nothing
			if (refresh_only) {
				self.end_pull_refresher();
			} else {
				self.end_update();
			}
		}, etag);
	}else{
		if(this.cache_strategy=="fetch_new"){
			self.begin_reloading(false);
			
			//only fetch new data on refresh
			var fetch_params = JSON.parse(JSON.stringify(self.options.request_params));
			fetch_params.since = self.timestamp;
			bi.sdk.get(this.options.model, fetch_params, function(data) {
				if(data.no_update){
					self.end_pull_refresher();
				}else{
					prepend_data_internal(data);
				}
				
				
			}, function(e) {
				//on fail, do nothing
				if (refresh_only) {
					self.end_pull_refresher();
				} else {
					self.end_update();
				}
			}, etag);
		}
	}
	
};


AdvancedTableView.prototype.setStartId = function(id) {
	if(this.first_loaded){
		this.scrollToId(id);
	}else{
		this.start_id = id;
	}
	
};

AdvancedTableView.prototype.scrollToId = function(id) {
	var self=this;
	if(this.id_mapping){
		id = naked_id(id);
		var row = this.id_mapping[id];
		if(row){
			if(PLATFORM!=ANDROID){
				self.tableView.scrollToIndex(row+2);
			}else{
				self.tableView.scrollToIndex(row);
			}
			
		}
			
		
	}
	
};
AdvancedTableView.prototype.prepend = function(rowData) {
	var row = this.getRow(rowData);
	this.tableView.insertRowBefore(0, row);
	return row;
};

AdvancedTableView.prototype.get_loading = function() {
	var self = this;
	var tableHeader = Ti.UI.createView({
		backgroundColor : WHITE,
		width : Ti.UI.FILL,
		height : 50,
		layout : "horizontal",
	});

	if (self.backgroundColor)
		tableHeader.backgroundColor = self.backgroundColor;

	var statusLabel = Ti.UI.createLabel({
		text : "Loading",
		left : "30%",
		top : 15,
		bottom : 15,
		height : Titanium.UI.SIZE,
		color : "#808080",
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 13,
			fontWeight : "bold"
		}
	});

	var style;
	if (PLATFORM != ANDROID) {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	} else {
		style = Ti.UI.ActivityIndicatorStyle.DARK;
	}
	var actInd = Titanium.UI.createActivityIndicator({
		left : 5,
		top : 8,
		bottom : 10,
		width : 30,
		height : 30,
		style : style
	});
	
	if(PLATFORM == ANDROID){
		statusLabel.left = "40%";
		actInd.top = 10;
	}

	tableHeader.add(statusLabel);
	tableHeader.add(actInd);
	actInd.show();

	function endReloading() {
		tableHeader.height = 0;
	}


	this.end_pull_refresher = endReloading;

	this.container.add(tableHeader);
	
	function beginReloading() {
		tableHeader.height = 50;
	}
	
	this.load_data_async = function(force){
		self.load_data(true,force);
	};
	
	this.begin_reloading = beginReloading;
};

AdvancedTableView.prototype.get_pull_refresher = function() {
	var tableView = this.tableView;
	var self = this;
	var tableHeader = Ti.UI.createView({
		backgroundColor : WHITE,
		width : Ti.UI.FILL,
		height : 50
	});

	if (self.backgroundColor)
		tableHeader.backgroundColor = self.backgroundColor;

	var arrow = Ti.UI.createLabel({
		text : "\uf176",
		left : 23,
		bottom : 10,
		color : "#808080",
		font : {
				fontSize : 20,
				fontFamily : "FontAwesome"
			},
	});

	var statusLabel = Ti.UI.createLabel({
		text : "Pull to reload",
		left : 55,
		width : 200,
		bottom : 15,
		height : Titanium.UI.SIZE,
		color : "#808080",
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 13,
			fontWeight : "bold"
		}
	});

	var style;
	if (PLATFORM != ANDROID) {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	} else {
		style = Ti.UI.ActivityIndicatorStyle.DARK;
	}
	var actInd = Titanium.UI.createActivityIndicator({
		left : 190,
		bottom : 8,
		width : 30,
		height : 30,
		style : style
	});

	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(actInd);

	tableView.headerPullView = tableHeader;

	var pulling = false;
	var reloading = false;

	function beginReloading(firstLoad) {
		reloading = true;
		pulling = false;
		arrow.hide();
		actInd.show();
		if (firstLoad)
			statusLabel.text = "Loading";
		else
			statusLabel.text = "Reloading";

		tableView.setContentInsets({
			top : 50
		}, {
			animated : true
		});
		tableView.scrollToTop(-50, true);
		arrow.transform = Ti.UI.create2DMatrix();
	}


	this.begin_reloading = beginReloading;
	
	this.load_data_async = function(force){
		self.load_data(true,force);
	};

	function endReloading() {
		// when you're done, just reset
		
		tableView.setContentInsets({
			top : 0
		}, {
			animated : true
		});
		
		reloading = false;
		statusLabel.text = "Pull down to refresh";
		actInd.hide();
		arrow.show();
	}


	this.end_pull_refresher = endReloading;

	tableView.addEventListener('scroll', function(e) {
		var offset = e.contentOffset.y;
		if (offset < -50.0 && !pulling && !reloading) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = "Release to refresh";
		} else if ((offset > -50.0 && offset < 0 ) && pulling && !reloading) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({
				transform : t,
				duration : 180
			});
			statusLabel.text = "Pull down to refresh";
		}
	});

	tableView.addEventListener('dragEnd', function() {
		if (pulling && !reloading) {

			beginReloading(false);
			self.load_data(true, true);
		}
	});
};

AdvancedTableView.prototype.get_dynamic_scroll = function() {
	var tableView = this.tableView;
	var self = this;

	var updating = false;
	var loadingRow = Ti.UI.createTableViewRow();

	var tableLoading = Ti.UI.createView({
		backgroundColor : WHITE,
		width : Ti.UI.FILL,
		height : 50,
		layout : "horizontal",
	});
	if (self.backgroundColor)
		tableLoading.backgroundColor = self.backgroundColor;
		
	var statusLabel = Ti.UI.createLabel({
		text : "Loading more",
		left : "30%",
		top : 15,
		bottom : 15,
		height : Titanium.UI.SIZE,
		color : "#808080",
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 13,
			fontWeight : "bold"
		}
	});

	var style;
	if (PLATFORM != ANDROID) {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	} else {
		style = Ti.UI.ActivityIndicatorStyle.DARK;
	}
	var actInd = Titanium.UI.createActivityIndicator({
		left : 5,
		top : 8,
		bottom : 10,
		width : 30,
		height : 30,
		style : style
	});
	
	if(PLATFORM == ANDROID){
		actInd.top = 10;
	}

	tableLoading.add(statusLabel);
	tableLoading.add(actInd);
	actInd.show();
	loadingRow.add(tableLoading);

	function beginUpdate() {
		updating = true;

		tableView.appendRow(loadingRow);

		self.load_data(false);
	}

	function endUpdate() {
		updating = false;

		if (PLATFORM != ANDROID) {
			tableView.deleteRow(loadingRow, {
				animationStyle : Titanium.UI.iPhone.RowAnimationStyle.NONE
			});
		} else {
			tableView.deleteRow(loadingRow, {});
		}

	}


	this.end_update = endUpdate;

	var lastDistance = 0;
	// calculate location to determine direction

	tableView.addEventListener('scroll', function(e) {
		if (!self.has_more)
			return;

		if (PLATFORM != ANDROID) {
			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;

			// going down is the only time we dynamically load,
			// going up we can safely ignore -- note here that
			// the values will be negative so we do the opposite
			if (distance < lastDistance) {
				// adjust the % of rows scrolled before we decide to start fetching
				//var nearEnd = theEnd * .75;

				if (!updating && (total >= theEnd)) {
					beginUpdate();
				}
			}
			lastDistance = distance;
		} else {
			if (!updating && (e.totalItemCount < e.firstVisibleItem + e.visibleItemCount + 3)) {
				beginUpdate();
			}
		}
	});

};

AdvancedTableView.prototype.clear_cache = function() {
	Ti.App.Cache.del(this.list_key);
};
module.exports = AdvancedTableView;
