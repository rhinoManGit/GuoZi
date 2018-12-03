/* Cosem Log Gathering Script V.2.0 */
function cosemConvert(rn, amt, pc, pa, pp, pg, etc) {
    var cosemProtocol = (location.protocol == "https:") ? "https:" : "http:";
    var image = new Image();
    var accountCode = "825";
    var imageURL = cosemProtocol + "//" + "tracking.icomas.co.kr";
    imageURL += "/Script/action3.php" + "?aid=" + accountCode + "&rn=" + encodeURI(rn);
    imageURL += "&amt=" + amt + "&pc=" + encodeURI(pc) + "&pa=" + pa + "&pp=" + pp + "&pg=" + encodeURI(pg) + "&etc=" + encodeURI(etc);
    image.src = imageURL;
}

var cosem_Request = function(){
var cookieDay = 7; // 쿠키설정 날짜
var accountCode = "825";
this.getParameter = function( name ){
var rtnval = ''; var nowAddress = unescape( location.href ); var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');
for(var i = 0 ; i < parameters.length ; i++){ var varName = parameters[i].split('=')[0];if(varName.toUpperCase() == name.toUpperCase()){rtnval = parameters[i].split('=')[1]; break;};}; return rtnval;
}
this.imageURL = function(){ var cosem = this.getParameter('cosemkid'); var cosem_kid = ""; var cosemProtocol = ( location.protocol=="https:" )? "https:" :"http:";
if( cosem.length == 0 ) cosem = this.getParameter('cosem');
if( cosem.length > 0 ){ cosem_kid = "&kid=" + cosem + "&referer=" + encodeURIComponent(location.href); 
var image = new Image(); image.src = cosemProtocol + "//" + "tracking.icomas.co.kr" + "/Script/script3.php" + "?aid="+accountCode+"&ctime=" + cookieDay + cosem_kid;};};
this.tracking = function( ){ var obj = this; setTimeout( function(){ obj.imageURL(); }, 10); };
};
var cosemRequest = new cosem_Request();
cosemRequest.tracking( );

