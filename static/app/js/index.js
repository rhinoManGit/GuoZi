/**
 *
 */
$(function() {

  var OSIFRootUrl     = '';
  var isLoadedSvg     = false; //20140403HTMLSEAT
  var IdHall          = '8167';
  var IdTime          = '976620';
  var Block           = '0';
  var StMax           = parseInt('10');
  var IdCustomer      = '14444324';
  var HCardAppOpt     = '0';
  var IdOrg           = 1;
  var layerWidth      = 678;
  var layerHeight     = 585;
  var _split          = '@';
  var _lines          = '^';
  var mapType         = '0';
  var ArBlockRemain   = new Array();
  var ArSectionRemain = new Array();
  var ArBlockFile     = new Array();

  //판매가능 좌석맵핑
  /*function TicketMapping(ticketData) {
    var tickets = ticketData.split(_lines);
    for (var i = 0; i < tickets.length; i++) {
      var ticket = tickets[i].split(_split);
      if (ticket.length > 3) {
        var objtk       = document.getElementById('t' + ticket[0]);
        objtk.title     = ticket[3];
        objtk.className = 's' + ticket[1];

        if (ticket[2] == '0') {
          objtk.style.cursor = 'hand';
          objtk.onclick      = ChoiceSeat;
          $('#t' + ticket[0]).attr('grade', ticket[5]);
        }
      }
    }
  }*/

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

  function GetImgPath() {

    HallRoot = parseInt((parseInt(IdHall, 10) / 1000), 10) * 1000;

    return 'http://tkfile.yes24.com/upload2/hallimg/' + HallRoot + '/' +
           IdHall + '/';
  }

  function ChoiceSeat() {

    if ($(this).attr('className') == 'son') {
      $('#C' + $(this).attr('value')).remove();
      $(this).attr('className', $(this).attr('oldclass'));
    }
    else {
      if ($('p[name=cseat]').length < StMax) {
        $('#liSelSeat').
            append('<p id="C' + $(this).attr('value') +
                   '" class="txt2" name="cseat" grade="' +
                   $(this).attr('grade') + '">' + $(this).attr('title') +
                   '</p>');

        $(this).attr('oldclass', $(this).attr('className'));
        $(this).attr('className', 'son');
      }
      else {
        alert(StMax + '좌석 까지만 선택이 가능합니다.');
      }
    }
  }

  //백그라운드 이미지
  function CreateHallBgImg(bgImginfo) {
    var arbginfo = bgImginfo.split(_split);

    if (arbginfo.length > 1) {
      if (arbginfo[0] != '') {
        $('#divContainer').
            css('background-image', 'url(\'' + GetImgPath() + arbginfo[0] +
                                    '\')');
        $('#divContainer').css('background-repeat', 'no-repeat');

        if (arbginfo[1] != '' && arbginfo[2] != '') {
          $('#divContainer').
              css('background-position', arbginfo[1] + 'px ' + arbginfo[2] +
                                         'px');
        }
        else {
          $('#divContainer').css('background-position', '0px 0px');
        }
      }
      else {
        $('#divContainer').css('background-image', 'url(\'\')');
      }
    }
    else {
      $('#divContainer').css('background-image', 'url(\'\')');
    }
  }

  /**
   * 总流程梳理：
   * step1, 获取某演唱会某一月的所有时间表，即有哪些时期是有演出的 @playDateList
   * step2, 从上面的日期列表中指定一天（@selectDate），然后获取当天的演出场次 @playSceneList
   * step3, 指定演出场次里面的一个时间，如下午3点的场次，然后获取对应的坐席信息
   *
   */
  app = new Vue({
    el     : '#app',
    data   : {
      iframeUrl: '/*http://ticket.yes24.com/Pages/Perf/Detail/Detail.aspx?IdPerf=30851&Gcode=009_112_001*/',
      visible  : false,
      email    : '',
      address  : '',
      date     : '',
      detailId : '30851',///*http://ticket.yes24.com/Pages/Perf/Detail/Detail.aspx?IdPerf=30851&Gcode=009_112_001*/
      user     : '',
      tel_1    : '',
      tel_2    : '',
      tel_3    : '',
      username : '',
      ps       : '',
      /**
       * 本月可选场次
       */

      step3    : '',
      /*
        坐席张数
       */
      count    :'',
      /**
       * 是否联席
       *
       */
      isLianXi: '1',
      cityList: [
        {
          value: '1',
          label: '联席'
        },
        {
          value: '0',
          label: '不联席'
        }
        ],

      /**
       * 重要参数
       */
      // 本月有演唱会演出的日期
      playDateList : [],
      // 选择的当前时间
      selectDate   : '',
      // 当天的场次开播场次：{scene: '', sceneId:''}
      playSceneList: [],
      // 选择的场次
      selectScene  : '',
      // 根据场次获取的坐席信息，展示类
      seatInfoText : '',

      block          : '0',// todo 暂时写死 后面改为调用接口
      channel        : 1,// todo 暂时写死
      idOrg          : 1,// todo 暂时写死
      idCustomer     : '14444324', // todo 用户id， 暂时写死
      // 选择某一天之后，将当天的演出时间和对应的大厅号码存起来，就是 idTime和idHall
      currentPlayInfo: [],
      // 获取某一天的演唱会详情（场次等等）
      playInfoText   : '',
      // 获取某一天的某一场次，或者某一集的价格和座位
      seatInfo       : '',
      // 选择最佳位置


      // 场次里面的坐席信息
      // seatInfo: [],
    },
    methods: {
      running: function() {
        let that = this;

        if (!this.detailId) {
          alert('请填写演唱会id和日期。');
          return;
        }

        let date  = that.date;
        let month = date.getMonth() + 1;

        if(month < 10){
          month = '0' + month;
        }

        let sDate = `${date.getFullYear()}-${month}`;

        /**
         * 返回值：
         * eg. ["2018-12-29","2018-12-30",""]
         */
        $.ajax({
          url    : `/index/fetchdetail?id=${that.detailId}&date=${sDate}`,
          success: function(res) {

            that.playDateList = res;

            /**
             * 获取当天的演唱会的时间
             * todo 默认先取当前最近的一天
             */
            that.selectDate = that.playDateList[6];
            that.fetchDatePlayTime();
          },
        });
      },

      /**
       * 获取当天对应的演唱会的具体演出时间。下面3点，7点等
       * 返回值：<option value='' selected='selected'>회차 선택</option><option value='976608'>
       *   오후 3시 00분</option><option value='976612'>오후 7시 00분</option>
       * 或者 <option value='976600'>오후 8시 00분</option>
       *
       */

      fetchDatePlayTime: function() {
        let that = this;

        $.ajax({
          url    : `/index/fetchplaytime?id=${that.detailId}&date=${that.selectDate.replace(/-/g, '')}`,
          success: function(res) {
            let list  = $(res);
            let aTime = [];
            let i     = 0;

            if (list.length > 1) i = 1;

            for (i; list[i]; i++) {
              aTime.push({
                scene  : list[i].text,
                sceneId: list[i].getAttribute('value'),
                select : false,
              });
            }

            /**
             * 播放的场次列表
             * @type {Array}
             */
            that.playSceneList = aTime;

            /**
             * 根据播放得到场次获取对应的座位图
             *
             */
            that.fetchSceneseat();
          },
        });
      },

      /**
       *  获取某一场演唱会的坐席信息
       */
      fetchSceneseat: function() {
        let that = this;

        /**
         * todo 默认先取当天的第一场
         * @type {string}
         */
        let id = that.playSceneList.length ? that.playSceneList[0].sceneId : '';
        // 当前的演出场次状态为true
        that.playSceneList.length && (that.playSceneList[0].select = true);
        that.playSceneList.length && (that.selectScene = that.playSceneList[0]);

        $.ajax({
          url    : `/index/remainseat?id=${id}`,
          success: function(res) {
            /**
             * 座位信息，说明
             * @type {*|void}
             * eg. <li><span class='grade'>R석</span><span>48석</span></li>
             * <li><span class='grade'>시야제한석</span><span>92석</span></li>
             */
            that.seatInfoText = res;

            /**
             * 接下来是获取演唱会的详细信息，主要是要获取到大厅号，这样才可以选票，选座环节
             * 这里面有一句代码很有意思，js,里面的，是在打开iframe的时候
             *  $j(document).ready(function () {

                  if (window.opener == null) {
                      alert("예매버튼을 이용하여 예매 부탁 드립니다."); //“请利用预售按钮预购一下。”强制要求用预售按钮打开
                      location.href = "/pages/Main.aspx";
                  }
             */
            that.fetchPlayInfo();
          },
        });
      },

      /**
       * 获取当前的日期的演唱会的详细信息，相比于上面的会相信一下，有大厅号，座位区域等
       *
       */
      fetchPlayInfo: function() {
        let that = this;

        $.ajax({
          url    : `/index/fetchplayinfo?id=${that.detailId}&date=${that.selectDate.replace(
              /-/g, '')}`,
          success: function(res) {

            that.playInfoText = res;

            /**
             * 对数据进行序列化存储起来
             */
            let $li = $(res).find('li');
            let len = $li.length;

            for (let i = 0; i < len; i++) {
              let o = $li.eq(i);

              that.currentPlayInfo.push({
                idTime         : o.attr('value'),
                idHall         : o.attr('idHall'),
                seatviewmode   : o.attr('seatviewmode'),
                saleclose      : o.attr('saleclose'),
                limitcussalecnt: o.attr('limitcussalecnt'),
                timeinfo       : o.attr('timeinfo'),
                YespointOption : o.attr('YespointOption'),
                text           : o.text(),
              });
            }

            /**
             *
             * 获取当前场次的的价格和座位
             */
            that.fetchSeatprice();

            /**
             *
             * todo 获取座位图 这里面的一个参数暂时写死
             *  var IdHall = '8491';
             var IdTime = '980360';
             var Block = '0';
             var StMax = parseInt('10');
             var IdCustomer = '14444324'; todo 这个参数暂时写死//
             */
            //that.fetchSeatMap();
            that.fetchBlock();
            //that.fetchSeatMapHtml();
          },
        });
      },

      /**
       * 价格和座位
       */
      fetchSeatprice: function() {
        let that = this;
        let id   = that.selectScene.sceneId;

        $.ajax({
          url    : `/index/fetchseatprice?id=${id}`,
          success: function(res) {

            that.seatInfo = res;

            /**
             * todo 获取座位图 这里面的一个参数暂时写死
             *  var IdHall = '8491';
             *  var IdTime = '980360';
             *  var Block = '0';
             *  var StMax = parseInt('10');
             *  var IdCustomer = '14444324'; todo 这个参数暂时写死//
             *
             * */
          },
        });
      },

      /**
       * 获取座位
       * 这里是弹出一个选择座位的布局图，下面是获取作为信息和渲染作为的代码
       *
       * function GetSeatData(blk, seq) {
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

                    // begin 20140410HTMLSEAT
                      if (isIe9over) {
                        jQuery("div").css("filter", "");
                      }
                        //end 20140410HTMLSEAT

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
       */
      fetchSeatMap: function() {
        /**
         * 参数
         /*$.ajax({
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
                });*/
        let that = this;

        $('#IdTime').val(that.currentPlayInfo[0].idTime);
        /**
         * todo 这里先获取第一场做演练
         * 后面做遍历
         */
        let param = {
          'idHall'    : that.currentPlayInfo[0].idHall, // 大厅
          'idTime'    : that.currentPlayInfo[0].idTime, // 时间 980360 详情页的选择时间之后的当天的那个场次的时间
          'block'     : that.block,
          'channel'   : that.channel,
          'idCustomer': that.idCustomer,
          'idOrg'     : that.idOrg,
        };

        let _fetch = function(param) {

          $.ajax({
            url    : `/index/fetchseatmap`,
            data   : param,
            success: function(res) {
              console.log(res);

              /**
               * todo 获取座位图 这里面的一个参数暂时写死
               *  var IdHall = '8491';
               var IdTime = '980360';
               var Block = '0';
               var StMax = parseInt('10');
               var IdCustomer = '14444324'; todo 这个参数暂时写死//
               *
               * */
                  //var hallLayout = $(res).find("Layout").text();

                  //$('#divSeatArray').html(hallLayout);
              var msg     = res;
              var timdid  = $(msg).find('IdTime').text();
              var blockid = $(msg).find('Block').text();

              /*if ((timdid == IdTime && blockid == Block) == false) {
               return;
               }*/

              var hallLayout = $(msg).find('Layout').text();
              var background = $(msg).find('Background').text();
              //            var regend = $(msg).find("Regend").text();
              //            var section = $(msg).find("Section").text();
              var blockRemain = $(msg).find('BlockRemain').text();
              var blockSeat   = $(msg).find('BlockSeat').text();

              $('#divSeatArray').html(hallLayout);

              /**
               * 选择最佳位置
               */


              /* begin 20140410HTMLSEAT*/
              /*if (isIe9over) {
               jQuery("div").css("filter", "");
               }*/
              /* end 20140410HTMLSEAT*/

              CreateHallBgImg(background);
              //          CreateLegend(regend);
              //          CreateSection(section);
              CreateRemainArgs(blockRemain);
              TicketMapping(blockSeat);

              /**
               * todo 等待渲染完成以后 执行 autoSelect
               * 选择座位以后的操作
               *
               */

              setTimeout(function() {
                that.autoSelect();
              }, 500);
              //ChoiceEndNew();

              //////////////
              /*setTimeout(function() {
               window.open('http://ticket.yes24.com/Pages/Perf/Sale/PerfSaleProcess.aspx?IdPerf=30851&IdTime=976594')
               }, 1000)*/
            },
          });
        };

        _fetch(param);
      },

      fetchBlock: function() {
        let that = this;

        $.ajax({
          url    : `/index/fetchblock`,
          data   : {pIdTime: that.currentPlayInfo[0].idTime},
          success: function(res) {
            console.log(res);
            that.block = res + '';
            that.fetchSeatMap();
            //that.fetchSeatMapHtml();
          }
      })
      },

      /**
       * 自动选择一个座位
       */
      autoSelect: function() {


        let that = this;
        /**
         * todo 等待渲染完成以后 执行 chooseEnd
         * 选择座位以后的操作
         *
         */
        setTimeout(function() {
          $('#divSeatArray').find('.s6').eq(3).trigger('click');

          // todo 选择座位以后的操作
          that.ChoiceEndNew();
        }, 1000)
      },

      ChoiceEndNew:function() {

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

        let that = this;
        /**
         * 进入占位环节
         */
        $.ajax({
          type: "post",
          url: '/index/lockseat',
          data: { "name": that.idCustomer,
            "idTime": that.currentPlayInfo[0].idTime, "token": token, "Block": that.block},
          dataType: "xml",
          async: true,
          success: function (msg) {
            ChoiceEnd_CallBack(msg, token, tokenClass);
          },
          error: function (msg) {
            errormsg(msg.responseText);
          }
        });
      },

      /**
       * todo （废弃）对于获取座位图的逻辑重新整理
       * 上面的是走的接口，但是会有问题，(还是走上面的，这个存在跨域等问题)
       * 我直接把这个iframe的地址获取到之后，直接爬取整个html, 因为对于任何的不同的演唱会的
       * 座位图都是不一样的，所以座位的背景图都是动态的，直接获取这个html比较靠谱
       * http://ticket.yes24.com/Pages/Perf/Sale/
       * PerfSaleHtmlSeat.aspx?idTime=984380&
       * idHall=8167&block=0&stMax=10&pHCardAppOpt=0
       *
       * 获取到座位的html，然后通过正则匹配出里面的座位图，然后再结合我们的js下单
       *
       * 这个的前一步是获取 演唱会的block，这个参数
       * 源代码：
       * function fax_GetTimeBlock(jpIdTime, jpIdHall, jpCardOpt) {
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
                      jvFrame += "' width=970 height=636 frameborder=0
                       marginheight=0 marginwidth=0 scrolling=no></iframe>";

       *
       *
       */

      fetchSeatMapHtml: function() {

        let that = this;

        /**
         * todo 这里先获取第一场做演练
         * 后面做遍历
         */
        let param = {
          'idHall'    : that.currentPlayInfo[0].idHall, // 大厅
          'idTime'    : that.currentPlayInfo[0].idTime, // 时间 980360 详情页的选择时间之后的当天的那个场次的时间
          'block'     : that.block,
          stMax       : 10,
          pHCardAppOpt: 0,
        };
        /*idTime: 984380
        idHall: 8167
        block: 0
        stMax: 10 //看源代码是写死的 var StMax = parseInt('10');
        pHCardAppOpt: 0*/

        let url = `/index/fetchseatmaphtml?idHall`+
                  `=${param.idHall}&idTime=${param.idTime}&block=${that.block}&stMax=10&pHCardAppOpt=0`

        $('#J-seatMap')[0].src = url;

        /*let _fetch = function(param) {

          $.ajax({
            url    : `/index/fetchseatmaphtml`,
            data   : param,
            dataType:'html',
            success: function(res) {
              console.log(res);

              /!**
               * todo 获取座位图 这里面的一个参数暂时写死
               *  var IdHall = '8491';
               var IdTime = '980360';
               var Block = '0';
               var StMax = parseInt('10');
               var IdCustomer = '14444324'; todo 这个参数暂时写死//
               *
               * *!/
                  //var hallLayout = $(res).find("Layout").text();

                  //$('#divSeatArray').html(hallLayout);
              var msg     = res;
              /!*var timdid  = $(msg).find('IdTime').text();
              var blockid = $(msg).find('Block').text();

              /!*if ((timdid == IdTime && blockid == Block) == false) {
               return;
               }*!/

              var hallLayout = $(msg).find('Layout').text();
              var background = $(msg).find('Background').text();
              //            var regend = $(msg).find("Regend").text();
              //            var section = $(msg).find("Section").text();
              var blockRemain = $(msg).find('BlockRemain').text();
              var blockSeat   = $(msg).find('BlockSeat').text();

              $('#divSeatArray').html(hallLayout);*!/
              window.$temp = $(msg);
              $('#divGuide').html($temp.find('#divGuide'));
              //$('#J-seatMap').html(msg);

              /!**
               * 选择最佳位置
               *!/


              /!* begin 20140410HTMLSEAT*!/
              /!*if (isIe9over) {
               jQuery("div").css("filter", "");
               }*!/
              /!* end 20140410HTMLSEAT*!/

              /!*CreateHallBgImg(background);
              //          CreateLegend(regend);
              //          CreateSection(section);
              CreateRemainArgs(blockRemain);
              TicketMapping(blockSeat);*!/

              //////////////
              /!*setTimeout(function() {
               window.open('http://ticket.yes24.com/Pages/Perf/Sale/PerfSaleProcess.aspx?IdPerf=30851&IdTime=976594')
               }, 1000)*!/
            },
          });
        };

        _fetch(param);*/
      },

      /**
       * 选座位
       * 每个座位的ID就是这个value，所有的选座都是取这个div然后从这个里面读取对应的id来完成的下单
       * 选择座位以后，调用下单的时候调用的就是这个方法 ChoiceEnd
       * <div class="son" id="t1500029"
       * style="LEFT: 391px; TOP: 298px" name="tk" value="1500029" title="1층 K열 019번" grade="R석" oldclass="s6"></div>
       */
      book:function() {

        ChoiceEndNew();
      },
      /**
       * 选择座位
       */
      choosieZuowei: function() {

      },

      show        : function() {
        this.visible = true;
      },
    },
  });

  var opened = true;
  $('.top-btn').click(function() {

    if (opened)
      $('.left-content').animate({
        'width': '0px',
      }, 'speed', function() {
        opened = false;
      });
    else
      $('.left-content').animate({
        'width': '187px',
      }, 'speed', function() {
        opened = true;
      });

  });

});