function fax_AjaxLoader(jpType, jpStep, jpSelID) {
    var jo = $j(jpSelID);

    if (jo.length == 1) {
        var joLoader = $j("#imgAjaxLoader" + jpStep);

        if (jpType == jcAJAX_BEFORESEND) {
            var baseOffset = jo.offset();
            joLoader.css({
                position: 'absolute',
                top: baseOffset.top + ((jo.height() - joLoader.height()) / 2) + 3,
                left: baseOffset.left + jo.width() - 84,
                'z-index': parseInt(jo.css("z-index")) + 1
            });
            joLoader.show();
        } else if (jpType == jcAJAX_COMPLETE) {
            joLoader.hide();
        }
    }
}

function fax_GetPerfSaleInfo(jpIdPerf) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PerfSaleInfo.aspx",
        data: { pIdPerf: $j.trim(jpIdPerf) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data == "") {
                fbk_axAlert("공연정보 수신중에 오류가 발생했습니다.");
            } else {
                $j("#StateBoard #perfboard").html(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연정보 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "1_1", "#step01_date > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "1_1", "#step01_date > h2");
        }
    });
}

function fax_GetPerfGuideView(jpIdPerf) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PerfGuideView.aspx",
        data: { pIdPerf: $j.trim(jpIdPerf) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "")
                $j("#step01_notice #guideview").html(data);
            else
                $j("#step01_notice #guideview").html($j("#step01_notice #guideview_default").html());
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연안내 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "1_3", "#step01_date > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "1_3", "#step01_date > h2");
        }
    });
}

function fax_GetPerfFlashDateAll(jpIdPerf) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PerfFlashDateAll.aspx",
        data: { pIdPerf: $j.trim(jpIdPerf), pIdCode: $j.trim(jgIdCode), pIsMania: $j.trim(jgIsMania) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                $j("#SeatFlashArea #selFlashDateAll").html(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("플래시공연일 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetPerfDateTopOne(jpIdPerf, jpIdSelTime) {
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

            if (jgIdSelTime != "" && jgIsFirstTimeLoad == "0") {
                jgCalSelDate = jgPerfFirstYear + "-" + jsf_def_PadLeft(jgPerfFirstMonth + 1, 2) + "-" + jsf_def_PadLeft(jgPerfFirstDay, 2);
            }

            fpc_ShowCalendar(jgPerfFirstYear, jgPerfFirstMonth, jgPerfFirstDay);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연날짜(F) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetPerfDatesInMonth(jpIdPerf, jpYear, jpMonth) {
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

            $j("#step01_date #calendar")
                .find("a[caldays=1]").each(function (i) {
                    var aTag = $j(this);
                    if (mHash.hasItem(aTag.attr("title")) == true) {
                        aTag.parent().addClass("select");
                    } else {
                        aTag.attr("title", "해당일은 공연이 없습니다.");
                        aTag[0].onclick = "";
                    }
                });

            var jvCurDate = new Date();
            var jvCurYear = jvCurDate.getFullYear();
            var jvCurMonth = parseInt(jvCurDate.getMonth()) + 1;
            var jvCurDay = jvCurDate.getDate();
            var jvTodaySale = jvCurYear + "-" + jsf_def_PadLeft(jvCurMonth, 2) + "-" + jsf_def_PadLeft(jvCurDay, 2);

            if (mHash.hasItem(jvTodaySale) == true) {
                $j("#step01_date #calendar").find("#imgTodaySale").css("display", "block");
            }

            mHash.clear();

            if (jgCalSelDate != "") {
                $j("#step01_date #calendar").find("a[title=" + jgCalSelDate + "]").parent().removeClass("select").addClass("term");

                if (jgIdSelTime != "" && jgIsFirstTimeLoad == "0") {
                    $j("#step01_date #calendar").find("a[title=" + jgCalSelDate + "]").trigger("click");
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연날짜(D) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "1_2", "#step01_date > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "1_2", "#step01_date > h2");
        }
    });
}

function fax_GetPerfTime(jpIdPerf, jpCalSelDate) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PerfTime.aspx",
        data: { pDay: $j.trim(jpCalSelDate.replace(/-/g, "")), pIdPerf: $j.trim(jpIdPerf), pIdCode: $j.trim(jgIdCode), pIsMania: $j.trim(jgIsMania) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                var joData = $j("#divTimeTempData").html(data);

                $j("#ulTime").html(joData.find("#ulTimeData").html());
                $j("#ulTime > li").unbind('.step01_time_li').bind('click.step01_time_li', fdc_UlTimeClick);
                $j("#selFlashTime").html(joData.find("#selFlashTimeData").html());

                if (jgIdSelTime != "" && jgIsFirstTimeLoad == "0") {
                    jgIsFirstTimeLoad = "1";
                    $j("#ulTime > li[value='" + jgIdSelTime + "']").trigger("click");
                    jgIdSelTime = "";
                } else {
                    if ($j("#ulTime > li").length == 1 && $j("#SeatFlashArea").css("display") == "none") {
                        $j("#ulTime > li:eq(0)").trigger("click");
                    } else if ($j("#selFlashTime option").length > 1 && $j("#SeatFlashArea").css("display") != "none") {
                        $j("#selFlashTime").prop("selectedIndex", "1").trigger("change");
                    }
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("공연회차 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "2_1", "#step01_time h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "2_1", "#step01_time h2");
        }
    });
}

function fax_GetTimeSeatRemain(jpIdTime, jpGenreId, jpDisplayRemainSeat) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/TimeSeatRemain.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pIdCode: $j.trim(jgIdCode), pDisplayRemainSeat: $j.trim(jpDisplayRemainSeat) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                var SeatInfo = $j("#step01_time #ulSeatSpace");

                if (jpGenreId == 15460) {
                    SeatInfo.html("<li>입장시간 : " + $j("#ulTime > li.on").attr("timeinfo") + "부터</li>");
                } else {
                    SeatInfo.html(data);
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석(지정) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "2_2", "#step01_time h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "2_2", "#step01_time h2");
        }
    });
}

function fax_GetTimeNoSeatClass(jpIdTime) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/TimeNoSeatClass.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pIdCode: $j.trim(jgIdCode), pMax: $j.trim(jgSeatSelectMax), pTimeLimitChk: $j.trim("ok") },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                var SeatInfo = $j("#step01_time #ulSeatSpace");

                SeatInfo.html(data);

                if (SeatInfo.find("select[id='selSeatClass']").length == 0 && $j("#ulTime > li.on").length == 1) {
                    fbk_Alert("선택하신 회차 " + $j("#ulTime > li.on").text() + "은 판매 매진 되었습니다.");
                    fdc_UlTimeInit();
                }

            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석(비지정) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "2_3", "#step01_time h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "2_3", "#step01_time h2");
        }
    });
}
function fax_GetTimeNoSeatClass_v2(jpIdTime, jpIdperf) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/TimeNoSeatClass.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pIdCode: $j.trim(jgIdCode), pMax: $j.trim(jgSeatSelectMax), pTimeLimitChk: $j.trim("ok"), pIdPerf: $j.trim(jpIdperf) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                var SeatInfo = $j("#step01_time #ulSeatSpace");

                SeatInfo.html(data);

                if (SeatInfo.find("select[id='selSeatClass']").length == 0 && $j("#ulTime > li.on").length == 1) {
                    fbk_Alert("선택하신 회차 " + $j("#ulTime > li.on").text() + "은 판매 매진 되었습니다.");
                    fdc_UlTimeInit();
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석(비지정) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "2_3", "#step01_time h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "2_3", "#step01_time h2");
        }
    });
}

function fax_GetTimeSeatFlashEnd(jpCntClass) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/TimeSeatFlashEnd.aspx",
        data: { pIdTime: $j.trim($j("#IdTime").val()), PCntClass: $j.trim(jpCntClass) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                var SeatInfo = $j("#step01_time #ulSeatSpace");

                SeatInfo.html(data);

                SeatInfo.find("select[id='selSeatClass']").prop("disabled", true);

                fdc_SeatButtonSwitch("show_seat2");

                $j("#StepCtrlBtn01 a").trigger("click");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석(선택정보) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "2_4", "#step01_time h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "2_4", "#step01_time h2");
        }
    });
}

function fax_GetTimeBlock(jpIdTime, jpIdHall, jpCardOpt) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/TimeFlashBlock.aspx",
        data: { pIdTime: $j.trim(jpIdTime) },
        dataType: "text",
        success: function (data, textStatus) {
            if (data != "") {
                var jvFrame = "";
                var jvSeatViewFile = "";

                if (jgSeatViewMode == jcHTML) jvSeatViewFile = "PerfSaleHtmlSeat.aspx";
                else jvSeatViewFile = "PerfSaleSeat.aspx";

                jvFrame += "<iframe name='ifrmSeatFrame' src='/Pages/Perf/Sale/" + jvSeatViewFile;
                jvFrame += "?idTime=" + jpIdTime;
                jvFrame += "&idHall=" + jpIdHall;
                jvFrame += "&block=" + data;
                jvFrame += "&stMax=" + jgSeatSelectMax;
                jvFrame += "&pHCardAppOpt=" + jpCardOpt;
                jvFrame += "' width=970 height=636 frameborder=0 marginheight=0 marginwidth=0 scrolling=no></iframe>";

                $j("#SeatFlashArea #divFlash").html(jvFrame);

                $j("#SeatFlashArea").css("display", "block");
                $j("#header").css("display", "none");
                $j("#ContentsArea").css("display", "none");
                $j("#StateBoard").css("display", "none");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석블럭(플래시) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetSeatChoiceInfo(jpIdTime, jpSeat) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/SeatChoiceInfo.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pIdSeat: $j.trim(jpSeat) },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#StateBoard #tk_seat").html(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석(선택정보2) 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            $j("#StateBoard #tk_seat").html("");
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetPromotionByClass(jpIdTime, jpCalSelDate, jpIdSeatClass, jpCardOpt) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PromotionByClass.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pSelDt: $j.trim(jpCalSelDate.replace(/-/g, "")), pSeat: $j.trim(jpIdSeatClass), pIdCode: $j.trim(jgIdCode), pHCardAppOpt: $j.trim(jpCardOpt) },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#divPromotionList").html(data);

            var joRdo = $j("#step03 div.disc_select").find("#spanPromotionSeat").find("input[name='rdoPromotionSeat']:checked");

            if (joRdo.length > 0) {
                var divSeat = $j("#divPromotionList").find("div[classbyte='" + joRdo.attr("classbyte") + "']");

                if (divSeat.length > 0) divSeat.css("display", "block");
                else {
                    var divFirst = $j("#divPromotionList").find("div:first");

                    divFirst.css("display", "block");
                    $j("#step03 div.disc_select").find("#spanPromotionSeat").find("input:radio[classbyte='" + divFirst.attr("classbyte") + "']").prop("checked", true);
                }
            }
            else {
                var divFirst = $j("#divPromotionList").find("div:first");

                divFirst.css("display", "block");
                $j("#step03 div.disc_select").find("#spanPromotionSeat").find("input:radio[classbyte='" + divFirst.attr("classbyte") + "']").prop("checked", true);
            }

            $j("#divPromotionList").find("select[id^='selPromotion']").each(function (index) {
                var joSel = $j(this);

                if (parseInt(joSel.find("option:selected").val()) > 0) {
                    joSel.trigger("change");
                }
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("좌석등급별 할인 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "3_1", "div.step03_promotion > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "3_1", "div.step03_promotion > h2");
        }
    });
}

function fax_GetUserCoupon(jpIdTime, jpTotalTicketPrice, jpTotalSelectSeatCnt, jpIdSeatClassPrice) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/Coupon.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pPayTot: $j.trim(jpTotalTicketPrice), pSeatCnt: $j.trim(jpTotalSelectSeatCnt), pSeatClassPrice: $j.trim(jpIdSeatClassPrice) },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#divCouponList").html(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("쿠폰 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "3_2", "div.step03_coupon > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "3_2", "div.step03_coupon > h2");
        }
    });
}

function fax_GetDeliveyMethod(jpIdTime, jpBaseDate) {
    var classString = "";
    $j("input[name='rdoPromotionSeat']").each(function (i, value) {
        classString += $j(value).val() + "|";
    });
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/DeliveryMethod.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pBaseDate: $j.trim(jpBaseDate), pIdPerf: $j.trim(jgIdPerf), pIdClass: classString },
        dataType: "html",
        success: function (data, textStatus) {
            var joDvry = $j("#step04").find("#deliveryPos");

            joDvry.html(data);

            var joEnbloc = joDvry.find("#EnblocDeliveryDate");

            if (joEnbloc.length > 0) {
                if (joEnbloc.val() != "") {
                    $j("#step04").find("span#enblocDate")
                        .css("display", "block")
                        .find("span").text(joEnbloc.val());
                }
            }

            var joAddr = $j("#step04_DeliveryInfo");
            joAddr.find("#btnRecentAddress").css("cursor", "pointer").unbind("click.Addr_Recent").bind("click.Addr_Recent", fdc_PopupRecentAddress);
            joAddr.find("#btnSearchAddress").css("cursor", "pointer").unbind("click.Addr_Search").bind("click.Addr_Search", fdc_PopupZipCode);

            if (joDvry.find("input[id^='rdoDelivery']").length > 0)
                joDvry.find("input[id^='rdoDelivery']:first").prop("checked", true).trigger("click");
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("수령방법 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "4_1", "#step04 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "4_1", "#step04 > h2");
        }
    });
}

function fax_GetOverseasDelivey(jpIdTime) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/OverseasDelivery.aspx",
        data: { pIdTime: $j.trim(jpIdTime) },
        dataType: "html",
        success: function (data, textStatus) {
            var joDvry = $j("#step04").find("#selOverseasDeliveryArea");
            joDvry.html(data);
            joDvry.trigger("change");
            $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 350, 'height': 250, 'url': '/Pages/Perf/Sale/Popup/OverseasDelivery.aspx', 'title': '해외배송안내' });
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("해외배송 정보 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "4_1", "#step04 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "4_1", "#step04 > h2");
        }
    });
}

function fax_GetOverseasCountry(jpCountryCode) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/OverseasCountry.aspx",
        data: { pCountryCode: $j.trim(jpCountryCode) },
        dataType: "html",
        success: function (data, textStatus) {
            var joDvry = $j("#step04").find("#selOverseasDeliveryCountry");

            joDvry.html(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("해외배송 국가 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "4_1", "#step04 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "4_1", "#step04 > h2");
        }
    });
}

function fax_GetDeliveyUserInfo() {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/DeliveryUserInfo.aspx",
        data: {},
        dataType: "html",
        success: function (data, textStatus) {
            var joUser = $j("#divDeliveryUserInfo");

            joUser.html(data);

            var joOrd = $j("#step04_OrdererInfo");

            joOrd.find("#ordererUserName").val(fdc_CtrlVal(joUser.find("#LUAddr_UserName")));
            joOrd.find("#ordererMobile1").val(fdc_CtrlVal(joUser.find("#LUAddr_Mobile1")));
            joOrd.find("#ordererMobile2").val(fdc_CtrlVal(joUser.find("#LUAddr_Mobile2")));
            joOrd.find("#ordererMobile3").val(fdc_CtrlVal(joUser.find("#LUAddr_Mobile3")));
            joOrd.find("#ordererMailH").val(fdc_CtrlVal(joUser.find("#LUAddr_MailH")));
            joOrd.find("#ordererMailD").val(fdc_CtrlVal(joUser.find("#LUAddr_MailD")));

            $j("#step04 input[id^='deliveryInfoType']").filter("[value='0']").prop("checked", true).trigger("click");
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("수령방법 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "4_2", "#step04 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "4_2", "#step04 > h2");
        }
    });
}

function fax_GetYesPays(jpPayType) {
    var joBase = $j("#baseYesPays");

    if (jpPayType == jcPAYTYPE_ALL) joBase.find("div[id^='base']").html("");
    else if (jpPayType == jcPAYTYPE_YESMONEY) joBase.find("#baseYesMoney").html("");
    else if (jpPayType == jcPAYTYPE_YESPOINT) joBase.find("#baseYesPoint").html("");
    else if (jpPayType == jcPAYTYPE_YESDEPOSIT) joBase.find("#baseYesDeposit").html("");
    else if (jpPayType == jcPAYTYPE_YESGIFT) joBase.find("#baseYesGift").html("");

    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/YesPays.aspx",
        data: { pPayType: $j.trim(jpPayType) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                var jvGUID = jsf_def_GUID();
                var joTemp = $j("<div id='" + jvGUID + "' style='display:none;'>" + data + "</div>").appendTo(document.body);

                joTemp.find("div.yes").each(function (idx) {
                    var keyName = $j(this).attr("keyname").replace("rcv", "");
                    $j("#base" + keyName).html($j(this).html());
                });

                joTemp.remove();
            }

            fdc_YesPaysBaseSetting(jpPayType);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("YES 결제수단" + (jpPayType == jcPAYTYPE_ALL ? "" : jpPayType) + " 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "5_" + (jpPayType == jcPAYTYPE_ALL ? 1 : jpPayType), "#step05 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "5_" + (jpPayType == jcPAYTYPE_ALL ? 1 : jpPayType), "#step05 > h2");
        }
    });
}

function fax_GetGiftTicketCount(jpIdTime) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/GiftTicketCount.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pIdPerf: $j.trim(jgIdPerf) },
        dataType: "text",
        success: function (data, textStatus) {
            $j("#liGiftTicket").find("#lblGiftTicketUsable").text(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("사용가능한 예매권 수량 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "5_5", "#step05 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "5_5", "#step05 > h2");
        }
    });
}

function fax_GetEtcFee(jpIdTime, jpSeatCnt, jpFreeCountOfCoupon, jpFreeCountOfGiftTicket) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/EtcFee.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pSeatCnt: $j.trim(jpSeatCnt), pFreeCountOfCoupon: $j.trim(jpFreeCountOfCoupon), pFreeCountOfGiftTicket: $j.trim(jpFreeCountOfGiftTicket) },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#divBookingFee").html(data);

            fdc_UptPriceBoard();
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("예매수수료 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "5_6", "#step05 > h2");
            $j("#divBookingFee").attr("bkinloading", "1");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "5_6", "#step05 > h2");
            $j("#divBookingFee").attr("bkinloading", "");
        }
    });
}

function fax_GetCancelFeePolicy(jpIdTime) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/CancelFeePolicy.aspx",
        data: { pIdTime: $j.trim(jpIdTime) },
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                $j("#step05").find("#lblCancelTimeInfo").text(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetPayMethod(jpIdTime, jpBaseDate, jpIsMPoint) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/PayMethod.aspx",
        data: { pIdTime: $j.trim(jpIdTime), pBaseDate: $j.trim(jpBaseDate), pIsMPoint: $j.trim(jpIsMPoint) },
        dataType: "html",
        success: function (data, textStatus) {
            var joCtrl = $j("#step05").find("#paymethodPos");

            joCtrl.html(data);

            if (joCtrl.find("li").length > 0) {
                var joCardCtrl = joCtrl.find("li[idcode='" + jcPAY_CARD + "']:first");
                var joBankCtrl = joCtrl.find("li[idcode='" + jcPAY_VBANK + "']:first");

                if (joCardCtrl.length > 0) joCardCtrl.append(" <a class='dcursor' onclick='fdc_PopupInstallment();' style='display:none;'><img src='" + jgIMGFILESVR + "/img/perfsale/btn_infor01.gif' alt='무이자할부안내' /></a>");

                if (jgIdPerf == "25609" || jgIdPerf == "25520" || jgIdPerf == "27165" || jgIdPerf == "27453" || jgIdPerf == "27563" || jgIdPerf == "27573" || jgIdPerf == "28868" || jgIdPerf == "30742") {
                    if (joCardCtrl.length > 0) joCardCtrl.append("<input id='chkMpointAgree'  onclick='jsf_MpointNotice(this)' type='checkbox'><label>M포인트 사용하기</label>");
                }
                if (joBankCtrl.length > 0) {
                    var jvSelBank = "";

                    jvSelBank += " <select id='selBank' disabled='disabled'>";
                    jvSelBank += $j("#hiddenBankOptions").val();
                    jvSelBank += "</select>";

                    joBankCtrl.append(jvSelBank);
                    //joBankCtrl.append("<a id='imgCashReceipt' class='dcursor' onclick='fdc_PopupCashReceiptSet();' disabled='disabled'><img src='" + jgIMGFILESVR + "/img/perfsale/btn_infor02.gif' alt='현금영수증발행신청' /></a>");
                    joBankCtrl.append("<a id='imgCashReceipt' class='dcursor' onclick='fdc_PopupCashReceiptInfo();' disabled='disabled'><img src='" + jgIMGFILESVR + "/img/perfsale/btn_infor04.gif' alt='현금영수증발행안내' /></a>");
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("결제방법 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
            fax_AjaxLoader(jcAJAX_BEFORESEND, "5_7", "#step05 > h2");
        },
        complete: function (xhr, textStatus) {
            fax_AjaxLoader(jcAJAX_COMPLETE, "5_7", "#step05 > h2");
        }
    });
}

function fax_GetBankAccountInfo(jpIdOrder, jpCustomerOrderID, jpCardReceiptTag) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/BankAccountInfo.aspx",
        data: { pIdOrder: $j.trim(jpIdOrder) },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#divVBankInfo").html(data);

            fts_DisplaySaleSuccess(jpIdOrder, jpCustomerOrderID, jpCardReceiptTag);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("계좌정보 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetYespointInfo(jpIdOrder) {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/YesPointinfo.aspx",
        data: { pIdOrder: $j.trim(jpIdOrder) },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#divYespointInfo").html(data);

            if (jgIsYesPointYN == "Y") { //예스포인트 적립유무
                var joYesPoint = $j("#divYespointInfo");
                var SuccPay = $j("#SuccessBoard #SuccPay");

                if (joYesPoint.find("input[id^='HYesPointinfo']").length == 1) {
                    SuccPay.find(".total_p").css("display", "block");
                    SuccPay.find(".total_p").find("span").find("strong").text(joYesPoint.find("#HYesPointinfo").val());
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("포인트 정보 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetInicisPayInfo() {    
    $j.ajax({
        async: false,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/InicisPayInfo.aspx",
        data: { pIdPerf: $j.trim(jgIdPerf), pPrice: fdc_Odr_PayMoney(), pHCardAppOpt: $j.trim(jgIsHcardOpt), pIsMPoint: $j.trim(jgIsMPoint), pIdTime: $j.trim($j("#IdTime").val()), pIsKaKao: $j.trim(jgIsKaKao), pPromotion: fdc_Odr_Promotions() },
        dataType: "html",
        success: function (data, textStatus) {
            $j("#divInicisPayinfo").html(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("이니시스 결제 정보 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}

function fax_GetRefundBank() {
    $j.ajax({
        async: true,
        type: "POST",
        url: "/Pages/Perf/Sale/Ajax/Perf/RefundBank.aspx",                
        dataType: "html",
        success: function (data, textStatus) {
            if (data != "") {
                $j("#selLiveRefundBank").html(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            fbk_axAlert("환불은행 조회 에러입니다.");
        },
        beforeSend: function (xhr, settings) {
        },
        complete: function (xhr, textStatus) {
        }
    });
}