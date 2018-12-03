//<reference path="../../../inc/js/jquery-1.7.2-vsdoc.js" />
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
var IsLogin = "0";

function jsf_pdi_GoSpecialPerfSale(idperf) {

    if (IsLogin != '1') {
        $j('#dialogAlert').jAlert({ "msg": '티켓 예매는 로그인이 필요합니다.', 'loc': jsf_base_GetYes24Login() });
        return;
    }

    if ($j("#HidAdultAuthDetailUse").val() == "1" || $j("#HidAdultAuthSaleUse").val() == "1") {
        if (parseInt($j("#HidUserage").val()) >= 19) {
            if (getCookie("AdultAuthYN") != "Y") {
                $j("#dialogAlert").jAlert({ "msg": "19세 이상 회원님만 예매 가능한 공연입니다.<br />성인인증을 먼저 해주세요.", "loc": jsf_base_GetYes24Adult() });
                return;
            }
        }
        else {
            $j("#dialogAlert").jAlert({ "msg": "19세 이상 회원님만 예매 가능한 공연입니다." });
            return;
        }
    }

    if ($j("#HidIdPerf").val() == 21322) {
        if ($j("#chkInterestPerf").is(":checked") == false) {
            $j("#dialogAlert").jAlert({ "msg": "대회 약관에 동의 하셔야 예매 가능합니다." });
            return;
        }
    }

    if ($j("#HidIdPerf").val() == 20193) {
        NTrackObj.callTrackTag('23012');
    }
    
    if ($j("#HidIdPerf").val() == 23351) {
        jsf_pdi_ax_GetPerfSaleChck($j("#HidIdPerf").val());
    }

    //if ($j("#PerfPlayTime").css("display") != "none") {
    if (document.getElementById("PerfPlayTime") != null) {
        if (document.getElementById("PerfPlayTime").style.display != "none") {
            var joSelTime = $j("#PerfPlayTime option:selected");

            if (joSelTime.length > 0 && joSelTime.val() != "") {
                jsf_base_GoPerfSaleTime(idperf, joSelTime.val(), IsLogin, "");
            } else {
                jsf_base_GoPerfSalePerf(idperf, IsLogin, "");
            }
        } else {
            jsf_base_GoPerfSalePerf(idperf, IsLogin, "");
        }
    } else {
        jsf_base_GoPerfSalePerf(idperf, IsLogin, "");
    }
}

function jsf_pdi_GoPerfSale(valopt) {
    
    if (IsLogin != '1') {
        $j('#dialogAlert').jAlert({ "msg": '티켓 예매는 로그인이 필요합니다.', 'loc': jsf_base_GetYes24Login() });
        return;
    }


    if ($j("#HidlsNameCheck").val() == '1') {
        var paramIdPerf = $j("#HidIdPerf").val();

        if (paramIdPerf == 27418 || paramIdPerf == 27419 || paramIdPerf == 29102 || paramIdPerf == 30400) {
            
            var mirunmsg = "";
            var mirunmsgTitle = "";
            var now = new Date();
	        var nowDate = now.getFullYear() + jsf_def_PadLeft(now.getMonth() + 1, 2) + jsf_def_PadLeft(now.getDate(), 2);

	        if (paramIdPerf == 27418) {
                mirunmsgTitle = "&lt2017 아디다스 MBC+ 마이런 서울 무료참가 접수&gt<br>";
            }
            if (paramIdPerf == 27419) {
                mirunmsgTitle = "&lt2017 아디다스 MBC+ 마이런 서울 매장 접수 결제&gt<br>";
            }
            if (paramIdPerf == 27419 && (parseInt(nowDate) >= parseInt("20170808"))) {
                mirunmsgTitle = "&lt2017 아디다스 MBC+ 마이런 서울 온라인 접수&gt<br>";
            }
            if (paramIdPerf == 29102) {
                mirunmsgTitle = "&lt2018 아디다스 마이런 부산 매장 접수 결제&gt<br>";
            }
            if (paramIdPerf == 29102 && (parseInt(nowDate) >= parseInt("20180320"))) {
                mirunmsgTitle = "&lt2018 아디다스 마이런 부산 온라인 접수&gt<br>";
            }
            if (paramIdPerf == 30400) {
                mirunmsgTitle = "&lt2018 아디다스 MBC+ 마이런 서울 매장 접수 결제&gt<br>";
            }
            if (paramIdPerf == 30400 && (parseInt(nowDate) >= parseInt("20180813"))) {
                mirunmsgTitle = "&lt2018 아디다스 MBC+ 마이런 서울 온라인 접수&gt<br>";
            }

            mirunmsg += mirunmsgTitle;
            mirunmsg += "접수 전에 로그인 후 본인인증(휴대폰, I-Pin인증)여부를 미리 확인해주세요.";
            mirunmsg += "<br>본인인증이 안된 아이디는 온라인 접수 및 결제가 불가합니다.<br>";
            mirunmsg += "<br>* 회원 가입 시 SMS 또는 이메일 인증 등 간편 가입 방식으로 가입한";
            mirunmsg += "회원은 본인 인증(휴대폰, I-Pin 인증)을 한번 더 해주셔야 접수가 가능합니다.";
            mirunmsg += "<br>* 본인 인증 후에도 반드시 재로그인을 해주신 후 접수를 진행해주시기 바랍니다.";
            mirunmsg += "<br>(본인인증 -> 로그아웃 -> 재로그인 -> 접수)";
            mirunmsg += "<br>* 1인 1개 아이디 신청 원칙/중복 접수 불가";

            $j("#dialogConfirm").jConfirm({
            "msg": mirunmsg,
            "buttons": {
                '본인인증하기': function () {
                    $j(this).dialog('close');   
                    location.href = "https://www.yes24.com/Member/FTMemUpt.aspx";                         
                },
                '취소': function () {
                    $j(this).dialog('close');                            
                }
                }
            });

            return;
        }
        else {
            //$j('#dialogAlert').jAlert({ 'msg': '본 공연은 본인인증(휴대폰, I-Pin 인증) 회원만 예매 가능합니다.<br>회원 가입 시 SMS 또는 이메일 인증 등 간편 가입을 이용한 회원<br>은 본인 인증 후 예매해주시기 바랍니다.<br>반드시 재로그인을 해주셔야 예매 진행이 가능하오니 착오없으시길 바랍니다.<br>(본인인증 → 로그아웃 → 재로그인 → 예매)', 'buttons': { '본인인증하기': function () { $j(this).dialog('close'); location.href = "https://www.yes24.com//Member/Mypage_reconfirmPW.aspx" } } })
            $j('#dialogAlert').jAlert({ 'msg': '본인인증 안내<br><br>[전자상거래 등에서의 소비자 보호에 관한 법률 제 6조 (거래기록의 보존 등)] 에 의해 안전한 거래 및 회원 정보 보호를 위해 예매 서비스 이용 시 본인 확인이 필요합니다.<br><br>본인 확인은 실거래자 확인을 위해 거래 당사자가 본인임을 인증할 수 있는 아이핀 인증과 본인 명의 휴대폰 인증만 가능합니다.<br><br>본인인증 후 로그아웃→재로그인 하여 이용해주시기 바랍니다.', 'buttons': { '본인인증하기': function () { $j(this).dialog('close'); location.href = "https://www.yes24.com//Member/ipin/ChangeMemberByIPIN.aspx" } } })
            return;
        }
    }

    if ($j("#HidAdultAuthDetailUse").val() == "1" || $j("#HidAdultAuthSaleUse").val() == "1") {        
        if (parseInt($j("#HidUserage").val()) >= 19) {
            if (getCookie("AdultAuthYN") != "Y") {
                $j("#dialogAlert").jAlert({ "msg": "19세 이상 회원님만 예매 가능한 공연입니다.<br />성인인증을 먼저 해주세요.", "loc": jsf_base_GetYes24Adult() });
                return;
            }
        }
        else {
            $j("#dialogAlert").jAlert({ "msg": "19세 이상 회원님만 예매 가능한 공연입니다." });
            return;
        }
    }

    if ($j("#HidIdPerf").val() == 21322) {
        if ($j("#chkInterestPerf").is(":checked") == false) {
            $j("#dialogAlert").jAlert({ "msg": "대회 약관에 동의 하셔야 예매 가능합니다." });
            return;
        }
    }

    if ($j("#HidIdPerf").val() == 20193) {
        NTrackObj.callTrackTag('23012');
    }

    if ($j("#HidIdPerf").val() == 23351) {
        jsf_pdi_ax_GetPerfSaleChck($j("#HidIdPerf").val());
    }


    if ($j("#HidPerfOpenChk").val() == "0") {
        if (getCookie('PerfPass') != "OK") {
            if ($j("#HidIdPerf").val() == 19917 || $j("#HidIdPerf").val() == 24073 || $j("#HidIdPerf").val() == 30919 || $j("#HidIdPerf").val() == 31013) { // 마룬5 내한공연 선예매
                $j('#dialogPopup').jSlimPopup({ modal: false, width: 400, height: 183, url: '/Pages/Perf/Sale/Popup/PerfPassChkPop.aspx?IdPerf=' + $j("#HidIdPerf").val(), 'title': '인증' });
                return;
            }
        }
    }


    if ($j("#HidPerfFanClubOption").val() == '1') { // 공연 Option이 팬클럽인 경우
        if ($j("#HidIdPerf").val() == 25172 || $j("#HidIdPerf").val() == 27743 || $j("#HidIdPerf").val() == 29819) {
            if (jsf_PerfAuth() != "Y") {
                $j('#dialogPopup').jSlimPopup({ modal: false, width: 350, height: 183, url: '/Pages/Popup/Perf/PerfAuth.aspx?IdPerf=' + $j("#HidIdPerf").val(), 'title': '인증' });
                return;
            }
        }
    }


    if ($j("#HidIdPerf").val() == 23296) {
        $j("#dialogConfirm").jConfirm({
            "msg": "* 금년도 자라섬 내 규정으로 인한 지정공간 외 공연자 및 무대 주변의 텐트 및 그늘막 설치 불가능<br>* 지류티켓은 매표소에서 팔찌로 교환 후 입장가능. 1인1팔찌로 교환하며, 대리수령 및 전달불가",
            "buttons": {
                '확인': function () {
                    $j(this).dialog('close');
                    jsf_base_GoPerfSalePerf($j("#HidIdPerf").val(), IsLogin, valopt);
                },
                '취소': function () {
                    $j(this).dialog('close');
                }
            }
        });
    }
    else {

        //if ($j("#PerfPlayTime").css("display") != "none") {
        if (document.getElementById("PerfPlayTime") != null) {
            if (document.getElementById("PerfPlayTime").style.display != "none") {
                var joSelTime = $j("#PerfPlayTime option:selected");

                if (joSelTime.length > 0 && joSelTime.val() != "") {
                    jsf_base_GoPerfSaleTime($j("#HidIdPerf").val(), joSelTime.val(), IsLogin, valopt);
                } else {
                    jsf_base_GoPerfSalePerf($j("#HidIdPerf").val(), IsLogin, valopt);
                }
            } else {
                jsf_base_GoPerfSalePerf($j("#HidIdPerf").val(), IsLogin, valopt);
            }
        } else {
            jsf_base_GoPerfSalePerf($j("#HidIdPerf").val(), IsLogin, valopt);
        }

    }

}


function jsf_PerfAuth() {
    var resultAuth = "N";
    $j.ajax({
        async: false,
        type: "POST",
        url: "/Pages/Popup/Perf/PerfAuth.aspx/PerfFanMemberChk",
        data: JSON.stringify({
            paramIdPerf: $j("#HidIdPerf").val()
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data, textStatus) {
            resultAuth = data.d.Result;
        },
        error: function (xhr, textStatus, errorThrown) {
            $j("#dialogAlert").jAlert({ "msg": "오류가 발생하였습니다." });
        }
    });

    return resultAuth;
}


 function jsf_AdultAuth() {
     if (IsLogin == '1') {
         if (parseInt($j("#HidUserage").val()) >= 19) {
             if (getCookie("AdultAuthYN") != "Y") {
                 //                 $j("#dialogAlert").jAlert({ "msg": "19세 이상 회원님만 예매 가능한 공연입니다.<br />성인인증을 먼저 해주세요.", "loc": jsf_base_GetYes24Adult() });
                 location.href = jsf_base_GetYes24Adult();
                 return;
             }
         }
         else {
             $j("#dialogAlert").jAlert({ "msg": "19세 이상 회원님만 예매 가능한 공연입니다."});
         }
    }
    else {
        $j("#dialogAlert").jAlert({ "msg": "로그인을 하셔야 성인인증이 가능합니다.", "loc": jsf_base_GetYes24Login() });
    }
}

function jsf_pdi_GoPerfPackage() {
    jsf_base_GoPackageSale($j("#HidIdPerf").val(), IsLogin);
}

function jsf_pdi_SetPerfSaleButton() {

    var IsEnglish = $j("#HidIsEnglishBooking").val();
    var PerfSaleState = $j("#HidPerfSaleState").val();
    var IdPerf = $j("#HidIdPerf").val();

    if (IsEnglish == "0") {
        $j("#imgEnglishBooking").css("display", "none");
        $j("#imgMyAlram").attr("src", jcFILESVR + "/img/common/btn_alram.gif");
    } else {
        if (PerfSaleState == "2") {
            $j("#imgEnglishBooking").css("display", "inline-block");
            $j("#imgMyAlram").attr("src", jcFILESVR + "/img/common/btn_alram02.gif");
        }
    }

    if ($j.trim($j("#HidCloseNotice").val()) != "") {
        $j("#divRightStep").children().not("#divNoData, #divSale").remove();
        $j("#divNoData").html("<span>" + $j("#HidCloseNotice").val() + "</span>");
        $j("#divNoData").show();
        return;
    }

    jsf_pdi_GetPerfDateTopOne(IdPerf, '', '', $j("#HidIsMania").val());

//    if (PerfSaleState == "16" || PerfSaleState == "8" || PerfSaleState == "1") {    //공연상태가 판매마감 또는 판매취소, 공연등록
    if (PerfSaleState != "2") {   // 판매 진행 이외의
        $j("#divRightStep").children().not("#divNoData, #divSale").remove();
        $j("#divNoData").show();
//        jsf_pdi_GetPerfDateTopOne = function (a, b, c, d, e) {
//            return;
//        }
        if (PerfSaleState == "4" || PerfSaleState == "8" || PerfSaleState == "16") {
            $j("#divNoData").html("<span>본 상품은 판매 진행 중이 아닙니다.</span>");
        }
    } else {
        jsf_pdi_ax_GetTimeSaleStates(IdPerf);
//        jsf_pdi_ax_GetPerfPlayDate(IdPerf);
    }


}

//탭 클릭
function jsf_pdi_TabClick() {
//    var IdTab = $j("#HidTab").val();
//    var TabCtrl = $j(this);

//    if (IdTab != TabCtrl.attr("tab")) {
//        $j("#HidTab").val(TabCtrl.attr("tab"));
//        jsf_pdi_TabDataBind();
//        jsf_pdi_TabDisplay();
//    } else {
//        if ($j('#btnPromotion').attr('token') == '1') {
//            jsf_com_GoToAnchor_ScrollSpeed($j("div#divPromotion"), 0);
//            $j('#btnPromotion').attr('token', '');
//        }
//    }

    var TabCtrl = $j(this);
    var IdPerf = $j("#HidIdPerf").val();

    if (IdPerf == 15801 || IdPerf ==15821) {
        if (TabCtrl.attr("tab") == "3") {
            alert("게시판 운영규정에 위반되는\n티켓 매매 및 양도, 교환 등에 대한 글이 지속적으로 올라오고 있어\n부득이하게 한줄기대평’ 코너를 닫게 되었습니다.\n양해 부탁 드립니다.");
            return;
        }
    }

    $j("#HidTab").val(TabCtrl.attr("tab"));
    jsf_pdi_TabDataBind(TabCtrl.attr("tab"));
    jsf_pdi_TabDisplay(TabCtrl.attr("tab"));

    
    if(TabCtrl.attr("tab") == 2 || TabCtrl.attr("tab") == 3)
        jsf_pdi_GetCummunityBoardCount();

    if ($j('#btnPromotion').attr('token') == '1') {
        jsf_com_GoToAnchor_ScrollSpeed($j("div#divPromotion"), 0);
        $j('#btnPromotion').attr('token', '');
    }
}

//탭 노출제어
function jsf_pdi_TabDisplay(IdTab) {
    //var IdTab = $j("#HidTab").val();

	$j("#ulTab a").each(function (idx) {
		var TabIndex = idx + 1;

		var TabOnImgSrc = jcFILESVR + "/img/common/tab_0" + TabIndex + "_ov.gif";
		var TabImgSrc = jcFILESVR + "/img/common/tab_0" + TabIndex + ".gif";

		$j(this).css("cursor", "pointer");
		$j(this).find("img").attr("src", TabImgSrc);
		$j(this).find("span").removeClass("hidden");

		if ($j(this).attr("tab") == IdTab) {
			//$j(this).css("cursor", "inherit");
			$j(this).find("img").attr("src", TabOnImgSrc);
			if (IdTab == 2 || IdTab == 3)
				$j(this).find("span").addClass("hidden");
		}
	});
}

function jsf_pdi_TabDataBind(IdTab) {
    var IdPerf = $j("#HidIdPerf").val();
    //var IdTab = $j("#HidTab").val();

    $j("div.cont_infor").css("hight", "");
    $j("div.cont_infor iframe").css("height", "500px");
    $j("div.cont_infor iframe").attr("src", "");
    
    if (IdTab == "1") jsf_pdi_ax_GetPerfDetailContents(IdPerf);
    else if (IdTab == "2") jsf_pdi_GetBoard(1, IdPerf);
    else if (IdTab == "3") jsf_pdi_GetBoard(2, IdPerf);
    else if (IdTab == "4") jsf_pdi_GetTheaterInfo();
    else if (IdTab == "5") jsf_pdi_GetCancelGuideInfo(IdPerf);
}

//약도
function jsf_pdi_GoMap() {
    $j("#HidTab").val("4");
    jsf_pdi_TabDataBind("4");
    jsf_pdi_TabDisplay("4");
}

//캐스팅일정 팝업
function jsf_pdi_OpenCastingInfo() {
    var IdPerf = $j("#HidIdPerf").val();
    //$j('#dialogPopup').jPopup({ 'modal': true, 'width': 700, 'height': 100, 'url': '/Pages/Popup/Perf/CastingContents.aspx?idPerf=' + IdPerf, 'title': '캐스팅 일정' });

    window.open('/Pages/Popup/Perf/CastingContents.aspx?idPerf=' + IdPerf, 'CastingInfo', 'width=694,height=520,directories=no,resizable=no,status=yes,toolbar=no,menubar=no,top=100,left=300');
}

//관련 콘텐츠 팝업
function jsf_pdi_OpenRelationContents(jspTabId) {
    var Param = "IdPerf=" + $j("#HidIdPerf").val() + "&Tab=" + jspTabId;
    $j('#dialogPopup').jPopup({ 'modal': true, 'width': 445, 'height': 475, 'url': '/Pages/Popup/Perf/RelationContents.aspx?' + Param, 'title': '' });
}

//팬클럽 인증 팝업
function jsf_pdi_OpenAuthFanClub(jspIsLogin) {
    var idperf = $j("#HidIdPerf").val();
    var idorg = $j("#HidIdOrg").val();
    var Param = "IdPerf=" + idperf + "&IdOrg=" + idorg;
    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();
            if ([19076, 17717].contains(idperf)) {
                $j('#dialogAlert').jAlert({
                    "msg": '구매 인증을 하려면 로그인이 필요합니다.',
                    'loc': jsl_RetUrl
                });
            }
            else if ([23372].contains(idperf) || [996, 2332, 2352, 2499].contains(idorg)) {
                $j('#dialogAlert').jAlert({
                    "msg": 'ABC유료회원 인증을 하려면 로그인이 필요합니다.',
                    'loc': jsl_RetUrl
                });
            }
            else {
                $j('#dialogAlert').jAlert({
                    "msg": '인증을 위해 로그인 먼저 해주세요.',
                    'loc': jsl_RetUrl
                });
            }
            return;

        }

    $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 350, 'url': '/Pages/Popup/Perf/FanClub.aspx?' + Param, 'title': '' });
}

function jsf_hyundaCardAgreePop() {
    var Param = "IdPerf=" + $j("#HidIdPerf").val();
    $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 430, 'url': '/Pages/Popup/Perf/hyundaCardAgree.aspx?'+Param, 'title': '' });
}


//현대카드 인증 팝업
function jsf_pdi_OpenAuthHCard_StarGold(jspIsLogin) {
    
    
    var Param = "IdPerf=" + $j("#HidIdPerf").val();

    var idperf = $j("#HidIdPerf").val();

    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Hdcard/AjaxAuthinfoReturn.aspx",
        data: {
            ParamIdPef: $j("#HidIdPerf").val(),
            ParamType: "I"
        },
        dataType: "json",
        success: function (data, textStatus) {

            if (data.Result == "00") {
                var yesAuthUrl = encodeURIComponent("http://ticket.yes24.com/Pages/hdcard/memberAuth.aspx?authinfo=" + data.Authinfo + "|P");
                window.open('http://bill.hyundaicard.com/star_gold/cert.hc?val1=h4DC2YerS3D&val2=' + yesAuthUrl + '&val3=' + idperf + '&val4=' + data.Value4 + '&val5=' + data.Value5);
            }
            else if (data.Result == "02") {
                $j('#dialogAlert').jAlert({ "msg": '로그인을 확인하여 주세요', 'loc': jsf_base_GetYes24Login() });
            }
            else if (data.Result == "03") {
                jsf_hyundaCardAgreePop();
            }
            else if (data.Result == "01") {
                $j('#dialogAlert').jAlert({ "msg": '이미 인증을 완료 하셨습니다.' });
            }
            else  {
                $j("#dialogAlert").jAlert({ "msg": "시스템 에러가 발생하였습니다." });
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            $j("#dialogAlert").jAlert({ "msg": "시스템 에러가 발생하였습니다." });
        },
        beforeSend: function (xhr, settings) {
            jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "", ".entry");
        },
        complete: function (xhr, textStatus) {
            jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "", ".entry");
        }
    })
}

function jsf_pdi_OpenAuthHCard_Cnt(jspIsLogin) {

    if (jspIsLogin == '0') {
        return;
    }

    var idperf = $j("#HidIdPerf").val();

    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Hdcard/AjaxAuthinfoReturn.aspx",
        data: {
            ParamIdPef: $j("#HidIdPerf").val(),
            ParamType: "S"
        },
        dataType: "json",
        success: function (data, textStatus) {

            if (data.Result == "00") {
                if (parseInt(data.Cnt) > 0) {
                    $j('#phdcardAuthBtn').html("<em>현대카드 Star∙Gold 인증완료</em>");
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$j("#dialogAlert").jAlert({ "msg": "시스템 에러가 발생하였습니다." });
        },
        beforeSend: function (xhr, settings) {
            jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "", ".entry");
        },
        complete: function (xhr, textStatus) {
            jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "", ".entry");
        }
    })
}

//나만의 맞춤 알람설정 팝업
function jsf_pdi_OpenMyAlarm(jspIsLogin) {
    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();
        $j('#dialogAlert').jAlert({
            "msg": '나만의 맞춤 알람설정을 하려면 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });
        return;
    }
    var Param = "IdPerf=" + $j("#HidIdPerf").val();
    $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 430, 'url': '/Pages/Popup/MyPage/MyAlarm.aspx?' + Param, 'title': '' });
}

//관심공연담기 팝업
function jsf_pdi_OpenFavoritePerformanceAdd(jspIsLogin) {
    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login()
        $j('#dialogAlert').jAlert({
            "msg": '관심공연을 설정 하려면 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });
        return;
    }
    var Param = "IdPerf=" + $j("#HidIdPerf").val();
    $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 310, 'height': 165, 'url': '/Pages/Popup/Perf/FavoritePerformance.aspx?' + Param, 'title': '' });
}


//공연장정보
function jsf_pdi_GetTheaterInfo() {
    var IdTheater = $j("#HidIdTheater").val();

    if (IdTheater != "") {
        jvUrl = "/Pages/Perf/Theater/IFrameTheater.aspx?IdTheater=" + IdTheater;

        $j("div.cont_infor").find("iframe").attr("src", jvUrl);
        $j("div.cont_infor").find("iframe").css("display", "block");
        $j("#PerfDInfo").css("display", "none");
    }
}

//취소,환불
function jsf_pdi_GetCancelGuideInfo(jspIdPerf) {

    if (jspIdPerf != "") {
        //jvUrl = "/Pages/Perf/Detail/IFrameCancelGuide.aspx?idPerf=" + jspIdPerf;

        //$j("div.cont_infor").find("iframe").attr("src", jvUrl);
        //$j("div.cont_infor").find("iframe").css("display", "block");
        //$j("#PerfDInfo").css("display", "none");

         $j.ajax({
            async: true,
            type: "GET",
            url: "/Pages/Perf/Detail/IFrameCancelGuide.aspx",
            data: { IdPerf: jspIdPerf },
            dataType: "html",
            success: function (data, textStatus) {
                $j("#PerfContents").empty();
                $j("#PerfContents").append(data);

                // 이전 게시판(WEAS) 스타일 제거
                $j('div.VBN_42585').removeAttr('style');

                $j("div.cont_infor").find("iframe").css("display", "none");
                $j("#PerfDInfo").css("display", "");
                $j("#PerfDInfo div.notice_cont").css("display", "none");
                $j('div.recomm').css('display', 'none');
            },
            error: function (xhr, textStatus, errorThrown) {
                jsf_axAlert("공연 취소/환불정책 조회 에러입니다.");
            },
            beforeSend: function (xhr, settings) {
                //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", "#ulTab a[tab='5']");
            },
            complete: function (xhr, textStatus) {
                //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", "#ulTab a[tab='5']");
            }
        });

        n_click_logging("http://ticket.yes24.com/Pages/Perf/Detail/IFrameCancelGuide.aspx");

    }
}

//게시판
function jsf_pdi_GetBoard(jspType, jspIdPerf) {

    if (jspIdPerf != "") {
        if (jspType == "1") jvUrl = "/Pages/Magazine/Community/Review/IFrameReview.aspx?idPerf=" + jspIdPerf;
        else if (jspType == "2") jvUrl = "/Pages/Magazine/Community/Expectation/IFrameExpectation.aspx?idPerf=" + jspIdPerf;
        //alert(jvUrl);
        $j("div.cont_infor").find("iframe").attr("src", jvUrl);
        $j("div.cont_infor").find("iframe").css("display", "block");
        $j("#PerfDInfo").css("display", "none");
    }
}

//게시판 게시물 갯수
function jsf_pdi_GetCummunityBoardCount() {
    var IdPerf = $j("#HidIdPerf").val();

    var now = new Date();
    var txtDate = now.getFullYear() + jsf_def_PadLeft(now.getMonth() + 1, 2) + jsf_def_PadLeft(now.getDate(), 2);

    if (IdPerf != "") {
        var HidIsReviewGuest = $j("#HidIsReviewGuest").val();
        var HidIsExpectationGuest = $j("#HidIsExpectationGuest").val();

        if (HidIsExpectationGuest == 1 && HidIsReviewGuest == 1) {
            return;
        }
        jsf_pdi_ax_GetCummunityBoardCount(IdPerf, HidIsReviewGuest, HidIsExpectationGuest);
    } else {
        $j("#PostscriptCount").html("0");
        $j("#ExpectionCount").html("0");
    }

}

// 관람후기 쿠키 체크
function jsf_pdi_GetReviewCheck() {
    var jvValue = $j("#HidReviewCheck").val();
    $j("#HidReviewCheck").val("");
    if (jvValue == "1") {
        $j("html, body").animate({ scrollTop: $j(".infor_section").offset().top }, 400);
    }
    return jvValue;
}

function jsf_pdi_GetPerfName() {
    return $j("#spanPerfName").text();
}

function jsf_pdi_ChangePlayDate() {
    var IdPerf = $j("#HidIdPerf").val();
    var PlayDate = $j("#PerfPlayDate option:selected").val();

    if (IdPerf != "" && PlayDate != "") {
        jsf_pdi_ax_GetPerfPlayTime(IdPerf, PlayDate);
    } else {
        $j("#SeatRemain").empty();
        $j("#PerfPlayTime").empty();
        $j("#PerfPlayTime").append("<option value=''>관람시간을 선택하세요</option>");
    }
}

function jsf_pdi_ChangePlayTime() {
    var IdTime = $j("#PerfPlayTime option:selected").val();
    var IdLock = 0;

    if (IdTime != "") {
        if ($j("#HidIdGenre").val() == "15460") {
            $j("#SeatRemain").empty();
            $j("#SeatRemain").append("<li>입장시간 : " + $j("#PerfPlayTime option:selected").text() + "부터</li>");
        } else {
            if ($j("#HidIsRemainSeat").val() == "1") {
                $j("#SeatRemain").empty();
                $j("#SeatRemain").append("<li>본 공연은 잔여좌석 서비스를 제공하지 않습니다.</li>");
            } else {
                jsf_pdi_ax_GetPerfRemainSeat(IdTime, IdLock);
            }
        }
    } else {
        $j("#SeatRemain").html("<li>관람 일시를 선택해주세요.</li>");
    }
}

function jsf_pdi_ax_GetPerfDetailContents(jspIdPerf) {

     $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Detail/Ajax/PerfContents.aspx",
        data: { IdPerf: jspIdPerf },
        dataType: "html",
        success: function (data, textStatus) {

            $j("#PerfContents").empty();
            $j("#PerfContents").append(data);

            // 이전 게시판(WEAS) 스타일 제거
            $j('div.VBN_42585').removeAttr('style');

            $j("div.cont_infor").find("iframe").css("display", "none");
            $j("#PerfDInfo").css("display", "");
            $j("#PerfDInfo div.notice_cont").css("display", "");
            $j('div.recomm').css('display', '');

            // 할인안내 이동
            if ($j('#btnPromotion').attr('token') == '1') {
                jsf_com_GoToAnchor_ScrollSpeed($j("div#divPromotion"), 0);
                $j('#btnPromotion').attr('token', '');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            jsf_axAlert("공연상세 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", ".cont_infor");
        },
        complete: function (xhr, textStatus) {
            if ($j("#DetailAlert").length > 0) {
                $j("#mainForm").append("<div id='dialogDetailAlert'></div>");
                if ($j("#DetailAlert").html().length > 0) {
                    $j("#dialogDetailAlert").jAlert({ "msg": $j("#DetailAlert").html(), "modal": false });
                }
            }
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", ".cont_infor");
        }
    });
    n_click_logging("http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfContents.aspx");
}

//function jsf_pdi_ax_GetPerfPlayDate(jspIdPerf) {
//    $j.ajax({
//        async: true,
//        type: "POST",
//        url: "/Pages/Perf/Detail/Ajax/PerfPlayDate.aspx",
//        data: { IdPerf: jspIdPerf },
//        dataType: "html",
//        success: function (data, textStatus) {
//            $j("#PerfPlayDate").empty();
//            $j("#PerfPlayDate").append(data);
//            $j("#PerfPlayDate").trigger("change");
//            $j("#PerfPlayTime").css("display", "");            
//        },
//        error: function (xhr, textStatus, errorThrown) {
//            jsf_axAlert("관람일자 조회 에러입니다.");
//        },
//        beforeSend: function (xhr, settings) {
//            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", "#PerfPlayDate");
//        },
//        complete: function (xhr, textStatus) {
//            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", "#PerfPlayDate");
//        }
//    });
//    
//    
//}

function jsf_pdi_ax_GetPerfPlayTime(jspIdPerf, jspPlayDate) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Detail/Ajax/PerfPlayTime.aspx",
        data: { IdPerf: jspIdPerf, PlayDate: jspPlayDate },
        dataType: "html",
        success: function (data, textStatus) {
            
            $j("#PerfPlayTime").attr("disabled", false);
            $j("#PerfPlayTime").empty();
            $j("#PerfPlayTime").append(data);
            $j("#PerfPlayTime").prop("selectedIndex", 0).trigger("change");
        },
        error: function (xhr, textStatus, errorThrown) {
            jsf_axAlert("관람시간 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", "#PerfPlayTime");
        },
        complete: function (xhr, textStatus) {
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", "#PerfPlayTime");
        }
    });
}

function jsf_pdi_ax_GetPerfRemainSeat(jspIdTime, jspLock) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Detail/Ajax/PerfRemainSeat.aspx",
        data: { IdTime: jspIdTime, IdLock: jspLock },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#SeatRemain").empty();
            $j("#SeatRemain").append(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            jsf_axAlert("잔여석 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", "#SeatRemain");
        },
        complete: function (xhr, textStatus) {
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", "#SeatRemain");
        }
    });
}

function jsf_pdi_ax_GetTimeSaleStates(jspIdPerf) {

    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Detail/Ajax/PerfSaleState.aspx",
        data: { IdPerf: jspIdPerf },
        dataType: "text",
        success: function (data, textStatus) {
            if (data == "0") {
                if ($j("#HidIsOpenDate").val() != "1")
                    $j("#divNoData").html("<span>본 상품은 판매 진행 중이 아닙니다.</span>");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$j("#dialogAlert").jAlert({ "msg": "공연상세 조회 에러입니다." });
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", ".btn");
        },
        complete: function (xhr, textStatus) {
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", ".btn");
        }
    });
}

function jsf_pdi_ax_GetPerfSaleChck(jspIdPerf) {

    $j.ajax({
        async: false,
        type: "POST",
        url: "/Pages/Perf/Detail/Ajax/PerfKey.aspx",
        data: { IdPerf: jspIdPerf },
        dataType: "text",
        success: function (data, textStatus) {
            $j.cookie('BIGPERF', data, { path: '/', domain: 'yes24.com' });
        },
        error: function (xhr, textStatus, errorThrown) {
            //$j("#dialogAlert").jAlert({ "msg": "공연상세 조회 에러입니다." });
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", ".btn");
        },
        complete: function (xhr, textStatus) {
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", ".btn");
        }
    });
}

//function jsf_pdi_ax_GetPerfSaleOpenDate(jspIdPerf) {

//    $j.ajax({
//        async: true,
//        type: "POST",
//        url: "/Pages/Perf/Detail/Ajax/PerfSaleOpenDate.aspx",
//        data: { IdPerf: jspIdPerf },
//        dataType: "html",
//        success: function (data, textStatus) {
//            if (data != "") {
//            } else {
//                $j("#PerfPlayDate").empty().append("<option>예매마감</option>");
//                $j("#PerfPlayTime").css("display", "none");

//                if ($j.trim($j("#HidCloseNotice").val()) == "")
//                    $j("#SeatRemain").append("<li>본 상품은<br/>예매가 마감되었습니다.</li>");
//                else
//                    $j("#SeatRemain").append("<li>" + $j("#HidCloseNotice").val() + "</li>");
//            }
//        },
//        error: function (xhr, textStatus, errorThrown) {
//            //$j("#dialogAlert").jAlert({ "msg": "공연상세 조회 에러입니다." });
//        },
//        beforeSend: function (xhr, settings) {
//            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", ".btn");
//        },
//        complete: function (xhr, textStatus) {
//            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", ".btn");
//        }
//    });
//}

function jsf_pdi_ax_GetCummunityBoardCount(jspIdPerf, IsReviewGuest, IsExpectationGuest) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Detail/Ajax/PerfCommunityCount.aspx",
        data: { IdPerf: jspIdPerf, IsReviewGuest: IsReviewGuest, IsExpectationGuest: IsExpectationGuest },
        dataType: "json",
        success: function (data, textStatus) {
            if (data != null) {
                $j("#PostscriptCount").html(data.PostscriptCount);
                $j("#ExpectionCount").html(data.ExpectionCount);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$j("#dialogAlert").jAlert({ "msg": "공연상세 조회 에러입니다." });
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", ".btn");
        },
        complete: function (xhr, textStatus) {
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", ".btn");
        }
    });
}

function jsf_pdi_SetRelatedContentsVisiblity(jspIdPerf) {

    $j.ajax({
        async: true,
        type: "GET",
        url: "/Pages/Popup/Perf/RelationContents.aspx",
        data: { IdPerf: jspIdPerf },
        dataType: "html",
        success: function (data, textStatus) {

            
            if ($j(data).find("#ImageSlide img").length > 0) {
                if ($j("#relatedImageButton").attr("src").indexOf('_ov.gif') < 0)
                    $j("#relatedImageButton").attr("src", $j("#relatedImageButton").attr("src").replace("btn_img.gif", "btn_img_ov.gif"));
            }

            if ($j(data).find("p[fdata!='']").length > 0) {
                if ($j("#relatedMovieButton").attr("src").indexOf('_ov.gif') < 0)
                    $j("#relatedMovieButton").attr("src", $j("#relatedMovieButton").attr("src").replace("btn_mov.gif", "btn_mov_ov.gif"));
            }

            if ($j(data).find("a[musicId]").length > 0) {
                if ($j("#relatedMusicButton").attr("src").indexOf('_ov.gif') < 0)
                    $j("#relatedMusicButton").attr("src", $j("#relatedMusicButton").attr("src").replace("btn_mus.gif", "btn_mus_ov.gif"));
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //$j("#dialogAlert").jAlert({ "msg": "공연상세 조회 에러입니다." });
        },
        beforeSend: function (xhr, settings) {
            //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "1", ".btn");
        },
        complete: function (xhr, textStatus) {
            //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "1", ".btn");
        }
    });
}


function jsf_pdi_getParameter(strParamName) {
    var arrResult = null;
    if (strParamName) {
        arrResult = location.search.match(new RegExp("[&?]" + strParamName + "=(.*?)(&|$)"));
    }
    return arrResult && arrResult[1] ? arrResult[1] : null;
}

function jsf_Hcard_SalePop(val) {
    var msg = '';
//    msg += '<h2 class="tit tc" style="margin:0 0 10px -10px">현대카드 앱카드 30% 할인 안내</h2>';
//    msg += ' <ul class="card_list">'
//    msg += '<li style="margin-left:15px;"> '
//    msg += '<span>- <em class="red">1인 2매</em> 할인</span>'
//    msg += '</li>'
//    msg += '<li style="margin-left:15px;"><span>- <em class="red">G3~C석만 할인</em></span><br><span style="padding-left:8px;">(G1, G2석은 일반예매로만 가능)</span>'
//    msg += '<li style="margin-left:15px;"> '
//    msg += '<span>- 앱카드 전용 예매하기 버튼을 통해서만 할인 적용</span>'
//    msg += '</li>'
//    msg += '</li>'
//    msg += '</ul>'

    var now = new Date();
    var txtDate = now.getFullYear() + jsf_def_PadLeft(now.getMonth() + 1, 2) + jsf_def_PadLeft(now.getDate(), 2) + jsf_def_PadLeft(now.getHours(), 2) + jsf_def_PadLeft(now.getMinutes(), 2) + jsf_def_PadLeft(now.getSeconds(), 2); ;
    var PerfSaleState = $j("#HidPerfSaleState").val();

//    if (PerfSaleState == "16" || PerfSaleState == "8" || PerfSaleState == "1" || PerfSaleState == "4") {

    if (val == 0) {
        if (parseInt(txtDate) < parseInt("20140408120000")) {
            msg = "4월 8일(화) 낮 12시<br />현대카드 선예매 오픈"
            $j("#dialogConfirm").jConfirm({
                "msg": msg,
                "buttons": {
                    '확인': function () {
                        $j(this).dialog('close');
                    }
                }
            });
        }
        else if (parseInt(txtDate) >= parseInt("20140409080000") && parseInt(txtDate) < parseInt("20140409120000")) {
            msg = "티켓오픈 : 4월 9일(수) 낮 12시"
            $j("#dialogConfirm").jConfirm({
                "msg": msg,
                "buttons": {
                    '확인': function () {
                        $j(this).dialog('close');
                    }
                }
            });
        }

        if (parseInt(txtDate) >= parseInt("20140409120000")) {
            //공연상태가 판매마감 또는 판매취소, 공연등록
            msg = "본 공연 판매 마감되었습니다. "
            $j("#dialogConfirm").jConfirm({
                "msg": msg,
                "buttons": {
                    '확인': function () {
                        $j(this).dialog('close');
                    }
                }
            });
        }

        return;

    }

    if (val == 1) {
        jsf_pdi_GoPerfSale(1);
    }
}


//우측 캘린더 영역

function fpc_CheckLeapYear(jpYear) {
    if (((jpYear % 4 == 0) && (jpYear % 100 != 0)) || (jpYear % 400 == 0))
        return ("29");
    else
        return ("28");
}

function fpc_MakeCalHTML(jpYear, jpMonth, jpDay) {
    var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var monthsDisp = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    var monthlen = new Array(31, fpc_CheckLeapYear(jpYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var days = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");

    var jvintThisYear = new Number();
    var jvintThisMonth = new Number();
    var jvintThisDay = new Number();

    var jvcurrentDate = new Date();

    jvintThisYear = parseInt(jpYear);
    jvintThisMonth = parseInt(jpMonth);
    jvintThisDay = parseInt(jpDay);

    if (jvintThisYear == 0) jvintThisYear = jvcurrentDate.getFullYear();
    if (jvintThisMonth == 0) jvintThisMonth = parseInt(jvcurrentDate.getMonth()) + 1;
    if (jvintThisDay == 0) jvintThisDay = jvcurrentDate.getDate();

    var first = months[jvintThisMonth - 1] + " 01, " + jvintThisYear;
    firstday = new Date(first);
    startday = firstday.getDay();

    var count = 1;
    var factor = startday - 1;
    var endday = parseInt(monthlen[jvintThisMonth - 1]) + factor;

    var jvCalHTML = "";

    jvCalHTML += "<div class='calTop' id='divCalTop'>";
    jvCalHTML += "<a href='javascript:;' onclick='fdc_CalMoveMonth(-1);' class='btn btn_lft'><em class='cal_arr'>이전달 보기</em></a>";
    jvCalHTML += "<strong class='cal_date'>" + jvintThisYear + "." + monthsDisp[jvintThisMonth - 1] + "</strong>";
    jvCalHTML += "<a href='javascript:;' onclick='fdc_CalMoveMonth(1);' class='btn btn_rgt'><em class='cal_arr'>다음달 보기</em></a>";
    jvCalHTML += "</div>";

    jvCalHTML += "<div class='calendar' id='divCalendar'>";
    jvCalHTML += "<ul>";
    jvCalHTML += "<li class='tp_dayT txC_red'>일</li><li class='tp_dayT'>월</li><li class='tp_dayT'>화</li><li class='tp_dayT'>수</li><li class='tp_dayT'>목</li><li class='tp_dayT'>금</li><li class='tp_dayT txC_dBlue'>토</li>";

    if (startday > 0) {
        for (empty = 0; empty < startday; empty++) {
            jvCalHTML += "<li></li>";
        }
    }

    for (i = startday; i <= endday; i++) {
        var jvDateString = jvintThisYear + "-" + jsf_def_PadLeft(jvintThisMonth, 2) + "-" + jsf_def_PadLeft(count, 2);

        if ((i % 7) == 6) {
            jvCalHTML += "<li class='tp_dayN'><a href='javascript:;' onclick='fdc_CalDateClick(\"" + jvDateString + "\");' caldays='1' id='" + jvDateString + "' title='" + jvDateString + "' class='txC_dBlue'>" + count + "</a></li>";
        }
        else if ((i % 7) == 0) {
            jvCalHTML += "<li class='tp_dayN'><a href='javascript:;' onclick='fdc_CalDateClick(\"" + jvDateString + "\");' caldays='1' id='" + jvDateString + "' title='" + jvDateString + "' class='txC_red'>" + count + "</a></li>";
        }
        else {
            jvCalHTML += "<li class='tp_dayN'><a href='javascript:;' onclick='fdc_CalDateClick(\"" + jvDateString + "\");'  caldays='1' id='" + jvDateString + "' title='" + jvDateString + "'>" + count + "</a></li>";
        }
        
        count++;
    }

    for (empty = ((endday + 1) % 7); empty != 0 && empty < 7; empty++) {
        jvCalHTML += "<li></li>";
    }

    jvCalHTML += "</ul>";
    jvCalHTML += "</div>";

    return jvCalHTML;
}

function fdc_CalMoveMonth(index) {
    var jvPrevDate;

    if (index == -1) {
        if (jgPerfFirstMonth == 0)
            jvPrevDate = new Date(jgPerfFirstYear - 1, 11, 1);
        else
            jvPrevDate = new Date(jgPerfFirstYear, jgPerfFirstMonth - 1, 1);

        jgPerfFirstYear = jvPrevDate.getFullYear();
        jgPerfFirstMonth = jvPrevDate.getMonth();
        jgPerfFirstDay = jvPrevDate.getDate();
    }
    else {
        if (jgPerfFirstMonth == 11)
            jvNextDate = new Date(jgPerfFirstYear + 1, 0, 1);
        else
            jvNextDate = new Date(jgPerfFirstYear, jgPerfFirstMonth + 1, 1);

        jgPerfFirstYear = jvNextDate.getFullYear();
        jgPerfFirstMonth = jvNextDate.getMonth();
        jgPerfFirstDay = jvNextDate.getDate();
    }
    $j("#divCalTop, #divCalendar").html("");
    fpc_ShowCalendar(jgPerfFirstYear, jgPerfFirstMonth, jgPerfFirstDay);
}

var jgCalSelDate = "";
var jgIdSelTime = "";
var jgPerfFirstYear = "";
var jgPerfFirstMonth = "";
var jgPerfFirstDay = "";

function fdc_CalDateClick(jpSelDate) {
    if (jgCalSelDate != "")
        $j("#divCalendar").find("a[title=" + jgCalSelDate + "]").parent().removeClass("chkOn").addClass("tickP");

    $j("#divCalendar").find("a[title=" + jpSelDate + "]").parent().removeClass("tickP").addClass("chkOn");
    jgCalSelDate = jpSelDate;

    jsf_pdi_ax_GetPerfPlayTime($j("#HidIdPerf").val(), jgCalSelDate.replace(/-/g, ""));
}

function fpc_ShowCalendar(jpYear, jpMonth, jpDay) {
    $j("#CalDate").after(fpc_MakeCalHTML(jpYear, jpMonth + 1, jpDay));
    jsf_pdi_GetPerfDatesInMonth($j("#HidIdPerf").val(), jpYear, jpMonth, '', $j("#HidIsMania").val());
}

function jsf_pid_SetPackageInfoView() {
    jsf_pdi_GetPerfDateTopOne = function (a, b, c, d, e) {
        return;
    }
    $j('#divRightStep').children().not('#divPackageinfo, #divSale').remove(); 
    $j('#divPackageinfo').css('display', 'Block');
}

function jsf_pdi_GetPerfDateTopOne(jpIdPerf, jpIdSelTime, jgIdCode, jgIsMania) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PerfDay.aspx",
        data: { pGetMode: "top", pIdPerf: $j.trim(jpIdPerf), pIdTime: $j.trim(jpIdSelTime), pIdCode: $j.trim(jgIdCode), pIsMania: $j.trim(jgIsMania) },
        dataType: "text",
        success: function (data, textStatus) {
            if (data != "") {
                var strDate = data.split(',');
                if (strDate.length > 1) {
                    jgPerfFirstYear = parseInt(strDate[0]);
                    jgPerfFirstMonth = parseInt(strDate[1]) - 1;
                    jgPerfFirstDay = parseInt(strDate[2]);
                }
            }
            else {
                $j("#divRightStep").children().not("#divNoData, #divSale").remove();
                $j("#divNoData").show();
                return;
            }
            if (jpIdSelTime != "") {
                jgCalSelDate = jgPerfFirstYear + "-" + jsf_def_PadLeft(jgPerfFirstMonth + 1, 2) + "-" + jsf_def_PadLeft(jgPerfFirstDay, 2);
            }

            fpc_ShowCalendar(jgPerfFirstYear, jgPerfFirstMonth, jgPerfFirstDay);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연날짜(F) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "", "#divRightStep");
        },
        complete: function (xhr, textStatus) {
            jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "", "#divRightStep");
        }
    });
}

function jsf_pdi_GetPerfDatesInMonth(jpIdPerf, jpYear, jpMonth, jgIdCode, jgIsMania) {
    var jvPerfMonth = jpYear + "-" + jsf_def_PadLeft(jpMonth + 1, 2);

    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PerfDay.aspx",
        data: { pGetMode: "days", pIdPerf: $j.trim(jpIdPerf), pPerfMonth: $j.trim(jvPerfMonth), pIdCode: $j.trim(jgIdCode), pIsMania: $j.trim(jgIsMania) },
        dataType: "text",
        success: function (data, textStatus) {
            var jvSaleDays = data.split(',');
            var mHash = new jsf_def_Hash();

            for (var i = 0; i < jvSaleDays.length; i++)
                if (jvSaleDays[i] != "") mHash.setItem('' + jvSaleDays[i], '' + jvSaleDays[i]);

            $j("#divCalendar").find("a[caldays=1]").each(function (i) {
                var aTag = $j(this);
                if (mHash.hasItem(aTag.attr("title")) == true) {
                    aTag.removeClass().parent().addClass("tickP");
                } else {
                    aTag.attr("title", "해당일은 공연이 없습니다.");
                    aTag[0].onclick = "";
                }
            });

            mHash.clear();

            if (jvSaleDays.length == 2)
                jgCalSelDate = jvSaleDays[0];

            if (jgCalSelDate != "") {
                $j("#divCalendar").find("a[title=" + jgCalSelDate + "]").parent().removeClass().addClass("chkOn");
                $j("#divCalendar").find("a[title=" + jgCalSelDate + "]").trigger("click");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연날짜(D) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function jsf_pdi_OpenAuthMiRun(jspIsLogin,idPerf) {
    
    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '인증을 하려면 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MiRunAuth.aspx?idPerf=' + idPerf, 'title': '', position: [$j('.info').offset().left, 150] });
}


function jsf_pdi_OpenMirunClause(jspIsLogin) {

    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '약관 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }
        
    if ($j("#chkMirunClause").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunClause.aspx', 'title': '' });
    }

}

function jsf_pdi_OpenMirunClause2017(jspIsLogin) {

    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '약관 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    if ($j("#chkMirunClause").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunClause2017.aspx', 'title': '', position: [$j('.info').offset().left, 150] });
    }

}

function jsf_pdi_OpenMirunClause2017Seoul(jspIsLogin) {

    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '약관 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    if ($j("#chkMirunClause").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunClause2017Seoul.aspx?idperf=' + $j("#HidIdPerf").val(), 'title': '', position: [$j('.info').offset().left, 150] });
    }

}

function jsf_pdi_OpenMirunClause2018Busan(jspIsLogin) {

    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '약관 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    if ($j("#chkMirunClause").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunClause2018Busan.aspx', 'title': '', position: [$j('.info').offset().left, 150] });
    }

}

function jsf_pdi_OpenMirunClause2018Seoul(jspIsLogin) {

    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '약관 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    if ($j("#chkMirunClause").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunClause2018Seoul.aspx', 'title': '', position: [$j('.info').offset().left, 150] });
    }

}


function jsf_pdi_OpenMirunBaseAgree(jspIsLogin) {
    
    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '런베이스 시설이용 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    if ($j("#chkMirunBase").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunBaseAgree.aspx', 'title': '' });
    }

}

function jsf_pdi_OpenMirunBaseAgree2017Seoul(jspIsLogin) {

    if (jspIsLogin == '0') {
        var jsl_RetUrl = jsf_base_GetYes24Login();

        $j('#dialogAlert').jAlert({
            "msg": '런베이스 시설이용 동의 시 로그인이 필요합니다.',
            'loc': jsl_RetUrl
        });

        return;
    }

    if ($j("#chkMirunBase").prop("checked") == true) {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 450, 'url': '/Pages/Popup/Perf/MirunBaseAgree2017Seoul.aspx?idperf=' + $j("#HidIdPerf").val(), 'title': '' });
    }

}