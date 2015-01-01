function AdvancedTableView() {
    this.has_more = false;
    this.list_size = 0;
}

AdvancedTableView.prototype.getTable = function(options) {

    var self = this;
    this.options = options;
    this.rowClick = options.row_click;
    this.getRow = options.get_row;
    this.getTemplate = options.get_template;
    this.container = Ti.UI.createView({
        layout : 'vertical'
    });
    this.emptyStatesParams = options.emptyStates;
    this.emptyStatesView = options.container;
    this.cache = options.cache;
    this.popOutButton = options.popOutButton;
    this.listSection = Titanium.UI.createListSection();
    this.fromChallengeSelection = options.fromChallengeSelection;

    var addExtraSpace = Ti.UI.createView({
        backgroundColor : BACKGROUND_GRAY,
        width : Ti.UI.FILL,
        height : "80dp"
    });

    // Add the list section to a list view
    this.listView = Titanium.UI.createListView({
        sections : [this.listSection],
        templates : {
            "default" : self.getTemplate()
        },
        defaultItemTemplate : 'default',

        backgroundColor : BACKGROUND_GRAY,
        minRowHeight : '60dp',
        separatorColor : 'transparent',
        footerView : addExtraSpace
    });

    var listView = this.listView;

    if (PLATFORM != ANDROID) {
        this.get_pull_refresher();
    }
    listView.addEventListener('marker', function(e) {
        if (self.has_more) {
            self.get_footer_view();
            self.load_data();
        }

    });

    this.listView.addEventListener('itemclick', function(e) {
        var item = e.section.getItemAt(e.itemIndex);
        self.rowClick(item.data);
    });

    listView.addEventListener("reload", function() {
        if (PLATFORM != ANDROID) {
            self.begin_reloading(true);
        } else {
            self.get_loading();
            self.load_data(true);
        }
    });

    listView.fireEvent("reload");

    this.container.add(this.listView);

    return this;
};

AdvancedTableView.prototype.load_data = function(refresh_only, force_reload) {
    var self = this;
    if (refresh_only)
        this.options.request_params.params["offset"] = 0;
    else
        this.options.request_params.params["offset"] += this.options.request_params.params["limit"];

    if ( typeof force_reload == "undefined") {
        force_reload = false;
    }

    var hash = JSON.stringify(this.options.request_params);
    var list_key = md5(this.options.model + hash);

    function load_data_internal(data) {
        if (data.result.records.length == 0) {
            bi.ui.emptyStates(self.emptyStatesView, self.emptyStatesParams);
        }
        var rows = [];
        for (var i = 0; i < data.result.records.length; i++) {
            var d = data.result.records[i];

            if (d != undefined) {
                var row = self.getRow(d);
                row.data = d;
                rows.push(row);
               /* var exists = joli.models.get('customer').findById('id', "'" + d.id + "'");
                Ti.API.info('exists: ' + exists);

                var customerRecord = models.customer.newRecord(d);
                customerRecord.save();

                Ti.API.info('Count: ' + models.customer.count());*/
            }

        }

        //Ti.API.info(joli.models.get('customer').findBy('full_name',"'Aaram singh'"));
        var total = data.result.length;

        if (total > self.options.request_params.params["offset"]) {
            self.has_more = true;

        } else {
            self.has_more = false;
            self.listView.footerView = null;
        }

        if (refresh_only) {
            self.list_size = rows.length;
            self.listSection.setItems(rows);
        } else {
            self.list_size += rows.length;
            self.listSection.appendItems(rows);
        }

        self.listView.setMarker({
            sectionIndex : 0,
            itemIndex : (self.list_size - 5)
        });

        if (refresh_only) {
            self.end_reloading();
        }

        if (self.cache && self.options.request_params.params["offset"] == 0) {
            Ti.App.Cache.put(list_key, data, 259200);
        }

    }

    //only cache first page
    var etag = null;
    if (this.cache && this.options.request_params.params["offset"] == 0) {
        var cached_obj = Ti.App.Cache.get(list_key);
        if (cached_obj)
            etag = cached_obj.etag;
    }

    if (!force_reload && cached_obj) {
        load_data_internal(cached_obj);
    }

    bi.sdk.call(this.options.model, "POST", this.options.request_params, function(data) {
        if (data.no_update) {
            if (refresh_only) {
                if (PLATFORM != ANDROID) {
                    self.end_reloading();
                }
            } else {
                self.end_update();
            }
        } else {
            load_data_internal(data);
        }

    }, function(e) {
        //on fail, do nothing
        if (refresh_only) {
            if (PLATFORM != ANDROID) {
                self.end_reloading();
            }
        } else {
            self.end_update();
        }
    }, "application/json");
};

AdvancedTableView.prototype.get_footer_view = function() {
    var tableView = this.tableView;
    var self = this;

    var updating = false;
    var loadingRow = Ti.UI.createTableViewRow();

    var tableLoading = Ti.UI.createView({
        backgroundColor : BACKGROUND_GRAY,
        width : Ti.UI.FILL,
        height : 50,
        layout : "horizontal",
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

    tableLoading.add(statusLabel);
    tableLoading.add(actInd);
    actInd.show();

    this.listView.footerView = tableLoading;
};

AdvancedTableView.prototype.get_loading = function() {
    var self = this;
    var tableHeader = Ti.UI.createView({
        backgroundColor : BACKGROUND_GRAY,
        width : Ti.UI.FILL,
        height : 50,
        layout : "horizontal",
    });

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

    if (PLATFORM == ANDROID) {
        statusLabel.left = "40%";
        actInd.top = 10;
    }

    tableHeader.add(statusLabel);
    tableHeader.add(actInd);

    //this is crashing for android when logout and login
    if (PLATFORM != ANDROID)
        actInd.show();

    function endReloading() {
        self.container.remove(tableHeader);
    }


    this.end_reloading = endReloading;

    this.container.add(tableHeader);
};

AdvancedTableView.prototype.get_pull_refresher = function() {
    var listView = this.listView;
    var self = this;
    var tableHeader = Ti.UI.createView({
        backgroundColor : BACKGROUND_GRAY,
        width : Ti.UI.FILL,
        height : 50
    });

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

    var style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;

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

    listView.pullView = tableHeader;

    var pulling = false;
    var reloading = false;

    function beginReloading(firstLoad) {
        reloading = true;
        pulling = false;
        arrow.hide();
        actInd.show();
        if (firstLoad === true)
            statusLabel.text = "Loading";
        else {
            statusLabel.text = "Reloading";
            firstLoad = false;
        }

        listView.setContentInsets({
            top : 50
        }, {
            animated : true
        });

        arrow.transform = Ti.UI.create2DMatrix();
        self.load_data(true, !firstLoad);
    }


    this.begin_reloading = beginReloading;

    function endReloading() {
        // when you're done, just reset
        listView.setContentInsets({
            top : 0
        }, {
            animated : true
        });
        reloading = false;
        statusLabel.text = "Pull down to refresh";
        actInd.hide();
        arrow.show();
    }


    this.end_reloading = endReloading;

    function pullListener(e) {

        if (e.active == false) {
            pulling = false;
            var t = Ti.UI.create2DMatrix();
            arrow.animate({
                transform : t,
                duration : 180
            });
            statusLabel.text = "Pull down to refresh";
        } else {
            var t = Ti.UI.create2DMatrix();
            t = t.rotate(-180);
            pulling = true;
            arrow.animate({
                transform : t,
                duration : 180
            });
            statusLabel.text = "Release to refresh";
        }
    }


    listView.addEventListener('pull', pullListener);
    listView.addEventListener('pullend', beginReloading);

};

module.exports = AdvancedTableView;
