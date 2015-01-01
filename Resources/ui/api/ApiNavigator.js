function ApiNavigator(model,params)
{
	this.model = model;
	this.params = JSON.parse(JSON.stringify(params));
	this.data_list = [];
	this.total = 0;
	this.nav_index = 0;
	this.page = 0;
}

ApiNavigator.prototype.next = function(callback)
{
	var self=this;
	function do_callback(){
		self.nav_index++;
		callback(self.data_list[self.nav_index]);
	}
	if(this.nav_index == this.data_list.length - 1){
		this.load(do_callback);
	}else{
		do_callback();
	}
	
};

ApiNavigator.prototype.previous = function(callback)
{
	this.nav_index--;
	callback(this.data_list[this.nav_index]);
};

ApiNavigator.prototype.has_next = function()
{
	if(this.total - 1 > this.nav_index)
		return true;
	else
		return false;
};

ApiNavigator.prototype.has_previous = function()
{
	if(this.nav_index > 0)
		return this.data_list.slice(0,this.nav_index);
	else
		return false;
};

//load data / count when it's not coming from a list
ApiNavigator.prototype.load = function(callback)
{
	var self=this;
	this.params["page"]++;
	
	bi.sdk.get(this.model, this.params, function(data){
		self.total = data["stats"]["total"];
		var data_list = data[self.model + "_list"];
		var new_data_list = self.data_list.concat(data_list);
		self.data_list = new_data_list;
		
		callback();
	}, function(){
		
	});
};

module.exports = ApiNavigator;


