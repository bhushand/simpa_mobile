function CustomerDetailView(parent, customer) {

    var self = this.parent;
    var customerDetailWin = Ti.UI.createWindow({
        title : 'Customer Detail',
        barColor : NAV_BAR_COLOR,
        backgroundColor : WHITE,
        navBarHidden : false,
        translucent : false,
        navTintColor : WHITE,
        layout : 'vertical'
    });

    var actionBar;
    if (PLATFORM == IPHONE) {
        customerDetailWin.navWindow = parent.navWindow;
        customerDetailWin.titleControl = titleControl('Customer Detail', activityListScollToTop);
        bi.ui.leftNavButton(customerDetailWin);
    } else {
        actionBar = bi.ui.actionBar('Customer Detail', customerDetailWin, null, null, activityListScollToTop);
    }

    function activityListScollToTop() {
        bi.ui.activityListScollToTop();
    }

    function sponsorContainer() {

        var sponsorView = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0
        });

        sponsorView.addEventListener('click', debounce(function(e) {
            //bi.navigation.open("member", customerDetailWin, campaignDataObj.sponsor.id);
        }, 500, true));

        var profilePhotoOptions = Ti.UI.createImageView({
            image : customer.image_url,
            width : '80dp',
            height : '80dp',
            left : '7dp',
            top : '7dp',
            bottom : '7dp',
            borderColor : BORDER_GRAY,
            borderRadius : 4
        });

        sponsorView.add(profilePhotoOptions);

        var sponserName = Titanium.UI.createLabel({
            text : customer.full_name,
            width : Ti.UI.SIZE,
            height : '25dp',
            left : '94dp',
            top : '10dp',
            color : BLACK,
            font : {
                fontSize : '17dp',
                fontWeight : 'bold',
                fontFamily : 'Helvetica Neue'
            },
        });
        sponsorView.add(sponserName);

        var sponserLabel = Titanium.UI.createLabel({
            text : 'Mobile: ' + customer.mobile,
            width : Ti.UI.SIZE,
            height : '25dp',
            left : '94dp',
            top : '30dp',
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        sponsorView.add(sponserLabel);

        return sponsorView;

    }

    /*
     for(var i in e) {
     Ti.API.info( i + " :data: " + e[i]);
     obj = e[i];
     for(var j in obj)
     Ti.API.info( j + " :source: " + obj[j]);
     }
     Ti.API.info("source data: " + e.source);
     * */

    function dashboardItems() {
        var dashboardItemsContainer = Ti.UI.createView({
            top : '10dp',
            height : Ti.UI.SIZE,
            width : '100%',
            layout : 'horizontal'
        });

        var dashboardImages = [];
        var dashboardItemNames = ['Personal Info', 'Address', 'Operating Lease', 'Map', 'Income Details', 'Monthly Expenditure', 'As. and Li.', 'KYC Documents', 'Office Use', 'Declaration', 'Options', 'Activities', 'Tickets', 'Notes', 'Uploaded Photo'];
        var dashboardItemFileView = ['PersonalInfoTabView', 'AddressTabView', 'OperatingLeaseTabView', 'MapTabView', 'IncomeDetailsTabView', 'MonthlyExpenditureTabView', 'AsLiTabView', 'KYCDocumentsTabView', 'OfficeUseTabView', 'DeclarationTabView', 'OptionsTabView', 'ActivitiesTabView', 'TicketsTabView', 'NotesTabView', 'UploadedPhotoTabView'];

        for (var i = 0; i < dashboardItemNames.length; i++) {

            var dashboardView = Ti.UI.createView({
                width : '70dp',
                height : '90dp',
                left : '10dp',
                item : dashboardItemNames[i],
                itemFileName : dashboardItemFileView[i]
            });

            dashboardView.addEventListener('click', function(e) {

                if (e.source.item == 'Map') {
                    bi.navigation.open("map", customerDetailWin, {
                        latitude : '19.109331300000000000',
                        longitude : '73.017835999999990000'
                    });
                } else if (e.source.item == 'Uploaded Photo') {
                    bi.navigation.open("uploadedPhotoGallery", customerDetailWin, {
                        title : "Uploaded Photo Gallery",
                    });
                } else if (e.source.item != 'Map') {

                    customer.tabName = e.source.item;
                    bi.navigation.open(e.source.itemFileName, customerDetailWin, customer);
                }
            });

            var profilePhotoOptions = Ti.UI.createImageView({
                width : '55dp',
                height : '55dp',
                left : '5dp',
                top : '5dp',
                bottom : '5dp',
                borderColor : BORDER_GRAY,
                borderRadius : 4,
                item : dashboardItemNames[i],
                itemFileName : dashboardItemFileView[i]
            });
            if (i == 7 || i == 13) {
                profilePhotoOptions.image = '/images/tabIcon/' + i + '.png';
            } else if (i == 9 || i == 11) {
                profilePhotoOptions.image = '/images/tabIcon/' + i + '.gif';
            } else {
                profilePhotoOptions.image = '/images/tabIcon/' + i + '.jpg';
            }
            dashboardView.add(profilePhotoOptions);

            var itemNames = Titanium.UI.createLabel({
                text : dashboardItemNames[i],
                width : Ti.UI.SIZE,
                height : '40dp',
                left : '5dp',
                top : '55dp',
                color : BLACK,
                font : {
                    fontSize : '12dp',
                    fontFamily : 'Helvetica Neue'
                },
                textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
                item : dashboardItemNames[i],
                itemFileName : dashboardItemFileView[i]
            });
            dashboardView.add(itemNames);
            dashboardItemsContainer.add(dashboardView);

        }
        return dashboardItemsContainer;
    }

    function showUserInterface() {

        customerDetailWin.add(sponsorContainer());
        customerDetailWin.add(dashboardItems());
    }

    showUserInterface();

    if (Ti.Geolocation.locationServicesEnabled) {
        locationUpdate();
        var location = JSON.parse(prop.getString('last_known_location'));
        if (location) {
            //bi.log.location(campaignDataObj.id, location.latitude, location.longitude, prop.getString("memberId"), 'Topic View');
        }
    }

    return customerDetailWin;

}

module.exports = CustomerDetailView;
