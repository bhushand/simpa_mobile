function TabbedView() {

}

TabbedView.prototype.getTabBar = function(parent, tabs, showTab) {

	var toolbarView = Titanium.UI.createView({
		height : '40dp',
		width : Titanium.UI.FILL,
		backgroundColor : TAG_BACK
	});

	var toolbarWrapper = Titanium.UI.createView({
		height : '40dp',
		width : '100%',
		layout : 'horizontal'
	});

	toolbarView.add(toolbarWrapper);

	var currentContentView = null;
	var currentTab = null;

	var tab_left = 5;
	var tab_index = 0;
	for (var key in tabs) {
		var tab = tabs[key];
		var tab_width = 96 / Object.keys(tabs).length;

		var fontWeight = "normal";
		if (tab_index == showTab) {
			fontWeight = "bold";
		}

		var toolbarBtn = Titanium.UI.createLabel({
			text : key,
			width : tab_width + '%',
			height : 40,
			color : LINK_COLOR,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontSize : '15dp',
				fontWeight : fontWeight,
				fontFamily : 'Helvetica Neue'
			}
		});

		var vseparator = Ti.UI.createView({
			width : 1,
			height : 30,
			backgroundColor : BACKGROUND_GRAY
		});

		if (tab_index == showTab) {
			currentTab = toolbarBtn;
		}

		toolbarBtn.addEventListener('click', function(e) {
			var tab = tabs[this.text];
			var font = currentTab.getFont();
			font.fontWeight = "normal";
			currentTab.setFont(font);
			currentTab = this;
			var font = this.getFont();
			font.fontWeight = "bold";
			this.setFont(font);
			this.setWidth((tab_width + 1) + "%");

			if (currentContentView != null) {
				parent.remove(currentContentView);
			}

			var tabView = require('/ui/common/' + tab.view);
			//construct UI
			tab.view_instance = new tabView(parent, tab.params);
			parent.add(tab.view_instance);

			if (tab.click) {
				tab.click();
			}

			currentContentView = tab.view_instance;
		});

		if (tab_index > 0) {
			toolbarWrapper.add(vseparator);
		}

		toolbarWrapper.add(toolbarBtn);

		tab_left += tab_width;
		tab_index++;
	};

	parent.add(toolbarView);
	currentTab.fireEvent('click');

	return toolbarView;

};

module.exports = TabbedView;
