// Hud constants
exports.STYLE_NORMAL = "normal";
exports.STYLE_TWEETIE = "tweetie";

exports.HIDE_EVENT = "OVERLAY:HUD:HIDE";

// Private variables
var messageWin, messageView, messageLabel, containerWindow, customView;

// Init function
exports.load = function(window, message, placeholder){	
	
	containerWindow = window;
		
	messageWin = Titanium.UI.createView({
		id: 'messageview',
		height: 50,
		width: 50,
		borderRadius: 10,
		backgroundColor: '#000',
		opacity: 0.7,
		touchEnabled: false,
		visible: false
	});
	
	if(message){
		messageLabel = Titanium.UI.createLabel({
			id: 'messagelabel',
			text: message,
			color: '#fff',
			width: 150,
			height: 'auto',
			font: {fontSize: 20, fontWeight: 'bold'},
			textAlign:'center'
		});
	}else{
		messageLabel = Titanium.UI.createActivityIndicator({
		});
		messageLabel.show();
	}
	
	// Attach everything to this window
	if(!placeholder)
		messageWin.add(messageLabel);
		
	containerWindow.add(messageWin);
	
	// Return the whole thing so we can change this methods
	return exports;
};

// Displays the overlay HUD to the user
exports.show = function(view){
	if(view){
		customView = view;
		messageWin.add(view);
		messageWin.height=Ti.UI.SIZE;
		messageWin.width=Ti.UI.SIZE;
	}
	
	if(PLATFORM!=ANDROID){
		// Set an initial low scale
		messageWin.transform = Ti.UI.create2DMatrix().scale(0.001);
		
		// Animate it to perform a nice "scale in"
		var scaleInTransform = Ti.UI.create2DMatrix();
		scaleInTransform = scaleInTransform.scale(1);
		
		var scaleIn = Titanium.UI.createAnimation();
		scaleIn.transform = scaleInTransform;
		scaleIn.duration = 250;
		
		messageWin.animate(scaleIn);
	}
	
	messageWin.show();
	
	// Return the whole thing so we can change this methods
	return exports;
};

// Hides the overlay HUD from the user
exports.hide = function(){
	
	if(PLATFORM!=ANDROID){
		var scaleOutTransform = Ti.UI.create2DMatrix();
		scaleOutTransform = scaleOutTransform.scale(0.001);
		
		var scaleOut = Titanium.UI.createAnimation();
		scaleOut.transform = scaleOutTransform;
		scaleOut.duration = 250;
		messageWin.animate(scaleOut);
		
		// When the animation finishes, close the window
		scaleOut.addEventListener('complete', function(){
			messageWin.hide();
			
			if(customView){
				messageWin.remove(customView);
			}
		});
	}else{
		messageWin.hide();
			
		if(customView){
			messageWin.remove(customView);
		}
	}
	
	
	// Return the whole thing so we can change this methods
	return exports;
};
