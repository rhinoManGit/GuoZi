/********매거진 공통***********/
var mgzHomeUrl = "/Pages/Magazine/";

/* 
매거진 메뉴 이동
old : 1-아티스트, 2-명품공연, 3-특집기사, 4-공연뉴스, 5-인터뷰, 6-카툰, 7-리얼토크, 8-관람후기, 9-기대평, 10-동영상
new : 
*/
function jsf_mgz_goMagazineList(jsPMcode) {

    //alert(jsPMcode);


//    if (jsPMcode < 7) {
//        window.location.href = mgzHomeUrl + "Magazine/MagazineList.aspx?mcode=" + jsPMcode;
//    }
//    else if (jsPMcode == 22) {
//        window.location.href = mgzHomeUrl + "TicketSpot/TicketSpot.aspx?mcode=" + jsPMcode;
    //    }
    
    //jsf_mgz_LeftMenu_Ctrl(jsPMcode);
    
    if (jsPMcode <= 5)
        window.location.href = mgzHomeUrl + "Magazine/MagazineList.aspx?mcode=" + jsPMcode;
//    else if (jsPMcode == 7)
//        window.location.href = mgzHomeUrl + "Community/Realtalk/Realtalk.aspx?mcode=" + jsPMcode;
    else if (jsPMcode == 6) //관람후기
        window.location.href = mgzHomeUrl + "Community/Review/Review.aspx?mcode=" + jsPMcode;
    else if (jsPMcode == 7) //기대평
        window.location.href = mgzHomeUrl + "Community/Expectation/Expectation.aspx?mcode=" + jsPMcode;
    else if (jsPMcode == 8) //동영상
        window.location.href = mgzHomeUrl + "TicketSpot/TicketSpot.aspx?mcode=" + jsPMcode;

}

/* 
old :매거진 코드 : 11-아티스트, 12-명품공연, 10-특집기사, 1-공연뉴스, 2-인터뷰, 9-카툰, 14-동영상
new  매거진 코드 : 
*/
function jsf_mgz_goMagazineView(jsPCode, jsCategoryId, jsPId) {
    if (jsPId == undefined) {
        jsPId = jsCategoryId;
    }

    var mcode = jsPCode;

//    alert("jsPCode : " + jsPCode);
//    alert("jsPId : " + jsPId);

//    if (jsPCode == 11) mcode = 1;
//    else if (jsPCode == 12) mcode = 2;
//    else if (jsPCode == 10) mcode = 3;
//    else if (jsPCode == 1) mcode = 4;
//    else if (jsPCode == 2) mcode = 5;
//    else if (jsPCode == 9) mcode = 6;
//    else if (jsPCode == 14) mcode = 10;
//    else if (jsPCode == 15) mcode = 11; //칼럼

    if (jsPCode == 14)
        window.location.href = mgzHomeUrl + "TicketSpot/TicketSpot.aspx?mcode=" + mcode + "&code=" + jsCategoryId + "&id=" + jsPId;
    else
        window.location.href = mgzHomeUrl + "Magazine/MagazineList.aspx?mcode=" + mcode + "&code=" + jsCategoryId + "#id=" + jsPId;

}

/* 
Board ID : 1-관람후기, 2-기대평, 3-리얼토크
*/
function jsf_mgz_goBoardView(jsPBoardId, jsPId) {

    switch (jsPBoardId) {
        case 1:
            window.location.href = mgzHomeUrl + "Community/Review/Review.aspx?mcode=8#id=" + jsPId;
            return;
        case 2:
            window.location.href = mgzHomeUrl + "Community/Expectation/Expectation.aspx?mcode=9#id=" + jsPId;
            return;
        case 3:
            window.location.href = mgzHomeUrl + "Community/Realtalk/Realtalk.aspx?mcode=7#id=" + jsPId;
            return;
        default:
            return;
    }
}

//바로가기
function jsf_mgz_GoSearchUserPage(jsPUserId, jsPType) {
    if (jsPType == 1) {
        location.href = "http://blog.yes24.com/" + jsPUserId;
    } else if (jsPType == 7) {
        location.href = "/Pages/Magazine/Community/Realtalk/RealtalkUserList.aspx?mode=" + jsPType + "&userid=" + jsPUserId;
    } else if (jsPType == 8) {
        location.href = "/Pages/Magazine/Community/Review/ReviewUserList.aspx?mode=" + jsPType + "&userid=" + jsPUserId;
    } else if (jsPType == 9) {
        location.href = "/Pages/Magazine/Community/Expectation/ExpectationUserList.aspx?mode=" + jsPType + "&userid=" + jsPUserId;
    }
}

//덧글 태그 삭제
function jsf_mgz_ReplaceHTMLtag(jsPCont) {
    var objStrip = new RegExp();
    objStrip = /[<][^>]*[>]/gi;
    return jsPCont.replace(objStrip, "");
}

// 덧글 로그인 체크
function jsf_mgz_logincheck(jsPIsLogin, jsPId, jsPObj) {
    if (jsPIsLogin == '0') {
        //var jsl_RetUrl = jsf_base_GoYes24Login() + "?RetUrl=" + encodeURIComponent(location.href + "&id=" + jsPId);
        var jsl_RetUrl = jsf_base_GetYes24Login();
        $j('#dialogAlert').jAlert({
            "msg": '로그인을 해주세요.',
            'loc': jsl_RetUrl
        });
    }

    if (jsPObj.value == "로그인 후 덧글을 입력하실 수 있습니다.") jsPObj.value = "";
    //if (document.getElementById("txtReplyCont").value == "로그인 후 덧글을 입력하실 수 있습니다.") document.getElementById("txtReplyCont").value = "";
    
}

// 공연기대평 덧글 체크
function jsf_mgz_LimitInputData(jsPObj, jsPILimitCnt) {

    var jsLSTemp = new String(jsPObj.value);
    var jsLITemp = jsLSTemp.length;
    var jsLChr;
    var jsLiTotLength = 0;
    var jsLStr = "";

    for (var idx = 0; idx < jsLITemp; idx++) {
        jsLChr = jsLSTemp.charAt(idx);

        if (escape(jsLChr) == '%0D') { } else if (escape(jsLChr).length > 4) {
            jsLiTotLength += 2;
        } else {
            jsLiTotLength++;
        }

        if (jsLiTotLength <= jsPILimitCnt) jsLStr = jsLStr + jsLChr;

        if (jsLiTotLength > jsPILimitCnt) {
            alert("덧글은 " + jsPILimitCnt + "바이트까지 작성하실 수 있으며,\r\n초과된 부분은 자동 삭제됩니다. 감사합니다.");
            jsPObj.value = jsLStr
            jsPObj.focus();
            return;
        }
    }
}

function jsf_mgz_UnderLimitInputData(jsPContents, jsPILimitCnt) {

    var jsLSTemp = new String(jsPContents);
    
    //공백 및 HTML 태그 제거
    jsLSTemp = jsLSTemp.replace(/&nbsp;/gi, "");
    jsLSTemp = jsLSTemp.replace(/\s/gi, "");
    jsLSTemp = jsLSTemp.replace(/(<([^>]+)>)/gi, "");

    if (jsLSTemp.length < jsPILimitCnt) 
        return false;
    else 
        return true;
}



//관심공연 담기
function jsf_mgz_MyPerformanceAdd(jsPIsLogin, jsPIdPerf, jsPId) {
    if (jsPIsLogin == '0') {
        //var jsl_RetUrl = jsf_base_GoYes24Login() + "?RetUrl=" + encodeURIComponent(location.href + "&id=" + jsPId);
        var jsl_RetUrl = jsf_base_GetYes24Login();
        $j('#dialogAlert').jAlert({
            "msg": '관심공연에 등록하려면 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });
        return;
    }
    else {
        $j.ajax({
            async: true,
            type: "POST",
            url: "/Pages/Ajax/InterestPerformance/InterestPerformanceAdd.aspx",
            data: { idPerf: jsPIdPerf },
            dataType: "html",
            success: function (data, textStatus) {
                $j("#dialogAlert").jAlert({ "msg": "관심공연이 등록되었습니다." });
            },
            error: function (xhr, textStatus, errorThrown) {
                $j("#dialogAlert").jAlert({ "msg": "관심공연등록시 오류가 발생하였습니다." });
            }
        });
    }

}

//게시판 운영규정 팝업
function jsf_mgz_OpenBoardRule() {

    try
    {
        if (parent != null)
            parent.jsf_def_IFrameSlimPopup('/Pages/Popup/Community/BoardRule.aspx');
        else
            jsf_def_IFrameSlimPopup('/Pages/Popup/Community/BoardRule.aspx');
    }
    catch (e)
    {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 650, 'height': 310, 'url': '/Pages/Popup/Community/BoardRule.aspx', 'title': '' });
    }

    return false;
}


/* TicketSpot Movie Player*/
function jsf_mgz_MainBTVPlayer(idx, width, height, auto, mute, playerSize) {
    $j("#btvPlayer").find("p").css("display", "none");
    var flashp = $j("#btvPlayer").find("p[tag='" + idx + "']");
    flashp.css("display", "block");
    if (flashp.attr("fdata") != null && flashp.attr("fdata") != "") {
        //flashp.html(jsf_base_GetCommonFlashAuto(flashp.attr("fdata"), flashp.attr("fwidth"), flashp.attr("fheight"), "STR", 1, true));
        flashp.html(jsf_base_GetCommonFlash_Player(flashp.attr("fdata"), width, height, "STR", auto, mute, playerSize));
    }
}