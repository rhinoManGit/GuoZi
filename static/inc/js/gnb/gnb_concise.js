document.write('<link href="http://image.yes24.com/Welcome/Resource/css/gnb_concise.css?v=' + new Date().getMinutes() + '" rel="stylesheet" type="text/css" />');
document.write('<!--[if IE]>');
document.write('<link rel="stylesheet" type="text/css" href="http://image.yes24.com/Welcome/resource/css/renew/renewHack_concise.css?v=' + new Date().getMinutes() + '" />');
document.write('<![endif]-->');
document.write('<script type="text/javascript" src="http://image.yes24.com/Welcome/_par_/welcome/CommonGNB/W_R2_BaroOn.js?v=' + new Date().getMinutes() + '"></script>');
document.write('<script type="text/javascript" src="http://image.yes24.com/Welcome/_par_/welcome/CommonGNB/W_R2_RightShoulderBanner.js?v=' + new Date().getMinutes() + '"></script>');
document.write('<script type="text/javascript" src="/inc/js/gnb/header.js?v=' + new Date().getMinutes() + '"></script>');
document.write('<script type="text/javascript" src="http://image.yes24.com/Welcome/JavaScript/jqueryExtends.js?v=' + new Date().getMinutes() + '"></script>');
document.write('<script type="text/javascript" src="http://image.yes24.com/Welcome/JavaScript/wlo.js"></script>');
document.write('<div id="yesConciseGnbWrap">');
document.write('<div class="conciseTop">');

document.write('<div class="conciseLft">');
document.write('<dl class="conciseMnu">');
document.write('<dt>간략GNB메뉴</dt>');
document.write('<dd class="ccLogo"><a class="logo" href="http://www.yes24.com/" onclick="setWcode(\'034_001\')"><img src="http://image.yes24.com/sysimage/renew/gnb/logo_concise.png" width="89" height="35" border="0" alt="대한민국 대표 인터넷서점 - YES24.COM" title="대한민국 대표 인터넷서점 - YES24.COM"></a></dd>');
document.write('<dd class="ccSchGrp">');
document.write('<a class="mnuLnk" href="javascript:void(0);" onclick="setWcode(\'034_002\')">통합검색</a>');
document.write('<div class="ccSchGrpArea" style="display:none;">');
document.write('<div class="schTxt">통합검색</div>');
document.write('<div class="ccSchCon">');
document.write('<form id="yesSForm" name="yesSForm" method="get" action="http://www.yes24.com/SearchCorner/Search?Gcode=000_004_001" onsubmit="return check_search();">');
document.write('<input type="hidden" id = "keywordAd" name="keywordAd" value=""/>');
document.write('<input type="hidden" id = "keyword" name="keyword"/>');
document.write('<input type="hidden" id="domain" name = "domain" value="ALL" />');
document.write('<input type="hidden" id="qdomain" name = "qdomain" value="전체" />');
document.write('<input type="hidden" id="Wcode" name="Wcode" value="034_003"/>');
document.write('<fieldset>');
document.write('<legend>검색</legend>');
document.write('<div class="schScope" title="검색분야">');
document.write('<input type="button" value="통합검색" class="schScopeNow" id="yBtnSearchCategoryText">');
document.write('<dl class="schScopeOpt" style="display:none">');
document.write('<dt><strong>통합검색</strong></dt>');
document.write('<dd class="schScopeCate">');
document.write('<ul class="clearfix">');
document.write('<li onClick="yesSetSearchFocus(\'통합검색\', \'ALL\', \'전체\');" class="on" title="통합검색">통합검색	</li>');
document.write('<li onClick="yesSetSearchFocus(\'국내도서\', \'BOOK\', \'국내도서\');"		 title="국내도서">국내도서	</li>');
document.write('<li onClick="yesSetSearchFocus(\'외국도서\', \'FOREIGN\', \'외국도서\');"	 title="외국도서">외국도서	</li>');
document.write('<li onClick="yesSetSearchFocus(\'eBook\', \'EBOOK\', \'eBook\');"			 title="eBook	">eBook		</li>');
document.write('<li onClick="yesSetSearchFocus(\'e러닝\', \'e러닝\', \'e러닝\');"			 title="e러닝	">e러닝		</li>');
document.write('<li onClick="yesSetSearchFocus(\'웹소설/코믹\', \'ESTORY\', \'웹소설/코믹\');" 	 title="웹소설/코믹">웹소설/코믹</li>');
document.write('<li onClick="yesSetSearchFocus(\'CD/LP\', \'MUSIC\', \'음반\');"				 title="CD/LP	">CD/LP		</li>');
document.write('<li onClick="yesSetSearchFocus(\'DVD/Blu-ray\', \'DVD\', \'DVD/비디오\');"			 title="DVD/Blu-ray		">DVD/Blu-ray		</li>');
document.write('<li onClick="yesSetSearchFocus(\'영화\', \'MOVIE\', \'영화\');"				 title="영화	">영화		</li>');
document.write('<li onClick="yesSetSearchFocus(\'다운로드\', \'VOD\', \'VOD\');"			 title="다운로드">다운로드	</li>');
document.write('<li onClick="yesSetSearchFocus(\'공연\', \'TICKET\', \'공연\');"			 title="공연	">공연		</li>');
document.write('<li onClick="yesSetSearchFocus(\'문구/GIFT\', \'GIFT\', \'GIFT\');"				 title="문구/GIFT	">문구/GIFT		</li>');
document.write('<li onClick="yesSetSearchFocus(\'중고샵\', \'USED_GOODS\', \'UsedGoods\');"	 title="중고샵	">중고샵	</li>');
document.write('<li onClick="yesSetSearchFocus(\'패션\', \'패션\',\'패션\');" title="패션">패션</li>');
document.write('</ul>');
document.write('</dd>');
document.write('<dd class="schScopeServ">');
document.write('<ul class="clearfix">');
document.write('<li onClick="yesSetSearchFocus(\'리뷰\', \'BLOG_REVIEW\', \'블로그\');"		title="YES블로그">리뷰		</li>');
document.write('<li onClick="yesSetSearchFocus(\'기사/인터뷰\', \'CHYES\', \'채널예스\');"	title="채널예스">기사/인터뷰</li>');
document.write('</ul>');
document.write('</dd>');
document.write('<dd class="schScopeOptBot"></dd>');
document.write('</dl>');
document.write('</div>');
document.write('<div class="schIpt"><input type="text" title="YES24 검색어 입력" class="iptTxt" accesskey="s" style="ime-mode:active;" autocomplete="off" id="query" name="query"  onmousedown="Concise_check_search();" ></div>');
document.write('<div class="schBtn"><button type="submit" title="검색" class="" id="yBtnSearch"><span class="yBlind">검색</span></button></div>');
document.write('</fieldset>');
document.write('</form>');
document.write('</div>');
document.write('</div>');
document.write('</dd>');
document.write('<dd class="ccCateGrp">');
document.write('<a class="mnuLnk" href="javascript:void(0);"  onclick="setWcode(\'034_004\')">예스24분야</a>');
document.write('<div class="ccCateLi" style="display:none;">');
document.write('<ul class="clearfix">');
document.write('<li class="tit" ><em>예스24분야</em></li>');
document.write('<li><a href="http://www.yes24.com/Mall/Main/Book/001?CategoryNumber=001" onclick="setWcode(\'034_004_001\')">국내도서   </a></li>');
document.write('<li><a href="http://www.yes24.com/Mall/Main/Foreign/002?CategoryNumber=002" onclick="setWcode(\'034_004_002\')">외국도서    </a></li>');
document.write('<li><a href="http://www.yes24.com/Mall/Main/eBook/017?CategoryNumber=017" onclick="setWcode(\'034_004_003\')">eBook </a></li>');
document.write('<li><a class="newWin" href="http://shiftbooks.yes24.com/" onclick="setWcode(\'034_004_004\')" target="_blank" onclick="yesHideCategory();">웹소설/코믹   </a></li>');
document.write('<li><a href="http://www.yes24.com/Mall/Main/Music/003?CategoryNumber=003" onclick="setWcode(\'034_004_005\')">CD/LP </a></li>');
document.write('<li><a href="http://www.yes24.com/Mall/Main/DVD/004?CategoryNumber=004" onclick="setWcode(\'034_004_006\')">DVD/Blu-ray </a></li>');
document.write('<li><a href="http://www.yes24.com/Mall/Main/Gift/006?CategoryNumber=006" onclick="setWcode(\'034_004_007\')">문구/GIFT   </a></li>');
document.write('<li><a href="http://www.yes24.com/Mall/main/Used/018?CategoryNumber=018" onclick="setWcode(\'034_004_009\')">중고샵    </a></li>');
document.write('<li><a class="newWin" href="http://fashion.yes24.com" target="_blank" onclick="setWcode(\'034_004_010\')">패션  </a></li>');
document.write('</ul>');
document.write('<div class="ccCateLiBot"></div>');
document.write('</div>');
document.write('</dd>');
document.write('<dd class="ccEntGrp">');
document.write('<a class="mnuLnk" href="javascript:void(0);"  onclick="setWcode(\'034_005\')">영화/공연</a>');
document.write('<div class="ccEntLi" style="display:none;">');
document.write('<ul class="clearfix">');
document.write('<li class="tit"><em>영화/공연</em></li>');
document.write('<li><a class="newWin" href="http://movie.yes24.com/" onclick="setWcode(\'034_005_001\')" target="_blank" onclick="yesHideEtc();">영화    </a></li>');
document.write('<li><a class="newWin" href="http://ticket.yes24.com/" onclick="setWcode(\'034_005_002\')" target="_blank" onclick="yesHideEtc();">공연    </a></li>');
document.write('<li><a class="newWin" href="http://vod.yes24.com/" onclick="setWcode(\'034_005_003\')" target="_blank" onclick="yesHideEtc();">다운로드</a></li>');
document.write('<li><a class="newWin" href="http://starcandy.yes24.com/" onclick="setWcode(\'034_005_004\')" target="_blank" onclick="yesHideEtc();">별사탕  </a></li>');
document.write('<li><a class="newWin" href="http://goldenbell.yes24.com/" onclick="setWcode(\'034_005_005\')" target="_blank" onclick="yesHideEtc();">골든벨  </a></li>');
document.write('</ul>');
document.write('<div class="ccEntLiBot"></div>');
document.write('</div>');
document.write('</dd>');
document.write('<dd class="ccChYes"><a class="mnuLnk" href="http://ch.yes24.com/" onclick="setWcode(\'034_007\')" target="_blank">채널예스</span></a></dd>');
document.write('<dd class="ccYesBlog"><a class="mnuLnk" href="http://blog.yes24.com/blogmain" onclick="setWcode(\'034_008\')" target="_blank">YES블로그</a></dd>');
document.write('<dd class="ccBestS"><a class="mnuLnk" href="http://www.yes24.com/24/category/bestseller" onclick="setWcode(\'034_009\')">베스트셀러</a></dd>');
document.write('<dd class="ccNewG"><a class="mnuLnk" href="http://www.yes24.com/category/newproduct.aspx" onclick="setWcode(\'034_010\')">신상품</a></dd>');
document.write('<dd class="ccYesCal"><a class="mnuLnk" href="http://www.yes24.com/Mall/Yescalendar" onclick="setWcode(\'034_015\')">YES캘린더</a></dd>');
document.write('</dl>');
document.write('</div>');

document.write('<div class="conciseRgt">');
document.write('<dl class="utilDl">');
document.write('<dt>유틸메뉴</dt>');
if (yesGetCookieValue("ServiceCookies") == null || yesGetCookieValue("ServiceCookies") == "") {
    document.write('<dd><a class="utilLnk" href="https://www.yes24.com/Templates/FTLogin.aspx" onclick="setWcode(\'034_011_002\')">로그인</a></dd>');
    document.write('<dd><a class="utilLnk" href="https://www.yes24.com/Member/FTMemAcc.aspx" onclick="setWcode(\'034_011_004\')">회원가입</a></dd>');
} else {
    document.write('<dd><a class="utilLnk" href="javascript:LogOutUrl();" onclick="setWcode(\'034_011_003\')">로그아웃</a></dd>');
}
document.write('<dd class="myPgGrp">');
document.write('<a class="utilLnk" href="http://www.yes24.com/Member/FTMypageMain.aspx" onclick="setWcode(\'034_011_005\')">마이페이지 <img class="bl_arrDwn" src="http://image.yes24.com/sysimage/renew/blank.gif" alt="마이페이지 더보기" width="8" height="14"></a>');
document.write('<div class="myPgLi" style="display:none;">');
document.write('<ul class="clearfix">');
document.write('<li class="tit"><a href="http://www.yes24.com/Member/FTMypageMain.aspx" onclick="setWcode(\'034_011_005\')">마이페이지 <img class="bl_arrUp" src="http://image.yes24.com/sysimage/renew/blank.gif" alt="마이페이지 더보기" width="8" height="14"></a></li>');
document.write('<li><a href="https://ssl.yes24.com/MyPageOrderList/MyPageOrderList" onclick="setWcode(\'034_011_006\')">주문내역	 </a></li>');
document.write('<li><a href="http://www.yes24.com/Member/FTGoMyBlog.aspx?type=list" onclick="setWcode(\'034_011_007\')" target="_blank">마이리스트   </a></li>');
document.write('<li><a href="http://www.yes24.com/Templates/FTMyAccount_1YESPoint.aspx" onclick="setWcode(\'034_011_008\')">YES포인트    </a></li>');
document.write('<li><a href="http://www.yes24.com/Templates/FTMyAccount_1YESMoney.aspx" onclick="setWcode(\'034_011_009\')">YES머니      </a></li>');
document.write('<li><a href="http://www.yes24.com/Templates/FTMyAccount_3GiftCard.aspx" onclick="setWcode(\'034_011_012\')">YES상품권      </a></li>');
document.write('<li><a href="http://www.yes24.com/Templates/FTMyAccount_4Coupon.aspx" onclick="setWcode(\'034_011_010\')">쿠폰         </a></li>');
document.write('<li><a href="https://www.yes24.com/Member/MyPage_reconfirmPW.aspx" onclick="setWcode(\'034_011_011\')">회원정보     </a></li>');
document.write('</ul>');
document.write('<div class="myPgLiBot"></div>');
document.write('</div>');
document.write('</dd>');
document.write('<dd><a class="utilLnk" href="http://ssl.yes24.com/Cart/Cart" onclick="setWcode(\'034_012\')">카트</span></a></dd>');
document.write('<dd><a class="utilLnk" href="https://ssl.yes24.com/MyPageOrderList/MyPageOrderList" onclick="setWcode(\'034_013\')">주문/배송</a></dd>');
document.write('<dd class="lastDd"><a class="utilLnk" href="http://www.yes24.com//Templates/FTCusMain.aspx" onclick="setWcode(\'034_014\')">고객센터</a></dd>');
document.write('</dl>');
document.write('</div>');

document.write('</div>');

document.write('<div class="conciseBot" style="display:none;">');
document.write('</div>');

document.write('</div>');

function yesGetCookie(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}
function yesGetCookieValue(key) {
    var arg = key + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return yesGetCookie(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
}

function yesSetSearchFocus(text, domain, qdomain) {
    $j('#yBtnSearchCategoryText').val(text);
    $j('#domain').val(domain);
    $j('#qdomain').val(qdomain);
    $j('#yesSForm .schScope dl').hide();
}

function yesSearch() {
    if ($j.trim($j('#query').val()) == "") {
        alert('검색어를 입력하세요.');
        $j('#query').focus();
        return false;
    }
}
function yesHideCategory() {
    $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
    $j('#yesConciseGnbWrap .conciseMnu dd div.ccCateLi').hide();
}
function yesHideEtc() {
    $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
    $j('#yesConciseGnbWrap .conciseMnu dd div.ccEntLi').hide();
}
// wiselog clickcode 
function setWcode(Wcode) {
    if (Wcode != null) {
        var wLogUrl = 'http://www.yes24.com/wiselog/buttonclick.jsp?Wcode=' + Wcode;

        n_click_logging(wLogUrl);
    }
}

function Concise_check_search() {
    setWcode("034_003");
    init_searchbox();
}

function IsEntPage() {
    var sRen = false;
    if (location.href.indexOf("ticket.yes24.com") > -1 || location.href.indexOf("movie.yes24.com") > -1) {
        sRen = true;
    }
    return sRen;
}

function LogOutUrl() {
    var defalutGoLogOut = "https://www.yes24.com/Templates/FTLogout.aspx";
    var check = "";

    if (location.href.indexOf("ticket.yes24.com") > -1 || location.href.indexOf("movie.yes24.com") > -1 || location.href.indexOf("vod.yes24.com") > -1) {
        if (location.href.indexOf("ticket.yes24.com") > -1) {
            check = "ticket";
        } else if (location.href.indexOf("movie.yes24.com") > -1) {
            check = "movie";
        } else if (location.href.indexOf("vod.yes24.com") > -1) {
            check = "vod";
        }
        defalutGoLogOut += "?ReturnURL=http://" + check + ".yes24.com";
    }
    location.href = defalutGoLogOut;
}

$j(document).ready(function () {
    var pid = yesGetCookieValue("PID");
    if (pid != null && (pid == "133794" || pid == "94982" || pid == "152581")) {
        $j("#yemdirectSite1").html("ON");
        $j("#yemdirectSite2").html("ON");
    }

    //한국 가스공사
    if (pid != null && pid == "110456" && yesGetCookieValue("ServiceCookies") != null && yesGetCookieValue("ServiceCookies") != "") {
        if (IsEntPage()) {
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccSchGrp").remove();
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccIST").remove();
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccChYes").remove();
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccYesBlog").remove();
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccBestS").remove();
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccNewG").remove();

            //음반 ,DVD 빼고 제거
            $j("#yesConciseGnbWrap .conciseTop .conciseLft .conciseMnu dd.ccCateGrp .ccCateLi li a").not('a:eq(4), a:eq(5)').remove();
        }
    }
    $j('#yBtnSearch').bind('mouseover', function (event) {
        $j(this).addClass('ovr');
    });
    $j('#yBtnSearch').bind('mouseout', function (event) {
        $j(this).removeClass('ovr');
    });

    $j('#yDivBiroOnAD').html(yDivBiroOnADHtml);
    $j('#gnbBnList').switchDiv({
        current: Math.floor(Math.random() * 6),
        pageBtnsClassSelector: ".gnbSquareBtn",
        pageNumTextSelector: ".pagenNum",
        isShowBtn: false
    });

    /* 검색옵션 s */
    $j('#yesConciseGnbWrap .conciseMnu .ccSchGrp').find('a:first').click(
		function (event) {
		    if ($j('#yesConciseGnbWrap .conciseBot').css("display") == "none") {
		        $j(this).addClass("mnuOn");
		        $j('#yesConciseGnbWrap .conciseMnu .ccSchGrpArea').show();
		        $j('#yesConciseGnbWrap .conciseBot').show();
		    } else {
		        $j(this).removeClass("mnuOn");
		        $j('#yesConciseGnbWrap .conciseMnu .ccSchGrpArea').hide();
		        $j('#yesConciseGnbWrap .conciseBot').hide();
		    }
		    event.stopPropagation();
		}
	);

    $j('#yesSForm .schScope input').click(function (event) {
        $j('#yesSForm .schScope dl').show();
        event.stopPropagation();
    });

    $j('#yesSForm .schScope dl dt').click(function () {
        $j('#yesSForm .schScope dl').hide();
    });
    /* 검색옵션 e */

    /* 예스24분야  s */
    $j('#yesConciseGnbWrap .conciseMnu .ccCateGrp').find('a:first').bind('click', function (event) {
        $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
        $j('#yesConciseGnbWrap .conciseMnu dd > div').not(".ccSchGrpArea").hide();
        $j(this).next().show();
        $j(this).parent().addClass("mOn");
        event.stopPropagation();
    });

    $j('#yesConciseGnbWrap .conciseMnu dd:not(.ccCateGrp)').find('a:first').bind('focus', function () {
        $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
        $j('#yesConciseGnbWrap .conciseMnu dd div.ccCateLi').hide();
    });
    /* 예스24분야 e */

    /* 영화/공연 s */
    $j('#yesConciseGnbWrap .conciseMnu .ccEntGrp').find('a:first').bind('click', function (event) {
        $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
        $j('#yesConciseGnbWrap .conciseMnu dd > div').not(".ccSchGrpArea").hide();
        $j(this).next().show();
        $j(this).parent().addClass("mOn");
        event.stopPropagation();
    });

    $j('#yesConciseGnbWrap .conciseMnu dd:not(.ccEntGrp)').find('a:first').bind('focus', function () {
        $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
        $j('#yesConciseGnbWrap .conciseMnu dd div.ccEntLi').hide();
    });
    /* 영화/공연 e */

    /* 바로24 s 
    $j('#baroYesOn').find('a:first').bind('mouseover focus', function () {
    $j(this).next().show();
    });
    $j('#baroYesOn').bind('mouseleave', function () {
    $j(this).find('a:first').next().hide();
    });
    $j('#yesConciseGnbWrap .conciseLft dd, #yesConciseGnbWrap .conciseRgt dd:not(.baroOn)').find('a:first').bind('focus', function () {
    $j('#baroYesOn').find('a:first').next().hide();
    });
    바로24 e */

    /* 마이페이지 s */
    $j('#yesConciseGnbWrap .utilDl .myPgGrp').find('a:first').bind('mouseover focus', function () {
        $j(this).next().show();
    });

    $j('#yesConciseGnbWrap .utilDl .myPgGrp').bind('mouseleave', function () {
        $j(this).find('a:first').next().hide();
    });

    $j('#yesConciseGnbWrap .utilDl dd:not(.myPgGrp)').find('a:first').bind('focus', function () {
        $j('#yesConciseGnbWrap .utilDl dd div.myPgLi').hide();
    });
    /* 마이페이지 e */

    /* 검색 옵션 */
    $j('#yesConciseGnbWrap .schScopeOpt dd li').bind('click', function (event) {
        event.stopPropagation();
    });

    $j('body').bind('click', function (event) {
        //검색 창옵션
        $j('#yesSForm .schScope dl').hide();

        $j('#yesConciseGnbWrap .conciseMnu dd').removeClass("mOn");
        // 예스24분야
        $j('#yesConciseGnbWrap .conciseMnu dd div.ccCateLi').hide();
        // 영화/공연
        $j('#yesConciseGnbWrap .conciseMnu dd div.ccEntLi').hide();
    });

});