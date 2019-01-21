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
    url: "/index/timeseatflashend",
    data: { pIdTime: $j.trim($j("#IdTime").val()), PCntClass: $j.trim(jpCntClass) },
    dataType: "html",
    success: function (data, textStatus) {
      if (data != "") {
        var SeatInfo = $j("#step01_time #ulSeatSpace");

        SeatInfo.html(data);

        SeatInfo.find("select[id='selSeatClass']").prop("disabled", true);

        fdc_SeatButtonSwitch("show_seat2");

        ///////////////////todo
        return;
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


function fdc_fmtNumber(jpStr) {
  var jvNegative = (parseInt(jpStr) < 0 ? true : false);
  var jvRet = "";

  jpStr = "" + (parseInt(jpStr) < 0 ? -1 * parseInt(jpStr) : parseInt(jpStr));
  for (i = 0; i < jpStr.length; i++) {
    if (i > 0 && (i % 3) == 0) jvRet = jpStr.charAt(jpStr.length - i - 1) + "," + jvRet;
    else jvRet = jpStr.charAt(jpStr.length - i - 1) + jvRet;
  }

  return (jvNegative ? "-" : "") + jvRet;
}

function fdc_ShowProcessTitleBar(jpStep) {
  if (jpStep != 6) {
    $j("#header ul.gnb")
    .find("li").each(function (i) { if (i != jpStep - 1) $j(this).removeClass("on"); }).end()
    .find("li").each(function (i) { if (i == jpStep - 1 && $j(this).hasClass("on") == false) $j(this).addClass("on"); });
  } else {
    $j("#header").css("display", "none");
  }
}

function fdc_ShowStepCtrlButton(jpStep) {
  $j("#StateBoard #StepCtrlBtnPanel")
  .find("div[id^='StepCtrlBtn0']").css("display", "none").end()
  .find("div[id='StepCtrlBtn0" + jpStep + "']").css("display", "block");
}

function fdc_GoPrevStep(jpStep) {
  if (jpStep == jcSTEP1) {

    $j("#liYesMoney").show();
    $j("#liYesPoint").show();
    $j("#liYesDeposit").show();
    $j("#liYesGift").show();
    $j("#liGiftTicket").show();
    $j("#liBenepiaPoint").show();

    var jvTimeOption = parseInt($j("#ulTime > li.on").attr("timeoption"));

    if (jvTimeOption == jcSEAT) {
      $j("#SeatFlashArea").css("display", "block");
      $j("#header").css("display", "none");
      $j("#ContentsArea").css("display", "none");
      $j("#StateBoard").css("display", "none");

      $j("#step01").css("display", "block");
      $j("#step03").css("display", "none");
      $j("#step04").css("display", "none");
      $j("#step05").css("display", "none");
      fdc_ShowProcessTitleBar(1);
      fdc_ShowStepCtrlButton(1);
    } else if (jvTimeOption == jcNOSEAT) {
      $j("#step01").css("display", "block");
      $j("#step03").css("display", "none");
      $j("#step04").css("display", "none");
      $j("#step05").css("display", "none");
      fdc_ShowProcessTitleBar(1);
      fdc_ShowStepCtrlButton(1);
    }
  } else if (jpStep == jcSTEP3) {
    $j("#step01").css("display", "none");
    $j("#step03").css("display", "block");
    $j("#step04").css("display", "none");
    $j("#step05").css("display", "none");
    fdc_ShowProcessTitleBar(3);
    fdc_ShowStepCtrlButton(3);
  } else if (jpStep == jcSTEP4) {
    $j("#step01").css("display", "none");
    $j("#step03").css("display", "none");
    $j("#step04").css("display", "block");
    $j("#step05").css("display", "none");
    fdc_ShowProcessTitleBar(4);
    fdc_ShowStepCtrlButton(4);
  }
}

function fdc_PopupCouponRegister() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 500, 'height': 205, 'url': '/Pages/Perf/Sale/Popup/CouponRegister.aspx', 'title': '할인쿠폰 등록' });
}

function fdc_PopupCouponRegisterEnd() {
  fdc_CtrlStep(jcSTEP3_3);
}

function fdc_PopupSaleAgree(idPerf) {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 452, 'height': 420, 'url': '/Pages/Perf/Sale/Popup/SaleAgree.aspx?IdPerf='+idPerf, 'title': '제 3자 정보제공' });
}


function fdc_PopupZipCode() {
  var joDvry = $j("#step04_DeliveryInfo");
  if (joDvry.find("#deliveryInfoType2").length > 0) {
    if (joDvry.find("#deliveryInfoType2").prop("checked") == false) joDvry.find("#deliveryInfoType2").prop("checked", true).trigger("click");
  }

  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 430, 'height': 580, 'url': '/Pages/Perf/Sale/Popup/ZipBuild.aspx', 'title': '우편번호 검색' });
}

function fdc_PopupZipCodeEnd(jpZCode1, jpAddr1) {
  var jo = $j("#step04_DeliveryInfo");

  jo.find("#deliveryZipCode1").val(jpZCode1);
  jo.find("#deliveryAddress1").val(jpAddr1);
}

//function fdc_PopupZipCode() {
//    var joDvry = $j("#step04_DeliveryInfo");
//    if (joDvry.find("#deliveryInfoType2").length > 0) {
//        if (joDvry.find("#deliveryInfoType2").prop("checked") == false) joDvry.find("#deliveryInfoType2").prop("checked", true).trigger("click");
//    }

//    $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 420, 'height': 317, 'url': '/Pages/Perf/Sale/Popup/ZipCode.aspx', 'title': '우편번호 검색' });
//}


//function fdc_PopupZipCodeEnd(jpZCode1, jpZCode2, jpAddr1) {
//    var jo = $j("#step04_DeliveryInfo");

//    jo.find("#deliveryZipCode1").val(jpZCode1);
//    jo.find("#deliveryZipCode2").val(jpZCode2);
//    jo.find("#deliveryAddress1").val(jpAddr1);
//}

function fdc_PopupRecentAddress() {
  var joDvry = $j("#step04_DeliveryInfo");
  if (joDvry.find("#deliveryInfoType1").length > 0) joDvry.find("#deliveryInfoType1").prop("checked", true).trigger("click");

  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 550, 'height': 278, 'url': '/Pages/Perf/Sale/Popup/RecentDeliveryAddress.aspx', 'title': '최근 배송지' });
}

function fdc_PopupRecentAddressEnd(jpName, jpHp1, jpHp2, jpHp3, jpZCode1, jpAddr1, jpAddr2) {
  var jo = $j("#step04_DeliveryInfo");

  jo.find("#deliveryUserName").val(jpName);
  jo.find("#deliveryZipCode1").val(jpZCode1);
  jo.find("#deliveryAddress1").val(jpAddr1);
  jo.find("#deliveryAddress2").val(jpAddr2);
  fdc_CheckZipCodeLength();
}

function fdc_PopupExchangePoint() {
  var joBase = $j("#baseYesPoint");
  var joCtrl = joBase.find("#rcvYesPoint");

  if (joCtrl.length > 0) {
    if (parseInt(joCtrl.val()) > 0)
      $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 380, 'height': 318, 'url': '/Pages/Perf/Sale/Popup/ExchangePoint.aspx', 'title': 'YES포인트 → YES머니 환전하기' });
    else
      fbk_Alert("환전하실 포인트가 없습니다.");
  } else fbk_Alert("환전하실 포인트가 없습니다.");
}

function fdc_PopupExchangePointParam(jpParam) {
  var joCtrl = $j("#baseYesPoint").find("#rcvYesPoint");

  if (joCtrl.length > 0) {
    jpParam.yespoint = (parseInt(joCtrl.val()) > 0 ? parseInt(joCtrl.val()) : 0);
  } else jpParam.yespoint = 0;

  joCtrl = $j("#baseYesMoney").find("#rcvYesMoney");

  if (joCtrl.length > 0) {
    jpParam.yesmoney = (parseInt(joCtrl.val()) > 0 ? parseInt(joCtrl.val()) : 0);
  } else jpParam.yesmoney = 0;
}

function fdc_PopupExchangePointEnd() {
  fax_GetYesPays(jcPAYTYPE_YESMONEY);
  fax_GetYesPays(jcPAYTYPE_YESPOINT);
}

function fdc_PopupYesGiftUse() {

  if (fdc_CheckEtcFeeInLoading())
    return false;

  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 500, 'height': 338, 'url': '/Pages/Perf/Sale/Popup/YesGiftUse.aspx', 'title': 'YES상품권 사용' });
}

function fdc_PopupYesGiftUseParam(jpParam) {
  jpParam.odrpaymoney = fdc_Odr_PayMoney() + fdc_CALC_YesGiftPrice();

  var joCtrl = $j("#liYesGift").find("#txtYesGift");

  if (joCtrl.length > 0) {
    jpParam.usedgiftinfo = joCtrl.attr("usedgiftinfo");
  } else jpParam.usedgiftinfo = "";
}

function fdc_PopupYesGiftUseEnd(jpUsedAmount, jpUsedGiftInfo) {
  var joTarget = $j("#liYesGift");

  joTarget.find("#txtYesGift").val(fdc_fmtNumber(jpUsedAmount)).attr("usedgiftinfo", jpUsedGiftInfo).trigger("change");
}

function fdc_PopupGiftiShow() {
  window.open('https://www.yes24.com/Exchange/GiftiShow/ExchangeGiftiShow.aspx?reqsrc=ent', '_gifti', 'toolbars=no, scrollbars=no, width=400, height=330');
}

function f_GetGiftyshowVal(obj) {
  fax_GetYesPays(jcPAYTYPE_YESGIFT);
}

function fdc_PopupBenepiaPoint() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 365, 'height': 203, 'url': '/Pages/Perf/Sale/Popup/BenepiaPoint.aspx', 'title': '베네피아 포인트' });
}

function fdc_PopupBenepiaPointParam(jpParam) {
  jpParam.odrpaymoney = fdc_Odr_PayMoney() + fdc_CALC_BenepiaPoint();
}

function fdc_PopupBenepiaPointEnd(jpUsedPoint, jpUsedBenepiaInfo) {
  var joTarget = $j("#liBenepiaPoint");

  joTarget.find("#txtBenepiaPoint").val(fdc_fmtNumber(jpUsedPoint)).attr("usedbenepiainfo", jpUsedBenepiaInfo);

  fdc_CtrlStep(jcSTEP5_6);
}

function fdc_PopupGiftTicketRegUse() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 500, 'height': 325, 'url': '/Pages/Perf/Sale/Popup/GiftTicketRegUse.aspx', 'title': '공연예매권 등록/사용' });
}

function fdc_PopupGiftTicketRegUseParam(jpParam) {
  var jvkeylist = "";

  $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").each(function (i) {
    jvkeylist += $j(this).attr("GT_No") + "#";
  });

  jpParam.idperf = jgIdPerf;
  jpParam.idtime = $j("#IdTime").val();
  jpParam.usedkeylist = jvkeylist;
}

function fdc_PopupGiftTicketRegUseEnd(jpGTUsedInfo, jpGTUsedView) {
  $j("#divGiftTicketUsedInfo").html(jpGTUsedInfo);
  $j("#divGiftTicketUsedView").html(jpGTUsedView);
  $j("#divGiftTicketUsedView").show();
  fax_GetGiftTicketCount($j("#IdTime").val());
  fdc_GetEtcFees();

  fdc_CtrlStep(jcSTEP5_5);
}

function fdc_PopupInstallment() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 300, 'height': 350, 'url': '/Pages/Popup/Perf/Installment.aspx', 'title': '무이자 할부 안내' });
}

function fdc_PopupCashReceiptSet() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 500, 'height': 302, 'url': '/Pages/Perf/Sale/Popup/CashReceiptSet.aspx', 'title': '현금영수증 발행 신청' });
}

function fdc_PopupCashReceiptInfo() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 350, 'height': 282, 'url': '/Pages/Perf/Sale/Popup/CashReceiptInfo.aspx', 'title': '현금영수증 발행 안내' });
}

function fdc_PopupCashReceiptSetParam(jpParam) {
  jpParam.receipt = $j("#hiddenReceiptInfo").attr("receipt");
  jpParam.receiptno = $j("#hiddenReceiptInfo").attr("receiptno");
}

function fdc_PopupCashReceiptSetEnd(jpReceipt, jpReceiptNo) {
  $j("#hiddenReceiptInfo").attr("receipt", jpReceipt);
  $j("#hiddenReceiptInfo").attr("receiptno", jpReceiptNo);
}

function fdc_CalDateClick(jpSelDate) {
  if (jgCalSelDate != "")
    $j("#step01_date #calendar").find("a[title=" + jgCalSelDate + "]").parent().removeClass("term").addClass("select");

  $j("#step01_date #calendar").find("a[title=" + jpSelDate + "]").parent().removeClass("select").addClass("term");

  jgCalSelDate = jpSelDate;

  if ($j("#SeatFlashArea").css("display") == "none") {
    $j("#SeatFlashArea #selFlashDateAll").val(jpSelDate);
  }

  fdc_CtrlStep(jcSTEP1_3);
}

function fdc_UlTimeInit() {
  var jvTimeVal = "0";

  if ($j("#IdTime").val() != jvTimeVal && jvTimeVal != "") {
    $j("#ulTime > li").removeClass("on").filter("[value='" + jvTimeVal + "']").addClass("on");

    $j("#IdTime").val(jvTimeVal);
    $j("#selFlashTime").val(jvTimeVal);

    fdc_CtrlStep(jcSTEP1_4_1);
  }
}

function fdc_UlTimeClick() {
  var jvTimeVal = $j(this).attr("value");

  if ($j("#IdTime").val() != jvTimeVal && jvTimeVal != "") {
    $j("#ulTime > li").removeClass("on").filter("[value='" + jvTimeVal + "']").addClass("on");

    $j("#IdTime").val(jvTimeVal);
    $j("#selFlashTime").val(jvTimeVal);

    jgSeatViewMode = parseInt($j("#ulTime > li.on").attr("seatviewmode"));

    fdc_CtrlStep(jcSTEP1_4_1);
  }
}

function fdc_SeatButtonSwitch(jpType) {
  if (jpType == "hide_seat")
    $j("#step01_time #btnSeatSelect").css("display", "none").attr({ "src": jgIMGFILESVR + "/img/perfsale/btn_seat.gif", "alt": "좌석선택" });
  else if (jpType == "show_seat")
    $j("#step01_time #btnSeatSelect").css("display", "block").attr({ "src": jgIMGFILESVR + "/img/perfsale/btn_seat.gif", "alt": "좌석선택" });
  else if (jpType == "show_seat2")
    $j("#step01_time #btnSeatSelect").css("display", "block").attr({ "src": jgIMGFILESVR + "/img/perfsale/btn_reseat.gif", "alt": "좌석선택" });
  else if (jpType == "show_reseat")
    $j("#step01_time #btnSeatSelect").css("display", "block").attr({ "src": jgIMGFILESVR + "/img/perfsale/btn_reseat.gif", "alt": "좌석다시선택" });
}

function fdc_ChoiceSeat() {
  if ($j("#IdTime").val() == "" || $j("#IdTime").val() == "0" || $j("#ulTime > li.on").length == 0) {
    fbk_Alert("공연회차를 선택하세요.");
    return false;
  }

  var jvTimeOption = parseInt($j("#ulTime > li.on").attr("timeoption"));
  var jvBtnText = $j("#step01_time #btnSeatSelect").attr("alt");

  if (jvTimeOption == jcSEAT) {
    fdc_FlashSeatLoad();
  } else if (jvTimeOption == jcNOSEAT) {
    if (jvBtnText == "좌석선택") {
    } else if (jvBtnText == "좌석다시선택")
      fdc_NoSeatSelectReset();
  }
}

function fdc_FlashSeatLoad() {
  if ($j("#IdTime").val() == "" || $j("#IdTime").val() == "0" || $j("#ulTime > li.on").length == 0)
    fbk_Alert("공연회차를 선택하세요.");
  else
    fdc_CtrlStep(jcSTEP_SEAT);
}

function fdc_FlashSeatUnload() {
  $j("#SeatFlashArea").css("display", "none");
  $j("#header").css("display", "block");
  $j("#ContentsArea").css("display", "block");
  $j("#StateBoard").css("display", "block");

  //$j("#SeatFlashArea #divFlash").html("");
}

function fdc_selFlashDateAllChange(jpSelDate) {
  if (jpSelDate.length == 10) {
    $j("#SeatFlashArea #divFlash").html("");

    fdc_CtrlStep(jcSTEP1);
    fdc_CalDateClick(jpSelDate);
  } else {
    $j("#selFlashTime option").remove();
    $j("#selFlashTime").html("<option value='0'>항목없음</option>");

    $j("#SeatFlashArea #divFlash").html("");
  }
}

function fdc_SelFlashTimeChange(jpIdTime) {
  if ($j("#selFlashTime").prop("selectedIndex") != 0) {
    if (parseInt($j("#selFlashTime option:selected").attr("timeoption")) == jcNOSEAT) {
      fbk_Alert("해당 회차는 좌석 비지정으로 좌석정보를 지정하실 수 없습니다.");

      $j("#selFlashTime").prop("selectedIndex", "0");
      $j("#SeatFlashArea #divFlash").html("");
    } else {
      $j("#ulTime > li[value='" + jpIdTime + "']").trigger("click");

      jgSeatViewMode = parseInt($j("#selFlashTime option:selected").attr("seatviewmode"));

      fax_GetTimeBlock(jpIdTime, $j("#selFlashTime option:selected").attr("idhall"), jgIsHcardOpt);
    }
  } else {
    $j("#ulTime > li[value='" + jpIdTime + "']").trigger("click");
    $j("#SeatFlashArea #divFlash").html("");
  }
}

function fdc_FlashSeatChoiceEnd(jpSelSeat) {
  $j("#SeatFlashArea").css("display", "none");
  $j("#header").css("display", "block");
  $j("#ContentsArea").css("display", "block");
  $j("#StateBoard").css("display", "block");

  if (jpSelSeat == "" || jpSelSeat.indexOf('@') <= 0) {
    fbk_Alert("선택된 좌석정보가 없습니다.");
    return false;
  }

  var jvSeatParts = jpSelSeat.split('@');
  var jvSeatKeyArr = jvSeatParts[0].split(',');
  var jvSeatClassNameArr = jvSeatParts[1].split(',');
  var jvSeatKeys = jvSeatParts[0].replace(/,/g, "-");
  var jvSeatClassNames = jvSeatParts[1].replace(/,/g, "-");

  if (jvSeatKeys != "" && jvSeatClassNames != "" && jvSeatKeyArr.length == jvSeatClassNameArr.length) {
    $j("#IdSeat").val(jvSeatKeys);
    fax_GetTimeSeatFlashEnd(jvSeatClassNames);
  }
}

function fdc_NoSeatSelectReset() {
  var SeatInfo = $j("#step01_time #ulSeatSpace");

  if (SeatInfo.find("select[id='selSeatClass']").length > 0)
    SeatInfo.find("select[id='selSeatClass']").prop("disabled", false).prop("selectedIndex", "0");

  fdc_CtrlStep(jcSTEP1_4_2);
}

function fdc_VerifySelSeatNumber() {
  if (jgCalSelDate == "") {
    fbk_Alert("공연일자를 선택하세요.");
    return false;
  }

  if ($j("#IdTime").val() == "" || $j("#IdTime").val() == "0" || $j("#ulTime > li.on").length == 0) {
    fbk_Alert("공연회차를 선택하세요.");
    return false;
  }

  var SeatInfo = $j("#step01_time #ulSeatSpace");
  if (SeatInfo.find("select[id='selSeatClass']").length == 0) {
    var jvTimeOption = parseInt($j("#ulTime > li.on").attr("timeoption"));

    if (jvTimeOption == jcSEAT) {
      fdc_FlashSeatLoad();
      return false;
    } else if (jvTimeOption == jcNOSEAT) {
      fbk_Alert("좌석이 지정되지 않았습니다");
      return false;
    }
  }

  var jvIdSeatClass = "";
  var jvIdSeatClassPrice = "";
  var jvSeatChoiceCount = 0;

  SeatInfo.find("div").each(function (i) {
    var selCtrl = $j(this).find("select[id='selSeatClass'] option:selected");

    if (parseInt(selCtrl.val()) > 0) {
      jvSeatChoiceCount += parseInt(selCtrl.val());
      jvIdSeatClass += $j(this).attr("classbyte") + "-" + selCtrl.val() + ",";
      jvIdSeatClassPrice += $j(this).attr("classbyte") + "-" + selCtrl.val() + "-" + $j(this).find("select[id='selSeatClass']").attr("price") + ",";
    }
  });


  if (jvSeatChoiceCount == 0) {
    fbk_Alert("좌석매수를 선택하세요.");
    return false;
  } else if (jvSeatChoiceCount > jgSeatSelectMax) {
    if (jgIdPerf == 24815 || jgIdPerf == 26417 || jgIdPerf == 27418 || jgIdPerf == 27419 || jgIdPerf == 29102 || jgIdPerf == 30400) {
      fbk_Alert("기념 티셔츠는 1개만 선택 가능합니다.(참가비 결제 후 사이즈 변경 불가)");
    }
    else {
      fbk_Alert("선택한 좌석수는 " + jgSeatSelectMax + "좌석을 초과하실 수 없습니다.<br />좌석수를 다시 선택해 주시기 바랍니다.");
    }
    return false;
  }

  var selTimeCtrl = $j("#ulTime > li.on");
  var jvLimitCusSaleCnt = selTimeCtrl.attr("limitcussalecnt");
  var jvLimitTimeSaleCnt = selTimeCtrl.attr("limittimesalecnt");

  if (jvSeatChoiceCount > jvLimitCusSaleCnt) {
    if (jvLimitCusSaleCnt == jvLimitTimeSaleCnt) {
      fbk_Alert("예매 가능한 매수가 초과 되었습니다.<br />예매중인 해당 회차는 " + jvLimitTimeSaleCnt + "매까지 예매가 가능합니다.");
      return false;
    } else {
      var jvCusBookingCnt = jvLimitTimeSaleCnt - jvLimitCusSaleCnt;
      fbk_Alert("고객님은 기존 " + jvCusBookingCnt + "매의 예매분이 있어 " + jvLimitCusSaleCnt + "매까지 예매하실 수 있습니다.<br />예매중인 해당 회차는 " + jvLimitTimeSaleCnt + "매까지 예매가 가능합니다.");
      return false;
    }
  }

  if (jgIdPerf == '23901' || jgIdPerf == '23933' || jgIdPerf == '12362' || jgIdPerf == '15206' || jgIdPerf == '21088' || jgIdPerf == '26977') {
    if (jvSeatChoiceCount + jgCampingCount > jgValleyCount) {
      fbk_Alert("캠핑권 매수는 3일권 매수(" + jgValleyCount + "매)를 초과할 수 없습니다.");
      return false;
    }
  }

  if (jgIdPerf == '23890' || jgIdPerf == '23934' || jgIdPerf == '26978') {
    if (jvSeatChoiceCount + jgJisanTotalCount > jgCampingCount) {
      fbk_Alert("패키지는 캠핑권 매수(" + jgCampingCount + "매)를 초과할 수 없습니다.");
      return false;
    }
  }

  if (jgIdPerf == '17491' || jgIdPerf == '17492') {
    if (jvSeatChoiceCount + jgCampingCount > jgValleyCount) {
      fbk_Alert("캠핑권 매수는 양일권 매수(" + jgValleyCount + "매)를 초과할 수 없습니다.");
      return false;
    }
  }

  if (jgIdPerf == '20344') {
    if (jvSeatChoiceCount + jgCampingCount > jgValleyCount) {
      fbk_Alert("캠핑권 매수는 2일권 매수(" + jgValleyCount + "매)를 초과할 수 없습니다.");
      return false;
    }
  }

  if (jgIdPerf == '26429') {
    if (jvSeatChoiceCount + jgCampingCount > jgValleyCount) {
      fbk_Alert("캠핑권은 아이디당 1매만 예매가능합니다.");
      return false;
    }
  }

  if (jgIdPerf == '15187' || jgIdPerf == '15200') {
    var jvCseat_cnt1 = 0;
    var jvCseat_cnt2 = 0;
    var jvCseat_cnt3 = 0;

    SeatInfo.find("div").each(function (i) {
      var selCtrl = $j(this).find("select[id='selSeatClass'] option:selected");
      var txtCtrl = $j(this).find("strong.c_name");

      if (parseInt(selCtrl.val()) > 0) {
        if (txtCtrl.text() == "캠핑권(금토)") {
          jvCseat_cnt1 = parseInt(selCtrl.val());
        }

        if (txtCtrl.text() == "캠핑권(토일)") {
          jvCseat_cnt3 = parseInt(selCtrl.val());
        }

        if (txtCtrl.text() == "캠핑권") {
          jvCseat_cnt2 = parseInt(selCtrl.val());
        }
      }
    });

    if (jvCseat_cnt1 > 0) {
      if (jvCseat_cnt1 + jgCampConcertCnt > jgclassCount_1) {
        fbk_Alert("캠핑권(금토) 매수(" + jgclassCount_1 + "매)를 초과할 수 없습니다.");
        return false;
      }
    }

    if (jvCseat_cnt2 > 0) {
      if (jvCseat_cnt2 + jgCampingCount > jgclassCount_2) {
        fbk_Alert("캠핑권 매수(" + jgclassCount_2 + "매)를 초과할 수 없습니다.");
        return false;
      }
    }

    if (jvCseat_cnt3 > 0) {
      if (jvCseat_cnt3 + jgCampConcertCnt2 > jgclassCount_3) {
        fbk_Alert("캠핑권(토일) 매수(" + jgclassCount_3 + "매)를 초과할 수 없습니다.");
        return false;
      }
    }

  }

  if (jgIdPerf == '15201' || jgIdPerf == '15204') {
    var jvCseat_cnt1 = 0;
    var jvCseat_cnt2 = 0;
    var jvCseat_cnt3 = 0;

    SeatInfo.find("div").each(function (i) {
      var selCtrl = $j(this).find("select[id='selSeatClass'] option:selected");
      var txtCtrl = $j(this).find("strong.c_name");

      if (parseInt(selCtrl.val()) > 0) {
        if (txtCtrl.text() == "텐트렌탈패키지(금토)") {
          jvCseat_cnt1 = parseInt(selCtrl.val());
        }

        if (txtCtrl.text() == "텐트렌탈패키지(토일)") {
          jvCseat_cnt3 = parseInt(selCtrl.val());
        }

        if (txtCtrl.text() == "텐트렌탈패키지") {
          jvCseat_cnt2 = parseInt(selCtrl.val());
        }
      }
    });

    if (jvCseat_cnt1 > 0) {
      if (jvCseat_cnt1 + jgCampConcertCnt > jgclassCount_1) {
        fbk_Alert("텐트렌탈패키지(금토) 매수(" + jgclassCount_1 + "매)를 초과할 수 없습니다.");
        return false;
      }
    }

    if (jvCseat_cnt2 > 0) {
      if (jvCseat_cnt2 + jgCampingCount > jgclassCount_2) {
        fbk_Alert("텐트렌탈패키지 매수(" + jgclassCount_2 + "매)를 초과할 수 없습니다.");
        return false;
      }
    }

    if (jvCseat_cnt3 > 0) {
      if (jvCseat_cnt3 + jgCampConcertCnt2 > jgclassCount_3) {
        fbk_Alert("텐트렌탈패키지(토일) 매수(" + jgclassCount_3 + "매)를 초과할 수 없습니다.");
        return false;
      }
    }

  }



  if (jgIdPerf == '9960' || jgIdPerf == '9965' || jgIdPerf == '-1') {
    if (jvSeatChoiceCount + jgCampingCount > jgValleyCount) {
      fbk_Alert("캠핑권 매수는 2일권 및 3일권 매수(" + valleyCnt + "매)를 초과할 수 없습니다.");
      return false;
    }
  }

  if (jgIdPerf == '9431' || jgIdPerf == '9737' || jgIdPerf == '9840' || jgIdPerf == '9934' || jgIdPerf == '10003' || jgIdPerf == '10018') {
    if (jgJisanTotalCount + jvSeatChoiceCount > 4) {
      fbk_Alert("본 공연은 고객당 4매를 초과할 수 없습니다.");
      return false;
    }
  }
  else if (jgIdPerf == '10164') {
    if (jgJisanTotalCount + jvSeatChoiceCount > 10) {
      fbk_Alert("본 공연은 고객당 10매를 초과할 수 없습니다.");
      return false;
    }
  }
  else if (jgIdPerf == '8225' || jgIdPerf == '9914') {
    if (jgJisanTotalCount + jvSeatChoiceCount > 2) {
      fbk_Alert("본 공연은 고객당 2매를 초과할 수 없습니다.");
      return false;
    }
  }
  else {
    if (jgPerfOption & jcPERF_LIMITSALENO == jcPERF_LIMITSALENO) {
      if (jgJisanTotalCount + jvSeatChoiceCount > jgSaleLimitNo) {
        fbk_Alert("본 공연은 고객당 " + jgSaleLimitNo + "매를 초과할 수 없습니다.");
        return false;
      }
    }
  }

  $j("#IdSeatClass").val(jvIdSeatClass);
  $j("#IdSeatClassPrice").val(jvIdSeatClassPrice);

  var jvTimeOption = parseInt($j("#ulTime > li.on").attr("timeoption"));
  if (jvTimeOption == jcNOSEAT) {
    SeatInfo.find("select[id='selSeatClass']").prop("disabled", true);
  }

  $j("#StateBoard #tk_count").text(jvSeatChoiceCount + "매");

  fdc_CtrlStep(jcSTEP1_4_3);
}

function fdc_GetSeatClassSelCount(jpClassByte) {
  var jvSelCount = 0;

  var SeatInfo = $j("#step01_time #ulSeatSpace");

  SeatInfo.find("div").each(function (i) {
    var selCtrl = $j(this).find("select[id='selSeatClass'] option:selected");

    if (parseInt(selCtrl.val()) > 0) {
      if ($j(this).attr("classbyte") == jpClassByte) {
        jvSelCount += parseInt(selCtrl.val());
      }
    }
  });

  return jvSelCount;
}

function fdc_SetRadioPromotionSeat() {
  var jvHTML = "";
  var SeatInfo = $j("#step01_time #ulSeatSpace");

  SeatInfo.find("div").each(function (i) {
    var selCtrl = $j(this).find("select[id='selSeatClass'] option:selected");
    var txtCtrl = $j(this).find("strong.c_name");

    if (parseInt(selCtrl.val()) > 0)
      jvHTML += "<input type='radio' name='rdoPromotionSeat' value='" + txtCtrl.text() + "' classbyte='" + $j(this).attr("classbyte") + "' onclick=fdc_PromotionView(this); /><label>" + txtCtrl.text() + "</label>";
  });

  $j("#step03 div.disc_select").find("#spanPromotionSeat").html(jvHTML);
  $j("#step03 div.disc_select").find("#spanPromotionSeat").find("input[name='rdoPromotionSeat']:first").prop("checked", true);
}

function fdc_PromotionView(jpSelObj) {
  var rdoCtrl = $j("#step03 div.disc_select").find("#spanPromotionSeat").find("input[name='rdoPromotionSeat']:checked");

  if (rdoCtrl.length > 0) {
    $j("#divPromotionList").find("div:visible").css("display", "none");

    var divSeat = $j("#divPromotionList").find("div[classbyte='" + rdoCtrl.attr("classbyte") + "']");

    if (divSeat.length > 0) divSeat.css("display", "block");
  }
}

function fdc_ShowPromotionTooltip(jpImgObj) {
  fbk_Alert($j(jpImgObj).attr("notice"));
}

function fdc_PreCheckSamePromotionGroup(jpGroupIndex, jpSelObj) {
  var jvNonError = true;
  var TblGroupCtrl = $j("#tblPromotionGroup" + jpGroupIndex);

  if (TblGroupCtrl.length > 0) {
    var jvCusSelSeatCnt = 0;
    var jvCusSelPromotionCnt = 0;

    jvCusSelSeatCnt = parseInt(TblGroupCtrl.attr("cusselseatcnt"));

    TblGroupCtrl.find("select option:selected").each(function (index) {
      jvCusSelPromotionCnt += parseInt($j(this).val());
    });

    if (jvCusSelPromotionCnt > jvCusSelSeatCnt) {
      var jvGroupName = TblGroupCtrl.attr("seatname");

      if (jvGroupName != "") {
        if (jgIdPerf == 24815 || jgIdPerf == 26417 || jgIdPerf == 27418 || jgIdPerf == 27419 || jgIdPerf == 29102 || jgIdPerf == 30400) {
          fbk_Alert("기념 티셔츠는 1개만 선택 가능합니다.<br>(참가비 결제 후 사이즈 변경 불가)");
        }
        else {
          fbk_Alert(jvGroupName + "은<br />선택한 좌석수를 초과하실 수 없습니다.<br />(선택좌석수:" + jvCusSelSeatCnt + ", 할인선택좌석수:" + jvCusSelPromotionCnt + ")");
        }
      }
      else {
        fbk_Alert("할인선택좌석은 선택한 좌석수를<br />초과하실 수 없습니다.<br />(선택좌석수:" + jvCusSelSeatCnt + ", 할인선택좌석수:" + jvCusSelPromotionCnt + ")");
      }

      jvNonError = false;
    }
  } else jvNonError = false;

  return jvNonError;
}

function fdc_PreCheckPromotionBase(jpIdPromotion, jpIdCode, jpIdAuth, jpIsOverlap, jpIsLimit, jpLimitNo, jpGroupIndex, jpSelObj) {
  var jvPreSelPromotionCnt = 0;
  var jvExistOtherCode = false;
  var jvExistOtherOverlap = false;

  var StorageCtrl = $j("#SelPromotionStorage");

  if (StorageCtrl.find("#chkPro" + jpIdPromotion).length > 0)
    $j("#chkPro" + jpIdPromotion, StorageCtrl).remove();

  StorageCtrl.find("input:hidden").each(function (index) {
    var SelPromotionInfo = $j(this).attr("addinfo").split('-');

    if (SelPromotionInfo[0] == "F") jvExistOtherOverlap = true;

    if ($j(this).val() != jpIdCode)
      jvExistOtherCode = true;
    else
      jvPreSelPromotionCnt += parseInt(SelPromotionInfo[1]);
  });

  if (jpIsOverlap == "F") {
    if (jvExistOtherCode == true) {
      fbk_Alert("중복할인이 불가한 할인항목입니다.<br />다른 할인항목과 함께<br />선택하실 수 없습니다.");
      $j(jpSelObj).prop("selectedIndex", "0");
      return false;
    }
  }

  if (jvExistOtherCode && jvExistOtherOverlap) {
    fbk_Alert("중복할인이 불가한 할인항목이<br />이미 포함되어 있으므로<br />이 할인을 선택하실 수 없습니다.");
    $j(jpSelObj).prop("selectedIndex", "0");
    return false;
  }

  if (jpLimitNo == "T") {
    var jvTotalSelCnt = parseInt($j(jpSelObj).val()) + jvPreSelPromotionCnt;

    if (jvTotalSelCnt > jpLimitNo) {
      var jvProNameCtrl = $j(jpSelObj).parent().parent().find("td.l");

      if (jvProNameCtrl.length > 0)
        fbk_Alert(jvProNameCtrl.text() + "<br />할인을 총 " + jvTotalSelCnt + " 매를 선택하셨습니다.<br />선택하신 할인은 " + jpLimitNo + " 매까지 할인적용 가능합니다.");
      else
        fbk_Alert("총 " + jvTotalSelCnt + " 매를 선택하셨습니다.<br />선택하신 할인은 " + jpLimitNo + " 매까지 할인적용 가능합니다.");

      $j(jpSelObj).prop("selectedIndex", "0");
      return false;
    }
  }

  var jvNonError = fdc_PreCheckSamePromotionGroup(jpGroupIndex, jpSelObj);

  if (jvNonError == false) {
    $j(jpSelObj).prop("selectedIndex", "0");
    return false;
  }

  StorageCtrl.html(StorageCtrl.html() + "<input type='hidden' id='chkPro" + jpIdPromotion + "' value='" + jpIdCode + "' addinfo='" + jpIsOverlap + "-" + $j(jpSelObj).val() + "' />");

  fdc_CtrlStep(jcSTEP3_2);
}

function fdc_PreCheckPromotion(jpIdPromotion, jpIdCode, jpIdAuth, jpIsOverlap, jpIsLimit, jpLimitNo, jpGroupIndex, jpSelObj) {
  if ($j(jpSelObj).find("option:selected").val() > 0) {

    var jvCouponPrice = fdc_CALC_CouponPriceByOption(jcCOUPON_NOOVERLAP);

    if (jvCouponPrice > 0) {
      fbk_Alert("할인과 함께 중복하여 사용할 수 없는 쿠폰이 선택되어 있습니다.<br />선택하신 쿠폰을 확인해 주시기 바랍니다.");
      $j(jpSelObj).prop("selectedIndex", "0");
      return false;
    }

    if (fdc_GetDiscountedTicketPrice() < 0) {
      fbk_Alert("이 할인 사용으로 인하여<br />티켓금액보다 많은 할인을<br />받으시게 됩니다.<br />다시 선택해 주시기 바랍니다.");
      $j(jpSelObj).prop("selectedIndex", "0");
      return false;
    }

    // 회원 할인인증 체크 위치
    if (jpIdAuth == '199') {
      if (jgIsMania != '1') {
        fbk_Alert("예스마니아 할인은 마니아 회원분만 선택이 가능합니다.");
        $j(jpSelObj).prop("selectedIndex", "0");
        return false;
      }
    }

    if (jpIdCode == "4399" || jpIdCode == "7605" || jpIdCode == "7606" || jpIdCode == "7956" || jpIdCode == "8330"
        || jpIdCode == "8346" || jpIdCode == "8347" || jpIdCode == "8366" || jpIdCode == "8783" || jpIdCode == "9358" || jpIdCode == "11249"
        || jpIdCode == "9461" || jpIdCode == "13664" || jpIdCode == "14978" || jpIdCode == "14985" || jpIdCode == "15073" || jpIdCode == "15119" || jpIdCode == "15239"
        || jpIdCode == "15533" || jpIdCode == "15756" || jpIdCode == "15757" || jpIdCode == "15758" || jpIdCode == "15759" || jpIdCode == "15079" || jpIdCode == "15118"
        || jpIdCode == "15454" || jpIdCode == "17458" || jpIdCode == "17459" || jpIdCode == "17462" || jpIdCode == "17463" || jpIdCode == "17464" || jpIdCode == "17465"
        || jpIdCode == "17466" || jpIdCode == "17479" || jpIdCode == "17526") {
      if (parseInt($j(jpSelObj).val()) > 0)
        fbk_Alert('[BC Loun.G 할인선택시] 주의사항!<br />- BC카드로 결제시에만 할인적용 가능합니다.<br />- 티켓수령시 반드시 <할인쿠폰을 지참>해주세요.<br /> (미지참시 현장에서 차액지불)<br />- 티켓은 현장에서 수령하실 수 있습니다. (배송불가)');
    }
    else if (jpIdCode == "12435") {
      if (parseInt($j(jpSelObj).val()) > 0)
        fbk_Alert("['M LIVE 쿠폰북 할인'은 올리브영, CGV, 예스24 배송 등을 통해 받으신 쿠폰북 소지자에 한해 제공되는 할인입니다.<br />티켓 수령 시 쿠폰북을 지참하셔야 하며, 미 지참 시 차액을 지불하셔야 합니다.");

    }

    var ImgAlertCtrl = $j("#T" + "imgAlertPro" + jpIdPromotion);

    if (ImgAlertCtrl.length > 0) {
      if (jgBookAlert == jcMODE_JQUERY) {// JQuery MODE
        $j("#dialogConfirm").jConfirm({
          "msg": ImgAlertCtrl.attr("notice") + "<br /><br />할인을 선택 하시겠습니까?",
          "buttons": {
            '확인': function () {
              $j(this).dialog('close');
              fdc_PreCheckPromotionBase(jpIdPromotion, jpIdCode, jpIdAuth, jpIsOverlap, jpIsLimit, jpLimitNo, jpGroupIndex, jpSelObj);
            },
            '취소': function () {
              $j(this).dialog('close');
              $j(jpSelObj).prop("selectedIndex", "0");
              fdc_ControlStep(jcSTEP3_2);
            }
          }
        });
      } else {// Window MODE
        if (confirm(ImgAlertCtrl.attr("notice") + "\n할인을 선택 하시겠습니까?")) {
          fdc_PreCheckPromotionBase(jpIdPromotion, jpIdCode, jpIdAuth, jpIsOverlap, jpIsLimit, jpLimitNo, jpGroupIndex, jpSelObj);
        } else {
          $j(jpSelObj).prop("selectedIndex", "0");
          fdc_CtrlStep(jcSTEP3_2);
        }
      }
    } else {
      fdc_PreCheckPromotionBase(jpIdPromotion, jpIdCode, jpIdAuth, jpIsOverlap, jpIsLimit, jpLimitNo, jpGroupIndex, jpSelObj);
    }
  } else {
    var StorageCtrl = $j("#SelPromotionStorage");

    if (StorageCtrl.find("#chkPro" + jpIdPromotion).length > 0) {
      $j("#chkPro" + jpIdPromotion, StorageCtrl).remove();
    }
    fdc_CtrlStep(jcSTEP3_2);
  }
}

function fdc_CheckCouponLimitAmount() {
  var jvIsValid = true;

  var jvCouponLimitAmount = fdc_CALC_CouponLimitAmount();

  if (jvCouponLimitAmount > 0) {
    var jvTicketPrice = 0, jvBookingFee = 0, jvDeliveryFee = 0;
    var jvDiscountPrice = 0;

    jvTicketPrice = fdc_GetTotalTicketInfo("PRICE");
    jvBookingFee = fdc_CALC_BookingFee();
    jvDeliveryFee = fdc_CALC_DeliveryFee();

    jvDiscountPrice = fdc_CALC_DiscountPrice();

    var jvCurRealPayPrice = (jvTicketPrice + jvBookingFee + jvDeliveryFee) - (jvDiscountPrice);

    if (jvCurRealPayPrice < jvCouponLimitAmount) {
      fbk_Alert("사용하신 쿠폰은 " + fdc_fmtNumber(jvCouponLimitAmount) + "원 이상 결제시 사용할 수 있습니다.");
      jvIsValid = false;
    }
  }

  return jvIsValid;
}

function fdc_CheckValidCoupon(jpIdCoupon, jpIdCouponCode, jpIdType, jplimitNo, jplimiAmount, jpCouponOption, jpCheckObj) {
  var jvIsValid = true;

  if ($j(jpCheckObj).prop("checked") == true) {

    if (jvIsValid != false) {
      var jvDiscountPrice = fdc_CALC_DiscountPrice();

      if (((parseInt(jpCouponOption) & jcCOUPON_NOOVERLAP) == jcCOUPON_NOOVERLAP) && jvDiscountPrice > 0) {
        fbk_Alert("이 쿠폰은 할인과 함께 중복하여 사용할 수 없습니다.<br />선택하신 할인이 있는지 확인해 주시기 바랍니다.");
        jvIsValid = false;
      }
    }

    if (jvIsValid != false) {
      if ((parseInt(jpCouponOption) & jcCOUPON_OVERLAPPERMIT) != jcCOUPON_OVERLAPPERMIT) {
        var jvSelCouponCount = fdc_CALC_CouponCountByNotOption(jcCOUPON_OVERLAPPERMIT, jpIdCoupon);

        if (jvSelCouponCount > 0) {
          fbk_Alert("이 쿠폰은 다른 쿠폰과 함께 중복하여 사용할 수 없습니다.<br />선택하신 쿠폰이 있는지 확인해 주시기 바랍니다.");
          jvIsValid = false;
        }
      }
    }


    if (jvIsValid != false) {
      var chkLimitNoOption = $j(jpCheckObj).attr("chklimitnooption");
      var LimitNoOption = $j(jpCheckObj).attr("limitnooption");
      var msgLimitNoOption = "";

      if (chkLimitNoOption == "N") {
        if (LimitNoOption == "1")
          msgLimitNoOption = "사용하신 쿠폰은 " + jplimitNo + "매 이하 예매 시 사용할 수 있습니다.";

        else if (LimitNoOption == "2")
          msgLimitNoOption = "사용하신 쿠폰은 " + jplimitNo + "매 이상 예매 시 사용할 수 있습니다.";

        else if (LimitNoOption == "3")
          msgLimitNoOption = "쿠폰 사용 조건을 확인하세요.";

        fbk_Alert(msgLimitNoOption);
        jvIsValid = false;
      }
    }


    if (jvIsValid != false) {
      if (!fdc_CheckCouponLimitAmount()) {
        jvIsValid = false;
      }
    }

    if (jvIsValid != false) {
      if (fdc_GetDiscountedTicketPrice() < 0) {
        fbk_Alert("이 쿠폰 사용으로 인하여<br />티켓금액보다 많은 할인을<br />받으시게 됩니다.<br />다시 선택해 주시기 바랍니다.");
        jvIsValid = false;
      }
    }

    if (jvIsValid == false) $j(jpCheckObj).prop("checked", false);
  }
  fdc_CtrlStep(jcSTEP3_4);
}

function fdc_PromotionEnd() {
  var jvCouponPrice = fdc_CALC_CouponPriceByOption(jcCOUPON_NOOVERLAP);

  if (jvCouponPrice > 0) {
    var jvDiscountPrice = fdc_CALC_DiscountPrice();

    if (jvDiscountPrice > 0) {
      fbk_Alert("본 공연은 쿠폰과 할인을 함께 사용하실 수 없습니다.<br />둘 중 하나를 선택 해제해 주시기 바랍니다.");
      return false;
    }
  }

  if (!fdc_CheckCouponLimitAmount()) {
    return false;
  }

  if (fdc_GetDiscountedTicketPrice() < 0) {
    fbk_Alert("할인 받으신 전체금액이<br />티켓금액을 초과 하였습니다.<br />다시 선택해 주시기 바랍니다.");
    return false;
  }

  var TblAllGroupCtrl = $j("table[id^='tblPromotionGroup']");
  var MirunPromotionCnt = 0;

  TblAllGroupCtrl.each(function (index) {
    TblGroupCtrl = $j(this);

    var jvCusSelSeatCnt = 0;
    var jvCusSelPromotionCnt = 0;

    jvCusSelSeatCnt = parseInt(TblGroupCtrl.attr("cusselseatcnt"));

    TblGroupCtrl.find("select option:selected").each(function (index) {
      jvCusSelPromotionCnt += parseInt($j(this).val());
      MirunPromotionCnt += jvCusSelPromotionCnt;
    });

    if (jvCusSelPromotionCnt > jvCusSelSeatCnt) {
      var jvGroupName = TblGroupCtrl.attr("seatname");

      if (jvGroupName != "") {
        if (jgIdPerf == 24815 || jgIdPerf == 26417 || jgIdPerf == 27418 || jgIdPerf == 27419 || jgIdPerf == 29102 || jgIdPerf == 30400) {
          fbk_Alert("기념 티셔츠는 1개만 선택 가능합니다.(참가비 결제 후 사이즈 변경 불가)");
        }
        else {
          fbk_Alert(jvGroupName + "은<br />선택한 좌석수를 초과하실 수 없습니다.<br />(선택좌석수:" + jvCusSelSeatCnt + ", 할인선택좌석수:" + jvCusSelPromotionCnt + ")");
        }
      }
      else
        fbk_Alert("할인선택좌석은 선택한 좌석수를<br />초과하실 수 없습니다.<br />(선택좌석수:" + jvCusSelSeatCnt + ", 할인선택좌석수:" + jvCusSelPromotionCnt + ")");

      return false;
    }
  });

  if (jgIdPerf == 24815 || jgIdPerf == 26417 || jgIdPerf == 27418 || jgIdPerf == 27419 || jgIdPerf == 29102 || jgIdPerf == 30400) {
    if (MirunPromotionCnt == 0) {
      fbk_Alert("티셔츠 사이즈를 선택해주세요.")
      return false;
    }
  }

  fdc_SetHdCardCtrl();

  fdc_SetLotteCardCtrl();

  fdc_CtrlStep(jcSTEP3_5);
}

function fdc_SetLotteCardCtrl() {
  var now = new Date();
  var txtDate = now.getFullYear() + jsf_def_PadLeft(now.getMonth() + 1, 2) + jsf_def_PadLeft(now.getDate(), 2) + jsf_def_PadLeft(now.getHours(), 2) + jsf_def_PadLeft(now.getMinutes(), 2);

  var jvhdpro = false;

  if (jgIdPerf == 30771) {
    if (parseInt(txtDate) <= parseInt("201809051500")) {
      $j("#liYesMoney").hide();
      $j("#liYesPoint").hide();
      $j("#liYesDeposit").hide();
      $j("#liYesGift").hide();
      $j("#liGiftTicket").hide();
      $j("#liBenepiaPoint").hide();
    }
    else {

      if ($j("#SelPromotionStorage").find("input[id^='chkPro'").length > 0) {
        $j("#SelPromotionStorage").find("input[id^='chkPro'").each(function (index) {
          if (this.value == "31471") {
            jvhdpro = true;
          }
        });
      }

      if (jvhdpro == true) {
        $j("#liYesMoney").hide();
        $j("#liYesPoint").hide();
        $j("#liYesDeposit").hide();
        $j("#liYesGift").hide();
        $j("#liGiftTicket").hide();
        $j("#liBenepiaPoint").hide();
      }
      else {
        $j("#liYesMoney").show();
        $j("#liYesPoint").show();
        $j("#liYesDeposit").show();
        $j("#liYesGift").show();
        $j("#liGiftTicket").show();
        $j("#liBenepiaPoint").show();
      }
    }
  }
}

function fdc_SetHdCardCtrl() {
  var now = new Date();
  var txtDate = now.getFullYear() + jsf_def_PadLeft(now.getMonth() + 1, 2) + jsf_def_PadLeft(now.getDate(), 2) + jsf_def_PadLeft(now.getHours(), 2) + jsf_def_PadLeft(now.getMinutes(), 2);

  var jvhdpro = false;

  if (jgIdPerf == 27165) {
    if (parseInt(txtDate) < parseInt("201706270900")) {
      $j("#liYesMoney").hide();
      $j("#liYesPoint").hide();
      $j("#liYesDeposit").hide();
      $j("#liYesGift").hide();
      $j("#liGiftTicket").hide();
      $j("#liBenepiaPoint").hide();
    }
    else {
      if ($j("#SelPromotionStorage").find("input[id^='chkPro'").length > 0) {
        $j("#SelPromotionStorage").find("input[id^='chkPro'").each(function (index) {
          if (this.value == "19484" || this.value == "26914") {
            jvhdpro = true;
          }
        });
      }

      if (jvhdpro == true) {
        $j("#liYesMoney").hide();
        $j("#liYesPoint").hide();
        $j("#liYesDeposit").hide();
        $j("#liYesGift").hide();
        $j("#liGiftTicket").hide();
        $j("#liBenepiaPoint").hide();
      }
      else {
        $j("#liYesMoney").show();
        $j("#liYesPoint").show();
        $j("#liYesDeposit").show();
        $j("#liYesGift").show();
        $j("#liGiftTicket").show();
        $j("#liBenepiaPoint").show();
      }
    }
  }
  else if (jgIdPerf == 27453 || jgIdPerf == 27563 || jgIdPerf == 27573 || jgIdPerf == 28868 || jgIdPerf == 30742) {
    if (parseInt(txtDate) < parseInt("201810260900")) {
      $j("#liYesMoney").hide();
      $j("#liYesPoint").hide();
      $j("#liYesDeposit").hide();
      $j("#liYesGift").hide();
      $j("#liGiftTicket").hide();
      $j("#liBenepiaPoint").hide();
    }
    else {
      if ($j("#SelPromotionStorage").find("input[id^='chkPro'").length > 0) {
        $j("#SelPromotionStorage").find("input[id^='chkPro'").each(function (index) {
          if (this.value == "19484" || this.value == "26914") {
            jvhdpro = true;
          }
        });
      }

      if (jvhdpro == true) {
        $j("#liYesMoney").hide();
        $j("#liYesPoint").hide();
        $j("#liYesDeposit").hide();
        $j("#liYesGift").hide();
        $j("#liGiftTicket").hide();
        $j("#liBenepiaPoint").hide();
      }
      else {
        $j("#liYesMoney").show();
        $j("#liYesPoint").show();
        $j("#liYesDeposit").show();
        $j("#liYesGift").show();
        $j("#liGiftTicket").show();
        $j("#liBenepiaPoint").show();
      }
    }
  }
  else if (jgIdPerf == 27589) // 특정공연 씨티카드만 결제 가능 (타결제수단 숨김)
  {
    $j("#liYesMoney").hide();
    $j("#liYesPoint").hide();
    $j("#liYesDeposit").hide();
    $j("#liYesGift").hide();
    $j("#liGiftTicket").hide();
    $j("#liBenepiaPoint").hide();
  }
  else if (jgIdPerf == 32059)
  {
    $j("#liYesMoney").hide();
    $j("#liYesPoint").hide();
    $j("#liYesDeposit").hide();
    $j("#liYesGift").hide();
    $j("#liGiftTicket").hide();
    $j("#liBenepiaPoint").hide();
  }
  else {
    $j("#liYesMoney").show();
    $j("#liYesPoint").show();
    $j("#liYesDeposit").show();
    $j("#liYesGift").show();
    $j("#liGiftTicket").show();
    $j("#liBenepiaPoint").show();
  }
}

function fdc_GetIsDeliveryPossible() {
  var jvDeliveryOk = true;

  $j("#divPromotionList").find("tr[deliveryno]").each(function (index) {
    var TrCtrl = $j(this)
    var SelCtrl = TrCtrl.find("select[id=selPromotion" + TrCtrl.attr("idpromotion") + "] option:selected");

    if (SelCtrl.length > 0) {
      if (SelCtrl.val() > 0) {
        jvDeliveryOk = false;
        return false;
      }
    }
  });

  return jvDeliveryOk;
}

function fdc_CtrlVal(jpCtrl) {
  return jpCtrl.length > 0 ? jpCtrl.val() : "";
}

function fdc_DisplayUserInfo(jpSelObj) {
  var joUser = $j("#divDeliveryUserInfo");
  var joAddr = $j("#step04_DeliveryInfo");

  if ($j(jpSelObj).val() == "0") {
    joAddr.find("#deliveryUserName").val(fdc_CtrlVal(joUser.find("#LUAddr_UserName")));
    joAddr.find("#deliveryMobile1").val(fdc_CtrlVal(joUser.find("#LUAddr_Mobile1")));
    joAddr.find("#deliveryMobile2").val(fdc_CtrlVal(joUser.find("#LUAddr_Mobile2")));
    joAddr.find("#deliveryMobile3").val(fdc_CtrlVal(joUser.find("#LUAddr_Mobile3")));
    joAddr.find("#deliveryZipCode1").val(fdc_CtrlVal(joUser.find("#LUAddr_ZipCode1")));
    //        joAddr.find("#deliveryZipCode2").val(fdc_CtrlVal(joUser.find("#LUAddr_ZipCode2")));
    joAddr.find("#deliveryAddress1").val(fdc_CtrlVal(joUser.find("#LUAddr_Address1")));
    joAddr.find("#deliveryAddress2").val(fdc_CtrlVal(joUser.find("#LUAddr_Address2")));

    //joAddr.find("#btnSearchAddress").css("cursor", "crosshair").unbind("click.Addr_Search");
    //joAddr.find("#btnRecentAddress").css("cursor", "crosshair").unbind("click.Addr_Recent");
    joAddr.find("#lideliveryAddress2").css("display", "block");

    fdc_CheckZipCodeLength();
  } else if ($j(jpSelObj).val() == "1") {
    joAddr.find("input[id^='delivery']:text").val("");

    //joAddr.find("#btnSearchAddress").css("cursor", "crosshair").unbind("click.Addr_Search");
    //joAddr.find("#btnRecentAddress").css("cursor", "pointer").unbind("click.Addr_Recent").bind("click.Addr_Recent", fdc_PopupRecentAddress);
    joAddr.find("#lideliveryAddress2").css("display", "none");
  } else {
    joAddr.find("input[id^='delivery']:text").val("");

    //joAddr.find("#btnSearchAddress").css("cursor", "pointer").unbind("click.Addr_Search").bind("click.Addr_Search", fdc_PopupZipCode);
    //joAddr.find("#btnRecentAddress").css("cursor", "crosshair").unbind("click.Addr_Recent");
    joAddr.find("#lideliveryAddress2").css("display", "block");
  }
}

function fdc_CheckZipCodeLength() {
  //    if ($j("#rdoDelivery8").is(":checked") == false)
  //        return false;
  //
  //    var joAddr = $j("#step04_DeliveryInfo");
  //    if (joAddr.find("#deliveryZipCode1").val().length > 5) {
  //        joAddr.find("#deliveryZipCode1").val("");
  //        $j("#dialogConfirm").jConfirm({
  //            "msg": "주소/우편번호 체계가 새롭게 변경되었습니다.<br/>정확하고 빠른 배송을 위하여, \"도로명 주소\"를 반드시 입력해주시기 바랍니다.",
  //            "buttons": {
  //                '확인': function () { $j(this).dialog('close'); fdc_PopupZipCode(); }
  //            }
  //        });
  //    }
}

function fdc_CheckDeliveryPossible() {
  var jvIsPossible = true;

  var joSelDelivery = $j("#step04").find("#deliveryPos").find("input[id^='rdoDelivery']:checked");
  var joSelPay = $j("#step05").find("#paymethodPos").find("input[id^='rdoPays']:checked");

  var joDELIVERY_CARD_ALLOWEDDAY = jcDELIVERY_CARD_ALLOWEDDAY;
  var joDELIVERY_VBANK_ALLOWEDDAY = jcDELIVERY_VBANK_ALLOWEDDAY;

  if (jgIdPerf == "21091" || jgIdPerf == "20063") {
    joDELIVERY_CARD_ALLOWEDDAY = 10;
    joDELIVERY_VBANK_ALLOWEDDAY = 10;
  }

  if (joSelDelivery.length > 0) {
    if (joSelDelivery.val() == 1) {
      joDELIVERY_CARD_ALLOWEDDAY = jcDELIVERY_OVERSEAS_ALLOWEDDAY;
      joDELIVERY_VBANK_ALLOWEDDAY = jcDELIVERY_OVERSEAS_ALLOWEDDAY;
    }
    var PayCode = parseInt(joSelPay.val());
    var DeliveryCode = parseInt(joSelDelivery.val());

    if (PayCode == jcPAY_CARD && DeliveryCode != -1) {
      if (parseInt(joSelDelivery.attr("datedifference")) < joDELIVERY_CARD_ALLOWEDDAY) {
        //fbk_Alert("신용카드 결제 시<br />공연일 기준 " + jcDELIVERY_CARD_ALLOWEDDAY + "일전(영업일기준) 까지만 배송이 가능합니다.<br />고객님의 티켓 수령방법이 [현장수령]으로 변경됩니다.");
        fbk_Alert("공연일 기준 " + joDELIVERY_CARD_ALLOWEDDAY + "일전(영업일기준) 까지만 배송이 가능합니다.<br />고객님의 티켓 수령방법이 [현장수령]으로 변경됩니다.");
        jvIsPossible = false;
      }
    } else if (PayCode == jcPAY_VBANK && DeliveryCode != -1) {
      if (parseInt(joSelDelivery.attr("datedifference")) < joDELIVERY_VBANK_ALLOWEDDAY) {
        //fbk_Alert("가상계좌 결제 시<br />공연일 기준 " + jcDELIVERY_CARD_ALLOWEDDAY + "일전(영업일기준) 까지만 배송이 가능합니다.<br />고객님의 티켓 수령방법이 [현장수령]으로 변경됩니다.");
        fbk_Alert("공연일 기준 " + joDELIVERY_CARD_ALLOWEDDAY + "일전(영업일기준) 까지만 배송이 가능합니다.<br />고객님의 티켓 수령방법이 [현장수령]으로 변경됩니다.");
        jvIsPossible = false;
      }
    } else if (DeliveryCode != -1) {
      if (parseInt(joSelDelivery.attr("datedifference")) < joDELIVERY_CARD_ALLOWEDDAY) {
        fbk_Alert("공연일 기준 " + joDELIVERY_CARD_ALLOWEDDAY + "일전(영업일기준) 까지만 배송이 가능합니다.<br />고객님의 티켓 수령방법이 [현장수령]으로 변경됩니다.");
        jvIsPossible = false;
      }
    }


  }

  return jvIsPossible;
}

function fdc_DeliveryMethodChangeEnd(jpSelVal) {
  if (jpSelVal == -1) {
    $j("#step04")
    .find("#step04_OrdererInfo").css("display", "block").end()
    .find("#step04_DeliveryInfo").css("display", "none").end()
    .find("#step04_DeliveryCaution").css("display", "block").end()
    .find("#step04_OverseasDeliveryInfo").css("display", "none").end()
    .find("#step04_OverseasDeliveryCaution").css("display", "none").end();
    fdc_CtrlStep(jcSTEP4_1);
  }
  else if (jpSelVal == 1) {
    $j("#step04")
    .find("#step04_OrdererInfo").css("display", "block").end()
    .find("#step04_DeliveryInfo").css("display", "none").end()
    .find("#step04_DeliveryCaution").css("display", "none").end()
    .find("#step04_OverseasDeliveryInfo").css("display", "block").end()
    .find("#step04_OverseasDeliveryCaution").css("display", "block").end();
    fax_GetOverseasDelivey($j("#IdTime").val(), jgCalSelDate);
  }
  else {
    fdc_CheckZipCodeLength();
    $j("#step04")
    .find("#step04_OrdererInfo").css("display", "block").end()
    .find("#step04_DeliveryInfo").css("display", "block").end()
    .find("#step04_DeliveryCaution").css("display", "block").end()
    .find("#step04_OverseasDeliveryInfo").css("display", "none").end()
    .find("#step04_OverseasDeliveryCaution").css("display", "none").end();
    fdc_CtrlStep(jcSTEP4_1);
  }
}

function fdc_DeliveryMethodChange(jpSelObj) {
  var jvSelVal = $j(jpSelObj).val();
  var jvIsPossible = (parseInt(jvSelVal) == -1 ? true : fdc_CheckDeliveryPossible());

  if (jvIsPossible == false) {
    $j("#step04 input[id^='rdoDelivery']").filter("[value='-1']").prop("checked", true);
    jvSelVal = $j("#step04 input[id^='rdoDelivery']:checked").val();
    fdc_DeliveryMethodChangeEnd(jvSelVal);
  } else {
    var jvIsExist = fdc_CALC_CouponExistByTypeWithoutSel(jcCOUPON_DELIVERYFEE);
    var jvSelCount = fdc_CALC_CouponCountByType(jcCOUPON_DELIVERYFEE);

    if (jvSelVal != -1 && jvIsExist == true && jvSelCount == 0) {
      $j("#dialogConfirm").jConfirm({
        "msg": "<font color='blue'>배송비 무료 쿠폰이 있습니다.</font><br />[<font color='red'>확인</font>]버튼을 클릭하시면 자동으로 사용처리됩니다.<br />경고창이 출력될 경우에는 해당 단계로 이동하시어<br />수동으로 직접 선택하시기 바랍니다.<br />사용하시겠습니까?",
        "buttons": {
          '확인': function () {
            $j(this).dialog('close');
            $j("#divCouponList").find("input[id='CheckCoupon']").filter("[coupontype='" + jcCOUPON_DELIVERYFEE + "']:first").trigger("click");
            fdc_DeliveryMethodChangeEnd(jvSelVal);
          },
          '취소': function () {
            $j(this).dialog('close');
            fdc_DeliveryMethodChangeEnd(jvSelVal);
          }
        }
      });
    } else {
      fdc_DeliveryMethodChangeEnd(jvSelVal);
    }
  }
}

function fdc_OverseasDeliveryChange(jpSelObj) {
  var jvSelVal = $j(jpSelObj).val();
  fax_GetOverseasCountry(jvSelVal);
  fdc_CtrlStep(jcSTEP4_1);
}

function fdc_DeliveryEnd() {
  var joSelDelivery = $j("#step04").find("#deliveryPos").find("input[id^='rdoDelivery']:checked");

  if (joSelDelivery.length == 0) {
    fbk_Alert("티켓 수령방법을 선택하세요.");
    return false;
  }

  var jvIsPossible = (parseInt(joSelDelivery.val()) == -1 ? true : fdc_CheckDeliveryPossible());

  if (jvIsPossible == false) {
    $j("#step04 input[id^='rdoDelivery']").filter("[value='-1']").prop("checked", true).trigger("click");
    return false;
  }

  var OrdererCtrl = $j("#step04_OrdererInfo");

  if ($j.trim(OrdererCtrl.find("#ordererUserName").val()) == "") {
    fbk_Alert("주문자 확인 정보를 모두 입력해 주세요.");
    return false;
  }

  if ($j.trim(OrdererCtrl.find("#ordererUserName").val()) == "" ||
      $j.trim(OrdererCtrl.find("#ordererMobile1").val()) == "" ||
      $j.trim(OrdererCtrl.find("#ordererMobile2").val()) == "" ||
      $j.trim(OrdererCtrl.find("#ordererMobile3").val()) == "") {
    if (jgIdPerf == "27419" || jgIdPerf == "27418" || jgIdPerf == "27420" || jgIdPerf == "29102" || jgIdPerf == "30400")
      fbk_Alert("연락처를 입력해주세요.");
    else
      fbk_Alert("긴급연락처를 입력해주세요.");

    return false;
  }

  // 현장이 아니며 해외배송도 아닌경우
  if (parseInt(joSelDelivery.val()) != -1 && parseInt(joSelDelivery.val()) != 1) {
    var joAddr = $j("#step04_DeliveryInfo");

    if ($j.trim(joAddr.find("#deliveryUserName").val()) == "" ||
        $j.trim(joAddr.find("#deliveryMobile1").val()) == "" ||
        $j.trim(joAddr.find("#deliveryMobile2").val()) == "" ||
        $j.trim(joAddr.find("#deliveryMobile3").val()) == "" ||
        $j.trim(joAddr.find("#deliveryZipCode1").val()) == "" ||
        $j.trim(joAddr.find("#deliveryAddress1").val()) == "") {
      fbk_Alert("배송지 정보를 모두 입력해 주세요.");
      return false;
    }

    if (joAddr.find("#deliveryInfoType1").length > 0) {
      if (joAddr.find("#deliveryInfoType1").prop("checked") == false) {
        //                if ($j.trim(joAddr.find("#deliveryAddress2").val()) == "") {
        //                    fbk_Alert("상세주소를 입력해 주세요.");
        //                    return false;
        //                }
      }
    }
  }
  else if (parseInt(joSelDelivery.val()) == 1) {
    var joAddr = $j("#step04_OverseasDeliveryInfo");

    var jvName = $j.trim(joAddr.find("#overseasDeliveryName").val());
    var jvMobile1 = $j.trim(joAddr.find("#overseasDeliveryMobile1").val());
    var jvMobile2 = $j.trim(joAddr.find("#overseasDeliveryMobile2").val());
    var jvMobile3 = $j.trim(joAddr.find("#overseasDeliveryMobile3").val());
    var jvMobile4 = $j.trim(joAddr.find("#overseasDeliveryMobile4").val());
    var jvZip = $j.trim(joAddr.find("#overseasDeliveryZipcode").val());
    var jvCity = $j.trim(joAddr.find("#overseasDeliveryCity").val());
    var jvCountry = $j.trim(joAddr.find("#selOverseasDeliveryCountry option:selected").val());
    var jvAddress1 = $j.trim(joAddr.find("#overseasDeliveryAddress1").val());

    if (jvCountry == "HK") {
      if (jvName == "" || jvMobile1 == "" || jvMobile2 == "" || jvMobile3 == "" || jvMobile4 == "" || jvCity == "" || jvCountry == "" || jvAddress1 == "") {
        fbk_Alert("배송지 정보를 빈칸 없이 모두 입력해 주세요.<br/>Please fill all the element without blank.");
        return false;
      }
    }
    else {
      if (jvName == "" || jvMobile1 == "" || jvMobile2 == "" || jvMobile3 == "" || jvMobile4 == "" || jvZip == "" || jvCity == "" || jvCountry == "" || jvAddress1 == "") {
        fbk_Alert("배송지 정보를 빈칸 없이 모두 입력해 주세요.<br/>Please fill all the element without blank.");
        return false;
      }
    }

    //        replace(/\s/gi, "");
    var city = jvCity.replace(/\s+/g, "");
    var name = jvName.replace(/\s+/g, "");
    var address1 = jvAddress1.replace(/\s+/g, "");
    var array = [city, name, address1];
    var pattern = /^[a-zA-Z0-9~!@#$%^&*()_+\-=\[\]{};':"\\,.<>\/?]*$/
    for (var i in array) {
      if (array[i].match(pattern) == null) {
        fbk_Alert("배송지 정보는 영어로 입력해 주세요.<br/>Please fill all the element by English.");
        return false;
        break;
      }
    }
  }

  fdc_CtrlStep(jcSTEP4_3);
}

function fdc_YesPaysBaseSetting(jpPayType) {
  if (jpPayType == jcPAYTYPE_ALL || jpPayType == jcPAYTYPE_YESMONEY) {
    var joBase = $j("#baseYesMoney");
    var joTarget = $j("#liYesMoney");

    if (joBase.find("#rcvYesMoney").length > 0) {
      joTarget.find("#lblYesMoney").text(fdc_fmtNumber(joBase.find("#rcvYesMoney").val()));
      if (joTarget.find("#txtYesMoney").val() == "") joTarget.find("#txtYesMoney").val("0").trigger("change");

      try {
        var jvUsedVal = parseInt(joTarget.find("#txtYesMoney").val());
        var jvKeepVal = parseInt(joBase.find("#rcvYesMoney").val());

        if (joTarget.find("#cbxYesMoney").prop("checked") == true) {
          if (jvUsedVal < jvKeepVal) joTarget.find("#cbxYesMoney").prop("checked", false).trigger("click");
          else if (jvUsedVal > jvKeepVal) { joTarget.find("#txtYesMoney").val(fdc_fmtNumber(jvKeepVal)).trigger("change"); }
          joTarget.find("#cbxYesMoney").prop("disabled", false);
        } else {
          if (jvUsedVal > jvKeepVal) { joTarget.find("#txtYesMoney").val(fdc_fmtNumber(jvKeepVal)).trigger("change"); }
          joTarget.find("input").prop("disabled", false);
        }
      } catch (e) { }
    } else {
      joTarget
      .find("#txtYesMoney").val("0").trigger("change").end()
      .find("#cbxYesMoney").prop("checked", false).end()
      .find("#lblYesMoney").text("0").end()
      .find("input").prop("disabled", true);
    }
  }

  if (jpPayType == jcPAYTYPE_ALL || jpPayType == jcPAYTYPE_YESPOINT) {
    var joBase = $j("#baseYesPoint");
    var joTarget = $j("#liYesPoint");

    if (joBase.find("#rcvYesPoint").length > 0) {
      joTarget.find("#lblYesPoint").text(fdc_fmtNumber(joBase.find("#rcvYesPoint").val()));

      try {
        var jvKeepVal = parseInt(joBase.find("#rcvYesPoint").val());
      } catch (e) { }
    } else {
      joTarget
      .find("#lblYesPoint").text("0").end();
    }
  }

  if (jpPayType == jcPAYTYPE_ALL || jpPayType == jcPAYTYPE_YESDEPOSIT) {
    var joBase = $j("#baseYesDeposit");
    var joTarget = $j("#liYesDeposit");

    if (joBase.find("#rcvYesDeposit").length > 0) {
      joTarget.find("#lblYesDeposit").text(fdc_fmtNumber(joBase.find("#rcvYesDeposit").val()));
      if (joTarget.find("#txtYesDeposit").val() == "") joTarget.find("#txtYesDeposit").val("0").trigger("change");

      try {
        var jvUsedVal = parseInt(joTarget.find("#txtYesDeposit").val());
        var jvKeepVal = parseInt(joBase.find("#rcvYesDeposit").val());

        if (joTarget.find("#cbxYesDeposit").prop("checked") == true) {
          if (jvUsedVal < jvKeepVal) joTarget.find("#cbxYesDeposit").prop("checked", false).trigger("click");
          else if (jvUsedVal > jvKeepVal) { joTarget.find("#txtYesDeposit").val(fdc_fmtNumber(jvKeepVal)).trigger("change"); }
          joTarget.find("#cbxYesDeposit").prop("disabled", false);
        } else {
          if (jvUsedVal > jvKeepVal) { joTarget.find("#txtYesDeposit").val(fdc_fmtNumber(jvKeepVal)).trigger("change"); }
          joTarget.find("input").prop("disabled", false);
        }
      } catch (e) { }
    } else {
      joTarget
      .find("#txtYesDeposit").val("0").trigger("change").end()
      .find("#cbxYesDeposit").prop("checked", false).end()
      .find("#lblYesDeposit").text("0").end()
      .find("input").prop("disabled", true);
    }
  }

  if (jpPayType == jcPAYTYPE_ALL || jpPayType == jcPAYTYPE_YESGIFT) {
    var joBase = $j("#baseYesGift");
    var joTarget = $j("#liYesGift");

    if (joBase.find("#rcvYesGift").length > 0) {
      joTarget.find("#lblYesGiftAmt").text(fdc_fmtNumber(joBase.find("#rcvYesGift").val()));
      joTarget.find("#lblYesGiftCnt").text(fdc_fmtNumber(joBase.find("#rcvYesGift").attr("totalcount")));

      if (joTarget.find("#txtYesGift").val() == "") joTarget.find("#txtYesGift").val("0").attr("usedgiftinfo", "").trigger("change");

      joTarget
      .find("#txtYesGift").prop("disabled", true).end();
    } else {
      joTarget
      .find("#txtYesGift").val("0").attr("usedgiftinfo", "").prop("disabled", true).trigger("change").end()
      .find("#lblYesGiftAmt").text("0").end()
      .find("#lblYesGiftCnt").text("0").end();
    }
  }


}

function fdc_UseFullYesCommon(jpRcvCtrl, jpTxtCtrl, jpCbxCtrl) {
  if (jpCbxCtrl.prop("checked") == true) {
    jpTxtCtrl.val(fdc_fmtNumber(jpRcvCtrl.val())).prop("disabled", true).trigger("change");
  } else {
    jpTxtCtrl.val(0).prop("disabled", false).trigger("change");
  }
}

function fdc_UseFullYesMoney() {
  var joBase = $j("#baseYesMoney");
  var joTarget = $j("#liYesMoney");

  fdc_UseFullYesCommon(joBase.find("#rcvYesMoney"), joTarget.find("#txtYesMoney"), joTarget.find("#cbxYesMoney"));
}

function fdc_UseFullYesDeposit() {
  var joBase = $j("#baseYesDeposit");
  var joTarget = $j("#liYesDeposit");

  fdc_UseFullYesCommon(joBase.find("#rcvYesDeposit"), joTarget.find("#txtYesDeposit"), joTarget.find("#cbxYesDeposit"));
}

function fdc_UseBenepiaPoint() {
  var jpCbxCtrl = $j("#liBenepiaPoint").find("#cbxBenepiaPoint");

  if (fdc_CheckEtcFeeInLoading()) {
    jpCbxCtrl.prop("checked", false);
    return false;
  }

  if (jpCbxCtrl.prop("checked") == true) {
    fdc_PopupBenepiaPoint();
  } else {
    $j("#liBenepiaPoint").find("#txtBenepiaPoint").val("").attr("usedbenepiainfo", "");

    fdc_CtrlStep(jcSTEP5_6);
  }
}

function fdc_CheckYesCommon(jpRcvCtrl, jpTxtCtrl, jpName, joMsg) {
  if (jpTxtCtrl.val() == "") jpTxtCtrl.val("0");

  joMsg.msg = "[ " + jpName + " ]<br />";
  var jvalid = true;

  if (!$j.isNumeric(jpTxtCtrl.val().replace(/,/g, ''))) { joMsg.msg += "금액 형식이 올바르지 않습니다.<br />"; jvalid = false; }

  if (jvalid) {
    var jvMin = "0";
    var jvMax = (jpRcvCtrl.length > 0 ? jpRcvCtrl.val() : "0");
    var jvTarget = jpTxtCtrl.val().replace(/,/g, '');

    if (parseInt(jvMin) > parseInt(jvTarget) || parseInt(jvMax) < parseInt(jvTarget)) { joMsg.msg += "보유하신 " + jpName + " 한도내에서만 사용이 가능합니다.<br />( 0 <= x <= " + fdc_fmtNumber(parseInt(jvMax)) + " )<br />"; jvalid = false; }
  }

  if (jvalid) {
    if (fdc_Odr_PayMoney() < 0) { joMsg.msg += "선택하신 금액이 결제금액보다 많습니다.<br />금액을 다시 확인해 주시기 바랍니다.<br />"; jvalid = false; }
  }

  return jvalid;
}

function fdc_CheckYesMoney() {
  var joBase = $j("#baseYesMoney");
  var joTarget = $j("#liYesMoney");

  var joMsg = { msg: "" };

  var jvalid = fdc_CheckYesCommon(joBase.find("#rcvYesMoney"), joTarget.find("#txtYesMoney"), "YES머니", joMsg);

  if (!jvalid) {
    joTarget.find("#txtYesMoney").val("0").trigger("change");
    if (joTarget.find("#cbxYesMoney").prop("checked") == true) { joTarget.find("#cbxYesMoney").prop("checked", false).trigger("click"); }
    fbk_Alert(joMsg.msg);
  }
  else fdc_CtrlStep(jcSTEP5_1);
}

function fdc_CheckYesDeposit() {
  var joBase = $j("#baseYesDeposit");
  var joTarget = $j("#liYesDeposit");

  var joMsg = { msg: "" };

  var jvalid = fdc_CheckYesCommon(joBase.find("#rcvYesDeposit"), joTarget.find("#txtYesDeposit"), "예치금", joMsg);

  if (!jvalid) {
    joTarget.find("#txtYesDeposit").val("0").trigger("change");
    if (joTarget.find("#cbxYesDeposit").prop("checked") == true) joTarget.find("#cbxYesDeposit").prop("checked", false).trigger("click");
    fbk_Alert(joMsg.msg);
  }
  else fdc_CtrlStep(jcSTEP5_3);
}

function fdc_CheckYesGift() {
  fdc_CtrlStep(jcSTEP5_4);
}

function fdc_GetEtcFees() {
  var jvTicketCount = fdc_GetTotalTicketInfo("COUNT");
  var jvFreeCountOfCoupon = fdc_CALC_CouponLimitNoByType(jcCOUPON_BOOKINGFEE);
  var jvFreeCountOfGiftTicket = fdc_CALC_GiftTicketCount();

  fax_GetEtcFee($j("#IdTime").val(), jvTicketCount, jvFreeCountOfCoupon, jvFreeCountOfGiftTicket);
}

function fdc_CheckEtcFeeInLoading() {
  if ($j("#divBookingFee").attr("bkinloading") == "1") {
    fbk_Alert("수수료 정보를 로딩중입니다...<br />잠시 후에 이용해 주시기 바랍니다.");
    return true;
  } else return false;
}

function fdc_CheckPayMethodPossible() {
  var jvIsPossible = true;

  var joSelPay = $j("#step05").find("#paymethodPos").find("input[id^='rdoPays']:checked");

  if (joSelPay.length > 0) {
    var PayCode = parseInt(joSelPay.val());

    if (PayCode == jcPAY_VBANK && parseInt(joSelPay.attr("datedifference")) < jcPAY_VBANK_ALLOWEDDAY) {
      fbk_Alert("가상계좌 결제는 공연일 기준 " + jcPAY_VBANK_ALLOWEDDAY + "일전(영업일기준) 까지만 가능합니다.");
      jvIsPossible = false;
    }
    else if (PayCode == jcPAY_VBANK && fdc_CALC_GiftTicketCount() > 0) {
      fbk_Alert("예매권 결제 시 무통장입금은 결제가 불가능합니다.<br />다른 결제수단을 이용하시기 바랍니다.");
      jvIsPossible = false;
    }
    else if (PayCode == jcPAY_VBANK && fdc_CALC_BenepiaPoint() > 0) {
      fbk_Alert("복지포인트 결제 시 무통장입금은 결제가 불가능합니다.<br />다른 결제수단을 이용하시기 바랍니다.");
      jvIsPossible = false;
    }
  }

  return jvIsPossible;
}

function fdc_PayMethodChange(jpSelObj) {
  var joCtrl = $j(jpSelObj);

  if (jgSubGenre == 27288) {
    if (joCtrl.val() == jcPAY_CARD) {
      $j("#step05").find("#paymethodPos").find("#selBank, #imgCashReceipt").prop("disabled", true);
      $j("#step05").find("#liLiveRefundinfo").find("#selLiveRefundBank, #txtLiveRefundAccount, #txtLiveRefundUserName").prop("disabled", true);
      $j("#step05").find("#liLiveRefundinfo").find("#selLiveRefundBank").prop("selectedIndex", "0");
      $j("#step05").find("#liLiveRefundinfo").find("#txtLiveRefundAccount, #txtLiveRefundUserName").val("");
    } else if (joCtrl.val() == jcPAY_VBANK) {
      $j("#step05").find("#paymethodPos").find("#selBank, #imgCashReceipt").prop("disabled", false);
      $j("#step05").find("#liLiveRefundinfo").find("#selLiveRefundBank, #txtLiveRefundAccount, #txtLiveRefundUserName").prop("disabled", false);
    }
  }
  else {
    if (joCtrl.val() == jcPAY_CARD) {
      $j("#step05").find("#paymethodPos").find("#selBank, #imgCashReceipt").prop("disabled", true);
    } else if (joCtrl.val() == jcPAY_VBANK) {
      $j("#step05").find("#paymethodPos").find("#selBank, #imgCashReceipt").prop("disabled", false);
    }
  }

  // 카카오뱅크 선택
  if ($j(jpSelObj).attr("idgroup") == jcPAY_KAKAO) {
    jgIsKaKao = "Y";
  }
  else {
    jgIsKaKao = "";
  }


  if (!fdc_CheckPayMethodPossible()) {
    $j("#step05 input[id^='rdoPay']").prop("checked", false);
    return false;
  }

  if (!fdc_CheckDeliveryPossible()) {
    $j("#step04 input[id^='rdoDelivery']").filter("[value='-1']").prop("checked", true);
    jvSelVal = $j("#step04 input[id^='rdoDelivery']:checked").val();
    fdc_DeliveryMethodChangeEnd(jvSelVal);
    return false;
  }
}

function fdc_PrePayCheck() {
  $j("#divMsgQueue")
  .clearQueue()
  .queue(function (next) {
    if (jgIdPerf == "-1" || jgIdPerf == "9268") {
      $j("#dialogConfirm").jConfirm({
        "msg": "예매취소규정안내<br />지산밸리 록페스티벌2011은 구매시점별 선구매에 따른 단계별 할인정책이 실시되며, 1차 판매된 Valley Rock Mania 티켓의 경우 30%, 2차 Early Bird할인 티켓에 대해서는 20%의 할인 조건을 부여하였습니다. 단, 선구매에 따른 할인판매 조건에 따라 해당 Valley Rock Mania 티켓 및 Early Bird 할인 티켓에 한하여 티켓 구매일 이후 취소하고자 하실 경우 예매취소수수료가 티켓가격의 50%로 적용되오니 이점 양지하시기 바라며, 예매취소에 관한 내용을 확인하신 후 신중한 예매 부탁 드립니다. 3차 인터넷예매 할인의 경우 각 예매처의 취소/환불규정에 따라 취소수수료가 적용됩니다. 위의 취소규정에 동의하십니까?",
        "buttons": {
          '확인': function () { $j(this).dialog('close'); next(); },
          '취소': function () { $j(this).dialog('close'); }
        }
      });
    }
    else if (jgIdPerf == "21091" || jgIdPerf == "21284") {
      $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 430, 'height': 368, 'url': '/Pages/Perf/Sale/Popup/Etc_Notice.aspx', 'title': '네이트 루스 내한공연 예매안내' });
    }
    else if (jgIdPerf == "22701") {
      var now = new Date();
      var txtDate = now.getFullYear() + jsf_def_PadLeft(now.getMonth() + 1, 2) + jsf_def_PadLeft(now.getDate(), 2) + jsf_def_PadLeft(now.getHours(), 2) + jsf_def_PadLeft(now.getMinutes(), 2);

      if (parseInt(txtDate) > parseInt("201601071359")) {
        $j("#dialogAlert").jAlert({
          "msg": "본 공연은 배송이 불가하며, 현장수령만 가능합니다. <br/>예매자 본인의 신분증(사본가능)과 예매번호, 연락처 모두 확인되어야 티켓 수령이 가능하오니, 예매 시 유의 부탁드립니다."
          , "buttons": {
            '확인': function () { $j(this).dialog('close'); next(); }
          }
        });
      }
      else { next(); }
    }
    else { next(); }
  })
  .queue(function (next) {
    var jvCancelClose = $j("#ulTime > li.on").attr("cancelclose");
    var jvCurDate = new Date();
    var jvDate = new Date(jvCancelClose.substr(0, 10).replace(/\./g, "/"));

    jvDate.setHours(parseInt(jvCancelClose.substr(11, 2)));
    jvDate.setMinutes(parseInt(jvCancelClose.substr(14, 2)));
    jvDate.setSeconds(parseInt(jvCancelClose.substr(17, 2)));

    if (jvDate.getTime() - jvCurDate.getTime() < 0) {
      $j("#dialogConfirm").jConfirm({
        "msg": "본 회차는 예매 후에 취소/변경/환불이 불가합니다.<br /> 예매를 진행하시겠습니까?",
        "buttons": {
          '확인': function () { $j(this).dialog('close'); fdc_doPayCheck(); },
          '취소': function () { $j(this).dialog('close'); }
        }
      });
    } else {
      if (jgPerfHappyFamily == "1") {
        $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 430, 'height': 345, 'url': '/Pages/Perf/Sale/Popup/HappyFamilySale_Notice.aspx', 'title': '해피패밀리 예매안내' });
      }
      else {
        fdc_doPayCheck();
      }

    }
  });
}

function fdc_doPayCheck() {


  var joPay = $j("#step05").find("#paymethodPos").find("input[id^='rdoPays']:checked");
  var jvTotalPrice = fdc_Odr_PayMoney();

  if (jvTotalPrice < 0) {
    fbk_Alert("결제금액은 0원 이상이어야 됩니다.");
    return false;
  } else if (jvTotalPrice > 0) {
    if (joPay.length == 0) {
      fbk_Alert("티켓 결제방법을 선택하세요.");
      return false;
    }

    if (joPay.val() != jcPAY_CARD && joPay.val() != jcPAY_VBANK) {
      fbk_Alert("신용카드/무통장입금만 가능합니다.");
      return false;
    }

    if (joPay.val() == jcPAY_VBANK && $j("#selBank").prop("selectedIndex") == 0) {
      fbk_Alert("입금은행을 선택하세요.");
      return false;
    }

    if (jgSubGenre == 27288) {
      if (joPay.val() == jcPAY_VBANK) {
        if ($j("#selLiveRefundBank").prop("selectedIndex") == 0) {
          fbk_Alert("환불은행을 선택하세요.");
          return false;
        }

        if ($j.trim($j("#txtLiveRefundAccount").val()) == "") {
          fbk_Alert("환불계좌를 입력해 주세요.");
          return false;
        }

        if ($j.trim($j("#txtLiveRefundUserName").val()) == "") {
          fbk_Alert("환불 예금주명을 입력해 주세요. ");
          return false;
        }
      }
    }

  }


  if (reCAPTCHAUse == "1") {
    if ($j("#recaptcha_response_field").val() == "") {
      fbk_Alert("자동주문방지를 확인해 주세요.");
      return false;
    }
  }

  if (reCAPTCHAUse == "2") {
    if ($j("#g-recaptcha-response").val() == "") {
      fbk_Alert("자동주문방지를 확인해 주세요.");
      return false;
    }
  }

  if (reCAPTCHAUse == "Y") {
    if ($j("#captchaText").val() == "") {
      fbk_Alert("자동주문방지 문자를 입력해주세요.");
      return false;
    }
  }

  if ($j("#cbxCancelFeeAgree").prop("checked") == false & $j("#chkinfoAgree").prop("checked") == false) {
    fbk_Alert("취소수수료/취소 기한 및 제 3자 정보 제공 내용에 동의하셔야만 결제 가능합니다.<br /> 내용을 확인하신 후 동의하기를 체크해주세요.");
    return false;
  }

  if ($j("#cbxCancelFeeAgree").prop("checked") == false) {
    fbk_Alert("취소수수료 및 취소기한을 확인 후 동의해 주시기 바랍니다.");
    return false;
  }

  if ($j("#chkinfoAgree").prop("checked") == false) {
    fbk_Alert("제 3자 정보 제공 내용 확인 후 동의해 주시기 바랍니다.");
    return false;
  }


  if (!fdc_CheckCouponLimitAmount()) {
    return false;
  }

  var jvGiftTicketCount = fdc_CALC_GiftTicketCount();

  if (jvGiftTicketCount > 0) {
    var jvTicketCount = fdc_GetTotalTicketInfo("COUNT");
    var jvDiscountCount = fdc_CALC_DiscountCount();

    if (jvTicketCount - jvTicketCount - jvDiscountCount < 0) {
      fbk_Alert("티켓수보다 많은 할인 혜택을 받으셨습니다.<br />사용하신 예매권을 초기화 합니다.<br />다시 선택해 주시기 바랍니다.");
      fdc_PopupGiftTicketRegUseEnd("", "<span class='ticket fst'>사용하신 예매권이 없습니다.</span>");
      return false;
    }

    if (fdc_CALC_CouponLimitAmount() > 0 || fdc_CALC_YesMoneyPrice() > 0 || fdc_CALC_YesDepositPrice() > 0 || fdc_CALC_YesGiftPrice() > 0 || fdc_Odr_PayMethod() == "2" || fdc_Odr_PayMethod() == "22") {
      $j("#step05 input[id^='rdoPay']").prop("checked", false);
      $j("#step05")
      .find("#txtYesMoney").val("").end()
      .find("#txtYesDeposit").val("").end()
      .find("#txtYesGift").val("").attr("usedgiftinfo", "").end()
      .find("#txtBenepiaPoint").val("").attr("usedbenepiainfo", "");
      fdc_UptPriceBoard();
      fbk_Alert("예매권 사용 시 타 결제수단과 중복 사용 불가합니다.")
      return false;
    }

  }

  if (jgIsShowOKCashbag == jcSHOW_ON) {

    if ($j("#chkOKCashBAgree").prop("checked") == false) {
      fbk_Alert("OK캐쉬백 적립을 위해서는 개인정보 취급 방침에 의해 고객 동의가 필요합니다.<br/> ’OK캐쉬백 정보 제공 동의’항목을 체크해주시기 바랍니다.");
      return false;
    }

    var joOKCashbag = $j("#step05").find("#liOKCashbag");

    if ($j.trim(joOKCashbag.find("#txtOKCashbagCardNo1").val()) == "" ||
        $j.trim(joOKCashbag.find("#txtOKCashbagCardNo2").val()) == "" ||
        $j.trim(joOKCashbag.find("#txtOKCashbagCardNo3").val()) == "" ||
        $j.trim(joOKCashbag.find("#txtOKCashbagCardNo4").val()) == "") {
      fbk_Alert("OK캐쉬백 카드번호를 입력해 주세요.");
      return false;
    }
  }

  jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "6", "#imgPayEnd");

  fdc_CtrlStep(jcSTEP_PAY);
}

function fdc_GetTotalTicketInfo(jpType) {
  var SeatInfo = $j("#step01_time #ulSeatSpace");

  var jvSeatChoiceCount = 0;
  var jvTicketPrice = 0;

  SeatInfo.find("div").each(function (i) {
    var selCtrl = $j(this).find("select[id='selSeatClass'] option:selected");

    if (parseInt(selCtrl.val()) > 0) {
      if (jpType == "COUNT") jvSeatChoiceCount += parseInt(selCtrl.val());
      if (jpType == "PRICE") jvTicketPrice += parseInt($j(this).find("select[id='selSeatClass']").attr("price")) * parseInt(selCtrl.val());
    }
  });

  if (jpType == "COUNT") return jvSeatChoiceCount;

  return jvTicketPrice;
}

function fdc_GetDiscountedTicketPrice() {
  var jvBookingFee = 0, jvDeliveryFee = 0;

  jvBookingFee = fdc_CALC_BookingFee();
  jvDeliveryFee = fdc_CALC_DeliveryFee();

  return fdc_Odr_PayMoney() - jvBookingFee - jvDeliveryFee;
}

function fdc_Odr_Promotions() {
  var jvPromotionInfo = "";

  $j("#divPromotionList").find("select[id^='selPromotion']").each(function (index) {
    var SelCtrl = $j(this);

    if (parseInt(SelCtrl.find("option:selected").val()) > 0) {
      var jvIdPromotion = SelCtrl.attr("id").replace("selPromotion", "");

      jvPromotionInfo += jvIdPromotion + "#" + SelCtrl.find("option:selected").val() + "^";
    }
  });

  jvPromotionInfo += fdc_Odr_GiftTicketDiscount();

  return jvPromotionInfo;
}

function fdc_Odr_Coupons() {
  var jvCouponInfo = "";

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    jvCouponInfo += $j(this).val() + "#" + $j(this).attr("price") + "^";
  });

  return jvCouponInfo;
}

function fdc_Odr_DeliveryMethod() {
  var jvInfo = "";

  var joCtrl = $j("#step04").find("#deliveryPos").find("input[id^='rdoDelivery']:checked");

  if (joCtrl.length > 0) {
    if (joCtrl.val() != "-1") {
      if (joCtrl.attr("id") == "rdoDeliveryOverseas") {
        joCtrl = $j("#step04").find("#selOverseasDeliveryArea option:selected");
        var jvPrice = joCtrl.attr("price");
      }
      else {
        var jvPrice = (fdc_CALC_CouponCountByType(jcCOUPON_DELIVERYFEE) > 0 ? "0" : joCtrl.attr("price"));

      }
      jvInfo = joCtrl.val() + "#" + jvPrice;
    }
  }
  return jvInfo;
}

function fdc_Odr_YesMoney() {
  var jvInfo = "";

  var joCtrl = $j("#liYesMoney").find("#txtYesMoney");
  var rcvCtrl = $j("#baseYesMoney").find("#rcvYesMoney");

  if (joCtrl.length > 0 && rcvCtrl.length > 0) {
    if (joCtrl.val() != "") {
      var jvVal = joCtrl.val().replace(/,/g, '');
      if ($j.isNumeric(jvVal)) {
        jvInfo = (parseInt(jvVal) > 0 ? rcvCtrl.attr("idcode") + "#" + parseInt(jvVal) : "");
      }
    }
  }

  return jvInfo;
}

function fdc_Odr_YesDeposit() {
  var jvInfo = "";

  var joCtrl = $j("#liYesDeposit").find("#txtYesDeposit");
  var rcvCtrl = $j("#baseYesDeposit").find("#rcvYesDeposit");

  if (joCtrl.length > 0 && rcvCtrl.length > 0) {
    if (joCtrl.val() != "") {
      var jvVal = joCtrl.val().replace(/,/g, '');
      if ($j.isNumeric(jvVal)) {
        jvInfo = (parseInt(jvVal) > 0 ? rcvCtrl.attr("idcode") + "#" + parseInt(jvVal) : "");
      }
    }
  }

  return jvInfo;
}

function fdc_Odr_YesGift() {
  var jvInfo = "";

  var joCtrl = $j("#liYesGift").find("#txtYesGift");

  if (joCtrl.length > 0) {
    if (joCtrl.val() != "") {
      var jvVal = joCtrl.val().replace(/,/g, '');
      if ($j.isNumeric(jvVal)) {
        jvInfo = (parseInt(jvVal) > 0 ? joCtrl.attr("usedgiftinfo") : "");
      }
    }
  }

  return jvInfo;
}

function fdc_Odr_BenepiaPoint() {
  var jvInfo = "";

  if (jgIsShowBenepia == jcSHOW_ON) {
    if ($j("#liBenepiaPoint").find("#cbxBenepiaPoint").prop("checked") == true) {
      var joCtrl = $j("#liBenepiaPoint").find("#txtBenepiaPoint");

      if (joCtrl.length > 0) {
        if (joCtrl.val() != "") {
          var jvVal = joCtrl.val().replace(/,/g, '');
          if ($j.isNumeric(jvVal)) {
            jvInfo = (parseInt(jvVal) > 0 ? joCtrl.attr("usedbenepiainfo") + "#" + parseInt(jvVal) : "");
          }
        }
      }
    }
  }

  return jvInfo;
}

function fdc_Odr_GiftTicketDiscount() {
  var jvInfo = "";
  var mHash = new jsf_def_Hash();

  try {
    $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").each(function (i) {
      var jvCode = parseInt($j(this).attr("GT_IdPromotion"));
      var jvValue = parseInt($j(this).attr("GT_DisAmount"));

      if (jvCode > 0 && jvValue > 0) {
        if (mHash.hasItem(jvCode) == true)
          mHash.setItem(jvCode, parseInt(mHash.getItem(jvCode)) + 1);
        else
          mHash.setItem(jvCode, 1);
      }

      jvCode = parseInt($j(this).attr("GT_IdYesPromotion"));
      jvValue = parseInt($j(this).attr("GT_DisYesAmount"));

      if (jvCode > 0 && jvValue > 0) {
        if (mHash.hasItem(jvCode) == true)
          mHash.setItem(jvCode, parseInt(mHash.getItem(jvCode)) + 1);
        else
          mHash.setItem(jvCode, 1);
      }
    });

    if (mHash.length > 0) {
      for (var key in mHash.items) {
        jvInfo += key + "#" + mHash.items[key] + "^";
      }
    }
  }
  finally {
    mHash.clear();
  }

  return jvInfo;
}

function fdc_Odr_GiftTicket() {
  var jvInfo = "";

  $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").each(function (i) {
    jvInfo += $j(this).attr("GT_MoneyType") + "#" + $j(this).attr("GT_No") + "#" + $j(this).attr("GT_SelPrice") + "^";
  });

  return jvInfo;
}

function fdc_Odr_PayMethod() {
  var jvInfo = "";

  var joCtrl = $j("#step05").find("#paymethodPos").find("input[id^='rdoPays']:checked");

  if (joCtrl.length > 0) jvInfo = joCtrl.val();

  return jvInfo;
}

function fdc_Odr_BankInfo() {
  var jvInfo = "";

  if (fdc_Odr_PayMethod() == jcPAY_VBANK) {
    var joCtrl = $j("#step05").find("#paymethodPos").find("#selBank option:selected");

    if (joCtrl.length > 0) jvInfo = joCtrl.val();
  }

  return jvInfo;
}

function fdc_Odr_OKCashbag() {
  var jvInfo = "";

  if (jgIsShowOKCashbag == jcSHOW_ON) {
    var joOKCashbag = $j("#step05").find("#liOKCashbag");

    jvInfo = $j.trim(joOKCashbag.find("#txtOKCashbagCardNo1").val()) + $j.trim(joOKCashbag.find("#txtOKCashbagCardNo2").val()) + $j.trim(joOKCashbag.find("#txtOKCashbagCardNo3").val()) + $j.trim(joOKCashbag.find("#txtOKCashbagCardNo4").val());
  }

  return jvInfo;
}

function fdc_Odr_PayMoney() {
  var jvTotalPrice = 0, jvTicketPrice = 0, jvBookingFee = 0, jvDeliveryFee = 0;
  var jvDiscountPrice = 0, jvCouponPrice = 0, jvYesMoneyPrice = 0, jvYesDepositPrice = 0, jvYesGiftPrice = 0;
  var jvGiftTicketPrice = 0, jvOtherPays = 0;

  jvTicketPrice = fdc_GetTotalTicketInfo("PRICE");
  jvBookingFee = fdc_CALC_BookingFee();
  jvDeliveryFee = fdc_CALC_DeliveryFee();

  jvDiscountPrice = fdc_CALC_DiscountPrice();
  jvCouponPrice = fdc_CALC_CouponPrice();
  jvYesMoneyPrice = fdc_CALC_YesMoneyPrice();
  jvYesDepositPrice = fdc_CALC_YesDepositPrice();
  jvYesGiftPrice = fdc_CALC_YesGiftPrice();
  jvGiftTicketPrice = fdc_CALC_GiftTicketPrice();
  jvOtherPaysPrice = fdc_CALC_OtherPaysPrice();

  jvTotalPrice = (jvTicketPrice + jvBookingFee + jvDeliveryFee) - (jvDiscountPrice + jvCouponPrice + jvYesMoneyPrice + jvYesDepositPrice + jvYesGiftPrice + jvGiftTicketPrice + jvOtherPaysPrice);

  return jvTotalPrice;
}

function fdc_CALC_BookingFee() {
  var jvFee = 0;

  var joCtrl = $j("#divBookingFee").find("#EtcFeeAmount");

  if (joCtrl.length > 0) {
    if (joCtrl.val() != "")
      jvFee = parseInt(joCtrl.val());
  }

  return jvFee;
}

function fdc_CALC_DeliveryFee() {
  var jvFee = 0;

  var joDvry = $j("#step04").find("#deliveryPos").find("input[id^='rdoDelivery']:checked");

  if (joDvry.length > 0) {
    if (joDvry.attr("id") == "rdoDeliveryOverseas") {
      var jvPrice = $j("#step04").find("#selOverseasDeliveryArea option:selected").attr("price");
    }
    else {
      var jvPrice = (fdc_CALC_CouponCountByType(jcCOUPON_DELIVERYFEE) > 0 ? "0" : joDvry.attr("price"));
    }
    jvFee = parseInt(jvPrice);
  }

  return jvFee;
}

function fdc_CALC_DiscountCount() {
  var jvCount = 0;

  $j("#divPromotionList").find("select[id^='selPromotion']").each(function (index) {
    jvCount += parseInt($j(this).find("option:selected").val());
  });

  return jvCount;
}

function fdc_CALC_DiscountPrice() {
  var jvPrice = 0;

  $j("#divPromotionList").find("select[id^='selPromotion']").each(function (index) {
    jvPrice += parseInt($j(this).find("option:selected").val()) * parseInt($j(this).attr("amount"));
  });

  jvPrice += fdc_CALC_GiftTicketDiscountAmount();

  return jvPrice;
}

function fdc_CALC_CouponPrice() {
  var jvPrice = 0;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    jvPrice += parseInt($j(this).attr("price"));
  });

  return jvPrice;
}

function fdc_CALC_CouponPriceByOption(jpOption) {
  var jvPrice = 0;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    if ((parseInt($j(this).attr("couponoption")) & jpOption) == jpOption)
      jvPrice += parseInt($j(this).attr("price"));
  });

  return jvPrice;
}

function fdc_CALC_CouponCountByNotOption(jpOption, jpIdCoupon) {
  var jvCount = 0;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    if (((parseInt($j(this).attr("couponoption")) & jpOption) != jpOption) && $j(this).val() != jpIdCoupon)
      jvCount++;
  });

  return jvCount;
}

function fdc_CALC_CouponExistByTypeWithoutSel(jpCouponType) {
  var jvIsExist = false;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox").each(function (index) {
    if (parseInt($j(this).attr("coupontype")) == jpCouponType) {
      jvIsExist = true;
      return false;
    }
  });

  return jvIsExist;
}

function fdc_CALC_CouponCountByType(jpCouponType) {
  var jvfreeChargeCount = 0;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    if (parseInt($j(this).attr("coupontype")) == jpCouponType)
      jvfreeChargeCount++;
  });

  return jvfreeChargeCount;
}

function fdc_CALC_CouponLimitNoByType(jpCouponType) {
  var jvfreeChargeLimitNo = 0;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    if (parseInt($j(this).attr("coupontype")) == jpCouponType)
      jvfreeChargeLimitNo += parseInt($j(this).attr("limitno"));
  });

  return jvfreeChargeLimitNo;
}

function fdc_CALC_CouponLimitAmount() {
  var jvCouponLimitAmount = 0;

  $j("#divCouponList").find("input[id='CheckCoupon']:checkbox:checked").each(function (index) {
    jvCouponLimitAmount += parseInt($j(this).attr("limitamount"));
  });

  return jvCouponLimitAmount;
}

function fdc_CALC_YesMoneyPrice() {
  var jvPrice = 0;

  var joCtrl = $j("#liYesMoney").find("#txtYesMoney");

  if (joCtrl.length > 0) {
    if (joCtrl.val() != "") {
      var jvVal = joCtrl.val().replace(/,/g, '');
      if ($j.isNumeric(jvVal)) {
        jvPrice = (parseInt(jvVal) > 0 ? parseInt(jvVal) : 0);
      }
    }
  }

  return jvPrice;
}

function fdc_CALC_YesDepositPrice() {
  var jvPrice = 0;

  var joCtrl = $j("#liYesDeposit").find("#txtYesDeposit");

  if (joCtrl.length > 0) {
    if (joCtrl.val() != "") {
      var jvVal = joCtrl.val().replace(/,/g, '');
      if ($j.isNumeric(jvVal)) {
        jvPrice = (parseInt(jvVal) > 0 ? parseInt(jvVal) : 0);
      }
    }
  }

  return jvPrice;
}

function fdc_CALC_YesGiftPrice() {
  var jvPrice = 0;

  var joCtrl = $j("#liYesGift").find("#txtYesGift");

  if (joCtrl.length > 0) {
    if (joCtrl.val() != "") {
      var jvVal = joCtrl.val().replace(/,/g, '');
      if ($j.isNumeric(jvVal)) {
        jvPrice = (parseInt(jvVal) > 0 ? parseInt(jvVal) : 0);
      }
    }
  }

  return jvPrice;
}

function fdc_CALC_GiftTicketDiscountAmount() {
  var jvAmount = 0;

  $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").each(function (i) {
    var jvCode = parseInt($j(this).attr("GT_IdPromotion"));
    var jvValue = parseInt($j(this).attr("GT_DisAmount"));

    if (jvCode > 0 && jvValue > 0) jvAmount += jvValue;

    jvCode = parseInt($j(this).attr("GT_IdYesPromotion"));
    jvValue = parseInt($j(this).attr("GT_DisYesAmount"));

    if (jvCode > 0 && jvValue > 0) jvAmount += jvValue;
  });

  return jvAmount;
}

function fdc_CALC_GiftTicketDisplayPrice() {
  var jvPrice = 0;

  $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").each(function (i) {
    jvPrice += parseInt($j(this).attr("GT_TkPrice"));
  });

  return jvPrice;
}

function fdc_CALC_GiftTicketPrice() {
  var jvPrice = 0;

  $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").each(function (i) {
    jvPrice += parseInt($j(this).attr("GT_SelPrice"));
  });

  return jvPrice;
}

function fdc_CALC_GiftTicketCount() {
  return $j("#divGiftTicketUsedInfo").find("input[id^='CheckGiftTicket']:checked").length;
}

function fdc_CALC_BenepiaPoint() {
  var jvPoint = 0;

  if (jgIsShowBenepia == jcSHOW_ON) {
    if ($j("#liBenepiaPoint").find("#cbxBenepiaPoint").prop("checked") == true) {
      var joCtrl = $j("#liBenepiaPoint").find("#txtBenepiaPoint");

      if (joCtrl.length > 0) {
        if (joCtrl.val() != "") {
          var jvVal = joCtrl.val().replace(/,/g, '');
          if ($j.isNumeric(jvVal)) {
            jvPoint = (parseInt(jvVal) > 0 ? parseInt(jvVal) : 0);
          }
        }
      }
    }
  }

  return jvPoint;
}

function fdc_CALC_OtherPaysPrice() {
  var jvPrice = 0;

  jvPrice = fdc_CALC_BenepiaPoint();

  return jvPrice;
}

function fdc_UptPriceBoard() {
  var jvTotalPrice = 0, jvTicketPrice = 0, jvBookingFee = 0, jvDeliveryFee = 0;
  var jvDiscountPrice = 0, jvCouponPrice = 0, jvYesMoneyPrice = 0, jvYesDepositPrice = 0, jvYesGiftPrice = 0;
  var jvGiftTicketPrice = 0, jvOtherPays = 0;

  jvTicketPrice = fdc_GetTotalTicketInfo("PRICE");
  jvBookingFee = fdc_CALC_BookingFee();
  jvDeliveryFee = fdc_CALC_DeliveryFee();

  jvDiscountPrice = fdc_CALC_DiscountPrice();
  jvCouponPrice = fdc_CALC_CouponPrice();
  jvYesMoneyPrice = fdc_CALC_YesMoneyPrice();
  jvYesDepositPrice = fdc_CALC_YesDepositPrice();
  jvYesGiftPrice = fdc_CALC_YesGiftPrice();
  jvGiftTicketPrice = fdc_CALC_GiftTicketPrice();
  jvOtherPaysPrice = fdc_CALC_OtherPaysPrice();

  jvTotalPrice = (jvTicketPrice + jvBookingFee + jvDeliveryFee) - (jvDiscountPrice + jvCouponPrice + jvYesMoneyPrice + jvYesDepositPrice + jvYesGiftPrice + jvGiftTicketPrice + jvOtherPaysPrice);

  var joCtrl = $j("#StateBoard");

  joCtrl.find("li.tk_price").find("span").text(fdc_fmtNumber(jvTicketPrice));
  joCtrl.find("li.tk_charge").find("span").text(fdc_fmtNumber(jvBookingFee));
  joCtrl.find("li.tk_deli").find("span").text(fdc_fmtNumber(jvDeliveryFee));
  joCtrl.find("li.tk_sumplus").find("span").text(fdc_fmtNumber(jvTicketPrice + jvBookingFee + jvDeliveryFee));

  joCtrl.find("li.tk_disc").find("span").text(fdc_fmtNumber(-1 * (jvDiscountPrice - fdc_CALC_GiftTicketDiscountAmount())));
  joCtrl.find("li.tk_coupon").find("span").text(fdc_fmtNumber(-1 * jvCouponPrice));
  joCtrl.find("li.tk_yesmoney").find("span").text(fdc_fmtNumber(-1 * jvYesMoneyPrice));
  joCtrl.find("li.tk_yesdeposit").find("span").text(fdc_fmtNumber(-1 * jvYesDepositPrice));
  joCtrl.find("li.tk_yesgift").find("span").text(fdc_fmtNumber(-1 * jvYesGiftPrice));
  joCtrl.find("li.tk_giftticket").find("span").text(fdc_fmtNumber(-1 * fdc_CALC_GiftTicketDisplayPrice()));
  joCtrl.find("li.tk_otherpays").find("span").text(fdc_fmtNumber(-1 * jvOtherPaysPrice));
  joCtrl.find("li.tk_summinus").find("span").text(fdc_fmtNumber(-1 * ((jvDiscountPrice - fdc_CALC_GiftTicketDiscountAmount()) + jvCouponPrice + jvYesMoneyPrice + jvYesDepositPrice + jvYesGiftPrice + fdc_CALC_GiftTicketDisplayPrice() + jvOtherPaysPrice)));

  joCtrl.find("span.t_result").html(fdc_fmtNumber(jvTotalPrice) + "<span>원</span>");
}

function fdc_InitData(jpStep) {
  if (jpStep == jcSTEP1 || jpStep == jcSTEP1_1 || jpStep == jcSTEP1_2 || jpStep == jcSTEP1_3 || jpStep == jcSTEP1_4 ||
      jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
    $j("#step03 div.disc_select").find("#spanPromotionSeat").html("");
    $j("#SelPromotionStorage").html("");
    $j("#divPromotionList").html("");
    $j("#divCouponList").html("");
    $j("#step04").find("#deliveryPos").html("");
    $j("#step05")
    .find("#txtYesMoney").val("").end()
    .find("#txtYesDeposit").val("").end()
    .find("#txtYesGift").val("").attr("usedgiftinfo", "").end()
    .find("#txtBenepiaPoint").val("").attr("usedbenepiainfo", "");
    $j("#divGiftTicketUsedView").html("");
    $j("#divGiftTicketUsedInfo").html("");
    $j("#divBookingFee").html("");

    if (jpStep == jcSTEP1) {
      $j("#IdTime").val("");
      $j("#IdSeat").val("");
      $j("#IdSeatClass").val("");
      $j("#IdSeatClassPrice").val("");

      if ($j("#SeatFlashArea").css("display") == "none") {
        var jvCurDate = new Date();
        jgPerfFirstYear = jvCurDate.getFullYear();
        jgPerfFirstMonth = parseInt(jvCurDate.getMonth());
        jgPerfFirstDay = jvCurDate.getDate();
      } else {
        var jvFlashDate = $j("#selFlashDateAll option:selected").val().split('-');
        jgPerfFirstYear = jvFlashDate[0];
        jgPerfFirstMonth = parseInt(jvFlashDate[1], 10) - 1;
        jgPerfFirstDay = parseInt(jvFlashDate[2], 10);
      }

      jgCalSelDate = "";
      $j("#step01_date #calendar").html("");
      $j("#step01_notice #guideview").html("");
    } else if (jpStep == jcSTEP1_1) {
      var jvPrevDate;

      if (jgPerfFirstMonth == 0)
        jvPrevDate = new Date(jgPerfFirstYear - 1, 11, 1);
      else
        jvPrevDate = new Date(jgPerfFirstYear, jgPerfFirstMonth - 1, 1);

      jgPerfFirstYear = jvPrevDate.getFullYear();
      jgPerfFirstMonth = jvPrevDate.getMonth();
      jgPerfFirstDay = jvPrevDate.getDate();

      $j("#step01_date #calendar").html("");
    } else if (jpStep == jcSTEP1_2) {
      var jvNextDate;

      if (jgPerfFirstMonth == 11)
        jvNextDate = new Date(jgPerfFirstYear + 1, 0, 1);
      else
        jvNextDate = new Date(jgPerfFirstYear, jgPerfFirstMonth + 1, 1);

      jgPerfFirstYear = jvNextDate.getFullYear();
      jgPerfFirstMonth = jvNextDate.getMonth();
      jgPerfFirstDay = jvNextDate.getDate();

      $j("#step01_date #calendar").html("");
    } else if (jpStep == jcSTEP1_3) {
      $j("#IdTime").val("");
      $j("#IdSeat").val("");
      $j("#IdSeatClass").val("");
      $j("#IdSeatClassPrice").val("");
    } else if (jpStep == jcSTEP1_4 || jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
      $j("#IdSeatClass").val("");
      $j("#IdSeatClassPrice").val("");

      if (jpStep == jcSTEP1_4) {
        $j("#IdTime").val("");
        $j("#IdSeat").val("");

        $j("#step01_time #ulSeatSpace").html("");
        $j("#StateBoard #tk_time").text("");
        $j("#StateBoard #tk_count").text("");
        $j("#StateBoard #tk_seat").html("");
      } else if (jpStep == jcSTEP1_4_1) {
        $j("#IdSeat").val("");

        if ($j("#ulTime > li.on").length == 0) $j("#step01_time #ulSeatSpace").html("");
        $j("#StateBoard #tk_count").text("");
      } else if (jpStep == jcSTEP1_4_2) {
        $j("#IdSeat").val("");
      } else if (jpStep == jcSTEP1_4_3) { }
    }
  }
  else if (jpStep == jcSTEP_SEAT) { }
  else if (jpStep == jcSTEP3 || jpStep == jcSTEP3_1 || jpStep == jcSTEP3_2 || jpStep == jcSTEP3_3 || jpStep == jcSTEP3_4 || jpStep == jcSTEP3_5) {
    if (jpStep == jcSTEP3) {
      $j("#step03 div.disc_select").find("#spanPromotionSeat").html("");
      $j("#SelPromotionStorage").html("");
      $j("#divPromotionList").html("");
      $j("#divCouponList").html("");
      $j("#step04").find("#deliveryPos").html("");
      $j("#step05")
      .find("#txtYesMoney").val("").end()
      .find("#txtYesDeposit").val("").end()
      .find("#txtYesGift").val("").attr("usedgiftinfo", "").end()
      .find("#txtBenepiaPoint").val("").attr("usedbenepiainfo", "");
      $j("#divGiftTicketUsedView").html("");
      $j("#divGiftTicketUsedInfo").html("");
      $j("#divBookingFee").html("");
    }
    else if (jpStep == jcSTEP3_1) { }
    else if (jpStep == jcSTEP3_2) { }
    else if (jpStep == jcSTEP3_3) { }
    else if (jpStep == jcSTEP3_4) { }
    else if (jpStep == jcSTEP3_5) { }
  }
  else if (jpStep == jcSTEP4 || jpStep == jcSTEP4_1 || jpStep == jcSTEP4_2 || jpStep == jcSTEP4_3) {
    if (jpStep == jcSTEP4) {
      $j("#step04").find("#deliveryPos").html("");
      $j("#step05")
      .find("#txtYesMoney").val("").end()
      .find("#txtYesDeposit").val("").end()
      .find("#txtYesGift").val("").attr("usedgiftinfo", "").end()
      .find("#txtBenepiaPoint").val("").attr("usedbenepiainfo", "");
      $j("#divGiftTicketUsedView").html("");
      $j("#divGiftTicketUsedInfo").html("");
    } else if (jpStep == jcSTEP4_1) { }
    else if (jpStep == jcSTEP4_2) { }
    else if (jpStep == jcSTEP4_3) { }
  }
  else if (jpStep == jcSTEP5 || jpStep == jcSTEP5_1 || jpStep == jcSTEP5_2 || jpStep == jcSTEP5_3 || jpStep == jcSTEP5_4
      || jpStep == jcSTEP5_5 || jpStep == jcSTEP5_6 || jpStep == jcSTEP5_7) {
    if (jpStep == jcSTEP5) {
      $j("#step05")
      .find("#txtYesMoney").val("").end()
      .find("#txtYesDeposit").val("").end()
      .find("#txtYesGift").val("").attr("usedgiftinfo", "").end()
      .find("#txtBenepiaPoint").val("").attr("usedbenepiainfo", "");
      $j("#divGiftTicketUsedView").html("<span class='ticket fst'>사용하신 예매권이 없습니다.</span>");
      $j("#divGiftTicketUsedInfo").html("");
    }
    else if (jpStep == jcSTEP5_1) { }
    else if (jpStep == jcSTEP5_2) { }
    else if (jpStep == jcSTEP5_3) { }
    else if (jpStep == jcSTEP5_4) { }
    else if (jpStep == jcSTEP5_5) { }
    else if (jpStep == jcSTEP5_6) { }
    else if (jpStep == jcSTEP5_7) { }
  } else if (jpStep == jcSTEP_PAY) { }
}

function fdc_BindData(jpStep) {
  if (jpStep == jcSTEP1 || jpStep == jcSTEP1_1 || jpStep == jcSTEP1_2 || jpStep == jcSTEP1_3 || jpStep == jcSTEP1_4 ||
      jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
    if (jpStep == jcSTEP1) {
      fax_GetPerfSaleInfo(jgIdPerf);
      fax_GetPerfGuideView(jgIdPerf);
      if ($j("#SeatFlashArea").css("display") == "none") fax_GetPerfFlashDateAll(jgIdPerf);

      if ($j("#SeatFlashArea").css("display") == "none")
        fax_GetPerfDateTopOne(jgIdPerf, jgIdSelTime);
      else
        fpc_ShowCalendar(jgPerfFirstYear, jgPerfFirstMonth, jgPerfFirstDay);
    } else if (jpStep == jcSTEP1_1) {
      fpc_ShowCalendar(jgPerfFirstYear, jgPerfFirstMonth, jgPerfFirstDay);
    } else if (jpStep == jcSTEP1_2) {
      fpc_ShowCalendar(jgPerfFirstYear, jgPerfFirstMonth, jgPerfFirstDay);
    } else if (jpStep == jcSTEP1_3) { }
    else if (jpStep == jcSTEP1_4 || jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
      if (jpStep == jcSTEP1_4) {
        fax_GetPerfTime(jgIdPerf, jgCalSelDate);
      } else if (jpStep == jcSTEP1_4_1) {
        if ($j("#ulTime > li").length > 0) {
          var joSelItem = $j("#ulTime > li.on");

          if (joSelItem.length == 1) {
            if (joSelItem.attr("timeoption") == jcSEAT) {
              fax_GetTimeSeatRemain($j("#IdTime").val(), $j("#hiddenGenreId").val(), $j("#hiddenDisplayRemainSeat").val());
            }
            else {
              fax_GetTimeNoSeatClass_v2($j("#IdTime").val(), jgIdPerf);
            }

            //YESPoint 적립대상회차
            fdc_TimeYesPoint_info(joSelItem.attr("yespointoption"));

          }
        }
      } else if (jpStep == jcSTEP1_4_2) { }
      else if (jpStep == jcSTEP1_4_3) {
        var joSelItem = $j("#ulTime > li.on");

        if (joSelItem.length == 1) {
          if (joSelItem.attr("timeoption") == jcSEAT)
            fax_GetSeatChoiceInfo($j("#IdTime").val(), $j("#IdSeat").val());
        }
      }
    }
  }
  else if (jpStep == jcSTEP_SEAT) {
    fax_GetTimeBlock($j("#IdTime").val(), $j("#ulTime > li.on").attr("idhall"), jgIsHcardOpt);
  } else if (jpStep == jcSTEP3 || jpStep == jcSTEP3_1 || jpStep == jcSTEP3_2 || jpStep == jcSTEP3_3 || jpStep == jcSTEP3_4 || jpStep == jcSTEP3_5) {
    if (jpStep == jcSTEP3) {

      fdc_SetRadioPromotionSeat();
      fax_GetPromotionByClass($j("#IdTime").val(), jgCalSelDate, $j("#IdSeatClass").val(), jgIsHcardOpt);

      if (jgIdPerf == '25609' || jgIdPerf == '25520' || jgIdPerf == '27165' || jgIdPerf == '27453' || jgIdPerf == '27563' || jgIdPerf == '27573' || jgIdPerf == '27589' || jgIdPerf == '28868' || jgIdPerf == '30742') {
        fdc_SetHdCardCtrl();
      };

      var jvTicketPrice = fdc_GetTotalTicketInfo("PRICE");
      var jvTicketCount = fdc_GetTotalTicketInfo("COUNT");

      fax_GetUserCoupon($j("#IdTime").val(), jvTicketPrice, jvTicketCount, $j("#IdSeatClassPrice").val());
      fdc_GetEtcFees();
    }
    else if (jpStep == jcSTEP3_1) { }
    else if (jpStep == jcSTEP3_2) { }
    else if (jpStep == jcSTEP3_3) {
      var jvTicketPrice = fdc_GetTotalTicketInfo("PRICE");
      var jvTicketCount = fdc_GetTotalTicketInfo("COUNT");

      fax_GetUserCoupon($j("#IdTime").val(), jvTicketPrice, jvTicketCount, $j("#IdSeatClassPrice").val());
    }
    else if (jpStep == jcSTEP3_4) { }
    else if (jpStep == jcSTEP3_5) { }
  }
  else if (jpStep == jcSTEP4 || jpStep == jcSTEP4_1 || jpStep == jcSTEP4_2 || jpStep == jcSTEP4_3) {
    if (jpStep == jcSTEP4) {
      if (fdc_GetIsDeliveryPossible() == false) {
        var joDvry = $j("#step04").find("#deliveryPos");

        joDvry.html("<input type='radio' name='rdoDelivery' id='rdoDeliveryBase' value='-1' price='0' datedifference='' onclick='fdc_DeliveryMethodChange(this);' /><label for='rdoDeliveryBase'>현장수령 [배송불가 할인 포함]</label>");
        joDvry.find("input[id^='rdoDelivery']:first").prop("checked", true).trigger("click");
      } else {
        if (fdc_CheckWillCall() == false) {
          fax_GetDeliveyMethod($j("#IdTime").val(), jgCalSelDate);
        }
        else{
          var joDvry = $j("#step04").find("#deliveryPos");

          joDvry.html("<input type='radio' name='rdoDelivery' id='rdoDeliveryBase' value='-1' price='0' datedifference='' onclick='fdc_DeliveryMethodChange(this);' /><label for='rdoDeliveryBase'>현장수령</label>");
          joDvry.find("input[id^='rdoDelivery']:first").prop("checked", true).trigger("click");
        }
      }

      fax_GetDeliveyUserInfo();
      fdc_GetEtcFees();
    } else if (jpStep == jcSTEP4_1) { }
    else if (jpStep == jcSTEP4_2) { }
    else if (jpStep == jcSTEP4_3) { }
  }
  else if (jpStep == jcSTEP5 || jpStep == jcSTEP5_1 || jpStep == jcSTEP5_2 || jpStep == jcSTEP5_3 || jpStep == jcSTEP5_4
      || jpStep == jcSTEP5_5 || jpStep == jcSTEP5_6 || jpStep == jcSTEP5_7) {
    if (jpStep == jcSTEP5) {
      fax_GetYesPays(jcPAYTYPE_ALL);
      fax_GetGiftTicketCount($j("#IdTime").val());
      fdc_GetEtcFees();
      fax_GetPayMethod($j("#IdTime").val(), jgCalSelDate, jgIsMPoint);
      fax_GetCancelFeePolicy($j("#IdTime").val());
      if (jgSubGenre == 27288) {
        $j("#liLiveRefundinfo").show();
        fax_GetRefundBank();
      };
    }
    else if (jpStep == jcSTEP5_1) { }
    else if (jpStep == jcSTEP5_2) { }
    else if (jpStep == jcSTEP5_3) { }
    else if (jpStep == jcSTEP5_4) { }
    else if (jpStep == jcSTEP5_5) { }
    else if (jpStep == jcSTEP5_6) { }
    else if (jpStep == jcSTEP5_7) { }
  } else if (jpStep == jcSTEP_PAY) { }
}

function fdc_CheckWillCall() {
  var jvWillCallOK = false;

  if (jgIdPerf == '32059' && $j("#IdSeat").val() != "") {
    var jvSeats = $j("#IdSeat").val().split('-');
    for (var i = 0; i < jvSeats.length; i++) {
      var jvSeatY = parseInt(jvSeats[i] / 100000);
      if (jvSeatY == 6 || jvSeatY == 7 || jvSeatY == 8 || jvSeatY == 32 || jvSeatY == 33 || jvSeatY == 34 || jvSeatY == 58 || jvSeatY == 59 || jvSeatY == 60) {
        jvWillCallOK = true; //true;
      }
    }
  }

  if (jgIdPerf == '32163' && $j("#IdSeat").val() != "") {
    var jvSeats = $j("#IdSeat").val().split('-');
    for (var i = 0; i < jvSeats.length; i++) {
      var jvSeatY = parseInt(jvSeats[i] / 100000);
      if (jvSeatY == 6 || jvSeatY == 7 || jvSeatY == 8 || jvSeatY == 9 || jvSeatY == 10 || jvSeatY == 11 || jvSeatY == 12) {
        jvWillCallOK = true; //true;
      }
    }
  }

  if (jgIdPerf == '32150' && $j("#IdSeat").val() != "") {
    var jvSeats = $j("#IdSeat").val().split('-');
    for (var i = 0; i < jvSeats.length; i++) {
      var jvSeatY = parseInt(jvSeats[i] / 100000);
      if (jvSeatY == 7 || jvSeatY == 8 || jvSeatY == 9 || jvSeatY == 48 || jvSeatY == 49 || jvSeatY == 50) {
        jvWillCallOK = true; //true;
      }
    }
  }

  if (jgIdPerf == '32182' && $j("#IdSeat").val() != "") {
    var jvSeats = $j("#IdSeat").val().split('-');
    for (var i = 0; i < jvSeats.length; i++) {
      var jvSeatY = parseInt(jvSeats[i] / 100000);
      if (jvSeatY == 2 || jvSeatY == 3 || jvSeatY == 4 || jvSeatY == 5 || jvSeatY == 6) {
        jvWillCallOK = true; //true;
      }
    }
  }

  return jvWillCallOK;
}

function fdc_DispRegion(jpStep) {
  if (jpStep == jcSTEP1 || jpStep == jcSTEP1_1 || jpStep == jcSTEP1_2 || jpStep == jcSTEP1_3 || jpStep == jcSTEP1_4 ||
      jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
    if ($j("#SeatFlashArea").css("display") == "none") {
      fdc_ShowProcessTitleBar(1);
      fdc_ShowStepCtrlButton(1);

      $j("#ContentsArea").css("display", "block")
      .find("#step01 > div[id^='step01_']").css("display", "block").end();
    }

    $j("#step03").css("display", "none");
    $j("#step04").css("display", "none");
    $j("#step05").css("display", "none");

    if (jpStep == jcSTEP1) { fdc_SeatButtonSwitch("hide_seat"); }
    else if (jpStep == jcSTEP1_1) { fdc_SeatButtonSwitch("hide_seat"); }
    else if (jpStep == jcSTEP1_2) { fdc_SeatButtonSwitch("hide_seat"); }
    else if (jpStep == jcSTEP1_3) { fdc_SeatButtonSwitch("hide_seat"); }
    else if (jpStep == jcSTEP1_4 || jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
      if (jpStep == jcSTEP1_4) {
        var jvDate = new Date(jgCalSelDate.replace(/-/g, "/"));
        $j("#step01_time div.select_day").find("span").text(jvDate.toLocaleDateString());

        fdc_SeatButtonSwitch("hide_seat");
      } else if (jpStep == jcSTEP1_4_1) {
        var joSelItem = $j("#ulTime > li.on");

        if (joSelItem.length == 0)
          fdc_SeatButtonSwitch("hide_seat");
        else {
          if (joSelItem.attr("timeoption") == jcSEAT)
            fdc_SeatButtonSwitch("show_seat");
          else
            fdc_SeatButtonSwitch("hide_seat");
        }
      } else if (jpStep == jcSTEP1_4_2) {
        fdc_SeatButtonSwitch("show_seat");
      } else if (jpStep == jcSTEP1_4_3) {
        fdc_SeatButtonSwitch("show_reseat");
      }
    }
  }
  else if (jpStep == jcSTEP_SEAT) { }
  else if (jpStep == jcSTEP3 || jpStep == jcSTEP3_1 || jpStep == jcSTEP3_2 || jpStep == jcSTEP3_3 || jpStep == jcSTEP3_4 || jpStep == jcSTEP3_5) {
    $j("#step01").css("display", "none");
    $j("#step04").css("display", "none");
    $j("#step05").css("display", "none");

    if (jpStep == jcSTEP3) {
      fdc_ShowProcessTitleBar(3);
      fdc_ShowStepCtrlButton(3);
      if (jgIdPerf == '19917' || jgIdPerf == '22110') {
        //fdc_PopExoAgree();
      };

      $j("#step03").css("display", "block");
    }
    else if (jpStep == jcSTEP3_1) { }
    else if (jpStep == jcSTEP3_2) { }
    else if (jpStep == jcSTEP3_3) { }
    else if (jpStep == jcSTEP3_4) { }
    else if (jpStep == jcSTEP3_5) { }
  }
  else if (jpStep == jcSTEP4 || jpStep == jcSTEP4_1 || jpStep == jcSTEP4_2 || jpStep == jcSTEP4_3) {
    $j("#step01").css("display", "none");
    $j("#step03").css("display", "none");
    $j("#step05").css("display", "none");

    if (jpStep == jcSTEP4) {
      fdc_ShowProcessTitleBar(4);
      fdc_ShowStepCtrlButton(4);

      $j("#step04").css("display", "block");
    } else if (jpStep == jcSTEP4_1) { }
    else if (jpStep == jcSTEP4_2) { }
    else if (jpStep == jcSTEP4_3) { }
  }
  else if (jpStep == jcSTEP5 || jpStep == jcSTEP5_1 || jpStep == jcSTEP5_2 || jpStep == jcSTEP5_3 || jpStep == jcSTEP5_4
      || jpStep == jcSTEP5_5 || jpStep == jcSTEP5_6 || jpStep == jcSTEP5_7) {
    $j("#step01").css("display", "none");
    $j("#step03").css("display", "none");
    $j("#step04").css("display", "none");

    if (jpStep == jcSTEP5) {
      fdc_ShowProcessTitleBar(5);
      fdc_ShowStepCtrlButton(5);

      $j("#step05").css("display", "block");

      if (jgIsShowBenepia == jcSHOW_ON) $j("#step05").find("#liBenepiaPoint").css("display", "block");
      else $j("#step05").find("#liBenepiaPoint").css("display", "none");

      if (jgIsShowOKCashbag == jcSHOW_ON) $j("#step05").find("#liOKCashbag").css("display", "block");
      else $j("#step05").find("#liOKCashbag").css("display", "none");
    }
    else if (jpStep == jcSTEP5_1) { }
    else if (jpStep == jcSTEP5_2) { }
    else if (jpStep == jcSTEP5_3) { }
    else if (jpStep == jcSTEP5_4) { }
    else if (jpStep == jcSTEP5_5) { }
    else if (jpStep == jcSTEP5_6) { }
    else if (jpStep == jcSTEP5_7) { }
  } else if (jpStep == jcSTEP_PAY) { }
}

function fdc_emailClick() {
  var OrdererCtrl = $j("#step04_OrdererInfo");
  if ($j.trim(OrdererCtrl.find("#ordererMailH").val()) == "" || $j.trim(OrdererCtrl.find("#ordererMailD").val()) == "") {
    fbk_Alert("이메일 정보는 마이페이지에서 변경해주세요");
  }

}

function fdc_UptBoard(jpStep) {
  if (jpStep == jcSTEP1 || jpStep == jcSTEP1_1 || jpStep == jcSTEP1_2 || jpStep == jcSTEP1_3 || jpStep == jcSTEP1_4 ||
      jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
    if (jpStep == jcSTEP1) { }
    else if (jpStep == jcSTEP1_1) { }
    else if (jpStep == jcSTEP1_2) { }
    else if (jpStep == jcSTEP1_3) { }
    else if (jpStep == jcSTEP1_4 || jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
      if (jpStep == jcSTEP1_4) {
        var jvDate = new Date(jgCalSelDate.replace(/-/g, "/"));
        var jvWeek = jvDate.toLocaleDateString();
        //$j("#StateBoard #tk_day").text(jgCalSelDate.replace(/-/g, ".") + " (" + jvWeek.substr(jvWeek.length - 3, 1) + ")");
        $j("#StateBoard #tk_day").text(jgCalSelDate.replace(/-/g, ".") + " (" + fpc_ShowDay(jvDate.getDay()) + ")");
      } else if (jpStep == jcSTEP1_4_1) {
        $j("#StateBoard #tk_time").text($j("#ulTime > li.on").text());

        var joSelItem = $j("#ulTime > li.on");

        if (joSelItem.length > 0) {
          if (joSelItem.attr("timeoption") == jcSEAT)
            $j("#StateBoard #tk_seat").html("<span>좌석 지정 회차입니다.</span>");
          else
            $j("#StateBoard #tk_seat").html("<span>비지정석</span>");
        } else {
          $j("#StateBoard #tk_seat").html("<span>회차를 선택하세요.</span>");
        }
      } else if (jpStep == jcSTEP1_4_2) {
        $j("#StateBoard #tk_seat").html("<span>비지정석</span>");
      } else if (jpStep == jcSTEP1_4_3) { }
    }
  }
  else if (jpStep == jcSTEP_SEAT) { }
  else if (jpStep == jcSTEP3 || jpStep == jcSTEP3_1 || jpStep == jcSTEP3_2 || jpStep == jcSTEP3_3 || jpStep == jcSTEP3_4 || jpStep == jcSTEP3_5) {
    if (jpStep == jcSTEP3) { }
    else if (jpStep == jcSTEP3_1) { }
    else if (jpStep == jcSTEP3_2) { }
    else if (jpStep == jcSTEP3_3) { }
    else if (jpStep == jcSTEP3_4) { }
    else if (jpStep == jcSTEP3_5) { }
  }
  else if (jpStep == jcSTEP4 || jpStep == jcSTEP4_1 || jpStep == jcSTEP4_2 || jpStep == jcSTEP4_3) {
    if (jpStep == jcSTEP4) { }
    else if (jpStep == jcSTEP4_1) { }
    else if (jpStep == jcSTEP4_2) { }
    else if (jpStep == jcSTEP4_3) { }
  }
  else if (jpStep == jcSTEP5 || jpStep == jcSTEP5_1 || jpStep == jcSTEP5_2 || jpStep == jcSTEP5_3 || jpStep == jcSTEP5_4
      || jpStep == jcSTEP5_5 || jpStep == jcSTEP5_6 || jpStep == jcSTEP5_7) {
    if (jpStep == jcSTEP5) { }
    else if (jpStep == jcSTEP5_1) { }
    else if (jpStep == jcSTEP5_2) { }
    else if (jpStep == jcSTEP5_3) { }
    else if (jpStep == jcSTEP5_4) { }
    else if (jpStep == jcSTEP5_5) { }
    else if (jpStep == jcSTEP5_6) { }
    else if (jpStep == jcSTEP5_7) { }
  } else if (jpStep == jcSTEP_PAY) { }

  fdc_UptPriceBoard();
}

function fdc_CtrlStep(jpStep) {
  if (jpStep == jcSTEP1 || jpStep == jcSTEP1_1 || jpStep == jcSTEP1_2 || jpStep == jcSTEP1_3 || jpStep == jcSTEP1_4 ||
      jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
    if (jpStep == jcSTEP1) {
      fdc_InitData(jpStep);
      fdc_BindData(jpStep);
      fdc_DispRegion(jpStep);
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP1_1) {
      fdc_InitData(jpStep);
      fdc_BindData(jpStep);
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP1_2) {
      fdc_InitData(jpStep);
      fdc_BindData(jpStep);
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP1_3) {
      if (jgCalSelDate != "") fdc_CtrlStep(jcSTEP1_4);
    } else if (jpStep == jcSTEP1_4 || jpStep == jcSTEP1_4_1 || jpStep == jcSTEP1_4_2 || jpStep == jcSTEP1_4_3) {
      if (jpStep == jcSTEP1_4) {
        fdc_InitData(jpStep);
        fdc_BindData(jpStep);
        fdc_DispRegion(jpStep);
        fdc_UptBoard(jpStep);
      } else if (jpStep == jcSTEP1_4_1) {
        fdc_InitData(jpStep);
        fdc_BindData(jpStep);
        fdc_DispRegion(jpStep);
        fdc_UptBoard(jpStep);
      } else if (jpStep == jcSTEP1_4_2) {
        fdc_InitData(jpStep);
        fdc_DispRegion(jpStep);
        fdc_UptBoard(jpStep);
      } else if (jpStep == jcSTEP1_4_3) {
        fdc_BindData(jpStep);
        fdc_DispRegion(jpStep);
        fdc_CtrlStep(jcSTEP3);
      }
    }
  } else if (jpStep == jcSTEP_SEAT) {
    fdc_BindData(jpStep);
  } else if (jpStep == jcSTEP3 || jpStep == jcSTEP3_1 || jpStep == jcSTEP3_2 || jpStep == jcSTEP3_3 || jpStep == jcSTEP3_4 || jpStep == jcSTEP3_5) {
    if (jpStep == jcSTEP3) {
      fdc_InitData(jpStep);
      fdc_DispRegion(jpStep);
      fdc_BindData(jpStep);
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP3_1) {
    } else if (jpStep == jcSTEP3_2) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP3_3) {
      fdc_BindData(jpStep);
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP3_4) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP3_5) {
      fdc_CtrlStep(jcSTEP4);
    }
  } else if (jpStep == jcSTEP4 || jpStep == jcSTEP4_1 || jpStep == jcSTEP4_2 || jpStep == jcSTEP4_3) {
    if (jpStep == jcSTEP4) {
      fdc_InitData(jpStep);
      fdc_DispRegion(jpStep);
      fdc_BindData(jpStep);
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP4_1) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP4_2) { }
    else if (jpStep == jcSTEP4_3) {
      fdc_CtrlStep(jcSTEP5);
    }
  } else if (jpStep == jcSTEP5 || jpStep == jcSTEP5_1 || jpStep == jcSTEP5_2 || jpStep == jcSTEP5_3 || jpStep == jcSTEP5_4
      || jpStep == jcSTEP5_5 || jpStep == jcSTEP5_6 || jpStep == jcSTEP5_7) {
    if (jpStep == jcSTEP5) {
      fdc_InitData(jpStep);
      fdc_DispRegion(jpStep);
      fdc_BindData(jpStep);
      fdc_UptBoard(jpStep);

      if(reCAPTCHAUse == "Y")
        initCaptcha();

    } else if (jpStep == jcSTEP5_1) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP5_2) {
    } else if (jpStep == jcSTEP5_3) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP5_4) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP5_5) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP5_6) {
      fdc_UptBoard(jpStep);
    } else if (jpStep == jcSTEP5_7) { }


  } else if (jpStep == jcSTEP_PAY) {
    fts_doPay();
  }
}

function fdc_TimeYesPoint_info(type) {

  if (jgYesPointState == 1) {
    $j(".number").find(".point").css("display", "block");
    if (type == jgIsTimeYesPointUse) {
      jgIsYesPointYN = "Y";
      $j(".number").find(".point").find("img").attr({ "src": jgIMGFILESVR + "/img/common/btn_p01.gif", "alt": "YES포인트" });
      $j(".number").find(".point").find("span").find("em").text("적립회차");

    } else {
      jgIsYesPointYN = "N";
      $j(".number").find(".point").find("img").attr({ "src": jgIMGFILESVR + "/img/common/btn_p02.gif", "alt": "YES포인트" });
      $j(".number").find(".point").find("span").find("em").text("적립제외");
    }
  }
}

function fdc_PopOkCashBAgree() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 430, 'height': 250, 'url': '/Pages/Perf/Sale/Popup/pop_okCashBaginfo.aspx', 'title': 'OK캐쉬백 정보 제공 동의' });
}

function fdc_PopExoAgree() {
  $j('#dialogPopup').jSlimPopup({ 'modal': true, 'width': 400, 'height': 190, 'url': '/Pages/Perf/Sale/Popup/pop_exoAgree.aspx', 'title': '좌석 임의 배정 동의' });
}

function fts_GoMirun(Type) {
  if (Type == "A") {
    opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Events/HotEvent/2016/Mirun.aspx?Type=A";
  }
  else {
    opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Events/HotEvent/2016/Mirun.aspx?Type=B";
  }

  fts_Close(true);
}

function fts_GoMypage() {
  opener.location.href = location.protocol + "//" + location.hostname + "/Pages/MyPage/MyPageMain.aspx";
  fts_Close(true);
}

function fts_GoMirunBase() {
  opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Perf/Detail/Detail.aspx?IdPerf=24890";
  fts_Close(true);
}

function fts_Go2017MirunBusan(idOrder, Type, MirunEmergencyTel) {
  //비상연락처 저장 후 관련 페이지로 이동

  $j.ajax({
    async: true,
    type: "POST",
    url: "/Pages/Perf/Sale/Popup/Ajax/2017MirunBusanEmergency.aspx",
    data: { ParamIdOrder: $j.trim(idOrder), ParamTel: MirunEmergencyTel },
    dataType: "html",
    success: function (data, textStatus) {

      if (Type == "A") {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Events/HotEvent/PromotionInfo.aspx?id=2532&Type=B";
        fts_Close(true);
      }
      else {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/MyPage/MyOrder.aspx";
        fts_Close(true);
      }

    },
    error: function (xhr, textStatus, errorThrown) {
      //fbk_axAlert("공연정보 조회 에러입니다.");
    },
    beforeSend: function (xhr, settings) {
      fax_AjaxLoader(jcAJAX_BEFORESEND, "1_1", "#step01_date > h2");
    },
    complete: function (xhr, textStatus) {
      fax_AjaxLoader(jcAJAX_COMPLETE, "1_1", "#step01_date > h2");
    }
  });

}

function fts_Go2017MirunSeoul(idOrder, Type, MirunEmergencyTel, StartGroup, FinisherBand_Store, Reward_Store) {
  //비상연락처 저장 후 관련 페이지로 이동

  $j.ajax({
    async: true,
    type: "POST",
    url: "/Pages/Perf/Sale/Popup/Ajax/2017MirunSeoulEmergency.aspx",
    data: { ParamIdOrder: $j.trim(idOrder), ParamTel: MirunEmergencyTel, ParamStartGroup: StartGroup, ParamFinisherBand_Store: FinisherBand_Store, ParamReward_Store: Reward_Store },
    dataType: "html",
    success: function (data, textStatus) {

      if (Type == "A") {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Events/HotEvent/PromotionInfo.aspx?id=2621&Type=B";
        fts_Close(true);
      }
      else {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Perf/Detail/Detail.aspx?IdPerf=27420"; // "/Pages/MyPage/MyOrder.aspx";
        fts_Close(true);
      }

    },
    error: function (xhr, textStatus, errorThrown) {
      //fbk_axAlert("공연정보 조회 에러입니다.");
    },
    beforeSend: function (xhr, settings) {
      fax_AjaxLoader(jcAJAX_BEFORESEND, "1_1", "#step01_date > h2");
    },
    complete: function (xhr, textStatus) {
      fax_AjaxLoader(jcAJAX_COMPLETE, "1_1", "#step01_date > h2");
    }
  });

}

function fts_Go2018MirunBusan(idOrder, Type, MirunEmergencyTel, StartGroup, Reward_Store) {
  //비상연락처 저장 후 관련 페이지로 이동

  $j.ajax({
    async: true,
    type: "POST",
    url: "/Pages/Perf/Sale/Popup/Ajax/2018MirunBusanEmergency.aspx",
    data: { ParamIdOrder: $j.trim(idOrder), ParamTel: MirunEmergencyTel, ParamStartGroup: StartGroup, ParamReward_Store: Reward_Store },
    dataType: "html",
    success: function (data, textStatus) {

      if (Type == "A") {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Events/HotEvent/PromotionInfo.aspx?id=2742&Type=B";
        fts_Close(true);
      }
      else {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/MyPage/MyOrder.aspx";
        fts_Close(true);
      }

    },
    error: function (xhr, textStatus, errorThrown) {
      //fbk_axAlert("공연정보 조회 에러입니다.");
    },
    beforeSend: function (xhr, settings) {
      fax_AjaxLoader(jcAJAX_BEFORESEND, "1_1", "#step01_date > h2");
    },
    complete: function (xhr, textStatus) {
      fax_AjaxLoader(jcAJAX_COMPLETE, "1_1", "#step01_date > h2");
    }
  });

}

function fts_Go2018MirunSeoul(idOrder, Type, MirunEmergencyTel, StartGroup, Reward_Store) {
  //비상연락처 저장 후 관련 페이지로 이동

  $j.ajax({
    async: true,
    type: "POST",
    url: "/Pages/Perf/Sale/Popup/Ajax/2018MirunSeoulEmergency.aspx",
    data: { ParamIdOrder: $j.trim(idOrder), ParamTel: MirunEmergencyTel, ParamStartGroup: StartGroup, ParamReward_Store: Reward_Store },
    dataType: "html",
    success: function (data, textStatus) {

      if (Type == "A") {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/Events/HotEvent/PromotionInfo.aspx?id=2806&Type=B";
        fts_Close(true);
      }
      else {
        opener.location.href = location.protocol + "//" + location.hostname + "/Pages/MyPage/MyOrder.aspx";
        fts_Close(true);
      }

    },
    error: function (xhr, textStatus, errorThrown) {
      //fbk_axAlert("공연정보 조회 에러입니다.");
    },
    beforeSend: function (xhr, settings) {
      fax_AjaxLoader(jcAJAX_BEFORESEND, "1_1", "#step01_date > h2");
    },
    complete: function (xhr, textStatus) {
      fax_AjaxLoader(jcAJAX_COMPLETE, "1_1", "#step01_date > h2");
    }
  });

}

function jsf_MpointNotice(jpObj) {
  var sHNotice = "<b>현대카드 M포인트 사용 안내</b><br>";
  sHNotice += "M포인트 적립 및 사용이 되지 않는 카드로 결제 시 'M포인트 사용함'에 미체크하셔야 결제 가능합니다. (체크 시 결제 불가) <br>";
  sHNotice += "M포인트는 1M포인트 = 1원으로 환산되어 사용됩니다.<br>(예시 : 1만 M포인트 사용하여 1만원 결제)<br>";
  sHNotice += "결제 금액의 100%까지 10M포인트 단위로 사용 가능하며, 사용된 M포인트는 청구 금액에서 차감됩니다.<br>";
  sHNotice += "※ M포인트 적립 및 사용불가 카드: 현대카드 ZERO(할인형), ZERO 모바일(할인형), X, T, 프리미엄 카드(Black, Purple, Red) 및 제휴카드 중 M포인트 미적립형 카드∙법인∙선불∙Gift카드 등";



  if ($j(jpObj).prop("checked") == true) {
    jgIsMPoint = "1";
    fbk_Alert(sHNotice);
  }
  else {
    jgIsMPoint = "0";
  }
}


function fdc_Odr_RefundBank() {
  var jvInfo = "";

  var joCtrl = $j("#step05").find("#selLiveRefundBank option:selected");

  if (joCtrl.length > 0) jvInfo = joCtrl.val();


  return jvInfo;
}


function getCaptchaImage(key) {
  var d = new Date();
  //$j("#captchaImg").attr("src", "Captcha/CaptchaImage.aspx?v=" + d.getTime());
  $j("#captchaImg").attr("src", "/Pages/Perf/Sale/Captcha/CaptchaImage.aspx?key=" + key);
}

function getCaptchaKey() {
  $j.ajax({
    async: true,
    type: "POST",
    url: "/Pages/Perf/Sale/Captcha/CaptchaImage.aspx/GetKeyCaptcha",
    //data: JSON.stringify({
    //    Param: mRow
    //}),
    dataType: "json",
    contentType: "application/json",
    success: function (data, textStatus) {
      if (data.d.Result == "") {
        $j("#dialogAlert").jAlert({ "msg": "시스템 에러가 발생하였습니다." });
        return;
      }
      else {
        $j("#captchaKey").val(data.d.Result);
        getCaptchaImage(data.d.Result);
      }



    },
    error: function (xhr, textStatus, errorThrown) {
      $j("#dialogAlert").jAlert({ "msg": "시스템 에러가 발생하였습니다." });
    },
    beforeSend: function (xhr, settings) {
      //jsf_com_AjaxLoader(jcAJAX_BEFORESEND, 0, 0, "", ".entry");
    },
    complete: function (xhr, textStatus) {
      //jsf_com_AjaxLoader(jcAJAX_COMPLETE, 0, 0, "", ".entry");
    }
  });
}

function initCaptcha() {
  $j("#captchaText").val("");
  $j("#captchaKey").val("");
  getCaptchaKey();
}