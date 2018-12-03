/******************************************************************
Title : Window Clint Region Center
Name: center
Description: Center a div on page, no matter what!
Author: AK (www.zeroedandnoughted.com)
Date: 22nd April 2009
Version: 0.2
Dependencies: jQuery
******************************************************************/

var jcYES24SVR = 'http://www.yes24.com';
var jcYES24SSLSVR = 'https://www.yes24.com';
var jcFILESVR = 'http://tkfile.yes24.com';
var jcSFILESVR = 'https://stkfile.yes24.com';

(function ($) {
    $.fn.akcenter = function (options) {
        var panel = this;
        panel.option = jQuery.extend({ applyscroll: 'yes' }, options);

        return this.each(function () {
            var $this = $(this);
            var frameXOffset = 0, frameYOffset = 0, windowHeight = 0, windowWidth = 0;
            
            if (top.document != window.document) {
                var frm = $('iframe', top.document.body);

                if (frm.length == 0) {
                    frm = $('frame', top.document.body);
                }

                var i = frm.length;

                while (i--) {
                    if (frm[i].contentDocument) {
                        doc = frm[i].contentDocument;
                    } else {
                        doc = frm[i].contentWindow.document;
                    }

                    if (doc === document) {
                        frameXOffset = $(frm[i]).offset().left;
                        frameYOffset = $(frm[i]).offset().top;
                        break;
                    }
                };

                if (jQuery.browser.msie) {
                    windowWidth = top.window.document.documentElement.clientWidth;
                    windowHeight = top.window.document.documentElement.clientHeight;
                } else {
                    windowWidth = top.window.innerWidth;
                    windowHeight = top.window.innerHeight;
                }
            } else {
                if (jQuery.browser.msie) {
                    windowWidth = window.document.documentElement.clientWidth;
                    windowHeight = window.document.documentElement.clientHeight;
                } else {
                    windowWidth = window.innerWidth;
                    windowHeight = window.innerHeight;
                }
            }

            var elHeight = $this.height();
            var newTop = ((windowHeight / 2) - (elHeight / 2)) - frameYOffset + (panel.option.applyscroll == "no" ? 0 : $(parent.document.documentElement).scrollTop());

            if ((newTop + elHeight) > $(document).height()) {
                newTop = $(document).height() - elHeight;
            }

            $this.css({
                position: 'absolute',
                left: ((windowWidth / 2) - ($this.width() / 2)) - frameXOffset + (panel.option.applyscroll == "no" ? 0 : $(parent.document.documentElement).scrollLeft()),
                top: newTop,
                'z-index': 2000
            });
        });
    };
})(jQuery);

/******************************************************************
// ProgressBar
******************************************************************/

(function ($) {
    $.fn.jry_home_ShowProgressBar = function (options) {
        var panel = this;
        this.option = jQuery.extend({ state: 'start' }, options);

        this.update = function () {
            var value = panel.progressbar("option", "value");

            if (value < 100) {
                panel.progressbar("value", value + 1);
            } else {
                panel.progressbar("value", 0);
            }
        };

        this.clear = function () {
            if (panel.filter("[intervalID]").length > 0) {
                var ids = panel.attr("intervalID").split('|');

                for (var i = 0; i < ids.length; i++)
                    if (ids[i] != "") { clearInterval(parseInt(ids[i])); }

                panel.attr("intervalID", "");
            }
        };

        this.start = function () {
            panel.progressbar({ value: 10 });
            panel.akcenter({ "applyscroll": "no" });
            panel.css("display", "block");

            this.clear();

            if (panel.filter("[intervalID]").length == 0)
                panel.attr("intervalID", setInterval(panel.update, 70) + "|");
            else
                panel.attr("intervalID", panel.attr("intervalID") + setInterval(panel.update, 70) + "|");
        };

        this.stop = function () {
            this.clear();

            panel.css("display", "none");
            panel.attr("intervalID", "");
        };

        if (this.option.state == 'start') this.start();
        if (this.option.state == 'stop') this.stop();
    }
})(jQuery);

/******************************************************************
// Calendar : Datepicker
******************************************************************/

(function ($) {
    // Display Start Skin Calendar
    $.fn.jry_home_ShowCalendar = function (options) {
        var panel = this;
        $(this).css({
                    'z-index': '999',
                    'position': 'relative'
                   });
        
        this.option = jQuery.extend({ minDate: '1900-01-01', maxDate: '', buttonImage: jcFILESVR + '/img/common/btn_cal.gif' }, options);

        $(this).removeClass("w70").addClass("w70")
            .datepicker({
            // Set Datepicker Position
            // inline: false,
            // Set Image Button Trigger
            showOn: "button",
            buttonImage: this.option.buttonImage,
            buttonImageOnly: true,
            buttonText: "날짜를 선택하세요.\r\n\r\n<달력콘트롤>\r\n년(年)단위 이동: Ctrl + PgUp/PgDn 키\r\n월(月)단위 이동: PgUp/PgDn 키",
            // Set Date Format Type
            dateFormat: "yy-mm-dd",
            // Set Date Range
            minDate: this.option.minDate,
            maxDate : this.option.maxDate,
            // Set Month/Year Choice
            changeMonth: true,
            changeYear: true,
            // Set Other Months
            showOtherMonths: true,
            showButtonPanel: false,
            //selectOtherMonths: true,
            // Set Show Week
            // showWeek: true,
            // firstDay: 1,
            // Set Month Short Names
            monthNamesShort: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
            // Set Month Names
            monthNames: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
            // Set Day Short Names
            dayNamesMin: ['<font color="red">일</font>', '월', '화', '수', '목', '금', '<font color="blue">토</font>'],
            // Set Year/Month Postion
            showMonthAfterYear: true,
            // Set Year Suffix Words
            //yearSuffix: '년'
            yearSuffix: ''
        });
    }
})(jQuery);

/******************************************************************
// Default Functions
******************************************************************/

/*  KEY CODE
Backspace (8), Tab (9), Shift (16), Ctrl (17), Menu (18), Pause Break (19), Caps Lock (20), Esc (27), 
Page Up (33), Page Down (34), End (35), Home (36), Left Arrow (37), Up Arrow (38), 
Right Arrow (39), Down Arrow (40), Insert (45), Forward Delete (46), Num Lock (144), Scroll Lock (145)
Number Code : 48 ~ 57, Number KeyPad Code : 96 ~ 105
*/

function jsf_def_InputBlur() {
    var pattern = new RegExp('[^0-9]+', 'g');
    var $input = $j(this);
    var value = $input.val();
    value = value.replace(pattern, '');
    $input.val(value);
}

function jsf_def_InputBlur_NoDash() {
    var pattern = new RegExp('[-]+', 'g');
    var $input = $j(this);
    var value = $input.val();
    value = value.replace(pattern, '');
    $input.val(value);
}

function jsf_def_InputNoDash(event) {
    var keyCode = event.which;
    var isStandard = false;
    var isExtended = (keyCode != 189);
    var validKeyCodes = ',8,9,37,39,46,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    if (isStandard || isExtended || isOther) {
        return true;
    } else {
        return false;
    }
}

function jsf_def_InputRealNumber(event) {
    var keyCode = event.which;
    var isStandard = (keyCode > 47 && keyCode < 58);
    var validKeyCodes = ',8,9,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    if (isStandard || isOther) {
        return true;
    } else {
        return false;
    }
}


function jsf_def_InputOnlyNumber(event) {
    var keyCode = event.which;
    var isStandard = (keyCode > 47 && keyCode < 58);
    var isExtended = (keyCode > 95 && keyCode < 106);
    var validKeyCodes = ',8,9,37,39,46,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    if (isStandard || isExtended || isOther) {
        return true;
    } else {
        return false;
    }
}

function jsf_def_InputOnlyNumberOkDash(event) {
    var keyCode = event.which;
    var isStandard = (keyCode > 47 && keyCode < 58);
    var isExtended = (keyCode > 95 && keyCode < 106);
    var validKeyCodes = ',8,9,37,39,46,189,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    if (isStandard || isExtended || isOther) {
        return true;
    } else {
        return false;
    }
}

function jsf_def_InputSsnNumberAutoDash(event) {
    var keyCode = event.which;
    var isStandard = (keyCode > 47 && keyCode < 58);
    var isExtended = (keyCode > 95 && keyCode < 106);
    var validKeyCodes = ',8,9,37,39,46,189,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    var $this = $j(this);
    var r = /(\D+)/g, npa = '', nxx = '', last4 = '';
    var str = $this.val().replace(r, '')
    var tmp = '';

    if (str.length > 6) {
        tmp += str.substr(0, 6);
        tmp += '-';
        tmp += str.substr(6);
    }
    else {
        tmp = str;
    }

    if (isStandard || isExtended || isOther) {
        $this.val(tmp);
        return true;
    } else {
        return false;
    }
}

function jsf_def_InputPhoneNumberAutoDash(event) {
    var keyCode = event.which;
    var isStandard = (keyCode > 47 && keyCode < 58);
    var isExtended = (keyCode > 95 && keyCode < 106);
    var validKeyCodes = ',8,9,37,39,46,189,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    var $this = $j(this);
    var r = /(\D+)/g, npa = '', nxx = '', last4 = '';
    var str = $this.val().replace(r, '')
    var tmp = '';

    if (str.length < 4) {
        tmp = str;
    }
    else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
    }
    else if (str.length <= 9) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
    }
    else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
    }

    if (isStandard || isExtended || isOther) {
        $this.val(tmp);
        return true;
    } else {
        return false;
    }
}

function jsf_def_InputOnlyNumberWithAutoTab(event) {
    var keyCode = event.which;
    var isStandard = (keyCode > 47 && keyCode < 58);
    var isExtended = (keyCode > 95 && keyCode < 106);
    var validKeyCodes = ',8,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);

    if (isStandard || isExtended || isOther) {
        return true;
    } else {
        return false;
    }
}

function jsf_def_InputOnlyNumberOkCharacter(event) {

    var keyValue = event.key;
    var keyCode = event.which;
    var check = /[^(a-zA-Z0-9)]/;
    var isCheck = !check.test(keyValue);
    if (keyCode > 122) {
        isCheck = false;
    }
    var validKeyCodes = ',8,9,37,39,46,189,';
    var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);
    
    if (isCheck || isOther) {
        return true;
    } else {
        return false;
    }
}


/*
include jquery.caret.1.02.min.js
add attributes in input control : autotab="1" autotabmax="3" autotabgroup="grpname"
bind events : keydown, keyup
*/
function jsf_def_InputAutoTab(event) {
    var keyCode = event.which;
    var ignoreKeyCodes = ',9,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,144,145,';

    if (ignoreKeyCodes.indexOf(',' + keyCode + ',') > -1) { return; }
    if (keyCode == 8 && event.type == 'keydown') { return; }

    var $this = $j(this);
    var currentLength = $this.val().length;
    var maximumLength = $this.attr('maxlength');

    var autotab = $this.attr('autotab');
    var autotabmax = $this.attr('autotabmax');
    var autotabgroup = $this.attr('autotabgroup');

    if (keyCode == 8 && currentLength == 0) {
        var prevObj = null;

        if (--autotab >= 1)
            prevObj = $j("input[autotabgroup=" + autotabgroup + "][autotab=" + autotab + "]");

        if (prevObj != null && prevObj.length > 0) {
            prevObj.focus();
            var prevObjLength = prevObj.val().length;
            if (prevObjLength > 0) prevObj.caret(prevObjLength, prevObjLength);
        }
    }

    else if (currentLength == maximumLength) {
        var nextObj = null;

        if (++autotab <= autotabmax)
            nextObj = $j("input[autotabgroup=" + autotabgroup + "][autotab=" + autotab + "]");

        if (nextObj != null && nextObj.length > 0) {
            nextObj.focus();
        }
    }
}

function jsf_def_NoPaste(event) {
    return false;
}

function jsf_def_NoCut(event) {
    return false;
}

function jsf_def_NoInput(event) {
    return false;
}

/*
var mHash = new jsf_def_Hash();
mHash.setItem(key, value);
mHash.getItem(key);
mHash.removeItem(key);
mHash.hasItem(key);
mHash.clear();
*/
function jsf_def_Hash() {
    this.length = 0;
    this.items = new Array();
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof (arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }

    this.removeItem = function (in_key) {
        var tmp_previous;
        if (typeof (this.items[in_key]) != 'undefined') {
            this.length--;
            var tmp_previous = this.items[in_key];
            delete this.items[in_key];
        }

        return tmp_previous;
    }

    this.getItem = function (in_key) {
        return this.items[in_key];
    }

    this.setItem = function (in_key, in_value) {
        var tmp_previous;
        if (typeof (in_value) != 'undefined') {
            if (typeof (this.items[in_key]) == 'undefined') {
                this.length++;
            }
            else {
                tmp_previous = this.items[in_key];
            }

            this.items[in_key] = in_value;
        }

        return tmp_previous;
    }

    this.hasItem = function (in_key) {
        return typeof (this.items[in_key]) != 'undefined';
    }

    this.clear = function () {
        for (var i in this.items) {
            delete this.items[i];
        }

        this.length = 0;
    }
}

/******************************************************************
// Utitity Functions
******************************************************************/

function jsf_def_PadLeft(jpSrc, jpLen, jpPadChar) {
    var jvOut = jpSrc.toString();
    if (!jpPadChar) { jpPadChar = '0'; }
    while (jvOut.length < jpLen) {
        jvOut = jpPadChar + jvOut;
    }
    return jvOut;
};

function jsf_def_PadRight(jpSrc, jpLen, jpPadChar) {
    var jvOut = jpSrc.toString();
    if (!jpPadChar) { jpPadChar = '0'; }
    while (jvOut.length < jpLen) {
        jvOut = jvOut + jpPadChar;
    }
    return jvOut;
};

function jsf_def_GetUnderAgeFromSSN(jpSSN) {
    if (jpSSN.length != 13)
        return 0;

    var v1 = Number(jpSSN.substring(0, 2));
    var v2 = Number(jpSSN.substring(6, 7));
    var vy = (v2 == 1 || v2 == 2 || v2 == 5 || v2 == 6) ? 1900 + v1 : ((v2 == 3 || v2 == 4 || v2 == 7 || v2 == 8) ? 2000 + v1 : 0);
    var vm = Number(jpSSN.substring(2, 4));
    var vd = Number(jpSSN.substring(4, 6));
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth() + 1;
    var thisDay = today.getDate();
    var dy = thisYear - vy;
    var dmd = (thisMonth - vm) * 100 + (thisDay - vd);

    return dmd >= 0 ? dy : dy - 1;
}

function jsf_def_VerifySSN(jpSSN) {
    jpSSN = jpSSN.replace(/-/gi, '');

    if (!(/^[0-9]{13}$/.test(jpSSN))) {
        return false;
    }

    var jvSum = 0;

    jvSum += jpSSN.charAt(0) * 2;
    jvSum += jpSSN.charAt(1) * 3;
    jvSum += jpSSN.charAt(2) * 4;
    jvSum += jpSSN.charAt(3) * 5;
    jvSum += jpSSN.charAt(4) * 6;
    jvSum += jpSSN.charAt(5) * 7;
    jvSum += jpSSN.charAt(6) * 8;
    jvSum += jpSSN.charAt(7) * 9;
    jvSum += jpSSN.charAt(8) * 2;
    jvSum += jpSSN.charAt(9) * 3;
    jvSum += jpSSN.charAt(10) * 4;
    jvSum += jpSSN.charAt(11) * 5;

    jvCheck = (11 - jvSum % 11) % 10;

    if (jpSSN.charAt(12) != jvCheck)
        return false;
    else if (!(jpSSN.charAt(6) == '1' || jpSSN.charAt(6) == '2' || jpSSN.charAt(6) == '3' || jpSSN.charAt(6) == '4'))
        return false;

    return true;
}

function jsf_def_VerifySSNF(jpSSN) {
    jpSSN = jpSSN.replace(/-/gi, '');

    if (!(/^[0-9]{13}$/.test(jpSSN))) {
        return false;
    }

    var jvSum = 0;
    var jvParity = 0;
    var jvSSNNo = new Array(13);

    for (i = 0; i < 13; i++) jvSSNNo[i] = parseInt(jpSSN.charAt(i));

    if (jvSSNNo[11] < 6) return false;

    if ((jvParity = jvSSNNo[7] * 10 + jvSSNNo[8]) & 1) return false;


    var jvWeight = 2;

    for (i = 0, jvSum = 0; i < 12; i++) {
        jvSum += (jvSSNNo[i] * jvWeight);
        if (++jvWeight > 9) jvWeight = 2;
    }

    if ((jvSum = 11 - (jvSum % 11)) >= 10) jvSum -= 10;
    if ((jvSum += 2) >= 10) jvSum -= 10;

    if (jvSum != jvSSNNo[12]) 
        return false;
    else if (!(jpSSN.charAt(6) == '5' || jpSSN.charAt(6) == '6' || jpSSN.charAt(6) == '7' || jpSSN.charAt(6) == '8'))
        return false;

    return true;
}

function jsf_def_VerifyBusinessNo(jpBizNo) {
    jpBizNo = jpBizNo.replace(/-/gi, '');

    if (!(/^[0-9]{10}$/.test(jpBizNo))) {
        return false;
    }

    var jvCheckNo = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
    var i, jvCheckSum = 0, jvC2, jvRemander;

    for (i = 0; i <= 7; i++) jvCheckSum += jvCheckNo[i] * jpBizNo.charAt(i);

    jvC2 = "0" + (jvCheckNo[8] * jpBizNo.charAt(8));
    jvC2 = jvC2.substring(jvC2.length - 2, jvC2.length);

    jvCheckSum += Math.floor(jvC2.charAt(0)) + Math.floor(jvC2.charAt(1));

    jvRemander = (10 - (jvCheckSum % 10)) % 10;

    if (Math.floor(jpBizNo.charAt(9)) == jvRemander) return true;
    
    return false;
}

function jsf_def_GetDocWidth() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
        Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
        Math.max(D.body.clientWidth, D.documentElement.clientWidth)
    );
}

function jsf_def_GetDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function jsf_def_GetNoAnchorUrl(jpUrl) {
    var jvUrl = jpUrl;

    if (jvUrl.length > 0 && jvUrl.indexOf("#") != -1) {
        jvUrl = jvUrl.substr(0, jvUrl.indexOf("#"));
    }

    return jvUrl;
}

function jsf_def_GUID() {
    var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


/******************************************************************
// 검색 카테고리
******************************************************************/
function toggle_search_submenu() {
    $j("#search_submenu").toggle();
}

function close_search_submenu() {
    $j("#search_submenu").hide();
}

function set_search_category(text, value) {
    $j("#search_category").text(text);
    $j("#searchType").val(value);
}


/******************************************************************
// Site Functions
******************************************************************/

var jcAJAX_BEFORESEND = 0;
var jcAJAX_COMPLETE = 1;

$j.ajaxSetup({ cache: false });

function jsf_com_AjaxLoader(jpType, jpTopMargin, jpLeftMargin, jpIndex, jpSelectorID) {
    var loaderImgObj = $j("#imgAjaxLoader" + jpIndex);
    var thisObj = $j(jpSelectorID);

    if (thisObj.length == 1) {
        if (jpType == jcAJAX_BEFORESEND) {
            var baseOffset = thisObj.offset();
            loaderImgObj.css({
                position: 'absolute',
                top: baseOffset.top + ((thisObj.height() - loaderImgObj.height()) / 2) + jpTopMargin,
                left: baseOffset.left + ((thisObj.width() - loaderImgObj.width()) / 2) + jpLeftMargin,
                //'z-index': (thisObj.css("z-index") == 'auto' ? parseInt(loaderImgObj.css("z-index")) + 1 : parseInt(thisObj.css("z-index")) + 1)
                'z-index': 9999
            });
            loaderImgObj.show();
        } else if (jpType == jcAJAX_COMPLETE) {
            loaderImgObj.hide();
        }
    }
}

function jsf_com_GoToAnchor(jpSelector) {
    $j('body,html').animate({ scrollTop: $j(jpSelector).offset().top }, 'slow');
}

function jsf_com_GoToAnchor_ScrollSpeed(jpSelector, scrollspeed) {
    $j('body,html').animate({ scrollTop: $j(jpSelector).offset().top }, scrollspeed);
}

function jsf_com_GoToTop() {
    var jvMiliSeconds = '';
    var args = jsf_com_GoToTop.arguments;

    if (args.length >= 1) jvMiliSeconds = args[0];
    else jvMiliSeconds = 300;

    $j('body,html').animate({ scrollTop: 0 }, (jvMiliSeconds == '' ? 300 : jvMiliSeconds));
}

function jsf_com_ShowPager(pagerid, ptotal, pidx, psize, callback, options) {
    this.option = jQuery.extend({ showcount: true, showendpoint: true }, options);
    
    var joPager = $j(pagerid);
    var joTotal = $j(ptotal);
    var joIndex = $j(pidx);
    var joSize = $j(psize);

    if (joPager.length > 0 && joTotal.length > 0 && joIndex.length > 0 && joSize.length > 0) {
        var jvTotal = parseInt(joTotal.val());
        var jvIndex = parseInt(joIndex.val());
        var jvSize = 10; // parseInt(joSize.val());
        var jvVSize = parseInt(joSize.val());
                
        var jvDPS = jvSize;
        var jvTPC = parseInt((jvTotal - 1) / jvVSize) + 1;
        var jvfrom = 0, jvto = 0;

        jvfrom = parseInt((jvIndex - 1) / jvDPS) * jvDPS + 1;
        jvto = jvfrom + (jvDPS - 1);

        if (jvTPC > jvfrom + (jvDPS - 1)) jvto = jvfrom + (jvDPS - 1);
        else jvto = jvTPC;

        var jvfirstPI = 0, jvprevPI = 0, jvnextPI = 0, jvlastPI = 0;

        if (parseInt((jvIndex - 1) / jvDPS) > 0) jvfirstPI = jvfrom - 1;
        if (jvIndex > 1) jvprevPI = jvIndex - 1;
        if (jvIndex < jvTPC) jvnextPI = jvIndex + 1;
        if (jvto < jvTPC) jvlastPI = jvto + 1;

        joPager.empty();

        if (this.option.showendpoint == true) {
            if (jvfirstPI > 0) joPager.append("<a pageno='" + jvfirstPI + "' class='dcursor'><img src='"+ jcFILESVR +"/img/common/btn_fst.gif' alt='처음으로' /></a>");
            else joPager.append("<img src='"+jcFILESVR +"/img/common/btn_fst.gif' alt='처음으로' />");
        }

        if (jvprevPI > 0) joPager.append("<a pageno='" + jvprevPI + "' class='dcursor'><img src='"+jcFILESVR +"/img/common/btn_pre.gif' alt='이전목록' /></a>");
        else joPager.append("<img src='"+jcFILESVR +"/img/common/btn_pre.gif' alt='이전목록' />");

        for (var i = jvfrom; i <= jvto; i++) {
            if (i == jvIndex) joPager.append("<a class='on'><span>" + i + "</span></a>");
            else joPager.append("<a pageno='" + i + "' class='dcursor'><span>" + i + "</span></a>");
        }

        if (this.option.showcount == true) {
            joPager.append("<span class='bunch'>(<strong>" + jvIndex + "</strong>/" + jvTPC + ")</span>");
        }

        if (jvnextPI > 0) joPager.append("<a pageno='" + jvnextPI + "' class='dcursor'><img src='"+jcFILESVR +"/img/common/btn_next.gif' alt='다음목록' /></a>");
        else joPager.append("<img src='"+jcFILESVR +"/img/common/btn_next.gif' alt='다음목록' />");

        if (this.option.showendpoint == true) {
            if (jvlastPI > 0) joPager.append("<a pageno='" + jvlastPI + "' class='dcursor'><img src='"+jcFILESVR +"/img/common/btn_end.gif' alt='맨끝으로'/></a> ");
            else joPager.append("<img src='"+jcFILESVR +"/img/common/btn_end.gif' alt='맨끝으로'/>");
        }

        joPager.find("a[pageno]").each(function (i) {
            $j(this).click(function (e) {
                joIndex.val($j(this).attr("pageno"));
                callback();
            });
        });
    }
}

function jsf_com_IE9NoSelect(jpInputCtrls) {
    if ($j.browser.msie && $j.browser.version == 9) {
        var joCtrl = jpInputCtrls;

        if (joCtrl.length > 0) {
            joCtrl.each(function (i) { 
                if($j(this).parent().length == 1) {
                    $j(this).parent().unbind("selectstart.ie9noselect").bind("selectstart.ie9noselect", function (e) {
                        e.preventDefault();
                    });
                }
            });
        }
    }
}

$j(document).ready(function () {// When DOM is loaded
    $j("a, img, input:button, input:submit, button, area").bind("focus.siteall", function () { $j(this).blur(); });
    $j("a.download").bind("click.sitedownload", function () { if ($j("#_downloadframe").length == 0) $j("<iframe name='_downloadframe' id='_downloadframe' frameborder='0' width='0' height='0'></iframe>").appendTo('body'); $j.download('/Pages/Func/Downloading.aspx', 'Path=' + $j(this).attr("dpath") + '&Name=' + $j(this).attr("dname")); });
    $j("img[multimedia_photo]").bind("click.multimedia_photo", function () { $j('#dialogPopup').jPopup({ 'modal': true, 'width': 200, 'height': 200, 'url': '/Pages/Popup/Multimedia/ShowImage.aspx?fileurl=' + $j(this).attr("fileurl"), 'title': '사진 보기' }); });
    $j("img[multimedia_movie]").bind("click.multimedia_movie", function () { $j('#dialogPopup').jPopup({ 'modal': true, 'width': 200, 'height': 200, 'url': '/Pages/Popup/Multimedia/ShowMovie.aspx?fileurl=' + $j(this).attr("fileurl"), 'title': '멀티미디어 보기' }); });
    //$j(document).bind('contextmenu.siteall', function (e) { return false; });
    $j("#imgAjaxLoader").css({ 'z-index': 1000 });

    // selectbox custom style
//    $j('select').each(function () {
//        if ($j(this).attr('id') != 'SelAuthorList')
//            $j(this).sSelect({ defaultText: $j(this).find('option:selected').html() });
//    });
});

$j(window).load(function () {// When resources & images are loaded
    
});