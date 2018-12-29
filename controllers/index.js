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
        /*'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
         */
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

  test(req, res, next) {

    let url   = 'http://gny.ly.com/dujia/fetch/commentVote';
    let param = {"dpGuid":"2ccc15e3-e706-4c2e-8565-17ff123",
    "t": "1545969549565"}

    // todo 必须要有cookie
    request.post({
      url: url, form: param, headers: {
        referer:"gny.ly.com",
        'Cookie':'dujiaUserToken=4e290a2f-eded-4321-ac05-a15aecf265ad; myStr=lrFOk3eoDHdXmpLo1RNvRDvvDv1Sh7Zz; nus=userid=130839352&nickName=%e5%90%8c%e7%a8%8b%e5%b0%8fT&level=1; _ga=GA1.2.315035221.1542610534; abtkey=96cdb12a-46a8-499a-a435-bd5eacc130d9; Hm_lvt_64941895c0a12a3bdeb5b07863a52466=1542943454,1543292148,1545106323; dj-koalaman=aebf33b72a2fb698c99042e9fed4ce5a; gny_city_info=%7B%22CityId%22%3A226%2C%22CityArea%22%3A%22%E5%8D%8E%E4%B8%9C%22%2C%22CityName%22%3A%22%E8%8B%8F%E5%B7%9E%22%2C%22FullPinyinName%22%3A%22suzhou%22%2C%22FirstZiMu%22%3A%22S%22%2C%22ProvinceId%22%3A16%2C%22ProvinceName%22%3A%22%E6%B1%9F%E8%8B%8F%22%2C%22ShortPy%22%3A%22sz%22%2C%22TcShortPy%22%3A%22sz%22%7D; CNSEInfo=RefId=10758821&tcbdkeyid=&SEFrom=&SEKeyWords=&RefUrl=; 17uCNRefId=10758821; NewProvinceId=16; NCid=226; NewProvinceName=%E6%B1%9F%E8%8B%8F; NCName=%E8%8B%8F%E5%B7%9E; __tctmu=144323752.0.0; __tctmz=144323752.1545899276276.9.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); longKey=1545106366928872; __tctrack=0; route=9610b5dab50088b9440314c1488559b1; qdid=-9999; Hm_lvt_c6a93e2a75a5b1ef9fb5d4553a2226e5=1544493904,1545012085,1545127994,1545967893; __tctma=144323752.1545106366928872.1545106366975.1545899276276.1545967939325.10; cnUser=userid=130839352&token=069220158164240130232187098219047143155091199213210248210059195077103131181117013028226227109182196098217217135190245130200000168201157246110055111083038069241074131186165121047197056079141075189020151169064070205038&loginType=passport; us=userid=130839352&nickName=%e5%90%8c%e7%a8%8b%e5%b0%8fT&level=1&isUpgrade=true; passport_login_state=pageurl=https%3a%2f%2fbus.ly.com%2f; line165098=1S160500; udc_feedback=%7B%22url%22%3A%20%22https%3A%2F%2Fgny.ly.com%2F%22%2C%22platform%22%3A%20%22PC%22%2C%22channel%22%3A%20%22%E5%9B%BD%E5%86%85%E6%B8%B8%22%2C%22page%22%3A%20%22%E5%9B%BD%E5%86%85%E8%AF%A6%E6%83%85%E9%A1%B5%22%7D; Hm_lpvt_c6a93e2a75a5b1ef9fb5d4553a2226e5=1545969472; __tctmc=144323752.256295517; __tctmd=144323752.737325; __tctmb=144323752.930169446535415.1545969031475.1545969031475.14; _gat=1'
        /*'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
         */
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