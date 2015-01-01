/****************************************************************************************************
 * Debug Module
 ****************************************************************************************************/
if ( typeof (logger) == 'undefined') {
	logger = function() {
	};
}

logger.info = function(text) {
	Ti.API.info(text);
};
logger.enabled = true;

function onlyRunOnce(runThisOnce) {
	Ti.App.Properties.setBool(runThisOnce, true);
}

/****************************************************************************************************
 *  Activity Indicator
 ****************************************************************************************************/

var activityIndicator = Titanium.UI.createActivityIndicator({
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : '15sp',
		fontWeight : 'bold'
	},
	color : WHITE,
	message : ''
});
if (PLATFORM == IPHONE) {
	activityIndicator.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
} else {
	activityIndicator.style = Titanium.UI.ActivityIndicatorStyle.BIG;
}

/****************************************************************************************************
 * Set Circlular Images
 ****************************************************************************************************/

function getCircularBorder(borderSize) {

    if (PLATFORM == IPHONE)
        borderSize = borderSize / 2;
    else
        borderSize = borderSize * 2;

    return borderSize;
}

/****************************************************************************************************
 * Set Title Control for IOS.
 ****************************************************************************************************/
function titleControl(text, callback) {
	var titleView = Titanium.UI.createView();

	var titleLabel = Titanium.UI.createLabel({
		text : text,
		color : NAV_BAR_TEXT_COLOR,
		height : '25dp',
		width : Ti.UI.SIZE,
		font : {
			fontWeight : 'bold',
			fontSize : '17dp'
		},
		textAlign : 'center',
		ellipsize : true
	});

	titleView.add(titleLabel);
	if (callback) {
		titleView.addEventListener('click', function(e) {
			callback();
		});
	}
	return titleView;
}

/****************************************************************************************************
 *  Check Wheather it is number or not.
 ****************************************************************************************************/
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/****************************************************************************************************
 *  Add commas to number
 ****************************************************************************************************/
function commaSeparateNumber(val) {
	while (/(\d+)(\d{3})/.test(val.toString())) {
		val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
	}
	return val;
}

/****************************************************************************************************
 *  Alert dialog shows Message, Error or Information
 ****************************************************************************************************/

function showAlertDialog(title, message) {
	Titanium.UI.createAlertDialog({
		title : title,
		message : message,
		buttonNames : [A02018]
	}).show();
}

function locationUpdate() {
    Ti.API.info("Send User GeoLocation to server.");
/*
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.purpose = 'Get Current Location';
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HUNDRED_METERS;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

		if (PLATFORM == IPHONE) {
			Ti.Geolocation.getCurrentPosition(function(loc) {
				if (loc.coords) {
					prop.setString('last_known_location', JSON.stringify(loc.coords));
				} else {
					//failed
				}
			});
		} else {

			var locFunct = function(loc) {
				if (loc.coords) {
					Titanium.Geolocation.removeEventListener('location', locFunct);
					prop.setString('last_known_location', JSON.stringify(loc.coords));
				} else {
					//failed
				}
			};

			var onPause = function() {
				Titanium.Geolocation.removeEventListener('location', locFunct);
			};

			var onDestroy = function() {
				Titanium.Geolocation.removeEventListener('location', locFunct);
			};

			Titanium.Geolocation.removeEventListener('location', locFunct);
			Titanium.Geolocation.addEventListener('location', locFunct);
			Ti.Android.currentActivity.addEventListener('pause', onPause);
			Ti.Android.currentActivity.addEventListener('destroy', onDestroy);
		}

	}
*/
}

function PixelsToDPUnits(px) {
	return (px / (Ti.Platform.displayCaps.dpi / 160));
}

/*****************************************************************************************************
 * Calculates the difference current date and twork creation date. And returns time elapsed.
 * Response formats supported are (1) #m, (2) #h, (3) #d, (4) #w,
 * (5) #m, (6) #y
 *
 * @param tworkDate Date of twork
 ******************************************************************************************************/
function getTimeElapsed(tworkDate) {

	var timeElapsed = null;
	
	if(tworkDate=='Just now')
	   return "Just now";

	var splitbyspace = tworkDate.split(' ');
	var date = splitbyspace[0];
	var time = splitbyspace[1];
	var date_arr = date.split('-');

	if (date_arr.length == 3) {
		var time_arr = time.split(':');

		if (time_arr[0] > 12) {
			var AMPM = time_arr[0] - 12;
		} else {
			var AMPM = time_arr[0];
		}

		var date_str = date_arr[1] + '/' + date_arr[2] + '/' + date_arr[0];

		if (time_arr[0] < 12) {
			var time_str = AMPM + ':' + time_arr[1] + ' AM';
		} else {
			var time_str = AMPM + ':' + time_arr[1] + ' PM';
		}

		var str = date_str + ' ' + time_str;

		var dateStr_Obj = new Date(str);

	} else {
		var dateStr_Obj = new Date(tworkDate);
	}

	var currentDate = new Date();
	var localTimezoneOffset = currentDate.getTimezoneOffset();
	var serverTimezoneOffset = 239;
	//Server UTC offset
	var offsetDifference = localTimezoneOffset - serverTimezoneOffset;

	//in minutes
	offsetDifference = offsetDifference * 60000;
	//in milliseconds
	var millisecondsPerMin = 1000 * 60;
	//minutes in milliseconds
	var minsPerHour = 60;
	//No. of minutes per hour
	var minsPerDay = minsPerHour * 24;
	//No. of minutes per day
	var minsPerWeek = minsPerDay * 7;
	//No. of minutes per week
	var minsPerMonth = minsPerDay * 30;
	//No. of minutes per month
	var minsPerYear = minsPerMonth * 12;
	//No. of minutes per year
	var diff_milliseconds = currentDate.getTime() - dateStr_Obj.getTime();
	diff_milliseconds = diff_milliseconds + offsetDifference;

	var minutes_Elapsed = ((diff_milliseconds / millisecondsPerMin) - 60);
	if (minutes_Elapsed < 60) {

		minutes_Elapsed = Math.floor(minutes_Elapsed - 1);

		var minutesAgo = L('minutes_ago');

		if (minutes_Elapsed === 1) {
			minutesAgo = L('minute_ago');
		}

		timeElapsed = Math.floor(minutes_Elapsed) + ' ' + minutesAgo;
		if (minutes_Elapsed <= 0) {
			timeElapsed = L('just_now');
		}
		return timeElapsed;
	}
	if (minutes_Elapsed < minsPerDay) {
		var hours_Elapsed = Math.floor(minutes_Elapsed / minsPerHour);
		if (hours_Elapsed === 1) {
			timeElapsed = hours_Elapsed + ' ' + L('hour_ago');
		} else {
			timeElapsed = hours_Elapsed + ' ' + L('hours_ago');
		}
		return timeElapsed;
	}
	if (minutes_Elapsed < minsPerWeek) {
		var days_Elapsed = Math.floor(minutes_Elapsed / minsPerDay);
		if (days_Elapsed === 1) {
			timeElapsed = days_Elapsed + ' ' + L('day_ago');
		} else {
			timeElapsed = days_Elapsed + ' ' + L('days_ago');
		}
		return timeElapsed;
	}
	if (minutes_Elapsed < minsPerMonth) {
		var weeks_Elapsed = Math.floor(minutes_Elapsed / minsPerWeek);
		if (weeks_Elapsed === 1) {
			timeElapsed = weeks_Elapsed + ' ' + L('week_ago');
		} else {
			timeElapsed = weeks_Elapsed + ' ' + L('weeks_ago');
		}
		return timeElapsed;
	}
	if (minutes_Elapsed < minsPerYear) {
		var months_Elapsed = Math.floor(minutes_Elapsed / minsPerMonth);
		if (months_Elapsed === 1) {
			timeElapsed = months_Elapsed + ' ' + L('month_ago');
		} else {
			timeElapsed = months_Elapsed + ' ' + L('months_ago');
		}
		return timeElapsed;
	}
	return L('year_ago');
}

/**********************************************************************************************************
 *                      Check Email validation
 **********************************************************************************************************/
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

/**********************************************************************************************************
 *                    Strip all htl tags and &lt; and &gt; and
 * replace &quot; &gt;  &lt; &amp; &#039;
 **********************************************************************************************************/

function convertToEntities(astr) {
	var bstr = '', cstr, i = 0;
	for (i; i < astr.length; ++i) {
		if (astr.charCodeAt(i) > 127) {
			cstr = astr.charCodeAt(i).toString(10);
			while (cstr.length < 4) {
				cstr = '0' + cstr;
			}
			bstr += '&#' + cstr + ';';
		} else {
			bstr += astr.charAt(i);
		}
	}
	return bstr;
}

function truncateString(maxLength, string) {
	var maxLength = maxLength, newString = string;

	if (string.length > maxLength) {
		//trim to max provided
		var trimmed = string.substr(0, maxLength);

		//trim again if in the middle of a word
		trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));

		newString = trimmed + '...';
	}

	return newString;
}

function stripHtmlTags(text) {

	//To convert all numerical character entities in a string to their character equivalents
	text = text.replace(/&#(\d+);/g, function(m, n) {
		return String.fromCharCode(n);
	});
	text = text.replace(/&lt;br&gt;/g, "\n").replace(/(&amp;)/g, "&").replace(/(&quot;)/g, '"').replace(/(&nbsp;)/g, '');
	text = text.replace(/(&gt;)/g, ">").replace(/(&lt;)/g, "<").replace(/(&amp;nbsp;)/g, " ");

	//Strip all html tags and Br tag replace with \n
	text = text.replace(/<br>/g, '\n');
	text = text.replace(/<br \/>/g, '\n');

	text = text.replace(/<\S[^><]*>/g, '');

	//To replace a leading space before a comma with ,and then a trailing space.
	//e.g. : -  " ," will replace with ", "
	text = text.replace(/ ,/g, ", ");

	return text;
}
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
//Identify url or link from Post Update or Post Comment
function urlify(text) {
	return text.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, function(url) {
		if(validateEmail(url)){
		    return url;
		}
		return "<a href='" + url + "'>" + url + "</a>";
	});
};
//Identify url or link from Post Update or Post Comment
function urlIdentify(text) {
	regex = /(https?:\/\/[^\s]+)/g;
	return text.replace(regex, function(url) {
		return true;
	});
};

function resizeImage(maxW, maxH, image) {
	var maxWidth = maxW;
	var maxHeight = maxH;
	var ratio = 0;
	var width = image.width;
	var height = image.height;

	// Check if the current width is larger than the max
	if (width > maxWidth) {
		ratio = maxWidth / width;
		// get ratio for scaling image
		height = height * ratio;
		// Reset height to match scaled image
		width = width * ratio;
		// Reset width to match scaled image
	}

	// Check if current height is larger than max
	if (height > maxHeight) {
		ratio = maxHeight / height;
		// get ratio for scaling image
		width = width * ratio;
		// Reset width to match scaled image
		height = height * ratio;
		// Reset height to match scaled image
	}

	if (PLATFORM != ANDROID) {
		var resizedImage = image.imageAsResized(width, height);

		return resizedImage;
	} else {
		return image;
	}

}

//Debounce is used to eliminate issues with double/triple clicking
var debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate)
				func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
		if (callNow)
			func.apply(context, args);
	};
};

var callback_Onerror = function(jsonObj) {
	activityIndicator.hide();
};

function extend(a, b) {
	for (var key in b)
	if (b.hasOwnProperty(key))
		a[key] = b[key];
	return a;
}

function naked_id(id) {
	if (id)
		return id.replace(/[\{\}]/g, "");
	else
		return null;
}

function getParameters(url) {
	url = url.substring(url.indexOf('?') + 1);
	var match, pl = /\+/g, // Regex for replacing addition symbol with a space
	search = /([^&=]+)=?([^&]*)/g, decode = function(s) {
		return decodeURIComponent(s.replace(pl, " "));
	}, query = url;

	urlParams = {};
	while ( match = search.exec(query))
	urlParams[decode(match[1])] = decode(match[2]);

	return urlParams;
}
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}