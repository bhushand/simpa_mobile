function CustomTabGroup() {

	var win = Titanium.UI.createWindow({
		backgroundColor : 'black',
		fullscreen : false,
		navTintColor: WHITE,
	});

	//-------Views to hold content-------

	var winView1 = Ti.UI.createScrollView({
		top : 0,
		height : '85%',
		backgroundColor : 'black'
	});

	var winView2 = Ti.UI.createScrollView({
		top : 0,
		height : '85%',
		backgroundColor : 'black'
	});

	var winView3 = Ti.UI.createScrollView({
		top : 0,
		height : '85%',
		backgroundColor : 'black'
	});

	var winView4 = Ti.UI.createScrollView({
		top : 0,
		height : '85%',
		backgroundColor : 'black'
	});

	//---------Labels that Describe each View-------

	var labelWin1 = Ti.UI.createLabel({
		text : 'I am window 1',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 34
		},
		color : 'white'
	});

	var labelWin2 = Ti.UI.createLabel({
		text : 'I am window 2',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 44
		},
		color : 'white'
	});

	var labelWin3 = Ti.UI.createLabel({
		text : 'I am window 3',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 54
		},
		color : 'white'
	});

	var labelWin4 = Ti.UI.createLabel({
		text : 'I am window 4',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 64
		},
		color : 'white'
	});

	winView1.add(labelWin1);
	winView2.add(labelWin2);
	winView3.add(labelWin3);
	winView4.add(labelWin4);

	//Tab container holds the custom tabgroup

	var tabContainer = Ti.UI.createView({
		bottom : 0,
		height : '15%',
		width : Ti.UI.FILL,
		layout : 'horizontal'

	});

	//----The custom tabs-----
	//they can also be defined with a background image
	//property which will give them a more professional style, look and feel

	var tab1 = Ti.UI.createView({
		left : 0,
		backgroundColor : 'red',
		height : Ti.UI.FILL,
		width : '25%'
	});

	var tab2 = Ti.UI.createView({
		left : 0,
		backgroundColor : 'blue',
		height : Ti.UI.FILL,
		width : '25%'
	});

	var tab3 = Ti.UI.createView({
		left : 0,
		backgroundColor : 'green',
		height : Ti.UI.FILL,
		width : '25%'
	});

	var tab4 = Ti.UI.createView({
		left : 0,
		backgroundColor : 'orange',
		height : Ti.UI.FILL,
		width : '25%'
	});

	//Labels describing each custom tab view

	var label1 = Ti.UI.createLabel({
		text : 'Tab 1',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 24
		},
		color : 'white'

	});

	var label2 = Ti.UI.createLabel({
		text : 'Tab 2',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 24
		},
		color : 'white'

	});

	var label3 = Ti.UI.createLabel({
		text : 'Tab 3',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 24
		},
		color : 'white'

	});

	var label4 = Ti.UI.createLabel({
		text : 'Tab 4',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontSize : 24
		},
		color : 'white'

	});

	//adding the labels to tabs and the tabs to the container
	tab1.add(label1);
	tab2.add(label2);
	tab3.add(label3);
	tab4.add(label4);

	win.add(tabContainer);

	tabContainer.add(tab1);
	tabContainer.add(tab2);
	tabContainer.add(tab3);
	tabContainer.add(tab4);

	win.add(winView1);

	win.add(winView2);
	winView2.hide();

	win.add(winView3);
	winView3.hide();

	win.add(winView4);
	winView4.hide();

	//----------------Tab Event Listeners------------

	tab1.addEventListener('click', function(e) {
		winView2.hide();
		winView3.hide();
		winView4.hide();
		winView1.show();
	});

	tab2.addEventListener('click', function(e) {
		winView1.hide();
		winView3.hide();
		winView4.hide();
		winView2.show();
	});

	tab3.addEventListener('click', function(e) {
		winView1.hide();
		winView2.hide();
		winView4.hide();
		winView3.show();
	});

	tab4.addEventListener('click', function(e) {
		winView1.hide();
		winView2.hide();
		winView3.hide();
		winView4.show();
	});

	win.open();

};

module.exports = CustomTabGroup;
