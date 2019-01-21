/**
 * todo 这些暂时是被写死的，因为是html页面返回出来的
 *
 * @param dis
 */
var $=$j=jQuery.noConflict();

var OSIFRootUrl = "";
var isLoadedSvg = false; //20140403HTMLSEAT
var IdHall = '8167';
var IdTime = '989802';
var Block = '0';
var StMax = parseInt('10');
var IdCustomer = '14441590';
var HCardAppOpt = '0';
var IdOrg = 1;
var layerWidth = 678;
var layerHeight = 585;
var _split = "@";
var _lines = "^";
var mapType = "0";
var ArBlockRemain = new Array();
var ArSectionRemain = new Array();
var ArBlockFile = new Array();

var jcAJAX_BEFORESEND = 0;
var jcAJAX_COMPLETE = 1;
var jgIMGFILESVR = 'http://tkfile.yes24.com';

//begin 201402HTMLSEAT -> 20140314HTMLSEAT--> 20140403HTMLSEAT
function toggleBigHtmlMap(dis) {

  GetTimeSaleState();

  if (dis == 0) {
    $("#dBigHtmlMap").css("display", "none");
    if (mapType == "2") {
      $("#dBigMapFocus").css("display", "none");
    }
  } else {
    $("#divSeatArray").html("");
    $("#divContainer").css("display", "none");
    //$("#liLegend").html("");
    $("#liSelSeat").html("");
    $("#dBigHtmlMap").css("display", "");
    if (mapType == "2") {
      $("#dBigMapFocus").css("display", "");
    }
  }
}

$("#divContainer").css({ width: layerWidth, height: layerHeight });

function errormsg(msg) {
  //alert(msg);
}

function GetImgPath() {
  var HallRoot = 0;
  HallRoot = parseInt((parseInt(IdHall, 10) / 1000), 10) * 1000

  return "http://tkfile.yes24.com/upload2/hallimg/" + HallRoot + "/" + IdHall + "/";
  //return "http://testticket.yes24.com/upload2/hallimg/" + HallRoot + "/" + IdHall + "/";
}


//begin 201402HTMLSEAT
function GetImageMap() {

  $("#progressbar").css("display", "");
  $("#divContainer").css("display", "none");
  $.ajax({
    type: "post",
    url: OSIFRootUrl + "/OSIF/Book.asmx/GetHallMapRemain",
    data: { "idHall": IdHall, "idTime": IdTime },
    dataType: "xml",
    async: true,
    success: function (response) {
      GetImageMap_CallBack(response);
    },
    error: function (response) {
      errormsg(response.responseText);
    }
  });
}

//20140314HTMLSEAT (좌석등급 정보 추가)
function GetImageMap_CallBack(msg) {
  var timdid = $(msg).find("IdTime").text();
  if (timdid != IdTime) {
    return;
  }
  var blockRemain = $(msg).find("BlockRemain").text();
  var miniMap = $(msg).find("SeatMap").text();
  var regend = $(msg).find("Regend").text();
  var section = $(msg).find("Section").text();

  CreateRemainArgs(blockRemain);
  CreateMiniMap(miniMap);
  CreateLegend(regend);
  CreateSection(section);
  //GetSeatData(Block, 0);
}
//end 201402HTMLSEAT

function GroupTicketMove() {
  jQuery.each($(".seatGroup"), function () {
    var moveTop = parseInt($(this).attr("mtop"));
    var moveLeft = parseInt($(this).attr("mleft"));
    var grpTop = parseInt($(this).css("top")) + moveTop;
    var grpLeft = parseInt($(this).css("left")) + moveLeft;

    $(this).css({ top: grpTop, left: grpLeft });
  });
}

//일괄 데이터 가져오기  todo 生成座位图 暂时没有用到
function GetSeatData(blk, seq) {
  Block = blk;

  $("#progressbar").css("display", "");
  $("#divContainer").css("display", "none");

  $("#divSeatArray").html("");
  //            $("#liLegend").html("");
  $("#liSelSeat").html("");

  $.ajax({
    type: "post",
    url: OSIFRootUrl + "/OSIF/Book.asmx/GetBookWhole",
    data: { "idHall": IdHall, "idTime": IdTime, "block": Block, "channel": 1, "idCustomer": IdCustomer, "idOrg": 1 },
    dataType: "xml",
    async: true,
    success: function (msg) {
      GetSeatData_CallBack(msg, seq);
    },
    error: function (msg) {
      errormsg(msg.responseText);
    }
  });
}

//판매가능 상태 확인
function GetTimeSaleState() {
  $.ajax({
    type: "post",
    url: "/Pages/Perf/Sale/Ajax/Perf/TimeSaleState.aspx",
    data: { PIdTime: IdTime },
    dataType: "html",
    async: false,
    success: function (msg) {
      GetTimeSaleStat_CallBack(msg);
    },
    error: function (msg) {
      errormsg(msg.responseText);
    }
  });
}

function GetTimeSaleStat_CallBack(Data) {
  if (Data == "0") {
    alert('판매가능한 회차자 아닙니다.');
    $("body").html("");
  }
}

function GetSeatData_CallBack(msg, seq) {
  var timdid = $(msg).find("IdTime").text();
  var blockid = $(msg).find("Block").text();

  if ((timdid == IdTime && blockid == Block) == false) {
    return;
  }

  var hallLayout = $(msg).find("Layout").text();
  var background = $(msg).find("Background").text();
  //            var regend = $(msg).find("Regend").text();
  //            var section = $(msg).find("Section").text();
  var blockRemain = $(msg).find("BlockRemain").text();
  var blockSeat = $(msg).find("BlockSeat").text();


  $("#divSeatArray").html(hallLayout);

  /* begin 20140410HTMLSEAT*/
  if (isIe9over) {
    jQuery("div").css("filter", "");
  }
  /* end 20140410HTMLSEAT*/

  CreateHallBgImg(background);
  //          CreateLegend(regend);
  //          CreateSection(section);
  CreateRemainArgs(blockRemain);
  TicketMapping(blockSeat);

  //20140410HTMLSEAT
  if (navigator.userAgent.toLowerCase().indexOf('msie') == -1 || isIe9over) {
    GroupTicketMove();
  }

  if (ArBlockFile[Block] != null && seq != 0) {
    $("#blockFile").attr("src", GetImgPath() + ArBlockFile[Block]);
  }

  $("#progressbar").css("display", "none");
  $("#divContainer").css("display", "");

  //begin 201402HTMLSEAT -> 20140403HTMLSEAT
  if (mapType == "1") {
    if (seq == 0) {
      if (isLoadedSvg) {
        MapFocusCreate(Block, 'mapFs', '#FFF000');
      } else {
        window.addEventListener('SVGLoad', function () {
          MapFocusCreate(Block, 'mapFs', '#FFF000');
        }, false);
      }
    } else {
      MapFocusCreate(Block, 'mapFs', '#FFF000');
    }
  }
  toggleBigHtmlMap(0);
  //begin 201402HTMLSEAT -> 20140403HTMLSEAT
}

//GetImageMap();

//begin 201402HTMLSEAT
function ChangeBlock(blk) {
  if (document.getElementById('mapFs') != null) {
    $("#mapFs").remove();
  }
  $("#mapFs").remove(); //20140403HTMLSEAT one more delete
  if (document.getElementById('mapOver') != null) {
    $("#mapOver").remove();
  }
  $("#blkInfo").css("display", "none");
  GetSeatData(blk, 1);
}
//end 201402HTMLSEAT

//연석 체크 시작 联席校验开始
/**
 * todo 这个方法是校验座位是否为联席的
 *
 * @returns {boolean}
 * @constructor
 */
function ChkSequenceSeat() {
  var arrSelSeat = [];

  jQuery.each($("p[name=cseat]"), function (index) {

    var titleThis = $(this).text().split(' ')[1].substring(0, 1);
    //2층 A3구역1열 002번 -> A

    var idThis = $(this).attr("id");
    if ((IdTime == "875463" || IdTime == "877531" || IdTime == "877657" || IdTime == "877658" || IdTime == "906865" || IdTime == "906965" || IdTime == "906966") && (titleThis == "A" || titleThis == "B" || titleThis == "D" || titleThis == "E")) { //세로줄
      //console.log(parseInt(Right(idThis.replace('C', ''), 2) + idThis.replace('C', '').substring(0, 2)));
      arrSelSeat[index] = parseInt(Right(idThis.replace('C', ''), 2) + idThis.replace('C', '').substring(0, 2));
    }
    else {
      arrSelSeat[index] = parseInt(idThis.replace('C', ''));
    }

    arrSelSeat.sort();

  });

  var chkSeq = checkSequnceNumbers(arrSelSeat, StMax);
  if (chkSeq[arrSelSeat.length - 1] != 1)
    return false;
  else
    return true;
}

function checkSequnceNumbers(target, counterLength) { //counterLength는 최대매수
  //var sequentialCounter = new Array(counterLength).fill(0);
  var sequentialCounter = [];
  for (var j = 0; j != counterLength; j++)
    sequentialCounter.push(0);

  var count = 0;
  for (var i = 0, len = target.length; i < len; i++) {
    var subCount = 0;
    for (var j = 1; j < len; j++) {
      if (target[j] === (target[i] + 1)) {
        subCount = subCount + 1;
      } else {
        continue;
      }
    }
    count = count + subCount;
    if (subCount === 0) {
      sequentialCounter[count] = sequentialCounter[count] + 1;
      count = 0;
    }
  }
  return sequentialCounter;
}

function Right(str, n) {
  if (n <= 0)
    return "";
  else if (n > String(str).length)
    return str;
  else {
    var iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
  }
}
//연석 체크 끝


//선택완료
/**
 * todo 这个是原来的点击下一步的方法，我这个进行修改，改为+new
 * @constructor
 */
function ChoiceEnd() {

  /*
  每当选择一个座位以后就会生成一个这样的p标签
    <p id="C1500029" class="txt2" name="cseat" grade="R석">1층 K열 019번</p>
   */
  var selSeatCnt = $("p[name=cseat]").length;

  if (selSeatCnt == 0) {
    alert('좌석을 선택해주세요.');
    return;
  }

  if (IdTime == "875463" || IdTime == "877498" || IdTime == "877530" ||
      IdTime == "877531" || IdTime == "877657" || IdTime == "877658" ||
      IdTime == "877623" || IdTime == "877659" || IdTime == "877660" ||
      IdTime == "877624" || IdTime == "877661" || IdTime == "877662" ||
      IdTime == "906865" || IdTime == "906965" || IdTime == "906966" ||
      IdTime == "906792" || IdTime == "906794" || IdTime == "906795" ||
      IdTime == "906652" || IdTime == "906643" || IdTime == "906653" ||
      IdTime == "968211" || IdTime == "968263")
  { //나훈아티켓 서울/부산/대구
    //연석 체크  首尔/釜山/大邱
    //联席格子
    if (!ChkSequenceSeat()) {
      //alert("연속된 좌석을 선택해 주세요.");
      //return;
      // 未选择连接的座位。您要继续吗
      if (!confirm("연속된 좌석이 선택되지 않았습니다. 계속하시겠습니까?")) {
        ChoiceReset();
        return;
      }
    }
  }

  var token = "";
  var tokenClass = "";


  jQuery.each($("p[name=cseat]"), function () {

    //0616수정
    var idThis = $(this).attr("id");

    if (token != "") {
      token += "," + idThis.replace('C', '');
    } else {
      token += idThis.replace('C', '');
    }


    if (tokenClass != "") {
      tokenClass += "," + $(this).attr("grade");
    } else {
      tokenClass += $(this).attr("grade");
    }
  });

  if (token == "" || tokenClass == "") {
    alert('좌석 선택정보가 올바르지 않습니다.'); //您的座位选择信息不正确
    return;
  }

  if (HCardAppOpt == "1") {

    if ((selSeatCnt > 2) && (tokenClass.indexOf('G1석') != -1 || tokenClass.indexOf('G2석') != -1)) {
      alert('현대카드 앱카드 30%할인은\nG3~C석에 한해 2매만 선택 가능합니다.');
      // todo 现代信用卡应用程序的30%折扣 仅在G3.~C席上只能选择2枚。
      return;
    }

    if (selSeatCnt > 2) {
      alert('현대카드 앱카드 30%할인은\n1인 2매 할인 가능합니다.');
      // todo 现代信用卡应用程序的30%折扣 可以1人2折。
      return;
    }

    if (tokenClass.indexOf('G1석') != -1 || tokenClass.indexOf('G2석') != -1) {
      alert('현대카드 앱카드 30%할인은\nG3~C석에 한해 할인 가능합니다.\n(G1석,G2석은 일반예매로만 가능)');
      // todo 现代信用卡应用程序的30%折扣 在G3 ~ C席上可以打折。（G1席，G2席可以一般预售
      return;
    }
  }

  if (IdTime == '720503' || IdTime == '720504' || IdTime == '720505' || IdTime == '720506' || IdTime == '720507' ||
      IdTime == '720508' || IdTime == '720512' || IdTime == '720513' || IdTime == '720514' || IdTime == '720516' ||
      IdTime == '720517' || IdTime == '720518' || IdTime == '720519' || IdTime == '720520' || IdTime == '720515' ||
      IdTime == "718882" || IdTime == '718875' || IdTime == '718879' || IdTime == '718880' || IdTime == '718881' || IdTime == '718882' ||
      IdTime == '718883') {

    var classinfo = tokenClass.split(",");
    var nVipCnt = 0;

    for (var i = 0; i < classinfo.length; i++) {
      if (classinfo[i] == "VIP(1인1매)석") {
        nVipCnt += 1;
      }
    }

    if (nVipCnt > 1) {
      // 可以预购的购买量超过了。预售中的VIP（1人1枚）石只预售1张。
      alert('예매 가능한 매수가 초과되었습니다.\n예매중인 회차의 VIP(1인1매)석은 1매만 예매가 가능합니다.');
      return;
    }
  }


  $.ajax({
    type: "post",
    url: OSIFRootUrl + "/OSIF/Book.asmx/Lock",
    data: { "name": IdCustomer, "idTime": IdTime, "token": token, "Block": Block},
    dataType: "xml",
    async: true,
    success: function (msg) {
      ChoiceEnd_CallBack(msg, token, tokenClass);
    },
    error: function (msg) {
      errormsg(msg.responseText);
    }
  });
}

/**
 * todo 重写了这个方法
 * @constructor
 */
function ChoiceEndNew() {

  /*
   每当选择一个座位以后就会生成一个这样的p标签
   <p id="C1500029" class="txt2" name="cseat" grade="R석">1층 K열 019번</p>
   */
  var selSeatCnt = $("p[name=cseat]").length;

  if (selSeatCnt == 0) {
    alert('좌석을 선택해주세요.');
    return;
  }

  if (IdTime == "875463" || IdTime == "877498" || IdTime == "877530" ||
      IdTime == "877531" || IdTime == "877657" || IdTime == "877658" ||
      IdTime == "877623" || IdTime == "877659" || IdTime == "877660" ||
      IdTime == "877624" || IdTime == "877661" || IdTime == "877662" ||
      IdTime == "906865" || IdTime == "906965" || IdTime == "906966" ||
      IdTime == "906792" || IdTime == "906794" || IdTime == "906795" ||
      IdTime == "906652" || IdTime == "906643" || IdTime == "906653" ||
      IdTime == "968211" || IdTime == "968263")
  { //나훈아티켓 서울/부산/대구
    //연석 체크  首尔/釜山/大邱
    //联席格子
    if (!ChkSequenceSeat()) {
      //alert("연속된 좌석을 선택해 주세요.");
      //return;
      // 未选择连接的座位。您要继续吗
      if (!confirm("연속된 좌석이 선택되지 않았습니다. 계속하시겠습니까?")) {
        ChoiceReset();
        return;
      }
    }
  }

  var token = "";
  var tokenClass = "";


  jQuery.each($("p[name=cseat]"), function () {

    //0616수정
    var idThis = $(this).attr("id");

    if (token != "") {
      token += "," + idThis.replace('C', '');
    } else {
      token += idThis.replace('C', '');
    }


    if (tokenClass != "") {
      tokenClass += "," + $(this).attr("grade");
    } else {
      tokenClass += $(this).attr("grade");
    }
  });



  if (token == "" || tokenClass == "") {
    alert('좌석 선택정보가 올바르지 않습니다.'); //您的座位选择信息不正确
    return;
  }

  if (HCardAppOpt == "1") {

    if ((selSeatCnt > 2) && (tokenClass.indexOf('G1석') != -1 || tokenClass.indexOf('G2석') != -1)) {
      alert('현대카드 앱카드 30%할인은\nG3~C석에 한해 2매만 선택 가능합니다.');
      return;
    }

    if (selSeatCnt > 2) {
      alert('현대카드 앱카드 30%할인은\n1인 2매 할인 가능합니다.');
      return;
    }

    if (tokenClass.indexOf('G1석') != -1 || tokenClass.indexOf('G2석') != -1) {
      alert('현대카드 앱카드 30%할인은\nG3~C석에 한해 할인 가능합니다.\n(G1석,G2석은 일반예매로만 가능)');
      return;
    }
  }

  if (IdTime == '720503' || IdTime == '720504' || IdTime == '720505' || IdTime == '720506' || IdTime == '720507' ||
      IdTime == '720508' || IdTime == '720512' || IdTime == '720513' || IdTime == '720514' || IdTime == '720516' ||
      IdTime == '720517' || IdTime == '720518' || IdTime == '720519' || IdTime == '720520' || IdTime == '720515' ||
      IdTime == "718882" || IdTime == '718875' || IdTime == '718879' || IdTime == '718880' || IdTime == '718881' || IdTime == '718882' ||
      IdTime == '718883') {

    var classinfo = tokenClass.split(",");
    var nVipCnt = 0;

    for (var i = 0; i < classinfo.length; i++) {
      if (classinfo[i] == "VIP(1인1매)석") {
        nVipCnt += 1;
      }
    }

    if (nVipCnt > 1) {
      alert('예매 가능한 매수가 초과되었습니다.\n예매중인 회차의 VIP(1인1매)석은 1매만 예매가 가능합니다.');
      return;
    }
  }


  $.ajax({
    type: "post",
    url: OSIFRootUrl + "/OSIF/Book.asmx/Lock",
    data: { "name": IdCustomer, "idTime": IdTime, "token": token, "Block": Block},
    dataType: "xml",
    async: true,
    success: function (msg) {
      ChoiceEnd_CallBack(msg, token, tokenClass);
    },
    error: function (msg) {
      errormsg(msg.responseText);
    }
  });
}

function ChoiceEnd_CallBack(msg, token, tokenClass) {
  var lockResult = $(msg).find("int").text();

  if (lockResult == "0") {
    ChoiceEndProcess(token + "@" + tokenClass);
  } else {
    alert('다른 고객님이 결제진행 중인 좌석입니다.\n다른 좌석을 선택해 주세요. 是其他顾客进行结算的座位。\n' +
        '\n' +
        '请选择另一个座位');
    GetSeatData(Block, 1);
    //ChoiceReset(); //2011.12.12 추가
    //resetseat(); //hsjung 수정(2012.04.25)
  }
}

//좌석선택
function ChoiceSeat() {

  if ($(this).attr("className") == "son") {
    $("#C" + $(this).attr("value")).remove();
    $(this).attr("class", $(this).attr("oldclass"));
  } else {
    if ($("p[name=cseat]").length < StMax) {
      $("#liSelSeat").append('<p id="C' + $(this).attr("value") + '" class="txt2" name="cseat" grade="' + $(this).attr("grade") + '">' + $(this).attr("title") + '</p>');
      //$("#liSelSeat").append('<p id="C' + $(this).attr("value") + '"  name="cseat" grade="' + $(this).attr("grade") + '">' + $(this).attr("title") + '</p>');
      $(this).attr("oldclass", $(this).attr("className"));
      $(this).attr("class", "son");
    } else {
      alert(StMax + '좌석 까지만 선택이 가능합니다.');
    }
  }
}

//다시선택 取消选择
/**
 * todo 选择的座位重置掉，重新选择
 * @constructor
 */
function ChoiceReset() {
  jQuery.each($("p[name=cseat]"), function () {
    //0616수정
    var idThis = $(this).attr("id");
    $("#t" + idThis.replace('C', '')).attr("className", $($("#t" + idThis.replace('C', ''))).attr("oldclass"));
  });
  $("#liSelSeat").html("");
}

//begin 201402HTMLSEAT
function CreateMiniMap(mapData) {
  var mapfiles = "";
  ArBlockFile = new Array();
  if (mapData.indexOf(_split) != -1) {
    var msgblocks = mapData.split(_lines);
    var imagemap = '<map name = "maphall">';
    for (var i = 0; i < msgblocks.length; i++) {
      var msgblock = msgblocks[i].split(_split);
      if (msgblock.length > 3) {
        if (Block == msgblock[0]) {
          mapfiles = '<img id="blockFile" src="' + GetImgPath() + msgblock[1] + '" border=0 usemap="#maphall" onfocus="this.blur();" />';
        }
        imagemap += '<area shape="poly" info="' + msgblock[3] + '" id="area' + msgblock[0] + '" value="' + msgblock[0] + '" coords="' + msgblock[2] + '"  href="#"  onfocus="this.blur();" onclick="ChangeBlock(' + msgblock[0] + ');return false;" onmousemove="movearea();" onmouseover="showMapInfo(' + msgblock[0] + ');" onmouseout="hidMapInfo(' + msgblock[0] + ');"  >';
        ArBlockFile[msgblock[0]] = msgblock[1];
      }
    }
    imagemap += '</map>';
    var maphtml = mapfiles + imagemap;
    $("#dMapInfo").html(maphtml);
  } else if (mapData != "") {

    var msgblocks = mapData.split(_lines);
    mapType = msgblocks[0];
    mapData = msgblocks[1].replace(/ alt=/gi, " info=");

    if ('https:' == document.location.protocol) {
      mapData = mapData.replace('http://tkfile', 'https://stkfile')
    }

    if (mapType == "2") {
      $("#dBigHtmlMap").html(mapData);
      //20140403HTMLSEAT
      //$("#dBigMapFocus").removeClass("mapFocus");
      //$("#dMapFocus").addClass("bigmapFocus");
      $("#dMapFocus").remove();
      $("#dBigMapFocus").css("display", "");

      $("#minimap, #minimapTitle, #dMapInfo").hide();
      $(".minimap_m").prepend("<p class='btn_all'><a href='#'><img src='http://tkfile.yes24.com/images/ticket_new/btn_seat2_all.jpg' alt='공연장 전체보기' onclick='toggleBigHtmlMap(1);' /></a></p>");
    } else {
      //20140403HTMLSEAT
      $("#dMapFocus").css("display", "");
      $("#dBigMapFocus").remove();
      $("#dMapInfo").html(mapData);
    }

    if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {
      $("area").bind({
        focus: function () {
          $(this).blur();
        }
      });
    }
  }

  if (mapType != "2") {
    //20140403HTMLSEAT 순서변경
    $("#ulLegend").height(120);
    SetMapFocusPosition();
    GetSeatData(Block, 0);
  } else {
    $("#ulLegend").height(294);
    $("#liLegend").height(274);
    SetMapFocusPosition(); //20140320HTMLSEAT
    $("#progressbar").css("display", "none");
  }
}
//end 201402HTMLSEAT

//백그라운드 이미지
function CreateHallBgImg(bgImginfo) {
  var arbginfo = bgImginfo.split(_split);
  if (arbginfo.length > 1) {
    if (arbginfo[0] != "") {
      $("#divContainer").css("background-image", "url('" + GetImgPath() + arbginfo[0] + "')");
      $("#divContainer").css("background-repeat", "no-repeat");

      if (arbginfo[1] != "" && arbginfo[2] != "") {
        $("#divContainer").css("background-position", arbginfo[1] + "px " + arbginfo[2] + "px");
      } else {
        $("#divContainer").css("background-position", "0px 0px");
      }
    } else {
      $("#divContainer").css("background-image", "url('')");
    }
  } else {
    $("#divContainer").css("background-image", "url('')");
  }
}

//좌석등급별 가격보기
function CreateLegend(args) {
  var disRemainSeat = 1; // 0 = show, 1 = hide
  disRemainSeat = $("#hiddenDisplayRemainSeat", parent.document).val();

  var resData = "";
  var legends = args.split(_lines);
  for (var i = 0; i < legends.length; i++) {
    var legend = legends[i].split(_split);
    if (legend.length > 1) {
      var lblRemainSeat = "";
      if (disRemainSeat == 0) {
        lblRemainSeat = '<em>(' + legend[3] + '석)</em>';
      }

      if (mapType != 2) {
        resData += '<div><p class="txt" ><img src="http://tkfile.yes24.com/images/ticket_new/ic_seat' + legend[0] + '.gif" alt="">' + legend[1] + ' ' + parent.fdc_fmtNumber(legend[2]) + '원' + lblRemainSeat + '</p></div>';
      }
      else {
        resData += '<div style="cursor:pointer;"><p class="txt" name="btnGrade" id="grade_' + legend[1] + '"><img src="http://tkfile.yes24.com/images/ticket_new/ic_seat' + legend[0] + '.gif" alt="">' + legend[1] + ' ' + parent.fdc_fmtNumber(legend[2]) + '원' + lblRemainSeat + '</p></div>';
      }
    }
  }
  $("#liLegend").html(resData);

  $('p[name="btnGrade"]').click(function () {

    toggleBigHtmlMap(1);
    var $obj = $(this);
    if ($obj.hasClass("ov")) {
      $obj.removeClass("ov");
      $obj.next().remove();
    }
    else {
      var gradeList = $("#liLegend > div");
      gradeList.children("p").removeClass("ov");
      gradeList.children("ul").remove();

      var resData = '<ul class="seat_layer" >';
      for (var i = 0; i < ArSectionRemain.length; i++) {
        var section = ArSectionRemain[i];
        if (section.className == this.id.substr(6)) {
          var lblRemainSeat = "";
          if (disRemainSeat == 0) {
            lblRemainSeat = '(' + section.seat + '석)';
          }
          resData += '<li style="cursor:pointer;" onclick="ChangeBlock(\'' + section.block + '\');">' + section.block + '구역' + lblRemainSeat + '</li>';
        }
      }
      resData += "</ul>";
      $obj.parent().append(resData);
      $obj.addClass("ov");
    }
  });
}

function CreateSection(args) {
  var sections = args.split(_lines);
  var objectList = new Array();
  for (var i = 0; i < sections.length; i++) {
    var blkNo = sections[i].split(_split);
    if (blkNo.length > 1) {
      var section = {};
      section.className = blkNo[0];
      section.block = blkNo[1];
      section.seat = blkNo[2];
      ArSectionRemain.push(section);
    }
  }
}

//블럭별 잔여석 정보 셋팅
function CreateRemainArgs(blocktickets) {
  ArBlockRemain = new Array();
  var msgblocks = blocktickets.split(_lines);
  for (var i = 0; i < msgblocks.length; i++) {
    var blkNo = msgblocks[i].split(_split);
    if (blkNo.length > 1) {
      ArBlockRemain[blkNo[0]] = blkNo[1];
    }
  }
}

//판매가능 좌석맵핑
function TicketMapping(ticketData) {
  var tickets = ticketData.split(_lines);
  for (var i = 0; i < tickets.length; i++) {
    var ticket = tickets[i].split(_split);
    if (ticket.length > 3) {
      var objtk = document.getElementById("t" + ticket[0]);
      objtk.title = ticket[3];
      objtk.className = "s" + ticket[1];

      if (ticket[2] == "0") {
        objtk.style.cursor = "hand";
        objtk.onclick = ChoiceSeat;
        $("#t" + ticket[0]).attr("grade", ticket[5]);
      }
    }
  }
}

function showMapInfo(blk) {
  if (ArBlockRemain.length > 0) {

    document.getElementById("blkInfo").style.display = "";
    var mapobj = document.getElementById("area" + blk);

    var infoblk = "";
    if ($(mapobj).attr("info") != "undefined" && $(mapobj).attr("info") != null) {
      infoblk = $(mapobj).attr("info");
    }
    var remainblk = "잔여석 0";
    if (isNaN(ArBlockRemain[blk]) == false) {
      remainblk = "잔여석 " + ArBlockRemain[blk];
    }

    if (mapobj != null) {
      if (infoblk != "") {
        $("#blkInfo").html(infoblk + "<br />" + remainblk);
      } else {
        $("#blkInfo").html(remainblk);
      }
    } else {
      $("#blkInfo").html(remainblk);
    }
  }

  if (document.getElementById('mapOver') != null) {
    $("#mapOver").remove();
  }
  //201402HTMLSEAT
  if (Block != blk || mapType == "2") {
    MapFocusCreate(blk, 'mapOver', '#ff8500');
  }

  var now = new Date();
  var txtDate = now.getFullYear() + parent.jsf_def_PadLeft(now.getMonth() + 1, 2) + parent.jsf_def_PadLeft(now.getDate(), 2);

  //            if (IdTime == '600980') {
  //                if (parseInt(txtDate) < parseInt("20140926")) {
  //                    $("#blkInfo").hide();
  //                }
  //            }

  movearea()
}

function hidMapInfo(blk) {
  document.getElementById("blkInfo").style.display = "none";
}

function movearea(e) {
  var ypos = 0;
  var xpos = 0;
  var ewidth = document.getElementById("blkInfo").offsetWidth;
  if (ewidth == 0) {
    return;
  }

  try {
    xpos = window.event.clientX;
    ypos = window.event.clientY;
  } catch (e) {
    ypos = window.event.y;
    xpos = window.event.x;
  }

  $("#blkInfo").css({ top: ypos, left: xpos - (ewidth + 6) });
}

function closeseat() {
  try {
    parent.fdc_FlashSeatUnload();
  } catch (e) {
    document.domain = "yes24.com";
    parent.fdc_FlashSeatUnload();
  }
}

function ChoiceEndProcess(vselseat) {
  /*
  todo 原来的代码
  try {
    parent.fdc_FlashSeatChoiceEnd(vselseat);
  } catch (e) {
    document.domain = "yes24.com";
    parent.fdc_FlashSeatChoiceEnd(vselseat);
  }*/
  fdc_FlashSeatChoiceEnd(vselseat);
}

function resetseat() {
  try {
    parent.fdc_FlashSeatLoad();
  } catch (e) {
    document.domain = "yes24.com";
    parent.fdc_FlashSeatLoad();
  }
}

function outMap() {
  if (document.getElementById('mapOver') != null) {
    $("#mapOver").remove();
  }
}

function MapFocusCreate(blk, objId, bcolor) {
  try {
    $(objId).remove(); //20140403HTMLSEAT
    var curshape = $("#area" + blk).attr("shape");
    var curcoords = $("#area" + blk).attr("coords");

    if (curshape.toLowerCase() == "rect") {
      var arshape = $("#area" + blk).attr("coords").split(',');
      var mapx1 = parseInt(arshape[0]);
      var mapy1 = parseInt(arshape[1]);
      var mapx2 = parseInt(arshape[2]) - mapx1;
      var mapy2 = parseInt(arshape[3]) - mapy1;
      var elPoint = document.createElementNS(svgns, 'rect');
      elPoint.setAttribute('id', objId);
      elPoint.setAttribute('fill', bcolor);
      elPoint.setAttribute('x', mapx1);
      elPoint.setAttribute('y', mapy1);
      elPoint.setAttribute('width', mapx2);
      elPoint.setAttribute('height', mapy2);
      //20140403HTMLSEAT
      if (mapType == "2") {
        var objSvg = document.getElementById('svgmapbig');
        objSvg.appendChild(elPoint);
      } else {
        var objSvg = document.getElementById('svgmap');
        objSvg.appendChild(elPoint);
      }
    } else {
      var elPoint = document.createElementNS(svgns, 'polygon');
      elPoint.setAttribute('id', objId);
      elPoint.setAttribute('fill', bcolor);
      elPoint.setAttribute('points', curcoords);
      //20140403HTMLSEAT
      if (mapType == "2") {
        var objSvg = document.getElementById('svgmapbig');
        objSvg.appendChild(elPoint);
      } else {
        var objSvg = document.getElementById('svgmap');
        objSvg.appendChild(elPoint);
      }
    }
  } catch (e) { }
}

//begin 201402HTMLSEAT
function SetMapFocusPosition() {
  try {
    if (mapType == "2") {
      var imgMapPos = $(".bigSeatMap > img[usemap*=#]").offset();
      if (imgMapPos != null) {
        var imgMapTypex = imgMapPos.left;
        var imgMapTypey = imgMapPos.top;
        //20140403HTMLSEAT
        var mapwidth = $(".bigSeatMap > img[usemap*=#]").attr("width");
        $("#dBigMapFocus").css({ top: imgMapTypey, left: imgMapTypex, width: mapwidth });
        $("#svgmapbig").css({ width: mapwidth });
      }
    } else {
      var imgMapPos = $(".seatMap > img[usemap*=#]").offset();
      if (imgMapPos != null) {
        var imgMapTypex = imgMapPos.left;
        var imgMapTypey = imgMapPos.top;
        $("#dMapFocus").css({ top: imgMapTypey, left: imgMapTypex });
      }
    }

  } catch (e) {
    alert(e);
  }
}
//end 201402HTMLSEAT
