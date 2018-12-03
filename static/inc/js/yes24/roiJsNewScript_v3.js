/*
eMFORCE ROI Script

Modified date: 2013.08.29

ver 3.0.0
*/

var _pg = document.location.href;
var _rf = document.referrer;
var _trackingDomain = _multiDomain(document.domain);
var _sp;
var _dir;
var _cat;
var _depth;
var _rfd = '';
var _kwd = '';
var _ekams = '';
var _conversionURL = 'gd';
var _trackingDays = 30;
var _cookieExpires = 30;
var _epochtime   = 0;
var _query = {};
var _ekamsCookieValue = '';
var _ekamsCookieName = 'ekams.tracer';
var _neoKeywordCookieName = 'neo.keyword';
var _todayepochtime = _getEpochTime(0);
var _protocol = document.location.protocol.indexOf('https') != -1 ? 'https://' : 'http://';
var _trackingURL = 'conv2.emforce.co.kr/';
var _trackingURLHttps = 'roi.emforce.co.kr/';
var _requestURL = self.document.location.href;
var _neoSearchEngineType = {
	'www.google.co.kr' : 'Google',
	'www.google.com' : 'Google',
	'search.naver.com' : 'Naver',
	'search.daum.net' : 'Daum',
	'kr.search.yahoo.com' : 'Yahoo',
	'search.empas.com' : 'Empas',
	'search.paran.com' : 'Paran',
	'search.d.paran.com' : 'Dreamwiz',
	'livesearch.msn.co.kr' : 'MSN',
	'search.cyworld.com' : 'Cyworld',
	'nate.search.com' : 'Nate',
	'search.korea.com' : 'Korea',
	'search.chol.com' : 'Chol',
	'www.grapi.kr' : 'Grapi'
};
var _neoSearchMatchCode = {
	'adwords' : 'G',
	'overture' : 'O',
	'naver' : 'N',
	'daum' : 'D',
	'yahoo' : 'Y',
	'empas' : 'E',
	'paran' : 'P',
	'realclick' : 'R'
};

if( _rf == ''){
	//no referror check
	var param = window.location.search;
    if (param.indexOf('_caosrefdm') < 0) {
        if(userAgentChk()){
        	_rf = 'mobile';
        }
    }else{
    	_rf = _parseQueryRef('_caosrefdm');
    }
}

//userAgent check
function userAgentChk(){
	var _userAgent = navigator.userAgent,
	mobileKeyWords = ['iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson'],
	isMobile = false;
	for (var word in mobileKeyWords) {
		if(_userAgent.match(mobileKeyWords[word])) {
			isMobile = true;
			break;
		}
	};
	return isMobile;
}

if( _protocol.indexOf('https') != -1 ) {
	_trackingURL = _trackingURLHttps;
}

function _multiDomain(dd) {
	var _s = dd.split(".");
	if (_s.length == 3) {
		if (_s[1].length == 2) {
			return dd;
		} else {
			return _s[1] + "." + _s[2];
		}
	} else if (_s.length > 3) {
		if (_s[_s.length-2].length == 2) {
				return _s[_s.length-3] + "." + _s[_s.length-2] + "." + _s[_s.length-1];
		} else {
				return _s[_s.length-2] + "." + _s[_s.length-1];
		}
	} else {
			return dd;
	}
}

function _parseQuery(att) {
  var pstr = window.location.search;
  if( typeof window.location.search === "string" ){
    pstr = document.location.href;
  }
  if (pstr.indexOf(att) < 0) return '';
  var len = pstr.length;
  var start = pstr.indexOf(att+'=') + (att.length + 1);
  var tmp = pstr.substr(start, len - start);
  var end = start + tmp.indexOf('&');
  if (end >= start) {
      tmp = pstr.substr(start, (end - start));
  }
  return tmp;
}

function _parseReferrerQuery(engine) {
  var searchEngine = {
	'www.google.co.kr' : 'q',
	'www.google.com'   : 'q',
	'search.naver.com' : 'query',
	'search.daum.net'  : 'q',
	'kr.search.yahoo.com' : 'p',
	'search.empas.com' : 'q',
	'search.paran.com' : 'Query',
	'search.d.paran.com' : 'q',
	'livesearch.msn.co.kr' : 'q',
	'search.cyworld.com' : 'q',
	'nate.search.empas.com' : 'q',
	'search.korea.com' : 'query',
	'search.chol.com' : 'q',
	'www.grapi.kr' : 'query'
  };

  if (searchEngine[engine] !== undefined) {
    var att = searchEngine[engine];
    var pstr = top.document.referrer;
    if (pstr.indexOf(att) < 0) return '';
    var len = pstr.length;
    var start = pstr.indexOf(att+'=') + (att.length + 1);
    var tmp = pstr.substr(start, len - start);
    var end = start + tmp.indexOf('&');
    if (end >= start) tmp = pstr.substr(start, (end - start));
    return tmp;
  } else { return ''; }
}

function _getCookieVal (offset) {
  var endstr = document.cookie.indexOf (';', offset);
  if (endstr == -1) endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}
function _getCookie(name) {
  var arg = name + '=';
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg)
        return _getCookieVal (j);
    i = document.cookie.indexOf(' ', i) + 1;
    if (i === 0) break;
  }
  return null;
}

function _setCookie(name, value, expiredays) {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + '=' + escape(value) + '; path=/; domain=' + _trackingDomain + '; expires=' + todayDate.toGMTString() + ';';
}

function _setCookieSec(name, value, expireSec) {
	var todayDate = new Date();
	todayDate.setSeconds(todayDate.getSeconds() + expireSec);
	document.cookie = name + '=' + escape(value) + '; path=/; domain=' + _trackingDomain + '; expires=' + todayDate.toGMTString() + ';';
}

function _getDomain(url) {
  start = url.indexOf('//');
  end = url.substring(start+2, url.length).indexOf('/');
  return (url.substring(start+2, start+2+end));
}

function _getEpochTime(days) {
  var todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + days);
  return parseInt(todayDate.getTime() / 1000,10);
}

function _getEpochTimeForCookieTime() {
  var todayDate = new Date();
  todayDate.setDate(todayDate.getDate());
  return parseInt(todayDate.getTime(),10);
}

function _getCalculateTime( seconds ) {
 var todayDate = new Date();
 todayDate.setSeconds(todayDate.getSeconds() + seconds);
 return parseInt(todayDate.getTime() / 1000,10);
}

function _neoReSetCookies(addCookieStr,cookieName,maxCnt,trackingDaysCnt)
{
	var tempCookiesStr = _getCookie(cookieName);
	var cookieValue = '';
	if( tempCookiesStr === null){
		epochtime = _getEpochTime(trackingDaysCnt);
		cookieValue = addCookieStr + '.' + epochtime;
	}else{
		cookieValue = neoRebatchCookies(tempCookiesStr,addCookieStr);
	}
	_setCookie(cookieName, cookieValue, _cookieExpires);
}

function neoRebatchCookies( tempCookiesStr,addCookieStr ){
	var cookiesList = tempCookiesStr.split('|');
	var cookiesListCnt = cookiesList.length;
	var neoCookieValue = '';
	var verifyValue = '';
	var epochtime = 0;
	for (var i = 0 ; i < cookiesListCnt ; i++)
	{
		var temp = cookiesList[i].split('.');
		var tempCnt = temp.length;
		if ( temp[(tempCnt-1)] - _todayepochtime > 0)
		{
			verifyValue = neoAddDiv(temp,'.');
			if (verifyValue != addCookieStr )
			{
				neoCookieValue += cookiesList[i] + '|';
			}
		}
	}
  epochtime = _getEpochTime(_query['trackingDays'] ? _query['trackingDays'] : _trackingDays);
  neoCookieValue += addCookieStr + '.' + epochtime;
  return neoCookieValue;
}

function neoAddDiv( temp , divStr ){
	var tempCnt = temp.length;
	var verifyValue ='';
	for (var k = 0 ; k < tempCnt-1 ; k++) {
		verifyValue += temp[k] + divStr;
	}
	return verifyValue.substring(0,(verifyValue.length-1));
}

function _neoLastAdvertiserData( tempCookiesStr,addCookieStr ){
	var cookiesList = tempCookiesStr.split('|');
	var cookiesListCnt = cookiesList.length;
	var neoCookieValue = '';
	var verifyValue = '';
	var tempCnt = 0;
	for ( var i = cookiesListCnt-1 ; i >= 0  ; i--)
	{
		var temp = cookiesList[i].split('.');
		if( temp.length > 0 ){
			tempCnt = temp.length;
			if ( temp[(tempCnt-1)] - _todayepochtime > 0)
			{
				verifyValue = neoAddDiv(temp,'.');
				if (verifyValue != addCookieStr )
				{
					if (_ekamsAdvertiserID == temp[1]) {
						neoCookieValue = verifyValue;
						break;
					}
				}
			}
		}
	}
  return neoCookieValue;
}

function _neoAbstractionUrl() {
	var trackingStr = _getCookie(_ekamsCookieName);
	var keywordStr = _getCookie(_neoKeywordCookieName);
	var tmpUrl = _protocol + _trackingURL+_conversionURL+'.emf?advertiserId='+_ekamsAdvertiserID;
	tmpUrl += '&roiId='+_ekamsTrackingID;
	tmpUrl += '&value='+_sp;
	tmpUrl += '&code1='+_dir;
	tmpUrl += '&code2='+_cat;
	tmpUrl += '&ekams='+_ekams;
	tmpUrl += '&allekams='+trackingStr;
	tmpUrl += '&neo='+keywordStr;
	return tmpUrl;
}

function _neoAbstractionUrlFlash(_ekamsAdvertiserID,ekamsTrackingID,sp,dir,cat){
	var trackingStr = _getCookie(_ekamsCookieName);
	var keywordStr = _getCookie(_neoKeywordCookieName);
	var _ekamsf ='';
	if( trackingStr !== null){
		_ekamsf = _neoLastAdvertiserData( trackingStr,_query['ekams']);
	}
	var tmpUrl = _protocol + _trackingURL+_conversionURL+'.emf?advertiserId='+_ekamsAdvertiserID;
	tmpUrl += '&roiId='+ekamsTrackingID;
	tmpUrl += '&value='+sp;
	tmpUrl += '&code1='+dir;
	tmpUrl += '&code2='+cat;
	tmpUrl += '&ekams='+_ekamsf;
	tmpUrl += '&allekams='+trackingStr;
	tmpUrl += '&neo='+keywordStr;
	return tmpUrl;
}

function _neoTrackingAbstractionData(trackingStr){
	var trackingAbstractionData = '';
	if( trackingStr !== null && trackingStr !== '' ){
		var tmpList = trackingStr.split('|');
		for (var i = (tmpList.length-1) ; i >= 0 ; i--){
			var temp = tmpList[i].split('.');
			var typeStr = temp[0];
			trackingAbstractionData += _neoSearchMatchCode[typeStr]+'.'+temp[5]+'.'+temp[6]+'|';
		}
	}
	return trackingAbstractionData;
}

function _neoKewordCookies( referrerUrl ){
  var keyword = _kwd;
  var domainStr = _rfd;
  var matchType = _neoSearchEngineType[domainStr];
  if(  matchType === undefined || matchType === '' )
  {
    var domainName = domainStr.replace('.','_');
    domainName = domainName.replace('.','_');
    if( domainName.indexOf(".") > 0 )
    {
		domainName = domainName.replace('.','_');
    }
    matchType = domainName;
  }
  var neoCookieValue = '';
  if( keyword !== '' )
  {
    keyword = keyword.replace('.','');
    keyword = keyword.replace('%7C','');
  }else{
    keyword = 'NOSEARCH';
    keyword = keyword.replace('%7C','');
  }
  var addCookieStr = matchType +'.'+keyword;
  neoCookieValue = _neoQueueCookiesValue( _neoKeywordCookieName,addCookieStr,3);
  _setCookie(_neoKeywordCookieName, neoCookieValue, _cookieExpires);
}

function _neoQueueCookiesValue( cookieName,addCookieStr,maxCnt )
{
	var tempCookiesStr = _getCookie(cookieName);
	if( tempCookiesStr === null ) tempCookiesStr='';
	var cookiesList = tempCookiesStr.split('|');
	var cookiesListCnt = cookiesList.length;
	var neoCookieValue = '';
	var epochtime = 0;
	var loopStartCnt = 0;
	if(cookiesListCnt >= maxCnt ){ loopStartCnt = (cookiesListCnt-maxCnt+1); }
	for (var i = loopStartCnt ; i < cookiesListCnt ; i++){
		var temp = cookiesList[i].split('.');
		var tempCnt = temp.length;
		if ( temp[(tempCnt-1)] - _todayepochtime > 0){
			neoCookieValue += cookiesList[i] + '|';
		}
	}

	epochtime = _getEpochTimeForCookieTime();
	neoCookieValue += addCookieStr + '.' + epochtime;
	return neoCookieValue;
}

function callbackFlashAction(_ekamsAdvertiserID,_ekamsTrackingID,sp,dir,cat) {
   var flashAction = new Image();
   flashAction.src = _neoAbstractionUrlFlash(_ekamsAdvertiserID,_ekamsTrackingID,sp,dir,cat);
}

function makeSalesPrice(sp) {
	var result = sp + "";

    if(/[0-9,]+/.test(result)){
       result = result.split(',').join('');
    }else{
       result = "0";
    }
    return result;
}

function _parseQueryRef(att) {
    var pstr = window.location.search;
    if (pstr.indexOf(att) < 0) {
        return '';
    }
    pstr = pstr.replace(/%2F/g, "/" ).replace(/%26/g, "&").replace(/%3A/g, ":");
    var len = pstr.length;
    var start = pstr.indexOf(att+'=') + (att.length + 1);
    var tmp = pstr.substr(start, len - start);
    var end = start + tmp.indexOf('&');
    if (end >= start) {
        tmp = pstr.substr(start, (end - start));
    }

    return tmp;
}

try { if (_salesPrice !== '') { _sp=makeSalesPrice(_salesPrice); }} catch (e) { _sp=''; }
try { if (_pageDepth == 'final') { _depth=_pageDepth; }} catch (e) { _depth=''; }
try { if (_directory !== '') { _dir=_directory; }} catch (e) { _dir=''; }
try { if (_category !== '') { _cat=_category; }} catch (e) { _cat=''; }

_query['ekams'] = _parseQuery('EKAMS');
_query['trackingDays'] = _parseQuery('trackingDays');

if ((_query['ekams'] !== '') && (_rf !== '')) {
    _neoReSetCookies( _query['ekams'] , _ekamsCookieName , 5 , _trackingDays );
}else{
	var localTempCookiesStr = _getCookie(_ekamsCookieName);
	if( localTempCookiesStr !== null ){
		_ekams = _neoLastAdvertiserData( localTempCookiesStr,_query['ekams']);
	}
}

if ((_query['ekams'] !== '') && (_rf !== '')) {
  _rfd = _getDomain(_rf);
  _kwd = _parseReferrerQuery(_rfd);
  _neoKewordCookies(_rf);
}


var _duplChek = _getCookie('ekams.dupl');

if (_pageDepth === undefined){
	var _pageDepth = '';
}

if( _duplChek === null ){
	if ((_pageDepth == 'final') && (_requestURL.substr(0,4) != 'file') && (_ekams !== '' )) {
		var newScriptTag = document.createElement('script');
		newScriptTag.src = _neoAbstractionUrl();
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);
		_setCookieSec('ekams.dupl','ekams.dupl',30);
  }
}