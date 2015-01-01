function getRow(customer) {
    var self = this;
    
    if (customer.has_image) {
        customer.image_url = prop.getString("hostName") + "/web/binary/image?model=" + self.model + "&field=image_small&id=" + customer.id + "&session_id=" + prop.getString("session_id");
    } else {
        customer.image_url = '/images/defaultProfile.png';
    }

    var row = {
        name: {
            text: customer.full_name
        },
        image: {
            image: customer.image_url
        },
        mobile: {
            text: 'Mobile: ' + customer.mobile
        }, 
        gender: {
            text: 'Gender: ' + capitaliseFirstLetter(customer.gender)
        },   
    };
    
    
    return row;
}

function getTemplate() {
    var itemTemplate = {
        properties: {
            // These are the same as the list data item properties
            // The list data item properties supersedes these if both are defined
            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
            backgroundColor: BACKGROUND_GRAY,
            height : Ti.UI.SIZE,
           
        },
        events: {
            // Bind event callbacks for bubbled events
            // Events caught here are fired by the subcomponent views of the ListItem
            //click: clickCB
        },
        childTemplates: [ // Add view subcomponents to the ListItem
            {
                type: 'Ti.UI.View',
                properties: {
                    top : 8,
                    left : 8,
                    right : 8,
                    height : Ti.UI.SIZE,
                    backgroundColor : WHITE,
                    layout : 'horizonatal',
                    borderColor : BORDER_GRAY,
                    borderWidth : 1
                },
                childTemplates: [
                    {
                        type: 'Ti.UI.View',
                        properties: {
                            left : 0,
                            right : 0,
                            height : Ti.UI.SIZE,
                            backgroundColor : WHITE
                        },
                        childTemplates: [
                            {
                                type: 'Ti.UI.ImageView',
                                bindId: 'image',
                                properties: {
                                    width : '80dp',
                                    height : '80dp',
                                    left : '7dp',
                                    top : '7dp',
                                    bottom : '7dp',
                                    borderColor : BORDER_GRAY,
                                    borderRadius : 4
                                },
                            },
                            {
                                type: 'Ti.UI.View',
                                properties: {
                                    width : Ti.UI.FILL,
                                    height : Ti.UI.SIZE,
                                    left : '95dp',
                                    top : 0,
                                    right: 5,
                                    layout : 'vertical',
                                    bottom : '7dp'
                                },
                                childTemplates: [
                                    {
                                        type: 'Ti.UI.Label',
                                        bindId: "name",
                                        properties: {
                                            left : 0,
                                            top : 7,
                                            color : TEXT_DARK,
                                            font : {
                                                fontSize : '15dp',
                                                fontFamily : 'Helvetica Neue'
                                            }
                                        }
                                    },
                                    {
                                        type: 'Ti.UI.Label',
                                        bindId: "gender",
                                        properties: {
                                            height : Ti.UI.SIZE,
                                            left : 0,
                                            top : 5,
                                            color : GRAY,
                                            font : {
                                                fontSize : '13dp',
                                                fontFamily : 'Helvetica Neue'
                                            }
                                        },
                                    },{
                                        type: 'Ti.UI.Label',
                                        bindId: "mobile",
                                        properties: {
                                            height : Ti.UI.SIZE,
                                            left : 0,
                                            top : 5,
                                            color : '#7c7bad',
                                            font : {
                                                fontSize : '13dp',
                                                fontFamily : 'Helvetica Neue'
                                            }
                                        },
                                    }
                                    
                                ]
                            }
                        ]
                    },
                ],
            },
        ]
    };
    
    if(PLATFORM != ANDROID){
        itemTemplate.properties.selectionStyle = Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE;
    }
    
    if(PLATFORM == ANDROID){
        itemTemplate.childTemplates[0].childTemplates[0].childTemplates[0].properties.borderRadius = 8;
    }
    
    return itemTemplate;


    
}

function rowClick(customer) {
    var self = this.parent;
    customer.list = this;
    bi.navigation.open("customerDetailView", self.parent, customer);
}

function CustomerListView(parent, title) {
    this.parent = parent;
    
    var search = Titanium.UI.createSearchBar({
        barColor: NAV_BAR_COLOR, 
        showCancel:false,
        height:43,
        width: 400,
        top:0,
    });

    if(parent)
       parent.titleControl = search;//titleControl(title, customerListScollToTop);
    
    
    var self = this;
    this.model = "res.partner";
    var request_params = {
        "jsonrpc":"2.0",
        "method":"call",
        "params":{
            "model":self.model,
            "fields" : ["title", "parent_id", "name", "full_name", "country_id", "email", "city", "gender", "color", "phone", "has_image", "state_id", "function", "is_company", "mobile", "category_id", "__last_update", "ticket_ids", "signing_date", "exp_mon", "last_name", "children", "no_tv", "asm_form_date", "rent_lease", "business_lines", "partial_downpayment", "secondary_address", "ujra_mitra", "amc", "rsa_remark", "child_ids", "applied_before", "ujra_mitra_id", "arable_land", "desc", "sale_remark", "voter_card", "gender", "nrega_number", "emi", "batteries", "father_name", "paid_date", "ele_hrs", "message_follower_ids", "marital_status", "exist_loan", "recharge_agent_lines", "salary_lines", "creation_date", "language_spk_ids", "petromax", "cancelled_date", "lender_name", "dio_type", "receipt_date", "sale_name", "other_value", "approved_date", "medicine", "ration_card", "payment_type", "submission_date", "sec_mob", "ticket_ids", "education_amt", "reason", "other_exp", "payment_rec", "goats_sheeps", "roof_type", "no_fan", "no_tractors", "mob_recharge", "simpa_letter_num", "caf", "secondary_name", "rsa_form_date", "product_ids", "other_ids", "form_date", "comment", "rms", "image", "recharge_ids", "other_name", "language_write_ids", "last_recharge_date", "create_uid", "earning_mem", "credit_state", "passport", "emi2", "pan_card", "net_profit", "asm_remark", "asm_receipt_date", "rec_user", "kerosene", "credit_remark", "loan_amount", "rsa_name", "product_id", "nick_name", "site_ele", "alternate_ph", "asm_name", "no_cars", "no_inverters", "outstanding_amount2", "lender_name2", "energy_bal", "contract_lines", "household", "rsa_receipt_date", "education", "message_ids", "shs_benefit", "avg_income", "outstanding_amount", "loan_amount2", "agriculture_lines", "credit_score", "signing_place", "aadhar_number", "system_id", "ref_lines", "language_understand_ids", "driving_license", "spend_energy", "kyc_complaint", "two_wheelers", "no_chickens", "status", "credit_name", "bank_ids", "create_dio", "material_type_ids", "rejected_date", "roles_id", "family_mem", "purpose", "electricity_bill", "other_misc", "cows_buffaloes", "mobile", "candles", "age", "completed_caf", "lease_complete", "op_lease", "maintenance_ids", "amt_down_pay", "mid_name", "dio_state", "display_name", "company_id"],
            "domain":[["parent_id","=",false],["customer","=",1]],
            "context":{"lang":"en_US","tz":false,"uid":prop.getString("uid"),"search_default_customer":1,"rms":1,"default_customer":1},
            "offset":0, limit:40,"sort":"",
            "session_id":prop.getString("session_id")
        },
        "id":"r27"
    };

    var emptyStates = {
        icon : "\uf0e7",
        text: ""
    };
    
    var customerListView = Titanium.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        left : 0,
        top : 0,
        bottom : 0,
    });
    var tableObj = this.getTable({
            model : "dataset/search_read",
            request_params : request_params,
            get_row : getRow,
            row_click : rowClick,
            get_template: getTemplate,
            container: customerListView,
            emptyStates : emptyStates,
            cache : true,
            popOutButton : true
    });
    customerListView.add(tableObj.container);

    bi.ui.updateChallengeList = function() {
        if(bi.ui.ideaPosted == true)
            tableObj.load_data(true);
    };
    function customerListScollToTop() {
        tableObj.listView.scrollToItem(0, 0);
    }

    bi.ui.customerListScollToTop = function(){
        tableObj.listView.scrollToItem(0, 0);
    };
    
    var saveAllCustomerDataOnce = Ti.App.Properties.getBool('saveAllCustomerDataOnce');
    if(!saveAllCustomerDataOnce) {
        onlyRunOnce('saveAllCustomerDataOnce');
        var offset = 0;
        var limit = 40;
        var once = true;
        var recordLength = 0;
        var apiCallInterval = setInterval(function () {
            var params = {
                "jsonrpc" : "2.0",
                "method" : "call",
                "params" : {
                    "model" : self.model,
                    "fields" : ["title", "parent_id", "name", "full_name", "country_id", "email", "city", "gender", "color", "phone", "has_image", "state_id", "function", "is_company", "mobile", "category_id", "__last_update", "ticket_ids", "signing_date", "exp_mon", "last_name", "children", "no_tv", "asm_form_date", "rent_lease", "business_lines", "partial_downpayment", "secondary_address", "ujra_mitra", "amc", "rsa_remark", "child_ids", "applied_before", "ujra_mitra_id", "arable_land", "desc", "sale_remark", "voter_card", "gender", "nrega_number", "emi", "batteries", "father_name", "paid_date", "ele_hrs", "message_follower_ids", "marital_status", "exist_loan", "recharge_agent_lines", "salary_lines", "creation_date", "language_spk_ids", "petromax", "cancelled_date", "lender_name", "dio_type", "receipt_date", "sale_name", "other_value", "approved_date", "medicine", "ration_card", "payment_type", "submission_date", "sec_mob", "ticket_ids", "education_amt", "reason", "other_exp", "payment_rec", "goats_sheeps", "roof_type", "no_fan", "no_tractors", "mob_recharge", "simpa_letter_num", "caf", "secondary_name", "rsa_form_date", "product_ids", "other_ids", "form_date", "comment", "rms", "image", "recharge_ids", "other_name", "language_write_ids", "last_recharge_date", "create_uid", "earning_mem", "credit_state", "passport", "emi2", "pan_card", "net_profit", "asm_remark", "asm_receipt_date", "rec_user", "kerosene", "credit_remark", "loan_amount", "rsa_name", "product_id", "nick_name", "site_ele", "alternate_ph", "asm_name", "no_cars", "no_inverters", "outstanding_amount2", "lender_name2", "energy_bal", "contract_lines", "household", "rsa_receipt_date", "education", "message_ids", "shs_benefit", "avg_income", "outstanding_amount", "loan_amount2", "agriculture_lines", "credit_score", "signing_place", "aadhar_number", "system_id", "ref_lines", "language_understand_ids", "driving_license", "spend_energy", "kyc_complaint", "two_wheelers", "no_chickens", "status", "credit_name", "bank_ids", "create_dio", "material_type_ids", "rejected_date", "roles_id", "family_mem", "purpose", "electricity_bill", "other_misc", "cows_buffaloes", "mobile", "candles", "age", "completed_caf", "lease_complete", "op_lease", "maintenance_ids", "amt_down_pay", "mid_name", "dio_state", "display_name", "company_id"],
                    "domain" : [["parent_id", "=", false], ["customer", "=", 1]],
                    "context" : {
                        "lang" : "en_US",
                        "tz" : false,
                        "uid" : prop.getString("uid"),
                        "search_default_customer" : 1,
                        "rms" : 1,
                        "default_customer" : 1
                    },
                    "offset" : offset,
                    "limit" : limit,
                    "sort" : "",
                    "session_id" : prop.getString("session_id")
                },
                "id" : "r27"
            };
    
            
            bi.sdk.call('dataset/search_read', "POST", params, function(data) {
                //Ti.API.info(data);
                if(once){
                    once = false;
                    recordLength = data.result.length;
                }
                for (var i = 0; i < data.result.records.length; i++) {
                    // create a "customer" record (persisted)
                    var customerRecord = models.customer.newRecord(data.result.records[i]);
                    customerRecord.save();
                    Ti.API.info('Count: ' + models.customer.count());
                    Ti.API.info("Save " + i + " Record.");
                    Ti.API.info(offset + " :offset::limit: " + limit);
                    if(offset >= recordLength){
                        clearInterval(apiCallInterval);
                    }
                }
    
                
            }, function(e) {
                //on fail, do nothing
                return e;
            }, "application/json"); 
            
            
            offset += limit;
        }, 5000);

    }
    
    return customerListView;
};

var advancedListView = require('/ui/common/AdvancedListView');
CustomerListView.prototype = new advancedListView();
module.exports = CustomerListView;
