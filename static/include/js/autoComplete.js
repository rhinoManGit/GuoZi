
var search_box;
var search_option;
var m_now = 0, s_now = 0, shl = 0, a_now = 0, a_on = 0, arr_on = 0, frm_on = 0;
var cn_use = "use_ac";
var wi_len = 2;
var wi_int = 500;
var max_row = 4;
var B = "block", I = "inline", N = "none", UD = "undefined";
var bak = "", old = "";
var qs_ac_list = "", qs_ac_id = "", qs_q = "", qs_m = 0, qs_ac_len = 0;

var acuse = 1; //자동완성사용여부
var cc = new Object();
var ac_layer_visibility = 0;
var goGoodsNo;
function get_nav() {
    var ver = navigator.appVersion;

    if (navigator.appName.indexOf("Microsoft") != -1 && ver.indexOf("MSIE 4") == -1 && ver.indexOf("MSIE 3") == -1) {
        return 1;
    } else if (navigator.appName.indexOf("Netscape") != -1) return 2;
    else return 0;
}


//기능끄기 버튼을 눌렀을때
function ac_off() {
    if ($j("#schInput").val() == "") {
        popup_ac(0);
        //document.all.noquery_ac_body.style.display = "none";
    } else {
        ac_hide();
        //		search_box.autocomplete = "off" ;
    }
    acuse = 0;
}

//기능켜기 버튼을 눌렀을때
function ac_on() {
    acuse = 1;
    popup_ac(1);

    if ($j("#schInput").val() != "")
        wd();

    setTimeout("wi()", wi_int);
    $j("#schInput").focus();

}


//type=0 : 모두 감춘준다.
//type=1 : 검색어가 있을때 자동완성창 보이기
//type=2 : 기능이 꺼져있을때 자동완성창 보이기
//type=3 : '검색어를 입력해달라'는 자동완성창 보이기
function popup_ac(type) {

    if (type == 0) {
        $j("#ac_body").css("display", "none");
        $j("#off_ac_body").css("display", "none");
        $j("#noquery_ac_body").css("display", "none");

        //검색창내 세모 이미지변경
        switch_image(0);
    } else if (type == 1) {
        $j("#ac_body").css("display", "block");
        $j("#off_ac_body").css("display", "none");
        $j("#noquery_ac_body").css("display", "none");

        switch_image(1);
    } else if (type == 2) {
        $j("#ac_body").css("display", "none");
        $j("#off_ac_body").css("display", "block");
        $j("#noquery_ac_body").css("display", "none");

        switch_image(1);
    } else if (type == 3) {
        $j("#ac_body").css("display", "none");
        $j("#off_ac_body").css("display", "none");
        $j("#noquery_ac_body")[0].style.display = "block";

        switch_image(1);
    }
}


//인풋박스의 세모 버튼을 눌렀을때 자동완성창을 보여준다.
function show_ac() {
    if (acuse == 0) {
        if ($j("#ac_body")[0].style.display == "block")
            popup_ac(0);
        else
            popup_ac(2);
    }
    else {
        if ($j("#schInput").val() == "") {
            if ($j("#noquery_ac_body")[0].style.display == "block")
                popup_ac(0);
            else
                popup_ac(3);
        }
        else {
            //wd();
            //alert(document.all.schInput.value);
            req_ipc();
        }
    }
}


function wd() {

    search_box.onclick = req_ipc;
    document.body.onclick = dis_p;

}

var dnc = 0;
function req_ipc() {
    dnc = 1;
    frm_on = 0;
    req_ac2(1);
}

function dis_p() {
    //alert(5);
    if (dnc) {
        dnc = 0;
        return;
    }

    if (arr_on) {
        return;
    }
    if (frm_on) {
        return;
    }
    alw = 0;
    ac_hide();

}

function req_ac2(me) {
    if (search_box.value == "" || acuse == 0) return;

    if (a_on && dnc) {
        ac_hide();
        return;
    }
    var o = get_cc(me);

    if (o && o[1][0] != "") { ac_show(o[0], o[1], o[2], me); }
    else reqAC(me);
}

function showAC(res) {
    eval(res);
    set_cc(qs_q, qs_ac_list, qs_ac_id, qs_m);
    ac_show(qs_q, qs_ac_list, qs_ac_id, qs_m);
}


function reqAC(me) {
    var sv;
    var ke = trim_space(search_box.value, me);
    var sTarget = "공연";

    ke = ke.replace(/ /g, "%20");
    if (ke == "") {
        ac_hide();
        return;
    }

    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Search/Ajax/get_ac_2.aspx",
        data: { p: me, q: ke, t: sTarget },
        dataType: "text",
        success: showAC
    });
}

function ac_show(aq, al, ai, am) {

    if (aq && aq != "" && aq != trim_space(search_box.value, am)) return;
    qs_q = aq;
    qs_m = am;
    qs_ac_list = al;
    qs_ac_id = ai;
    qs_ac_len = qs_ac_list.length;
    var h = (qs_ac_len > 7) ? 7 : qs_ac_len;
    h = h * 19;

    print_ac();

    if (qs_ac_list[0] == "" && (qs_m == 1 || qs_m == 2)) {
        qs_ac_len = 1;
        h = 19;
        if (qs_ac_list[0] == "") h = h + 19;
    }
    h = 140;
    scrol.style.height = h + 4;

    if (qs_ac_len) {
        h += 38;
        //a_on=1;
    } else {
        //a_on=0;
    }
    a_on = 1;
    ac_body.width = 330;
    ac_body.height = h;

    popup_ac(1);

    if (a_on) {
        set_acpos(0, 0);
        scrol.scrollTop = 0;

        search_box.onkeydown = ackhl;
    }
}

function set_acpos(v, bookImgsrc) {
    a_now = v;
    setTimeout('set_ahl();', 10);

    if (v > 0 && bookImgsrc) {
        $j("#bookImg").show();
        $j("#bookImg").attr("src", bookImgsrc);

        goGoodsNo = $j("#gNo" + a_now).val();
    }
}

function goGoods() {
    location.href = "/Pages/Perf/Detail/Detail.aspx?IdPerf=" + (goGoodsNo);
}

function set_ahl() {
    if (!a_on) return;

    var o1, o2;
    for (i = 0; i < qs_ac_len; i++) {
        o1 = document.getElementById('ac' + (i + 1));
        if ((i + 1) == a_now) {
            o1.style.backgroundColor = '#e3edf5';
        } else {
            o1.style.backgroundColor = '';
            //				document.all.bookImg.src = '';
        }
    }
}

function Keycode(e) {
    var result;
    if (window.event)
        result = window.event.keyCode;
    else if (e)
        result = e.which;
    return result;
}


//키를 누를때 이벤트 검사하는 함수
function ackhl(event) {
    var key = Keycode(event);
    var o1, o2;
    var img;

    if (key == 39) {
        req_ac2(1);
    }
    if (key == 13) {
        //if (a_now>0) search_keyword(qs_ac_list[a_now]);
    }
    if (key == 40 || (key == 9)) {

        if (!a_on) {
            req_ac2(1);
            return;
        }
        if (a_now < qs_ac_len) {
            if (a_now == 0) bak = search_box.value;

            a_now++;
            if (a_now > max_row) scrol.scrollTop = parseInt((a_now - 1) / max_row) * max_row * 19;
            o1 = document.getElementById('ac' + a_now);
            //o2 = document.getElementById('acq' + a_now) ;
            //img = document.getElementById("img" + a_now) ;
            //old = search_box.value = o2.outerText ;
            //set_acpos(a_now, img.outerText) ;

            old = search_box.value = $j('#acq' + a_now).text();
            set_acpos(a_now, $j('#img' + a_now).text());
            search_box.focus();
            set_ahl();
            //e.returnValue = false;
        }
    }
    if (a_on && (key == 38 || key == 9)) {
        if (!a_on) return;
        if (a_now <= 1) {
            ac_hide();
            old = search_box.value = bak;
        }
        else {
            a_now--;
            if ((qs_ac_len - a_now) + 1 > max_row) scrol.scrollTop = (qs_ac_len - (parseInt((qs_ac_len - a_now) / max_row) + 1) * 4) * 19;
            old = search_box.value = $j('#acq' + a_now).text();
            set_acpos(a_now, $j('#img' + a_now).text());
            search_box.focus();
            set_ahl();
            //e.returnValue = false ;
        }
    }

}

function print_ac() {

    if (qs_ac_list[0] == "") {
        scrol.innerHTML = get_ac0();
    }
    else {
        scrol.innerHTML = get_aclist();
    }
    //alert(scrol.innerHTML);
    popup_ac(1); //자동완성창 보여줌.
    //document.all.ac_body.style.display = B ;
    setTimeout('set_ahl();', 10);
}

function get_aclist() {
    var d = "", ds = "", l = 0, s = "", cnt = 0, pos = 0, qlen = 0, img = "";
    if (qs_ac_list[0] != "") {
        s += "<table width=100% cellpadding=0 cellspacing=0 border=0 style=margin-left:6px>";
        s += "<tr><td width=65% valign=top>";
        s += "<table width=100% cellpadding=0 cellspacing=0 border=0 style=margin-top:10px>";
        for (i = 0; i < qs_ac_len; i++) {
            var query = qs_ac_list[i].split("^");
            ds = d = query[0];
            goodsNo = query[2];
            age_lmt_yn = query[3];
            lmt_age = query[4];
            img = query[1];

            l = js_strlen(d);

            if (l > 20) ds = js_substring(d, 0, 26) + "..";

            pos = d.indexOf(search_box.value);

            if (pos >= 0) {
                if (pos == 0) {
                    ds = js_highlight(ds, search_box.value, 0);
                }
                else if (pos == d.length - 1) {
                    ds = js_highlight(ds, search_box.value, -1);
                } else {
                    ds = js_highlight(ds, search_box.value, pos);
                }
            }
            s += "<input type='hidden' Id='gNo" + (i + 1) + "' value='" + goodsNo + "'>";
            s += "<a href='javascript:jsf_mm_Search();'>";
            s += "<tr id='ac" + (i + 1) + "' onmouseover=\"set_acpos('" + (i + 1) + "', '" + img + "');\" onmouseout=\"set_acpos(0,0); \" onclick=\"set_acinput('" + (i + 1) + "')\" style=\"this.style.backgroundColor=''\" style='cursor:pointer;'>";
            s += "<td style=padding-left:5px; height=22 align=left title=\"" + d + "\">" + ds + "</td>";
            s += "<td height=22 align=right></td>";
            s += "</tr></a>";
            s += "<span id='acq" + (i + 1) + "' style='display:none'>" + d + "</span>";
            s += "<span id='img" + (i + 1) + "' style='display:none'>" + img + "</span>";
        }
        s += "</table>";
        s += "</td><td width=10px></td><td>";
        s += "<table width=100% cellpadding=0 cellspacing=0 border=0 style=\"margin-top:10px;\">";
        s += "<tr><td valign='top'  height=140 width=70><img border=0 id='bookImg' width='70px' height='87px' style='display:none;cursor:pointer;' onClick=\"goGoods();\">&nbsp;</td></tr></table>";
        s += "</td></tr></table>"
    }

    return s;
}

function js_makehigh_pre(s, t) {
    var d = "";
    var s1 = s.replace(/ /g, "");
    var t1 = t.replace(/ /g, "");
    t1 = t1.toLowerCase();
    if (t1 == s1.substring(0, t1.length)) {
        d = "<font color=#4b7bcd>";
        for (var i = 0, j = 0; j < t1.length; i++) {
            if (s.substring(i, i + 1) != " ") j++;
            d += s.substring(i, i + 1)
        }
        d += "</font>" + s.substring(i, s.length)
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
        d += "<font color=#4b7bcd>";
        for (var k = i, l = 0; l < t1.length; k++) {
            if (s.substring(k, k + 1) != " ") l++;
            d += s.substring(k, k + 1);
        }
        d += "</font>";
    }
    return d;
}

function js_makehigh_mid(s, t, pos) {
    var d = "";
    var s1 = s.replace(/ /g, "");
    var t1 = t.replace(/ /g, "");
    t1 = t1.toLowerCase();

    d = s.substring(0, pos);
    d += "<font color=#4b7bcd>";
    for (var i = pos, j = 0; j < t1.length; i++) {
        if (s.substring(i, i + 1) != " ") j++;
        d += s.substring(i, i + 1);
    }
    d += "</font>" + s.substring(i, s.length);
    return d;
}


function js_highlight(s, d, is_suf) {
    var ret = "";
    if (is_suf == 0) {
        ret = js_makehigh_pre(s, d);
    }
    else if (is_suf == -1) {
        ret = js_makehigh_suf(s, d);
    }
    else {
        ret = js_makehigh_mid(s, d, is_suf);
    }

    if (ret == "") return s;
    else return ret;
}

function set_acinput(v) {
    if (!a_on) return;

    old = search_box.value = $j('#acq' + a_now).text();

    search_box.focus();
    ac_hide();
}

function get_ac0() {
    var s = "", ment = "";
    if (qs_m == 1) ment = "추천 상품명이 없습니다.";
    else if (qs_m == 2) ment = "추천 상품명이 없습니다.";
    s += "<table width=100% cellpadding=0 cellspacing=0 border=0>";
    s += "<tr id=ac1 onmouseover=\"set_acpos(1,0); \" onmouseout=\"set_acpos(0,0); \" style=\"backgroundColor=''\">";
    s += "<td height=20 align=left style=padding:5px;font-size:11px;>" + ment + "<img border=0 id='bookImg' style='display:none'></td></tr>";
    s += "</table>";
    s += "<span id=acq1 style='display:none'>" + old + "</span>";
    return s;
}

function js_strlen(s) {
    var i, l = 0;
    for (i = 0; i < s.length; i++)
        if (s.charCodeAt(i) > 127) l += 2;
        else l++;
    return l;
}

function js_substring(s, start, len) {
    var i, l = 0; d = "";
    for (i = start; i < s.length && l < len; i++) {
        if (s.charCodeAt(i) > 127) l += 2;
        else l++;
        d += s.substr(i, 1);
    }
    return d;
}

function trim_space(ke, me) {

    if (me != 2) {
        ke = ke.replace(/^ +/g, "");
        ke = ke.replace(/ +$/g, " ");
    } else {
        ke = ke.replace(/^ +/g, " ");
        ke = ke.replace(/ +$/g, "");
    }
    ke = ke.replace(/ +/g, " ");

    return ke;
}

function get_cc(me) {
    var ke = trim_space(search_box.value, me) + me;
    return cc[ke];
    //		 alert(typeof(cc[ke]));
    //		 return typeof(cc[ke])==UD ? null : cc[ke] ;
}

function set_cc(aq, al, ai, me) {
    cc[aq + me] = new Array(aq, al, ai);
}

function ac_hide() {

    if (document.getElementById("ac_body").style.display == N) return;
    popup_ac(0); //hide all
    a_on = a_now = 0;
}

function wi() {
    if (acuse == 0) return;

    var now = search_box.value;
    if (now == "" && now != old) ac_hide();

    if (now.length >= wi_len && now != "" && now != old) {
        var o = null, me = 1;
        o = get_cc(me);

        if (o && o[1][0] != "") { ac_show(o[0], o[1], o[2], me); }
        else { reqAC(me); }
    }
    old = now;
    setTimeout("wi()", wi_int);
}

function set_mouseon(f) {
    if (f == 1) arr_on = 1;
    else if (f == 2) frm_on = 1;
}

function set_mouseoff(f) {
    if (f == 1) arr_on = 0;
    else if (f == 2) frm_on = 0;
}

//검색어입력창의 자동완성 화살표를 위, 아래로 변경한다.
//type 0 : 창이 닫혔을때 화살표 아래로.
//type 1 : 창이 펼처졌을때 위로
function switch_image(type) {
    if (type == 0) {
        $j("#imgIntro0").attr("src", "http://tkfile.yes24.com/img/common/ic_search_arrow.gif");
    } else if (type == 1) {
        $j("#imgIntro0").attr("src", "http://tkfile.yes24.com/img/common/ic_search_arrow2.gif");
    }
}

function debug(msg) {
    window.status = msg;
}

function s_init() {
    search_box = document.getElementById("schInput");

    bak = old = search_box.value;
    wd();
    setTimeout("wi()", wi_int);
}


$j(document).ready(function () {
    setTimeout("s_init()", 2000);
});

