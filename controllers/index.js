/**
 * Created by Administrator on 2017/9/18 0018.
 */
const fs      = require('fs');
const request = require('request');
var http      = require('http');

class Index {
  constructor() {
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  index(req, res, next) {

    res.render('index');
  }

  /**
   * 获取远程detail内容
   * @param req
   * @param res
   * @param next
   * 参考代码：http://ticket.yes24.com/Pages/Perf/Detail/Scripts/Detail.js?v=14 P1169
   * function jsf_pdi_GetPerfDatesInMonth(jpIdPerf, jpYear, jpMonth, jgIdCode, jgIsMania) {
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
   */
  fetchdetail(req, res, next) {
    let id   = req.query.id;
    let date = req.query.date;

    let url   = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/PerfDay.aspx';
    let param = {
      pGetMode  : 'days',
      pIdPerf   : id,
      pPerfMonth: date,
      pIdCode   : '',//（代码里面默认是传递的空）
      pIsMania  : '0' //（传0即可）
    };

    request.post({url: url, form: param}, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.json(body.split(','));
      }
    });
  }

  /**
   * 获取演唱会具体时间
   * @param req
   * @param res
   * @param next
   * Request URL: http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfPlayTime.aspx
   Request Method: POST
   参数：
   IdPerf: 30851 （演唱会的id）
   PlayDate: 20181227

   返回值：<option value='976599'>오후 8시 00분</option>
   */
  fetchplaytime(req, res, next) {
    let id   = req.query.id;
    let date = req.query.date;

    let url   = 'http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfPlayTime.aspx';
    let param = {
      IdPerf  : id,//30851 （演唱会的id）
      PlayDate: date//20181227
    };

    request.post({url: url, form: param}, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   *
   * 确认了抢票的场次以后，开始获取演唱会的剩余坐席， 依赖于fetchplaytime
   * @param req
   * @param res
   * @param next
   * equest URL: http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfRemainSeat.aspx
     Request Method: POST
     参数：
     IdTime: 976599
     IdLock: 0 （看代码中这个是写死的）
   */
  remainseat(req, res, next) {
    let id = req.query.id;

    let url   = 'http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfRemainSeat.aspx';
    let param = {
      IdTime: id,//30851 （演唱会的id）
      IdLock: 0//20181227
    };

    request.post({url: url, form: param}, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   * 获取演唱会详情
   * @param req
   * @param res
   * @param next
   * 获取到这里，就是打开iframe弹框了
   调用第一个接口;
   Request URL: http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/PerfTime.aspx
   Request Method: POST
   Status Code: 200 OK
   参数
   pDay: 20181222
   pIdPerf: 30851
   pIdCode:
   pIsMania: 0 写
   */
  fetchplayinfo(req, res, next) {
    let id   = req.query.id;
    let date = req.query.date;

    /**
     * 这个接口依赖于一个cookie
     * Cookie:ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYD
     *    A1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4
     *    ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3
     *    R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3
     *    RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmha
     * MG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;
     * @type {string}
     * 这个里面会返回比较13:00，第一集，15:00,第二集，然后用户选择了这两个里面的任意一个，然后点击按钮，获取选座位的一页面
     * 这个下面会调用下面的接口
     */
    let url   = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/PerfTime.aspx';
    let param = {
      pDay    : date,//'20181221',
      pIdPerf : id,//'30851',
      pIdCode : '',
      pIsMania: '0',
    };
    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09',
      },
    }, function(error, response, body) {
      console.log('ssssssssss111', error, body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   * 上面获取到了当前一天的两集，然后点击一集的时候会调用这个接口，获取这一集的作为大致信息，然后用户点击下一步来选择（座位图）
   * Request URL: http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/TimeSeatRemain.aspx
   Request Method: POST
   参数：
   pIdTime: 976612
   pIdCode:
   pDisplayRemainSeat: 0
   */
  fetchseatprice(req, res, next) {

    let id    = req.query.id;
    let url   = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/TimeSeatRemain.aspx';
    let param = {
      pIdTime           : id,//976612,
      pIdCode           : '',
      pDisplayRemainSeat: 0,
    };

    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;',
      },
    }, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   * 获取演唱会的座位图
   */
  fetchseatmap(req, res, next) {

    let url   = 'http://ticket.yes24.com/OSIF/Book.asmx/GetBookWhole';
    let param = {
      'idHall'    : req.query.idHall, // 大厅
      'idTime'    : req.query.idTime, // 时间 980360 详情页的选择时间之后的当天的那个场次的时间
      'block'     : req.query.block,
      'channel'   : req.query.channel,
      'idCustomer': req.query.idCustomer,
      'idOrg'     : req.query.idOrg,
    };

    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
      },
    }, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   * todo 这个接口是依赖于cookie的
   * @param req
   * @param res
   * @param next
   */
  fetchblock(req, res, next){
   // pIdTime: 984382
    let url   = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/TimeFlashBlock.aspx';
    let param = {
      'pIdTime'    : '984382'||req.query.pIdTime,
    };

    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        'Content-Type': 'text/html; charset=utf-8',

        /*'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
         */
        'Cookie': 'PCID=15412575754544845754324; __utmz=186092716.1543761346.9.3.utmcsr=10.102.42.86:1302|utmccn=(referral)|utmcmd=referral|utmcct=/; ASP.NET_SessionId=2cezhhvcncsyd1tkuqqiv5du; __utmc=186092716; RecentViewGoods=; __utma=12748607.1899395315.1541259374.1541842300.1546615669.4; __utmc=12748607; __utmz=12748607.1546615669.4.4.utmcsr=ticket.yes24.com|utmccn=(referral)|utmcmd=referral|utmcct=/Pages/Perf/Detail/Detail.aspx; HTTP_REFERER=https://www.yes24.com/Templates/FTLogin.aspx?ReturnURL=http://ticket.yes24.com/Pages/Perf/Detail/Detail.aspx&&ReturnParams=IdPerf=32050`Gcode=009_112_001; AT_LOGIN=AT_MID=meilan1&AT_SID=31617DC7FADC961F0F5960AD07D91B90&AT_PID=0x572F1A06ACE3D962AA6DBFDF02F2F490AFD632F5&AT_LDTS=201901050035; ClientIPAddress=; ServerIPAddress=; MEM_NO=; MEM_ID=; MEM_NM=; FAMILY_PAY_NO=; MEM_GB=; NICK_NM=; BLOG_URL=; CART_NO=; MEM_AGE=; NEW_PID=; ServiceCookies=MTQ0NDE1OTBgbWVpbGFuMWBMSSBLT05HYDBgMDVgxOFgYDE0NDQxNTkwYDQwYDRhV2hna0lFSEorRnBnczlwc0NwY05reHExanlkLzNONFEvRloxOC9OdVdEbG9CN0lrbTJ4VzlNMEZJNjBESFpgY2gvdHZTdTl3UlhnR0xDLzlqKzNJZkpwckZaWXUvY05JUnpOeWxOYU1LdFFWRGVOc0FKZHBxN0VkUGRnYkhFbGNhSXRCbk04cjhIZTBlbWsyOEZpQTY3cG42S2pBWDRReno2a293SFJyMHBMYk1WaFowblBrWVFib1RxbW11bDdzYVpub1crZStya2N0ZTJDWkp5ZE5zQnYxZVBVVHZOWSttK3Q1RWZXYllNPWBtbjg5ZE9FdmJtMmZCbnR5ckVlRit3PT0=; Mallinmall_CKMN=14441590; Mallinmall_CKMI=meilan1; Mallinmall_CKMNM=LI+KONG; Mallinmall_CKMAG=40; Yes24LoginID=meilan1; EntLoginInfo=bWVpbGFuMXwyMDE5LTAxLTA1IL/AwPwgMTI6MzU6MzU=; RecentViewInfo=NotCookie%3DY%26Interval%3D5%26ReloadTime%3DFri%2C%2004%20Jan%202019%2015%3A35%3A35%20GMT%26First%3Dtrue; YesTicket=UserNO=188,245,80,36,225,67,30,48,1,226,126,212,222,58,235,168&UserID=99,234,69,255,226,231,191,185&UserName=13,227,113,214,49,206,191,105&UserNickName=164,80,231,199,85,14,246,109&Email=50,7,127,115,196,36,63,201,58,103,19,12,172,140,46,27,187,143,247,158,65,238,42,0&ManiaLevel=185,175,224,130,94,14,207,79&MemberStatus=245,54,43,158,39,91,228,116&UserIdentiNumber=186,219,219,185,232,25,153,61,215,6,226,217,129,93,201,98&StarLevel=245,54,43,158,39,91,228,116&PromotionCode=245,54,43,158,39,91,228,116&MemberGB=100,254,24,90,225,175,0,66&UserAge=18,183,46,181,134,149,118,19&ORD_PATH_GB=195,31,27,161,165,198,213,175&ZipCode=255,150,156,169,164,205,217,43&Address=29,144,253,142,54,202,36,187&Addr1=245,54,43,158,39,91,228,116&Addr2=245,54,43,158,39,91,228,116&Addr3=245,54,43,158,39,91,228,116&Addr4=245,54,43,158,39,91,228,116&Phone=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&Mobile=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&OrgID=13,101,187,16,10,24,135,131&Channel=13,101,187,16,10,24,135,131; __utma=186092716.778539359.1541257578.1546612005.1546616414.22; TVPERF=9,205,148,67,207,154,165,152,149,37,174,14,127,99,168,116,138,110,246,241,108,29,141,70'
      },
    }, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   * 这个的前一步是获取 演唱会的block，这个参数
   *
   */
  fetchseatmaphtml(req, res, next) {

    let idHall = 8167 || req.query.idHall;
    let idTime = 984380 || req.query.idTime;

    /*idTime: 984380
    idHall: 8167*/

    let url   = `http://ticket.yes24.com/Pages/Perf/Sale/PerfSaleHtmlSeat`
        +`.aspx?idTime=${idTime}&idHall=${idHall}&block=0&stMax=10&pHCardAppOpt=0`;
    url = 'http://ticket.yes24.com/Pages/Perf/Sale/PerfSaleHtmlSeat.aspx?idTime=984380&idHall=8167&block=0&stMax=10&pHCardAppOpt=0'

    // todo 必须要有cookie
   // req.pipe(request(url)).pipe(res);
    request({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      'Cookie': "PCID=15412575754544845754324; __utmz=186092716.1543761346.9.3.utmcsr=10.102.42.86:1302|utmccn=(referral)|utmcmd=referral|utmcct=/; __utma=12748607.1899395315.1541259374.1541842300.1546615669.4; __utmz=12748607.1546615669.4.4.utmcsr=ticket.yes24.com|utmccn=(referral)|utmcmd=referral|utmcct=/Pages/Perf/Detail/Detail.aspx; AT_LOGIN=AT_MID=meilan1&AT_SID=31617DC7FADC961F0F5960AD07D91B90&AT_PID=0x572F1A06ACE3D962AA6DBFDF02F2F490AFD632F5&AT_LDTS=201901050035; ServiceCookies=MTQ0NDE1OTBgbWVpbGFuMWBMSSBLT05HYDBgMDVgxOFgYDE0NDQxNTkwYDQwYDRhV2hna0lFSEorRnBnczlwc0NwY05reHExanlkLzNONFEvRloxOC9OdVdEbG9CN0lrbTJ4VzlNMEZJNjBESFpgY2gvdHZTdTl3UlhnR0xDLzlqKzNJZkpwckZaWXUvY05JUnpOeWxOYU1LdFFWRGVOc0FKZHBxN0VkUGRnYkhFbGNhSXRCbk04cjhIZTBlbWsyOEZpQTY3cG42S2pBWDRReno2a293SFJyMHBMYk1WaFowblBrWVFib1RxbW11bDdzYVpub1crZStya2N0ZTJDWkp5ZE5zQnYxZVBVVHZOWSttK3Q1RWZXYllNPWBtbjg5ZE9FdmJtMmZCbnR5ckVlRit3PT0=; Yes24LoginID=meilan1; __utma=186092716.778539359.1541257578.1546612005.1546616414.22; YesTicket=UserNO=188,245,80,36,225,67,30,48,1,226,126,212,222,58,235,168&UserID=99,234,69,255,226,231,191,185&UserName=13,227,113,214,49,206,191,105&UserNickName=164,80,231,199,85,14,246,109&Email=50,7,127,115,196,36,63,201,58,103,19,12,172,140,46,27,187,143,247,158,65,238,42,0&ManiaLevel=185,175,224,130,94,14,207,79&MemberStatus=245,54,43,158,39,91,228,116&UserIdentiNumber=186,219,219,185,232,25,153,61,215,6,226,217,129,93,201,98&StarLevel=245,54,43,158,39,91,228,116&PromotionCode=245,54,43,158,39,91,228,116&MemberGB=100,254,24,90,225,175,0,66&UserAge=18,183,46,181,134,149,118,19&ORD_PATH_GB=195,31,27,161,165,198,213,175&ZipCode=255,150,156,169,164,205,217,43&Address=29,144,253,142,54,202,36,187&Addr1=245,54,43,158,39,91,228,116&Addr2=245,54,43,158,39,91,228,116&Addr3=245,54,43,158,39,91,228,116&Addr4=245,54,43,158,39,91,228,116&Phone=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&Mobile=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&OrgID=13,101,187,16,10,24,135,131&Channel=13,101,187,16,10,24,135,131"}}, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   * 进入占位环节，锁定坐席
   */
  lockseat(req, res, next) {

    let url   = 'http://ticket.yes24.com/OSIF/Book.asmx/Lock';

    let param = {
      name: req.query.name ||'14441590',
      idTime: req.query.idTime || '989802',
      token: req.query.token || '1500029,1500030',
      Block: req.query.Block || '0'
    };

    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        'Content-Type': 'text/html; charset=utf-8',

        /*'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
         */
        'Cookie': 'PCID=15412575754544845754324; __utmz=186092716.1543761346.9.3.utmcsr=10.102.42.86:1302|utmccn=(referral)|utmcmd=referral|utmcct=/; ASP.NET_SessionId=2cezhhvcncsyd1tkuqqiv5du; __utmc=186092716; RecentViewGoods=; __utma=12748607.1899395315.1541259374.1541842300.1546615669.4; __utmc=12748607; __utmz=12748607.1546615669.4.4.utmcsr=ticket.yes24.com|utmccn=(referral)|utmcmd=referral|utmcct=/Pages/Perf/Detail/Detail.aspx; HTTP_REFERER=https://www.yes24.com/Templates/FTLogin.aspx?ReturnURL=http://ticket.yes24.com/Pages/Perf/Detail/Detail.aspx&&ReturnParams=IdPerf=32050`Gcode=009_112_001; AT_LOGIN=AT_MID=meilan1&AT_SID=31617DC7FADC961F0F5960AD07D91B90&AT_PID=0x572F1A06ACE3D962AA6DBFDF02F2F490AFD632F5&AT_LDTS=201901050035; ClientIPAddress=; ServerIPAddress=; MEM_NO=; MEM_ID=; MEM_NM=; FAMILY_PAY_NO=; MEM_GB=; NICK_NM=; BLOG_URL=; CART_NO=; MEM_AGE=; NEW_PID=; ServiceCookies=MTQ0NDE1OTBgbWVpbGFuMWBMSSBLT05HYDBgMDVgxOFgYDE0NDQxNTkwYDQwYDRhV2hna0lFSEorRnBnczlwc0NwY05reHExanlkLzNONFEvRloxOC9OdVdEbG9CN0lrbTJ4VzlNMEZJNjBESFpgY2gvdHZTdTl3UlhnR0xDLzlqKzNJZkpwckZaWXUvY05JUnpOeWxOYU1LdFFWRGVOc0FKZHBxN0VkUGRnYkhFbGNhSXRCbk04cjhIZTBlbWsyOEZpQTY3cG42S2pBWDRReno2a293SFJyMHBMYk1WaFowblBrWVFib1RxbW11bDdzYVpub1crZStya2N0ZTJDWkp5ZE5zQnYxZVBVVHZOWSttK3Q1RWZXYllNPWBtbjg5ZE9FdmJtMmZCbnR5ckVlRit3PT0=; Mallinmall_CKMN=14441590; Mallinmall_CKMI=meilan1; Mallinmall_CKMNM=LI+KONG; Mallinmall_CKMAG=40; Yes24LoginID=meilan1; EntLoginInfo=bWVpbGFuMXwyMDE5LTAxLTA1IL/AwPwgMTI6MzU6MzU=; RecentViewInfo=NotCookie%3DY%26Interval%3D5%26ReloadTime%3DFri%2C%2004%20Jan%202019%2015%3A35%3A35%20GMT%26First%3Dtrue; YesTicket=UserNO=188,245,80,36,225,67,30,48,1,226,126,212,222,58,235,168&UserID=99,234,69,255,226,231,191,185&UserName=13,227,113,214,49,206,191,105&UserNickName=164,80,231,199,85,14,246,109&Email=50,7,127,115,196,36,63,201,58,103,19,12,172,140,46,27,187,143,247,158,65,238,42,0&ManiaLevel=185,175,224,130,94,14,207,79&MemberStatus=245,54,43,158,39,91,228,116&UserIdentiNumber=186,219,219,185,232,25,153,61,215,6,226,217,129,93,201,98&StarLevel=245,54,43,158,39,91,228,116&PromotionCode=245,54,43,158,39,91,228,116&MemberGB=100,254,24,90,225,175,0,66&UserAge=18,183,46,181,134,149,118,19&ORD_PATH_GB=195,31,27,161,165,198,213,175&ZipCode=255,150,156,169,164,205,217,43&Address=29,144,253,142,54,202,36,187&Addr1=245,54,43,158,39,91,228,116&Addr2=245,54,43,158,39,91,228,116&Addr3=245,54,43,158,39,91,228,116&Addr4=245,54,43,158,39,91,228,116&Phone=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&Mobile=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&OrgID=13,101,187,16,10,24,135,131&Channel=13,101,187,16,10,24,135,131; __utma=186092716.778539359.1541257578.1546612005.1546616414.22; TVPERF=9,205,148,67,207,154,165,152,149,37,174,14,127,99,168,116,138,110,246,241,108,29,141,70'
      },
    }, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }

  /**
   * 选座完成之后的一个接口
   *
   */
  timeseatflashend(req, res, next) {

    let url   = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/TimeSeatFlashEnd.aspx';

    let param = {
      pIdTime: req.query.idTime || '989802',
      PCntClass: req.query.name || 'R석-R석'

    };

    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        'Content-Type': 'text/html; charset=utf-8',

        /*'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
         */
        'Cookie': 'PCID=15412575754544845754324; __utmz=186092716.1543761346.9.3.utmcsr=10.102.42.86:1302|utmccn=(referral)|utmcmd=referral|utmcct=/; ASP.NET_SessionId=2cezhhvcncsyd1tkuqqiv5du; __utmc=186092716; RecentViewGoods=; __utma=12748607.1899395315.1541259374.1541842300.1546615669.4; __utmc=12748607; __utmz=12748607.1546615669.4.4.utmcsr=ticket.yes24.com|utmccn=(referral)|utmcmd=referral|utmcct=/Pages/Perf/Detail/Detail.aspx; HTTP_REFERER=https://www.yes24.com/Templates/FTLogin.aspx?ReturnURL=http://ticket.yes24.com/Pages/Perf/Detail/Detail.aspx&&ReturnParams=IdPerf=32050`Gcode=009_112_001; AT_LOGIN=AT_MID=meilan1&AT_SID=31617DC7FADC961F0F5960AD07D91B90&AT_PID=0x572F1A06ACE3D962AA6DBFDF02F2F490AFD632F5&AT_LDTS=201901050035; ClientIPAddress=; ServerIPAddress=; MEM_NO=; MEM_ID=; MEM_NM=; FAMILY_PAY_NO=; MEM_GB=; NICK_NM=; BLOG_URL=; CART_NO=; MEM_AGE=; NEW_PID=; ServiceCookies=MTQ0NDE1OTBgbWVpbGFuMWBMSSBLT05HYDBgMDVgxOFgYDE0NDQxNTkwYDQwYDRhV2hna0lFSEorRnBnczlwc0NwY05reHExanlkLzNONFEvRloxOC9OdVdEbG9CN0lrbTJ4VzlNMEZJNjBESFpgY2gvdHZTdTl3UlhnR0xDLzlqKzNJZkpwckZaWXUvY05JUnpOeWxOYU1LdFFWRGVOc0FKZHBxN0VkUGRnYkhFbGNhSXRCbk04cjhIZTBlbWsyOEZpQTY3cG42S2pBWDRReno2a293SFJyMHBMYk1WaFowblBrWVFib1RxbW11bDdzYVpub1crZStya2N0ZTJDWkp5ZE5zQnYxZVBVVHZOWSttK3Q1RWZXYllNPWBtbjg5ZE9FdmJtMmZCbnR5ckVlRit3PT0=; Mallinmall_CKMN=14441590; Mallinmall_CKMI=meilan1; Mallinmall_CKMNM=LI+KONG; Mallinmall_CKMAG=40; Yes24LoginID=meilan1; EntLoginInfo=bWVpbGFuMXwyMDE5LTAxLTA1IL/AwPwgMTI6MzU6MzU=; RecentViewInfo=NotCookie%3DY%26Interval%3D5%26ReloadTime%3DFri%2C%2004%20Jan%202019%2015%3A35%3A35%20GMT%26First%3Dtrue; YesTicket=UserNO=188,245,80,36,225,67,30,48,1,226,126,212,222,58,235,168&UserID=99,234,69,255,226,231,191,185&UserName=13,227,113,214,49,206,191,105&UserNickName=164,80,231,199,85,14,246,109&Email=50,7,127,115,196,36,63,201,58,103,19,12,172,140,46,27,187,143,247,158,65,238,42,0&ManiaLevel=185,175,224,130,94,14,207,79&MemberStatus=245,54,43,158,39,91,228,116&UserIdentiNumber=186,219,219,185,232,25,153,61,215,6,226,217,129,93,201,98&StarLevel=245,54,43,158,39,91,228,116&PromotionCode=245,54,43,158,39,91,228,116&MemberGB=100,254,24,90,225,175,0,66&UserAge=18,183,46,181,134,149,118,19&ORD_PATH_GB=195,31,27,161,165,198,213,175&ZipCode=255,150,156,169,164,205,217,43&Address=29,144,253,142,54,202,36,187&Addr1=245,54,43,158,39,91,228,116&Addr2=245,54,43,158,39,91,228,116&Addr3=245,54,43,158,39,91,228,116&Addr4=245,54,43,158,39,91,228,116&Phone=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&Mobile=48,70,225,17,96,140,199,186,95,2,35,151,126,204,152,122&OrgID=13,101,187,16,10,24,135,131&Channel=13,101,187,16,10,24,135,131; __utma=186092716.778539359.1541257578.1546612005.1546616414.22; TVPERF=9,205,148,67,207,154,165,152,149,37,174,14,127,99,168,116,138,110,246,241,108,29,141,70'
      },
    }, function(error, response, body) {
      console.log('ssssssssss', body);

      if (error) {
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body);
      }
    });
  }
  /**
   * 本地详情
   * @param req
   * @param res
   * @param next
   */
  detail(req, res, next) {
    res.render('detail');
  }
}

module.exports = Index;