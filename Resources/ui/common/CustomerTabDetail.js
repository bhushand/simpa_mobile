function CustomerTabDetail(parent, customer) {
    this.parent = parent;
    this.customer = customer;
    var self = this;

    var customerTabDetailWin = Ti.UI.createWindow({
        title : customer.tabName,
        barColor : NAV_BAR_COLOR,
        backgroundColor : WHITE,
        navBarHidden : false,
        translucent : false,
        navTintColor : WHITE,
        layout : 'vertical'
    });
    this.customerTabDetailWin = customerTabDetailWin;
    var actionBar;
    if (PLATFORM == IPHONE) {
        customerTabDetailWin.navWindow = parent.navWindow;
        customerTabDetailWin.titleControl = titleControl(customer.tabName, activityListScollToTop);
        bi.ui.leftNavButton(customerTabDetailWin);
    } else {
        actionBar = bi.ui.actionBar(customer.tabName, customerTabDetailWin, null, null, activityListScollToTop);
    }

    function activityListScollToTop() {
        bi.ui.activityListScollToTop();
    }

    if (customer.tabName == 'Tickets') {
        var request_params = {
            "jsonrpc" : "2.0",
            "method" : "call",
            "params" : {
                "model" : "simpa.ticket",
                "method" : "read",
                "args" : [self.customer.ticket_ids, ["name", "date", "problem_desc", "state"]],
                "kwargs" : {
                    "context" : {
                        "lang" : "en_US",
                        "tz" : false,
                        "uid" : prop.getString("uid")
                    }
                },
                "session_id" : prop.getString("session_id"),
                "context" : {
                    "lang" : "en_US",
                    "tz" : false,
                    "uid" : prop.getString("uid")
                }
            },
            "id" : "r154"
        };
        bi.sdk.call('dataset/call_kw', "POST", request_params, function(data) {
            Ti.API.info(data);
        }, function(e) {
            //on fail, do nothing

        }, "application/json");
    } else if (customer.tabName == 'Activities') {

        var request_params = {
            "jsonrpc" : "2.0",
            "method" : "call",
            "params" : {
                "model" : "recharge.activity",
                "method" : "read",
                "args" : [[1], ["roles_id", "id", "r_date", "code", "amount", "um_id", "recharge_type", "system_id"]],
                "kwargs" : {
                    "context" : {
                        "lang" : "en_US",
                        "tz" : false,
                        "uid" : prop.getString("uid")
                    }
                },
                "session_id" : prop.getString("session_id"),
                "context" : {
                    "lang" : "en_US",
                    "tz" : false,
                    "uid" : prop.getString("uid")
                }
            },
            "id" : "r153"
        };
        bi.sdk.call('dataset/call_kw', "POST", request_params, function(data) {
            Ti.API.info(data);
        }, function(e) {
            //on fail, do nothing

        }, "application/json");
    } else if (customer.tabName == 'Address') {
        var args = ["nick_name", "gender", "alternate_ph", "father_name", "age", "purpose", "mobile", "sec_mob"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'Personal Info') {

        var args = ["name", "last_name", "full_name", "caf", "amc", "rms", "system_id", "product_id", "amt_down_pay", "partial_downpayment", "exp_mon", "payment_type", "dio_type", "create_dio", "Branch", "company_id", "payment_rec"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'Operating Lease') {

        var args = ["marital_status", "earning_mem", "children", "education", "reason", "shs_benefit", "site_ele", "family_mem", "language_spk_ids", "language_write_ids", "language_understand_ids"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == "Income Details") {

        var args = ["salary_lines", "business_lines", "agriculture_lines", "contract_lines", "desc", "net_profit", "avg_income"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'Monthly expenditure') {

        var args = ["rent_lease", "mob_recharge", "kerosene", "petromax", "medicine", "household", "exist_loan", "candles", "electricity_bill", "education_amt", "other_misc", "batteries", "other_exp"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'As. and Li.') {

        var args = ["spend_energy", "energy_bal", "arable_land", "no_tv", "no_fan", "no_tractors", "no_cars", "no_inverters", "cows_buffaloes", "goats_sheeps", "two_wheelers", "no_chickens", "lender_name", "loan_amount", "outstanding_amount", "emi", "loan_amount2", "emi2", "outstanding_amount2", "lender_name2"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'KYC Documents') {

        var args = ["voter_card", "ration_card", "pan_card", "passport", "driving_license", "aadhar_number", "nrega_number", "simpa_letter_num"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'Office Use') {

        var args = ["roof_type", "applied_before", "last_recharge_date", "ujra_mitra", "ujra_mitra_id", "sale_name", "sale_remark", "submission_date", "asm_name", "asm_remark", "asm_form_date", "asm_receipt_date", "rsa_name", "rsa_remark", "rsa_form_date", "rsa_receipt_date", "credit_remark", "credit_score", "status", "completed_caf", "kyc_complaint", "op_lease", "credit_name", "credit_state", "creation_date", "approved_date", "rejected_date", "paid_date", "cancelled_date"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'Declaration') {

        var args = ["signing_date", "signing_place", "secondary_name", "secondary_address", "op_lease", "ref_lines"];
        this.GetTabDataFromOdoo(args);
    } else if (customer.tabName == 'Options') {

        var args = ["rent_lease", "mob_recharge", "kerosene", "petromax", "medicine", "household", "exist_loan", "candles", "electricity_bill", "education_amt", "other_misc", "batteries", "other_exp"];
        this.GetTabDataFromOdoo(args);
    }
    return customerTabDetailWin;

}

CustomerTabDetail.prototype.GetTabDataFromOdoo = function(args) {
    var self = this;
    var request_params = {
        "jsonrpc" : "2.0",
        "method" : "call",
        "params" : {
            "model" : "res.partner",
            "method" : "read",
            "args" : [[self.customer.id], args],
            "kwargs" : {
                "context" : {
                    "lang" : "en_US",
                    "tz" : false,
                    "uid" : prop.getString("uid"),
                    "search_default_customer" : 1,
                    "rms" : 1,
                    "default_customer" : 1,
                    "bin_size" : true,
                    "future_display_name" : true
                }
            },
            "session_id" : prop.getString("session_id"),
            "context" : {
                "lang" : "en_US",
                "tz" : false,
                "uid" : prop.getString("uid")
            }
        },
        "id" : "r516"
    };
    bi.sdk.call('dataset/call_kw', "POST", request_params, function(data) {
        self.UI(data);
    }, function(e) {
        //on fail, do nothing
        return e;
    }, "application/json");
};
CustomerTabDetail.prototype.UI = function(data) {
    var self = this;
    var tabView = Titanium.UI.createView({
        left : 0,
        right : 0,
        height : Ti.UI.SIZE,
        layout : 'vertical'
    });

    var tabInfoContainer = Titanium.UI.createView({
        top : 3,
        left : 8,
        right : 8,
        bottom : 8,
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout : 'vertical'
    });

    for (var i = 0; i < data.result.length; i++) {
        var labelWrapperView = Ti.UI.createView({
            width : Ti.UI.SIZE,
            height : Ti.UI.SIZE,
            left : 0,
            top : '10dp',
            layout : 'horizontal'
        });
        var Label = Titanium.UI.createLabel({
            text : data.result[0].full_name,
            width : '75%',
            height : '25dp',
            left : '5dp',
            top : '30dp',
            color : BLACK,
            font : {
                fontSize : '15dp',
                fontFamily : 'Helvetica Neue'
            },
        });
        labelWrapperView.add(Label);

        tabInfoContainer.add(labelWrapperView);
    }

    tabView.add(tabInfoContainer);

    self.customerTabDetailWin.add(tabView);

};
module.exports = CustomerTabDetail;
