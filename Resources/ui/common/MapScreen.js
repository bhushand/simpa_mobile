function MapScreen(parent, params) {
    var Map = require('ti.map');
    var mapWin = Titanium.UI.createWindow({
        title : MAP_TITLE,
        backgroundColor : GRAY,
        barColor : NAV_BAR_COLOR,
        navBarHidden : false,
        translucent : false,
        navTintColor : WHITE,
        layout : 'vertical'
    });


    if (PLATFORM == IPHONE)
        bi.ui.leftNavButton(mapWin);
    else
        bi.ui.actionBar(MAP_TITLE, mapWin);

    var thisLocation = Map.createAnnotation({
        latitude : params.latitude,
        longitude : params.longitude,
        pincolor : Map.ANNOTATION_RED,
        myid : 1 // Custom property to uniquely identify this annotation.
    });

    var mapView = Map.createView({
        mapType : Map.NORMAL_TYPE,
        region : {
            latitude : params.latitude,
            longitude : params.longitude,
            latitudeDelta : 0.01,
            longitudeDelta : 0.01
        },
        animate : true,
        regionFit : true,
        userLocation : true,
        annotations : [thisLocation],
    });

    mapWin.add(mapView);

    return mapWin;
}

module.exports = MapScreen;
