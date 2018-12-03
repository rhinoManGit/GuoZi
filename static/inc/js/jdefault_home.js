/* Base Script */

function jsf_base_GetDeParam(params) {
    var o = {};
    if (!params) return o;
    var a = params.split('&');
    for (var i = 0; i < a.length; i++) {
        var pair = a[i].split('=');
        o[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return o;
}

function jsf_base_GetCookie(jpKey, jpSubKey) {
    var joCookie = jsf_base_GetDeParam($j.cookie(jpKey, { raw: true }));
    return (joCookie[jpSubKey] == undefined ? "" : joCookie[jpSubKey]);
}

function jsf_base_IsSiteLogin() {

    if (jsf_base_GetCookie("YesTicket", "UserNO") != "") return true;
    else return false;
   /*return true*/
}

function jsf_base_GetSiteMainURL() {
    return "/Pages/Main.aspx";
}

function jsf_base_GetSiteDetailURL(jpIdPerf) {
    return "/Pages/Perf/Detail/Detail.aspx?IdPerf=" + jpIdPerf;
}

function jsf_base_GoToPerfDetail(jpIdPerf) {
    window.location.href = jsf_base_GetSiteDetailURL(jpIdPerf);
}

function jsf_base_GoToUrl(jpGoUrl) {
    if (jpGoUrl == "")
        window.location.href = jsf_base_GetSiteMainURL();
    else {
        var jvGoUrl = jpGoUrl.toLowerCase();

        if (jvGoUrl.indexOf("http://") == 0 || jvGoUrl.indexOf("https://") == 0)
            window.location.href = jpGoUrl;
        else
            window.location.href = $j.url().attr("protocol") + "://" + $j.url().attr("host") + jpGoUrl;
    }
}

function jsf_base_GetYesFormatUrl() {
    var jvUrl = $j.url().attr("source");

    jvUrl = jsf_def_GetNoAnchorUrl(jvUrl);
    jvUrl = jvUrl.replace(/&/g, "`");
    jvUrl = jvUrl.replace(/\?/g, "&&ReturnParams=");

    return jvUrl;
}

function jsf_base_GoYes24Login() {
    location.href = jcYES24SSLSVR + "/Templates/FTLogin.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
}

function jsf_base_GetYes24Login() {
    if (sTLPage == "1") {
        return "/Pages/Login/LoginEnt.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
    }
    else {
        return jcYES24SSLSVR + "/Templates/FTLogin.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
    }
}

function jsf_GetConcise_Login() {
    if (sTLPage == "1") {
        location.href =  "/Pages/Login/LoginEnt.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
    }
    else {
        setWcode('034_011_002');
        location.href = jcYES24SSLSVR + "/Templates/FTLogin.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
    }

}

function jsf_base_GoYes24Adult() {
    location.href = jcYES24SSLSVR + "/Member/Adult.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
}

function jsf_base_GetYes24Adult() {
    return jcYES24SSLSVR + "/Member/Adult.aspx?ReturnURL=" + jsf_base_GetYesFormatUrl();
}

function jsf_base_GetYesReferrer() {
    //console.log(111111111111)
    if (document.referrer == "") {
        return "http://ticket.yes24.com"
    }
    else { 
    return document.referrer;
    }
}

var winRef;
function jsf_base_ShowPerfSaleProcess() {
    var args = jsf_base_ShowPerfSaleProcess.arguments;

    var paramString = "";

    if (args.length > 0) {
        paramString = "?IdPerf=" + args[0];
    }
    
    if (args.length > 1) {
        if (paramString == "") {            
            if (args[1].length == 1) {
                paramString = "?pHCardAppOpt=" + args[1];
            }
            else {
                paramString = "?IdTime=" + args[1];
            }

        } else {
            paramString += "&IdTime=" + args[1];
        }
    }

    if (args.length >= 2) {
        if (args[2] == 1) {
            paramString += "&pHCardAppOpt=" + args[2];
        }
    }

    if (jgBookTPopup == jcMODE_JQUERY) {// JQuery MODE        
        $j('#dialogPopup').jPopup({ 'modal': true, 'width': 972, 'height': 583, 'url': 'http://'+location.host + '/Pages/Perf/Sale/PerfSaleProcess.aspx' + paramString, 'title': '공연예매' });
    } else {// Window MODE
        var jvPopupWidth = 970;
        var jvPopupHeight = 636;

        if (/chrome/.test(navigator.userAgent.toLowerCase())) {
            jvPopupWidth += 18;
        } else if ($j.browser.msie) { }
        else if ($j.browser.mozilla) { }
        else if ($j.browser.safari) {
            jvPopupWidth += 18;
            jvPopupHeight -= 100;
        }
        else if ($j.browser.opera) {
            jvPopupWidth += 18;
        }

        var jvPopupLeftPos = (screen.width - jvPopupWidth) / 2;
        var jvPopupTopPos = (screen.height - jvPopupHeight) / 2;

        //window.open('http://' + location.host + '/Pages/Perf/Sale/PerfSaleProcess.aspx' + paramString, 'pop_perfsale', 'width=' + jvPopupWidth + ',height=' + jvPopupHeight + ',left=' + jvPopupLeftPos + ',top=' + jvPopupTopPos);

        var popUrl = 'http://' + location.host + '/Pages/Perf/Sale/PerfSaleProcess.aspx' + paramString;
        
        if (!winRef || winRef.closed) {
            winRef = window.open(popUrl, 'pop_perfsale', 'width=' + jvPopupWidth + ',height=' + jvPopupHeight + ',left=' + jvPopupLeftPos + ',top=' + jvPopupTopPos);
        } else {
            winRef.location = popUrl;
            winRef.focus();
        }

    }
}

function jsf_base_GoPerfSalePerf(jsp_IdPerf, jsp_IsLogin, HcadOption) {    
    if (jsp_IsLogin == '0') {
        var jvRetUrl = jsf_base_GetYes24Login();

        if (jgSiteAlert == jcMODE_JQUERY) {// JQuery MODE
            $j('#dialogAlert').jAlert({ "msg": '티켓 예매는 로그인이 필요합니다.', 'loc': jvRetUrl });
        } else {// Window MODE
            alert('티켓 예매는 로그인이 필요합니다.');
            location.href = jvRetUrl;
        }
    }
    else {        
        if (HcadOption == 1) {
            jsf_base_ShowPerfSaleProcess(jsp_IdPerf, HcadOption);
        }
        else {
            jsf_base_ShowPerfSaleProcess(jsp_IdPerf);
        }
    }
}

function jsf_base_GoPerfSaleTime(jsp_IdPerf, jsp_IdTime, jsp_IsLogin, jsp_HcardOpt) {
    if (jsp_IsLogin == '0') {
        var jvRetUrl = jsf_base_GetYes24Login();

        if (jgSiteAlert == jcMODE_JQUERY) {// JQuery MODE
            $j('#dialogAlert').jAlert({ "msg": '티켓 예매는 로그인이 필요합니다.', 'loc': jvRetUrl });
        } else {// Window MODE
            alert('티켓 예매는 로그인이 필요합니다.');
            location.href = jvRetUrl;
        }
    }
    else
        jsf_base_ShowPerfSaleProcess(jsp_IdPerf, jsp_IdTime, jsp_HcardOpt);
}

function jsf_base_ShowPackageSaleProcess() {
    var args = jsf_base_ShowPackageSaleProcess.arguments;

    var paramString = "";

    if (args.length > 0) {
        paramString = "?Id=" + args[0];
    }

    if (jgBookPPopup == jcMODE_JQUERY) {// JQuery MODE
        $j('#dialogPopup').jPopup({ 'modal': true, 'width': 927, 'height': 571, 'url': '/Pages/Perf/Sale/PackageSaleProcess.aspx' + paramString, 'title': '패키지예매' });
    } else {// Window MODE
        var jvPopupWidth = 907;
        var jvPopupHeight = 710;

        var jvPopupLeftPos = (screen.width - jvPopupWidth) / 2;
        var jvPopupTopPos = (screen.height - jvPopupHeight) / 2;

        window.open('/Pages/PerfSale/PerfSalePackage.aspx' + paramString, 'pop_packagesale', 'width=' + jvPopupWidth + ',height=' + jvPopupHeight + ',left=' + jvPopupLeftPos + ',top=' + jvPopupTopPos + ', resizable=yes');
    }
}

function jsf_base_GoPackageSale(jsp_IdPackage, jsp_IsLogin) {
    if (jsp_IsLogin == '0') {
        var jvRetUrl = jsf_base_GetYes24Login();
            
        if (jgSiteAlert == jcMODE_JQUERY) {// JQuery MODE
            $j('#dialogAlert').jAlert({ "msg": '패키지 예매는 로그인이 필요합니다.', 'loc': jvRetUrl });
        } else {// Window MODE
            alert('패키지 예매는 로그인이 필요합니다.');
            location.href = jvRetUrl;
        }
    }
    else jsf_base_ShowPackageSaleProcess(jsp_IdPackage);
}

function jsf_base_GetTooltipVal(jpCtrl) {
    var jvTooltip = jpCtrl.attr("vtooltip");
    var jvVal = jpCtrl.val();

    return (jvTooltip == 'undefined' ? jvVal : (jvTooltip == jvVal ? "" : jvVal));
}

var jgIsPageShow = true;

function jsf_base_SearchGo() {
    if (document.getElementById('searchbox').value.length < 0) {
        $j("#dialogAlert").jAlert({ "msg": "검색어를 입력하세요." });
        return false;
    }
    else if (document.getElementById('searchbox').value.length < 2) {
        $j("#dialogAlert").jAlert({ "msg": "검색어를 두자이상 입력하세요." });
        return false;
    } else {
        location.href = "/Pages/Category/search.aspx?q=" + $j("#searchbox").val();

    }
}

function jsf_base_SearchEnter() {
    if (event.keyCode == 13) {
        jsf_base_SearchGo();
    }
}

function jsf_base_MMOver(obj, gubun) {
    obj.src = obj.src.replace("on", "");
    if (gubun == 'over') obj.src = obj.src.replace(".gif", "on.gif");
    else obj.src = obj.src.replace("on.gif", ".gif");
}

function jsf_base_GetParam(valuename) {
    var rtnval = "";
    var nowAddress = unescape(location.href);
    var parameters = (nowAddress.slice(nowAddress.indexOf("?") + 1, nowAddress.length)).split("&");

    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split("=")[0];

        if (varName.toUpperCase() == valuename.toUpperCase()) {
            rtnval = parameters[i].split("=")[1];
            break;
        }
    }

    return rtnval;
}

function jsf_base_GetCommonFlash(flash, objWidth, objHeight, rettype) {
    var doc = document;
    var sDoc = "";
    var xfile = flash.substring(flash.lastIndexOf(".") + 1);
    var sDomainUrl = "";
    var sCurUrl = document.URL.toLowerCase();
    var iCenterPos = sCurUrl.indexOf('?');

    if (iCenterPos != -1)
        sDomainUrl = sCurUrl.substr(0, iCenterPos);
    else
        sDomainUrl = sCurUrl;

    var ihttpAdd = "http://";
    if (sDomainUrl.indexOf('https://') != -1) ihttpAdd = "https://";

    sDoc += "<OBJECT codeBase='" + ihttpAdd + "download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0'";
    sDoc += "height='" + objHeight + "' width='" + objWidth + "' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'>";

    if (xfile.toLowerCase() == "swf") {
        sDoc += "<PARAM NAME='FlashVars' VALUE=''>";
        sDoc += "<PARAM NAME='Movie' VALUE='" + flash + "'>";
        sDoc += "<PARAM NAME='Src' VALUE='" + flash + "'>";
    } else{
        sDoc += "<PARAM NAME='FlashVars' VALUE='flv=" + flash + "'>";
        sDoc += "<PARAM NAME='Movie' VALUE='/inc/swf/bTv_flvPlayer.swf'>";
        sDoc += "<PARAM NAME='Src' VALUE='/inc/swf/bTv_flvPlayer.swf'>";
    }

    sDoc += "<PARAM NAME='WMode' VALUE='Transparent'>";
    sDoc += "<PARAM NAME='Play' VALUE='1'>";
    sDoc += "<PARAM NAME='Loop' VALUE='-1'>";
    sDoc += "<PARAM NAME='Quality' VALUE='High'>";
    sDoc += "<PARAM NAME='SAlign' VALUE=''>";
    sDoc += "<PARAM NAME='Menu' VALUE='-1'>";
    sDoc += "<PARAM NAME='Base' VALUE=''>";
    sDoc += "<PARAM NAME='DeviceFont' VALUE='0'>";
    sDoc += "<PARAM NAME='EmbedMovie' VALUE='0'>";
    sDoc += "<PARAM NAME='BGColor' VALUE=''>";
    sDoc += "<PARAM NAME='SWRemote' VALUE=''>";
    sDoc += "<PARAM NAME='MovieData' VALUE=''>";
    sDoc += "<param name='allowScriptAccess' value='always' />";
    sDoc += "<PARAM NAME='SeamlessTabbing' VALUE='1'>";
    sDoc += "<PARAM NAME='Profile' VALUE='0'>";
    sDoc += "<PARAM NAME='ProfileAddress' VALUE=''>";
    sDoc += "<PARAM NAME='ProfilePort' VALUE='0'>";

    if (xfile.toLowerCase() == "swf")
        sDoc += "<embed src='" + flash + "' quality='high' WMode='Transparent' width='" + objWidth + "' height='" + objHeight + "' align='middle'";
    else
        sDoc += "<embed src='/inc/swf/bTv_flvPlayer.swf' flashvars='flv=" + flash + "' quality='high' WMode='Transparent' width='" + objWidth + "' height='" + objHeight + "' align='middle'";

    sDoc += "type='application/x-shockwave-flash' pluginspage='" + ihttpAdd + "www.macromedia.com/go/getflashplayer'>";
    sDoc += "</OBJECT>";

    if (rettype == "STR")
        return sDoc;
    else
        doc.write(sDoc);
}

function jsf_base_GetCommonFlash_Player(flash, objWidth, objHeight, rettype, auto, mute, playerSize) {
    var doc = document;
    var sDoc = "";
    var xfile = flash.substring(flash.lastIndexOf(".") + 1);
    var sDomainUrl = "";
    var sCurUrl = document.URL.toLowerCase();
    var iCenterPos = sCurUrl.indexOf('?');
    var playerUrl = "";

    if (iCenterPos != -1)
        sDomainUrl = sCurUrl.substr(0, iCenterPos);
    else
        sDomainUrl = sCurUrl;

    var ihttpAdd = "http://";
    if (sDomainUrl.indexOf('https://') != -1) ihttpAdd = "https://";

    if (playerSize == "640")
        playerUrl = "/inc/swf/bTv_flvPlayer_640x480.swf";
    else if (playerSize == "215")
        playerUrl = "/inc/swf/bTv_flvPlayer_215x180.swf";
    else if (playerSize == "421")
        playerUrl = "/inc/swf/bTv_flvPlayer_421x258.swf";
    else if (playerSize == "430")
        playerUrl = "/inc/swf/bTv_flvPlayer_430x330.swf";
    else if (playerSize == "440")
        playerUrl = "/inc/swf/bTv_flvPlayer_440x350.swf";
    else if (playerSize == "465")
        playerUrl = "/inc/swf/bTv_flvPlayer_465x320.swf";
    else if (playerSize == "680")
        playerUrl = "/inc/swf/bTv_flvPlayer_680x480.swf";

    sDoc += "<object type='application/x-shockwave-flash' data='" + (xfile.toLowerCase() == "swf" ? flash : (playerUrl + "?flvURL=" + flash + "&autoPlayVars=" + auto + "&muteVars=" + mute)) + "' width='" + objWidth + "' height='" + objHeight + "' title=''>";
    if (xfile.toLowerCase() == "swf") {
        sDoc += "<PARAM NAME='FlashVars' VALUE=''>";
        sDoc += "<PARAM NAME='Movie' VALUE='" + flash + "'>";
    } else {
        sDoc += "<PARAM NAME='FlashVars' VALUE='flvURL=" + flash + "&autoPlayVars=" + auto + "&muteVars=" + mute + "'>";
        sDoc += "<PARAM NAME='Movie' VALUE='" + playerUrl + "'>";
    }
    sDoc += "<embed quality='high' WMode='Transparent'>";
    sDoc += "<PARAM NAME='WMode' VALUE='Transparent'>";
    sDoc += "</OBJECT>";


    if (rettype == "STR")
        return sDoc;
    else
        doc.write(sDoc);
}

function jsf_base_GetCommonFlashAuto(flash, objWidth, objHeight, rettype, auto, mute) {
    var doc = document;
    var sDoc = "";
    var xfile = flash.substring(flash.lastIndexOf(".") + 1);
    var sDomainUrl = "";
    var sCurUrl = document.URL.toLowerCase();
    var iCenterPos = sCurUrl.indexOf('?');

    if (iCenterPos != -1)
        sDomainUrl = sCurUrl.substr(0, iCenterPos);
    else
        sDomainUrl = sCurUrl;

    var ihttpAdd = "http://";
    if (sDomainUrl.indexOf('https://') != -1) ihttpAdd = "https://";

    if (xfile.toLowerCase() == "swf")
        sDoc += "<embed src='" + flash + "' quality='high' WMode='Transparent' width='" + objWidth + "' height='" + objHeight + "' align='middle'";
    else
        sDoc += "<embed src='/inc/swf/bTv_flvPlayer.swf?autoPlayVars=" + auto + "&muteVars=" + mute + "&flv="+flash+"' flashvars='flv=" + flash + "' quality='high' WMode='Transparent' width='" + objWidth + "' height='" + objHeight + "' align='middle'";

    sDoc += "type='application/x-shockwave-flash' pluginspage='" + ihttpAdd + "www.macromedia.com/go/getflashplayer'>";

    if (rettype == "STR")
        return sDoc;
    else
        doc.write(sDoc);
}

function jsf_base_PagerMove(movePage) {
    CurPage = movePage;
    jsf_cm_GetBoardList();
}

function jsf_base_Paging(objdiv, pagesize, listsize, callback, options) {
    this.option = jQuery.extend({ showcount: true, showendpoint: true }, options);

    objdiv.html("");
    var innerHtml = "";
    var FromPage = parseInt((CurPage - 1) / listsize) * listsize + 1;
    var ToPage = FromPage + listsize - 1;
    var PageCount = parseInt(((Total - 1) / pagesize)) + 1;
    if (PageCount <= ToPage)
        ToPage = PageCount;

    if (this.option.showendpoint == true) {
        if (parseInt(((CurPage - 1) / listsize)) > 0) {
            innerHtml += "<a pageno='" + (parseInt(FromPage) - 1) + "' class='dcursor'><img src='" + jcFILESVR + "/img/common/btn_fst.gif' alt='처음 페이지' /></a>";
        } else {
            innerHtml += "<img src='" + jcFILESVR + "/img/common/btn_fst.gif' alt='처음 페이지' />";
        }
    }

    if (CurPage > 1) {
        innerHtml += "<a pageno='" + (parseInt(CurPage) - 1) + "' class='dcursor'><img src='" + jcFILESVR + "/img/common/btn_pre.gif' alt='이전페이지'/></a>";
    } else {
        innerHtml += "<img src='" + jcFILESVR + "/img/common/btn_pre.gif' alt='이전페이지'/>";
    }

    for (var i = FromPage; i <= ToPage; i++) {
        if (i == CurPage)
            innerHtml += "<a class='on'><span>" + i + "</span></a>";
        else
            innerHtml += "<a pageno='" + i + "' class='dcursor'><span>" + i + "</span></a>";
    }

    if (this.option.showcount == true) {
        innerHtml += "<span class='bunch'>(<strong>" + CurPage + "</strong>/" + PageCount + ")</span>";
    }

    if (CurPage < PageCount) {
        innerHtml += "<a pageno='" + (parseInt(CurPage) + 1) + "' class='dcursor'><img src='" + jcFILESVR + "/img/common/btn_next.gif' alt='다음페이지' /></a>";
    } else {
        innerHtml += "<img src='" + jcFILESVR + "/img/common/btn_next.gif' alt='다음페이지' />";
    }

    if (this.option.showendpoint == true) {
        if (ToPage < PageCount) {
            innerHtml += "<a pageno='" + (parseInt(ToPage) + 1) + "' class='dcursor'><img src='" + jcFILESVR + "/img/common/btn_end.gif' alt='마지막 페이지'/></a>";
        } else {
            innerHtml += "<img src='" + jcFILESVR + "/img/common/btn_end.gif' alt='마지막 페이지'/>";
        }
    }
    objdiv.html(innerHtml);

    objdiv.find("a[pageno]").each(function (i) {
        $j(this).click(function (e) {
            jsf_base_PagerMove($j(this).attr("pageno"));
            if (callback != null)
                callback();
        });
    });
}

function setCookie(name, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function getCookie(name) {
    var nameOfCookie = name + "=";
    var x = 0;
    while (x <= document.cookie.length) {
        var y = (x + nameOfCookie.length);
        if (document.cookie.substring(x, y) == nameOfCookie) {
            if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                endOfCookie = document.cookie.length;
            return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x == 0)
            break;
    }
    return "";
}

function jsf_base_persnalNotice(noticeTitle) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Notice/Ajax/AjaxPersnalNotice.aspx/PNotice",
        data: JSON.stringify({
            noticeName: noticeTitle
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data, textStatus) {
            if (data.d.result == "SUCESS") {
                if (data.d.noticetype == "POPUP") {
                    $j("#mainForm").append("<div id='dialogPopup" + noticeTitle + "'></div>");
                    $j("#dialogPopup" + noticeTitle ).jSlimPopup({ 'modal': false, 'width': 415, 'height': 542, 'url': '/Pages/Popup/Notice/GreenPlugged.aspx', 'title': noticeTitle });
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $j("#dialogAlert").jAlert({ "msg": "통신 오류." });
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}


