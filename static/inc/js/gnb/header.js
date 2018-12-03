$j(document).ready(function () {
    var whatsupNumber = Math.ceil((13 - 1 + 1) * Math.random());
    $j("#whatsupRandom" + whatsupNumber).show();

    if (typeof isOzBrowser != "undefined" && isOzBrowser) {
        if (typeof rearraneSearchItemsByOzFunction == "function")
            rearraneSearchItemsByOzFunction(document.getElementById("qdomain"));

    }
    set_gcode();

    //if (YesData.IsHttps() != "True")
    //$j("input[id='query']").focus();

    //자동완성을 위한 기능    
    //init_ac();
});

function set_gcode() {
    /*	
    스카이스크리퍼에서 웰컴 메인을 제외한 페이지에서는 Gcode를 전부 삭제함
    2011.09.21 
    모든 페이지에 Gcode가 노출되도록 수정
    */

    /*
    if (YesData.IsWelcomePage() == "False") {
    try {    	
    //whatup 영역
    var whatsup = $j("#whatsupList a");
    for (var j = 0; j < $j(whatsup).length; j++) {
    $j(whatsup)[j].href = $j(whatsup)[j].href.toLowerCase().replace("gcode=", "g=");
    }

    var whats = $j("#whats a");
    for (var k = 0; k < $j(whats).length; k++) {
    $j(whats)[k].href = $j(whats)[k].href.toLowerCase().replace("gcode=", "g=");
    }
    //어깨배너
    var banner = $j("#banner a");
    for (var l = 0; l < $j(banner).length; l++) {
    $j(banner)[l].href = $j(banner)[l].href.toLowerCase().replace("gcode=", "g=");
    }

    var popular = $j("#popular a");
    for (var m = 0; m < $j(popular).length; m++) {
    $j(popular)[m].href = $j(popular)[m].href.toLowerCase().replace("gcode=", "g=");
    }
            
    } catch (e) { }
    }*/
}

function toggle_search_submenu() {
    $j("#search_submenu").toggle();
}
function close_search_submenu() {
    $j("#search_submenu").hide();
}


function set_default_search_category(categoryNumber) {
    var resultText;
    var resultValue;
    switch (categoryNumber) {
        case "001":
            resultText = "국내도서";
            break;
        case "002":
            resultText = "외국도서";
            break;
        case "003":
            resultText = "음반";
            break;
        case "004":
            resultText = "DVD";
            break;
        case "006":
            resultText = "문구/GIFT";
            break;
        case "009":
            resultText = "e러닝";
            break;
        case "017":
            resultText = "eBook";
            break;
        case "018":
            resultText = "중고샵";
            break;
        case "981":
            resultText = "패션";
            break;
        default:
            resultText = "통합검색";
            break;
    }

    if (categoryNumber == "004") {
        resultValue = "DVD/비디오";
    }
    if (categoryNumber == "018") {
        resultValue = "UsedGoods";
    }
    else {
        resultValue = resultText;
    }
    set_search_category(resultText, resultValue);
}


function set_search_category(text, value) {
    $j("#search_category").val(text);

    if (value == 'DVD')
        value = 'DVD/비디오';

    if (value == '웹소설/코믹')
        value = '웹소설/코믹';

    $j("#qdomain").val(value);
    $j("#domain").val(value);

    $j('#yesSForm .schScope dl').hide(); //검색 창옵션
}

/* 메인 검색 버튼 */
function check_search() {

    var isIE = false;
    var isEucKr = true;

    if (navigator.userAgent.toLowerCase().indexOf('msie') > -1)
        isIE = true;

    if (isIE == true && document.charset.toLowerCase() == 'utf-8')
        isEucKr = false;
    else if (isIE == false && document.characterSet.toLowerCase() == 'utf-8')
        isEucKr = false;

    //alert('isIE : ' + isIE + ', isEucKr : ' + isEucKr);
    //return false;

    if ($j.trim($j("#qdomain").val()) == 'iSTYLE24') {
        if (isEucKr == true) {	// euc-kr이면, utf-8로 변경
            document.charset = 'utf-8';
        }

        var iStyle24SearchUrl = 'http://istyle24mall.yes24.com/Search/Index?Keywords=' + encodeURIComponent($j.trim($j("#query").val()));

        if (isEucKr == true) {	// euc-kr이면, euc-kr로 복원
            document.charset = 'euc-kr';
        }

        window.open(iStyle24SearchUrl);
        return false;
    }
    else if ($j.trim($j("#qdomain").val()) == '화장품') {
        if (isEucKr == true) {	// euc-kr이면, utf-8로 변경
            document.charset = 'utf-8';
        }

        var iStyle24SearchUrl = 'http://istyle24mall.yes24.com/Search/?Keywords=' + encodeURIComponent($j.trim($j("#query").val())) + '&CategoryNo=10001000&FCategoryNo=10001000';

        if (isEucKr == true) {	// euc-kr이면, euc-kr로 복원
            document.charset = 'euc-kr';
        }

        window.open(iStyle24SearchUrl);
        return false;
    }

    // submit 전에 euc-kr로 인코딩 변경
    if (isEucKr == false) {
        if ($j("#domain").val() == "패션") $j("#domain").val("FASHION");

        var url = 'http://www.yes24.com/SearchCorner/Search?domain=' + $j.trim($j("#domain").val()) + '&query=' + escape($j.trim($j("#query").val()));

        //alert(url);

        document.location.href = url;

        return false;

    }

    var Wcode = "";
    var objForm = $j("form[id='yesSForm']");
    //debugger;

    // 추천어가 있을시 추천어 링크로 이동
    if ($j.trim($j("#keywordAd").val()) != "") {
        if (YesData.IsWelcomePage() == "True") {
            if ($j("#keywordAd").val().indexOf("?") != -1)
                window.location = $j("#keywordAd").val() + "&Wcode=001_006"
            else
                window.location = $j("#keywordAd").val() + "?Wcode=001_006"
        }
        else
            window.location = $j("#keywordAd").val();
        return false;
    }


    // 검색어를 입력안할시 경고 메시지
    if ($j.trim($j("#query").val()) == "") {
        alert("검색어를 입력하세요.");
        $j("#query").focus();
        return false;
    }

    $j("#domain").val(fnGetDomain($j("#qdomain").val()));
    Wcode = "001_005";
    $j("#Scode").val(fnGetScode($j.trim($j("#qdomain").val())));

    //Wcode를 넣는다.
    $j("#Wcode").val(Wcode);
    //if (Wcode != undefined)
    //$j("[name='Wcode']").val(Wcode);
}
/* Scode 반환 */
function fnGetScode(domain) {
    var ret = "";
    switch (domain) {
        case "국내도서":
            ret = "006_002";
            break;
        case "외국도서":
            ret = "006_003";
            break;
        case "e-러닝":
            ret = "006_004";
            break;
        case "eBook":
            ret = "006_005";
            break;
        case "웹소설/코믹":
            ret = "006_018";
            break;
        case "UsedGoods":
            ret = "006_015";
            break;
        case "음반":
            ret = "006_006";
            break;
        case "DVD/비디오":
            ret = "006_007";
            break;
        case "영화":
            ret = "006_008";
            break;
        case "공연":
            ret = "006_009";
            break;
        case "문구/GIFT":
            ret = "006_0010";
            break;
        case "패션":
            ret = "006_017";
            break;
        default:
            // 전체
            ret = "006_001";
            break;
    }
    return ret;
}
function fnGetDomain(domain) {
    var ret = "";
    switch (domain) {
        case "국내도서":
            ret = "BOOK";
            break;
        case "외국도서":
            ret = "FOREIGN";
            break;
        case "e-러닝":
            ret = "E_LEARNING";
            break;
        case "eBook":
            ret = "EBOOK";
            break;
        case "웹소설/코믹":
            ret = "ESTORY";
            break;
        case "UsedGoods":
            ret = "USED_GOODS";
            break;
        case "BUYBACK":
            ret = "BUYBACK";
            break;
        case "음반":
            ret = "MUSIC";
            break;
        case "DVD/비디오":
            ret = "DVD";
            break;
        case "영화":
            ret = "MOVIE";
            break;
        case "공연":
            ret = "TICKET";
            break;
        case "문구/GIFT":
            ret = "문구/GIFT";
            break;
        case "패션":
            ret = "FASHION";
            break;
        case "VOD":
            ret = "VOD";
            break;
        default:
            // 전체
            ret = "ALL";
            break;
    }
    return ret;
}

//자동완성 기능
var wi_int = 500;
var _startAcIndex = 3; // 자동완성 시작단어수
var is_ac_open = false; //자동완성이 열렸는지 여부
var is_ac_on = true;    //자동완성 사용여부
var is_process_ac = false; //자동완성이 실행되는중인지 여부
var is_user_open = false; //사용자가 셋팅할려고 창을 연 경우
var old_keyword = "";
var ac_cursor_index = -1; //현재 가리키고 있는 인덱스
var ac_item_count = 0;    //검색 아이템 카운트
var query_init = false;   //검색박스를 초기화했는지 여부
var timeout;


//자동완성 기능을 초기한다.
function init_ac() {

    timeout = setTimeout("do_ac()", wi_int);

    var ac_use = getCookie("AC_USE");   //자동완성 on,off
    if (!is_ac_on) ac_use = "N"; 		//설정상 종료했으면
    if (ac_use == "N") {
        is_ac_on = false;
        onoff_ac_image(); //끄기, 껴기 이미지 변경
    }
    else
        is_ac_on = true;


    $j("#query").bind(($j.browser.opera ? "keypress" : "keydown"), function (e) {

        switch (e.keyCode) {
            case 40:    //DOWN
                acList_next();
                break;
            case 38:    //UP
                acList_prev();
                break;
            case 27:    //ESC
                close_ac();
                break;
            default:
                start_ac();
                break;
        }

    });

}

//
function check_ac_onoff() {
    var ac_use = getCookie("AC_USE");   //자동완성 on,off
    if (ac_use == "N") {
        is_ac_on = false;
        onoff_ac_image(); //끄기, 껴기 이미지 변경
    }
    else
        is_ac_on = true;
}

//검색박스를 초기화한다.
function init_searchbox() {
    // 통합검색일 경우 초기화 필요없음
    if (location.href.toLowerCase().indexOf('/searchcorner/search') > -1)
        query_init = true;

    $j("input#keywordAd").val('');

    if (query_init)
        return;

    var obj = $j("form[id='yesSForm'] input[id='query']");
    $j(obj).css("background-image", "")
    $j(obj).val("");
    $j(obj).attr("class", "iptTxt");

    query_init = true;
}

//common_gnb검색박스를 초기화한다.
function Common_init_searchbox() {
    setWcode("001_005");
    init_searchbox();


}


//전 아이템으로 이동한다.
function acList_prev() {

    if (ac_cursor_index >= -1) {
        stop_ac(); //커서를 옮기는 동안은 검색을 멈춘다.
        $j("#ac_list_" + ac_cursor_index--).removeClass("hilight");
        var obj = $j("#ac_list_" + ac_cursor_index);
        $j(obj).addClass("hilight"); //커서이동
        set_ac_image_link(obj);     //이미지 셋팅
        $j("#query").val($j("#ac_query_" + ac_cursor_index).text());
    }

}

//다음 아이템으로 이동한다.
function acList_next() {

    if (ac_cursor_index < ac_item_count - 1) {
        stop_ac(); //커서를 옮기는 동안은 검색을 멈춘다.
        $j("#ac_list_" + ac_cursor_index++).removeClass("hilight");
        var obj = $j("#ac_list_" + ac_cursor_index);
        $j(obj).addClass("hilight");
        set_ac_image_link(obj);
        $j("#query").val($j("#ac_query_" + ac_cursor_index).text());  //검색창에 텍스트 셋팅
    }

}

function set_cursor(index) {
    ac_cursor_index = index;
    //마우스를 올렸을때 표시되는 부분이 있으면 삭제한다.
    for (k = 0; k < ac_item_count; k++)
        $j("#ac_list_" + k).removeClass("hilight");
}


//버튼을 클릭해서 자동완성을 열고 닫는다.
function toggle_ac() {

    if (is_ac_open) {
        is_user_open = false;
        close_ac();
        stop_ac();
    }
    else {
        is_user_open = true;
        old_keyword = "";   //old 키워드를 리셋해서 다시 검색되게 한다.
        open_ac();
        start_ac();
    }
}

//자동 완성 창을 연다.
function open_ac() {

    //자동 완성 여부가 꺼져 있으면
    if (!is_ac_on) {
        $j("#ac_list").html("<li>검색어 자동완성 기능이 꺼져 있습니다.</li>");
    }
    else {
        if ($j("#ac_list").html() == "")
            $j("#ac_list").html("<li>검색어를 입력해 주세요.</li>");
    }
    $j("#autoComplete").show();
    is_ac_open = true;


}

//자동 완성 창을 닫는다.
function close_ac() {

    if (!is_user_open) {
        $j("#autoComplete").hide();
        is_ac_open = false;
        $j("#ac_list").html("");
        $j("#ac_image_link").html("");
    }

}

//자동 완성 작동
function start_ac() {
    is_process_ac = true;
}

//자동 완성 멈춤
function stop_ac() {
    is_process_ac = false;
}
//자동 완성 기능 사용
function on_ac() {
    is_ac_on = true;
    onoff_ac_image();
    setCookie("AC_USE", "Y", -1000);
    open_ac();
    start_ac();
    $j("#query").focus();

}
//자동 완성 기능 멈춤
function off_ac() {
    is_ac_on = false;
    //var query = $j("input[id='query']");
    onoff_ac_image();
    //자동완성기능 하루동안사용안함
    setCookie("AC_USE", "N", 1000 * 60 * 60 * 24);
    close_ac();
    stop_ac();

}

function onoff_ac_image() {

    $j("#ac_img_off").toggle();
    $j("#ac_img_on").toggle();
}

//자동완성 아이템을 검색한다.
function search_ac_item(i) {
    check_search("000_004_003");
    $j("#query").val($j("#ac_query_" + i).text());
    $j("form[id='yesSForm']").submit();
}


//자동 완성을 실행
function do_ac() {

    //자동완성 기능이 on/off 여부
    if (is_ac_on && is_process_ac) {
        var keyword = document.getElementById("query").value;
        var qdomain = document.getElementById('qdomain').value;
        if (keyword.length >= _startAcIndex) {  //최소길이 이상
            if (old_keyword != keyword) {
                if (qdomain != "도서본문" && qdomain != "블로그" && qdomain != "채널예스")
                    get_search_result(keyword, qdomain);
            }
        }
        else {
            close_ac();
        }
    }
    clearTimeout(timeout);
    timeout = setTimeout("do_ac()", wi_int);
}


function get_search_result(keyword, target) {
    old_keyword = keyword;
    //$j.ajaxSetup({ contentType: "application/x-www-form-urlencoded;charset=utf-8" });
    var requestUrl = "/searchCenter/get_ac_2.aspx";
    var data = "p=1&q=" + escape(keyword) + "&t=" + escape(target);
    $j.get(requestUrl, data, function (data) {

        eval(data);
        set_ac_list(qs_q, qs_ac_list, qs_ac_id, qs_m);
        open_ac();
        is_user_open = false; //유저가 창 연 기능을 종료

    });

}

function go_to_goods(goodsNo) {
    var value = $j("#qdomain").val();
    if (value == "영화")
        location.href = "http://movie.yes24.com/Movie/Movie_View_Default.aspx?m_id=" + goodsNo;
    else if (value == "공연")
        location.href = "http://ticket.yes24.com/Home/Perf/PerfDetailInfo.aspx?IdPerf=" + (parseInt(goodsNo, 10) + 100000);
    else
        location.href = YesData.HTTP_URL() + "/24/Goods/" + goodsNo;
}

//이미지 셋팅
function set_ac_image_link(obj) {
    var html = "";
    var dataobj = $j(obj).find("span");
    var goodsno = $j(dataobj).attr("goodsno");
    var imagepath = $j(dataobj).attr("imagepath");
    var agelmtyn = $j(dataobj).attr("agelmtyn");
    var lmtage = $j(dataobj).attr("lmtage");
    if (imagepath != "" && imagepath != undefined) {
        if (agelmtyn == 'Y' && lmtage > YesData.MEM_AGE() && lmtage >= 19) //19세 제한
            imagepath = "http://image.yes24.com/sysimage/pd19.gif";
        if (YesData.IsHttps() == "True")
            imagepath = path.replace(YesData.IMG_HOST_SYS(), YesData.HTTPS_IMG_HOST_SYS());
        html = "<a href=\"javascript:go_to_goods(" + goodsno + ");\"><img src=\"" + imagepath + "\" alt=\"\"/></a>";
    }
    $j("#ac_image_link").html(html);

}



//자동완성 창 셋팅
function set_ac_list(aq, ac_list, ai, am) {

    var keyword = jQuery.trim($j("#query").val());
    if (aq && aq != "" && aq != keyword) return;

    ac_cursor_index = -1; //초기화
    ac_item_count = 0;  //검색 아이템 수 초기화

    var html = "";
    if (ac_list.length > 0 && ac_list != "") {

        for (i = 0; i < ac_list.length && i < 7; i++) {
            var data = ac_list[i].split("^");
            var goodsNm = data[0];
            var iamage_path = data[1];
            var goodsNo = data[2];
            var age_lmt_yn = data[3];
            var lmt_age = data[4];
            var name = "";
            //문자를 자른다.
            if (goodsNm.length > 16)
                name = goodsNm.substring(0, 16) + "...";
            else
                name = goodsNm;
            //검색어와 결과가 매칭되는 부분을 강조           
            var pos = goodsNm.indexOf(keyword);
            if (pos >= 0) {
                if (pos == 0)
                    name = js_highlight(name, keyword, 0);
                else if (pos == goodsNm.length - 1)
                    name = js_highlight(name, keyword, -1);
                else
                    name = js_highlight(name, keyword, pos);
            }

            html += "<li id='ac_list_" + i + "' onmouseover='set_ac_image_link(this);set_cursor(" + i + ");set_useropen(true);' onmouseout='set_useropen(false)'><a href='javascript:search_ac_item(" + i + ");' style='cursor:pointer'>" + name + "</a>";
            html += "<span id='ac_query_" + i + "' style='display:none' goodsno='" + goodsNo + "' imagepath='" + iamage_path + "' agelmtyn='" + age_lmt_yn + "' lmtage=" + lmt_age + ">" + goodsNm + "</span></li>";
            ac_item_count++;
        }

    }
    else {
        html = "<li>추천 상품명이 없습니다.</li>";
    }
    $j("#ac_list").html(html);
}

function set_useropen(value) {
    is_user_open = value;
}
//검색어 강조
function js_highlight(s, d, is_suf) {
    var ret = "";
    if (is_suf == 0) {
        ret = js_makehigh_pre(s.toLowerCase(), d.toLowerCase());
    }
    else if (is_suf == -1) {
        ret = js_makehigh_suf(s.toLowerCase(), d.toLowerCase());
    }
    else {
        ret = js_makehigh_mid(s.toLowerCase(), d.toLowerCase(), is_suf);
    }

    if (ret == "") return s;
    else return ret;
}

function js_makehigh_pre(s, t) {
    var d = "";
    var s1 = s.replace(/ /g, "");
    var t1 = t.replace(/ /g, "");
    t1 = t1.toLowerCase();
    if (t1 == s1.substring(0, t1.length)) {
        d = "<strong>";
        for (var i = 0, j = 0; j < t1.length; i++) {
            if (s.substring(i, i + 1) != " ") j++;
            d += s.substring(i, i + 1)
        }
        d += "</strong>" + s.substring(i, s.length)
    }
    return d;
}

function js_makehigh_suf(s, t) {
    var d = "";
    var s1 = s.replace(/ /g, "");
    var t1 = t.replace(/ /g, "");
    t1 = t1.toLowerCase();
    if (t1 == s1.substring(s1.length - t1.length)) {
        for (var i = 0, j = 0; j < s1.length - t1.length; i++) {
            if (s.substring(i, i + 1) != " ") j++;
            d += s.substring(i, i + 1);
        }
        d += "<strong>";
        for (var k = i, l = 0; l < t1.length; k++) {
            if (s.substring(k, k + 1) != " ") l++;
            d += s.substring(k, k + 1);
        }
        d += "</strong>";
    }
    return d;
}

function js_makehigh_mid(s, t, pos) {
    var d = "";
    var s1 = s.replace(/ /g, "");
    var t1 = t.replace(/ /g, "");
    t1 = t1.toLowerCase();

    d = s.substring(0, pos);
    d += "<strong>";
    for (var i = pos, j = 0; j < t1.length; i++) {
        if (s.substring(i, i + 1) != " ") j++;
        d += s.substring(i, i + 1);
    }
    d += "</strong>" + s.substring(i, s.length);
    return d;
}


function open_layer(obj, topPosition) {
    obj.style.visibility = "visible";
    obj.style.top = topPosition;
}

function close_layer(obj) {
    obj.style.visibility = "hidden";
}

function openAddSearchWin() {
    centerNewWinNoScroll(YesData.HTTP_URL() + "/main/popup_AddSearchWin.aspx?Wcode=001_001_010", "searchTerm", 363, 414);
}

function fnGetValueDomain(domain) {
    var ret = "";
    switch (domain) {
        case "BOOK":
            ret = "국내도서";
            break;
        case "FOREIGN":
            ret = "외국도서";
            break;
        case "E_LEARNING":
            ret = "e러닝";
            break;
        case "EBOOK":
            ret = "eBook";
            break;
        case "USED_GOODS":
            ret = "중고샵";
            break;
        case "BUYBACK":
            ret = "바이백";
            break;
        case "MUSIC":
            ret = "음반";
            break;
        case "DVD":
            ret = "DVD";
            break;
        case "MOVIE":
            ret = "영화";
            break;
        case "TICKET":
            ret = "공연";
            break;
        case "문구/GIFT":
            ret = "문구/GIFT";
            break;
        case "FASHION":
            ret = "패션";
            break;
        case "VOD":
            ret = "다운로드";
            break;
        case "ESTORY":
            ret = "웹소설/코믹";
            break;
        case "BLOG_REVIEW":
            ret = "리뷰";
            break;
        case "CHYES":
            ret = "기사/인터뷰";
            break;
        default:
            // 전체
            ret = "통합검색";
            break;
    }

    $j("#search_category").val(ret);
    return ret;
}