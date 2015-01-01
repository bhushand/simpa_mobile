function ViewImageScreen(imageFile, index) {

	//create component instance
	var viewImageWin = Ti.UI.createWindow({
		backgroundColor : '#444444',
		barColor : NAV_BAR_COLOR,
		navBarHidden : false,
		translucent : false,
		navTintColor : WHITE,
	});

	if (PLATFORM == IPHONE) {
		viewImageWin.titleControl = titleControl(imageFile[index].title);
		bi.ui.leftNavButton(viewImageWin);
	} else {
		viewImageWin.title = imageFile[index].title;
	}

	/* On View Idea Screen their is a logic written in such a way that the image is not set from server,
	 * it is just set a image choosen from gallery or captured from gallery.
	 * So this getImage() return the BLOB Object according to the request.
	 */

	function getImage(BLOBObject, index) {
		if (!BLOBObject)
			return imageFile[index];
		else
			return bi.sdk.get_link(imageFile[index].url);
	}

	var mainView = [];
	var noOfAttchment = imageFile.length;
	for (var i = 0; i < noOfAttchment; i++) {

		mainView[i] = Titanium.UI.createView({
			height : Titanium.UI.FILL,
			width : Titanium.UI.FILL,
		});

		if (["png", "jpg", "bmp", "gif", "jpeg"].indexOf(imageFile[i].extension) != -1 || !imageFile[i].extension) {

			var scrollView = Titanium.UI.createScrollView({
				top : 0,
				contentWidth : Titanium.UI.FILL,
				contentHeight : Titanium.UI.FILL,
			});
			if(PLATFORM == IPHONE) {
			    scrollView.maxZoomScale = 2.0;
                scrollView.minZoomScale = 1.0;
                scrollView.scrollingEnabled = false;
			}

			//Image to show on the screen
			imageView = Titanium.UI.createImageView({
				image : getImage(imageFile[i].url, i),
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				originalFilename : imageFile[i].original_filename
			});

			scrollView.add(imageView);
			mainView[i].add(scrollView);
			
			imageView.addEventListener('longpress', function(e) {
                var img = this.toBlob();
                bi.ui.saveToPhotoGalleryOverlay(img, e.source.originalFilename);
            });
		} else {
			if (PLATFORM == IPHONE) {
				var webView = Titanium.UI.createWebView({
					url : bi.sdk.get_link(imageFile[i].url)
				});

				mainView[i].add(webView);
			} else {
				var emptyStates = {
					icon : null,
					text : 'Preview unavailable.'
				};
				bi.ui.emptyStates(mainView[i], emptyStates);
			}
		}
	}

	//Horizontal Scrolling view which holds the image(s)
	var scrollableView = Titanium.UI.createScrollableView({
	    top : 0,
		left : 0,
		right : 0,
		bottom : 0,
		disableBounce : true,
		backgroundColor : '#444444',
		views : mainView,
		currentPage : index
	});
    if(PLATFORM == ANDROID){
        scrollableView.top = 44;
    }
	bi.ui.actionBar(imageFile[index].title, viewImageWin);

	viewImageWin.add(scrollableView);

	//Bottom Scroll Pannel
	var scrollPannel = Titanium.UI.createView({
		backgroundColor : '#808080',
		height : '50dp',
		width : Titanium.UI.FILL,
		bottom : '0dp',
	});

	//Large tapping area for left slider button
	var leftSlideImageView = Titanium.UI.createView({
		height : Titanium.UI.FILL,
		width : '80dp',
		left : '0dp',
		backgroundColor : 'transparent',
	});

	//Large tapping area for right slider button
	var RightSlideImageView = Titanium.UI.createView({
		height : Titanium.UI.FILL,
		width : '80dp',
		right : '0dp',
		backgroundColor : 'transparent',
	});

	//Left button to slide and view left image is image exist
	var leftSlideImage = Titanium.UI.createImageView({
		image : '/images/ideaDetailImages/slideLeft.png',
		top : '10dp',
		left : '20dp',
		height : '30dp',
		width : '30dp',
	});

	//Right button to slide and view right image is image exist
	var rightSlideImage = Titanium.UI.createImageView({
		image : '/images/ideaDetailImages/slideRight.png',
		top : '10dp',
		right : '20dp',
		height : '30dp',
		width : '30dp',
	});

	//Sliding Images by clicking on pannel right button towards Right Side.
	RightSlideImageView.addEventListener('click', function() {

		var pageIndex = scrollableView.currentPage;
		pageIndex++;
		if (pageIndex < imageFile.length) {
			scrollableView.scrollToView(pageIndex);
		}

	});

	//Sliding Images by clicking on pannel left button towards Left Side.
	leftSlideImageView.addEventListener('click', function() {

		var pageIndex = scrollableView.currentPage;
		pageIndex--;
		if (pageIndex >= 0)
			scrollableView.scrollToView(pageIndex);

	});

	leftSlideImageView.add(leftSlideImage);
	RightSlideImageView.add(rightSlideImage);

	if (index == 0) {
		leftSlideImageView.setVisible(false);
	}

	if (imageFile.length - 1 == index) {
		RightSlideImageView.setVisible(false);
	}

	scrollPannel.add(leftSlideImageView);
	scrollPannel.add(RightSlideImageView);
	if (noOfAttchment > 1) {
		scrollableView.bottom = '50dp';
		viewImageWin.add(scrollPannel);
	}

	scrollableView.addEventListener('scroll', function(e) {
		var currentPage = e.currentPage;
	
		if (currentPage == 0) {
			leftSlideImageView.setVisible(false);
		} else {
			leftSlideImageView.setVisible(true);
		}

		if (imageFile.length - 1 == currentPage) {
			RightSlideImageView.setVisible(false);
		} else {
			RightSlideImageView.setVisible(true);
		}
	});
	return viewImageWin;
}

module.exports = ViewImageScreen;
