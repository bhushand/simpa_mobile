function PhotoScreen(parent, params) {

    var data = params.data;
    var self = this;
    this.data = data;
    
    var title=params.title;

    var photoWindow = Titanium.UI.createWindow({
        layout : 'vertical',
        backgroundColor : 'black',
        translucent : false,
        navTintColor : WHITE,
        barColor : NAV_BAR_COLOR,
    });
    
    //Left navigation Button on top-left of window
    if (PLATFORM == IPHONE){
        photoWindow.titleControl = titleControl(title);
        bi.ui.leftNavButton(photoWindow);
    }
        
    else
        actionBar = bi.ui.actionBar(title, photoWindow);

    return photoWindow;
}

module.exports = PhotoScreen;
