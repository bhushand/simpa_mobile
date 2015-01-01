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

	var imageView = Titanium.UI.createScrollView({
		contentWidth : Ti.UI.FILL,
		contentHeight : 'auto',

		top : 0,
		bottom : 0,

		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : true,

		//Here you can determine the max and min zoom scale
		maxZoomScale : 2,

	});

    var original_filename;
    
    if(params.original_filename)
        original_filename = params.original_filename;
    else{
        original_filename = Date.now()+".jpg";
    }

	var photoImage = Titanium.UI.createImageView({
		image : params.image,
		originalFilename: original_filename
	});
	
	photoImage.addEventListener('longpress', function(e) {
        var img = this.toBlob();
        bi.ui.saveToPhotoGalleryOverlay(img, e.source.originalFilename);
    });

	imageView.add(photoImage);

	photoWindow.add(imageView);
	return photoWindow;
}

module.exports = PhotoScreen;
