function BI(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.refresh_callbacks = [];

    //this is the prod BI auth domain, set to other server for testing
    this.auth_domain = "auth.brightidea.com";
    this.domain = "auth.brightidea.com";
}

BI.prototype.authenticate = function(email, password, callback, fail) {
    //call affiliate domain for accurate logging
    var oauth_url = "https://" + this.domain + "/_oauth2/token";
    var self = this;

    var auth_callback = function(data) {
        self.access_token = data.access_token;
        self.refresh_token = data.refresh_token;
        self.expire = Date.now() + data.expires_in * 1000;
        callback(data.systems);
    };

    this.request(oauth_url, "POST", {
        "client_id" : this.client_id,
        "client_secret" : this.client_secret,
        "username" : email,
        "password" : password,
        "grant_type" : "password"
    }, auth_callback, fail);

};

BI.prototype.get = function(url, params, success, fail, cache) {
    switch (arguments.length) {
    case 2:
        if ( typeof arguments[1] == "function") {
            var success = arguments[1];
        }
        break;
    case 3:
        if ( typeof arguments[1] == "function") {
            params = [];
            success = arguments[1];
            var fail = arguments[2];
        }
        break;
    }

    var fail = ( typeof fail === "undefined") ? this.error_handler : fail;
    this.call(url, "GET", params, success, fail, "application/json", cache);
};

BI.prototype.call = function(url, method, params, success, fail, content_type, cache) {
    var call_url = prop.getString("hostName") + "/web/" + url;

    var method = ( typeof method === "undefined") ? "GET" : method.toUpperCase();
    var params = ( typeof params === "undefined") ? [] : params;
    var success = ( typeof success === "undefined") ? function() {
    } : success;
    var fail = ( typeof fail === "undefined") ? this.error_handler : fail;
    var content_type = ( typeof content_type === "undefined") ? "application/json" : content_type;

    var self = this;

    if (method == "GET" || method == "DELETE") {
        var out = [];

        for (key in params) {
            if (params[key] instanceof Array) {
                for (var i = 0; i < params[key].length; i++) {
                    out.push(key + "[]=" + params[key][i]);
                };
            } else {
                out.push(key + '=' + params[key]);
            }

        }

        if (out.length > 0) {
            var connector = "&";
            if (call_url.indexOf("?") == -1) {
                connector = "?";
            }

            call_url += connector + out.join('&');
        }

        params = null;
    } else if (content_type == "application/json") {
        //encode body as json
        params = JSON.stringify(params);
    }

    //automatically refresh access token if it timeout
    if (this.access_token && this.expire < Date.now()) {
        this.refresh(function() {
            self.request(call_url, method, params, success, fail, content_type, cache);
        }, fail);
        return;
    }

    this.request(call_url, method, params, success, fail, content_type, cache);
};

BI.prototype.refresh = function(callback, fail) {
    var oauth_url = "https://" + this.auth_domain + "/_oauth2/token";
    var self = this;

    var auth_callback = function(data) {
        self.access_token = data.access_token;
        self.refresh_token = data.refresh_token;
        self.expire = Date.now() + data.expires_in * 1000;
        while (self.refresh_callbacks.length > 0) {
            var callback = self.refresh_callbacks.pop();
            callback();
        };

    };

    self.refresh_callbacks.push(callback);
    if (self.refresh_callbacks.length == 1) {
        this.request(oauth_url, "POST", {
            "client_id" : this.client_id,
            "client_secret" : this.client_secret,
            "refresh_token" : this.refresh_token,
            "grant_type" : "refresh_token"
        }, auth_callback, function(e) {
            if (e.error == "invalid_grant") {
                Ti.API.log("Failed to refresh access token. Will be forced to logout");
                self.refresh_callbacks = [];
                bi.ui.logout(function() {

                });
            } else {
                fail();
            }

        });
    }

};

BI.prototype.clear_session = function() {
    this.access_token = null;
    this.refresh_token = null;
    this.expire = 0;
};

BI.prototype.error_handler = function(e) {
    // you should handle the error by passing a fail callback instead of letting it get here
    throw e;
};

BI.prototype.get_link = function(link) {
    var url = this.url_append(link, "access_token=" + this.access_token);
    return url;

};

BI.prototype.url_append = function(link, param) {
    if (!link)
        return '';

    var connector = "&";
    if (link.indexOf("?") == -1) {
        connector = "?";
    }
    return link + connector + param;

};

BI.prototype.request = function(url, method, data, success, fail, content_type, cache, retry) {
    var self = this;
    var retry = ( typeof retry === "undefined") ? 0 : retry;
    method = method.toUpperCase();

    Ti.API.info("API Call: [url] [" + method + "] :" + url);
    if (data)
        Ti.API.info("API Call: [data] :" + data);
    Ti.API.info("API Call: [content_type] :" + content_type);

    var client = Ti.Network.createHTTPClient({
        // function called when the response data is available
        onload : function(e) {
            if (this.status == "304") {
                success({
                    no_update : true
                });
                return;
            }

            var responseJson = JSON.parse(this.responseText);
            if (method == "GET") {

                var etag = client.getResponseHeader("Etag");
                if (etag) {
                    responseJson["etag"] = etag;
                }
            }

            Ti.API.info("Received text: " + this.responseText);
            success(responseJson);
        },
        // function called when an error occurs, including a timeout
        onerror : function(e) {
            if (this.status == 401 && retry < 1) {
                //authentication error
                var response = JSON.parse(this.responseText);
                if (response.error == "invalid_grant" && (response.error_description == "The access token provided is invalid" || response.error_description == "The access token provided has expired")) {
                    //try to auto renew access token once
                    self.refresh(function() {
                        self.request(url, method, data, success, fail, content_type, cache, retry + 1);
                    }, fail);
                } else {
                    fail(JSON.parse(this.responseText));
                }

            } else if (this.status == 400) {
                //user error, application will hanle this
                fail(JSON.parse(this.responseText));
            } else {
                //exception, most likely 500
                fail(e);
            }
            Ti.API.info("API Error: " + e.error + this.responseText);
        },
        timeout : 60000 // in milliseconds
    });

    if (!this.access_token)
        url = this.url_append(url, "client_id=" + this.client_id);

    // Prepare the connection.
    client.open(method, url);

    if (this.access_token)
        client.setRequestHeader('Authorization', 'Bearer ' + this.access_token);

    var user_agent;
    if (PLATFORM != ANDROID) {
        user_agent = "BIMOBILE V" + Ti.App.version + " IOS";
    } else {
        user_agent = "BIMOBILE V" + Ti.App.version + " ANDROID";
    }
    client.setRequestHeader('User-Agent', user_agent);

    if (cache) {
        client.setRequestHeader('If-None-Match', cache);
    }
    // Send
    if (data) {
        Ti.API.info(data);

        if (content_type) {
            if (PLATFORM == ANDROID && content_type == "multipart/form-data") {
                // android doesn't need any header for multipart
            } else {
                client.setRequestHeader('Content-Type', content_type);
            }

        } else
            client.setRequestHeader('Content-Type', "application/json");

        client.send(data);
    } else {
        client.send();
    }

};

/* Making tokens persistent. We shouldn't store the tokens in the application property according to Titanium doc.
 * This should be moved to user database.
 */
Object.defineProperty(BI.prototype, "access_token", {
    get : function() {
        return prop.getString("accessToken");
    },
    set : function(val) {
        prop.setString("accessToken", val);
    }
});

Object.defineProperty(BI.prototype, "refresh_token", {
    get : function() {
        return prop.getString("refreshToken");
    },
    set : function(val) {
        prop.setString("refreshToken", val);
    }
});

Object.defineProperty(BI.prototype, "expire", {
    get : function() {
        return prop.getString("expire");
    },
    set : function(val) {
        prop.setString("expire", val);
    }
});
module.exports = BI;
