const PLATFORM = Titanium.Platform.name;
const ANDROID = "android";
const IPHONE = "iPhone OS";
const DBNAME = "brightideaDB";

/**************************************************************************************************
 * KEYBOARD constANTS
 **************************************************************************************************/
const KEYBOARD_ASCII = Titanium.UI.KEYBOARD_ASCII;
const KEYBOARD_EMAIL = Titanium.UI.KEYBOARD_EMAIL;

if (PLATFORM == ANDROID) {
	var KEYBOARD_NUMBER = Titanium.UI.KEYBOARD_DECIMAL_PAD;
} else if (PLATFORM == IPHONE) {
	var KEYBOARD_NUMBER = Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION;
}

/**************************************************************************************************
 * Style Constants
 **************************************************************************************************/

const BI_BORDER_RADIUS = 5;
const NIELSEN_BLUE = '#009dd9';
const NIELSEN_DARK_BLUE = '#008dc3';
const BLUE_EYES = '#1589FF';
/**************************************************************************************************
 * COLOR constANTS
 * TODO: Branding different file
 **************************************************************************************************/
const RED = '#CC3300';
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const BLACK_VAR = '#222';
const GRAY = '#999';
const NAVY = '#009dd9';
const LIGHT_GRAY = '#F0F0F0';
const TURQUOISE = '#00FFFF';
const GREEN = '#00FF00';
const BLUE = '#009dd9';
var NAV_BAR_COLOR = '#009dd9';
var NAV_BAR_TEXT_COLOR = "#ffffff";
const UNREAD_ROW_COLOR = '#dcf0fe';
const TAB_BAR_COLOR = '#3F3C37';
const DARK_GRAY_COLOR = '#525252';

const BACKGROUND_GRAY = '#DBDBDB';
const PHASE_BACKGROUND = '#999999';
const BORDER_GRAY = '#CBCBCB';
const TEXT_DARK = '#333';
const TEXT_MEDIUM = '#B6B6B6';
const TEXT_LIGHT = '#BFBEBE';
const TAG_BACK = '#F4F4F4';
const TAG_BORDER = '#CCCCCC';
const CURRENT_USER_BACK = '#DDDDDD';
const COMMENT_BACK = '#F6F6F6';
const HEADER_BACK = '#E6E6E6';
const COMMENT_BORDER = '#E7E7E7';
const LINK_COLOR = '#09B0FF';
const SUBMITTER_LETTER = '#525252';
const ADVANCED_COMMENT_BTN = '#D3D6DB';
/***
 * Internationalization constants naming scheme :
 ***
 * File specific constants (Always starts with a single letter (A-Z)) :
 *
 * constant has 6 charecters in the format of
 * < filename initial > < no. 01-99 > < no. 001-999 >
 * Filename initial :
 * Say for a file 'accounts.js', it is 'a'
 *
 * no. 01-99 :
 * If there are more than one files with same intial letter. This no.
 * distingushes files by giving each an incrementing no. ex. a01, a02 etc.
 * Thus there are at most 99 files are allowed with same initial letter.
 *
 * no. 001-999 :
 * It distingushes constants in a file. Thus there are at most 999 constants
 * are allowed in a file.
 *
 * Application specific constants (Always starts with letters "AP") :
 * Starts with AP0001 and increments by one. At most 9999 are allowed.
 */
/**************************************************************************************************
 *               							Application Specific
 *               TODO: default constants need NOT be here.
 **************************************************************************************************/

const AP0020 = '';

const AP0023 = 'API call limit exceeded.';
const AP0024 = 'Your API call limit is exceeded.';

const AP0029 = 'No network connection available. Please connect to a WiFi or cellular network to use Brightidea Mobile.';

const AP0037 = 'Invalid Response from brightidea. Please try again';

/**************************************************************************************************
 *               							ResetPasswordScreen.js
 **************************************************************************************************/
const RP0001 = 'You have successfully reset your password';

/**************************************************************************************************
 *               							home.js
 **************************************************************************************************/

const A02018 = 'OK';

const A02020 = 'Submit';

const A02034 = 'The username or password you entered is incorrect. Please try again.';


/**************************************************************************************************
 *               							SettingsScreen.js
 **************************************************************************************************/
const S01001 = 'Logged into ';
const S01002 = 'Notifications: ';

