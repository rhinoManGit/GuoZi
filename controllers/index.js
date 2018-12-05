/**
 * Created by Administrator on 2017/9/18 0018.
 */
const fs      = require('fs');
const request = require('request');
var http = require('http');
class Index{
  constructor(){}

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  index(req, res, next){

    res.render('index')
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
  fetchdetail(req, res, next){
    let id   = req.query.id;
    let date = req.query.date;

    let url = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/PerfDay.aspx';
    let param = {
      pGetMode  : 'days',
      pIdPerf   : id,
      pPerfMonth: date,
      pIdCode   : '',//（代码里面默认是传递的空）
      pIsMania  : '0' //（传0即可）
    };

    request.post({url:url, form: param}, function (error, response, body) {
      console.log('ssssssssss', body)

      if(error){
        return next(error);
      }

      if (response.statusCode == 200) {
        res.json(body.split(','))
      }
    })
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
  fetchplaytime(req, res, next){
    let id   = req.query.id;
    let date = req.query.date;

    let url = 'http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfPlayTime.aspx';
    let param = {
      IdPerf: id,//30851 （演唱会的id）
      PlayDate: date//20181227
    };

    request.post({url:url, form: param}, function (error, response, body) {
      console.log('ssssssssss', body)

      if(error){
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body)
      }
    })
  }

  /**
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
  remainseat(req, res, next){
    let id   = req.query.id;

    let url = 'http://ticket.yes24.com/Pages/Perf/Detail/Ajax/PerfRemainSeat.aspx';
    let param = {
      IdTime: id,//30851 （演唱会的id）
      IdLock: 0//20181227
    };

    request.post({url:url, form: param}, function (error, response, body) {
      console.log('ssssssssss', body)

      if(error){
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body)
      }
    })
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
  fetchplayinfo(req, res, next){
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
    let url = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/PerfTime.aspx';
    let param = {
      pDay: date,//'20181221',
      pIdPerf: id,//'30851',
      pIdCode:'',
      pIsMania: '0',
    };
    // todo 必须要有cookie
    request.post({url:url, form: param, headers: {
        'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09'
      }}, function (error, response, body) {
      console.log('ssssssssss111', error, body)

      if(error){
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body)
      }
    })
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
  fetchseatprice(req, res, next){

    let id   = req.query.id;
    let url = 'http://ticket.yes24.com/Pages/Perf/Sale/Ajax/Perf/TimeSeatRemain.aspx';
    let param = {
      pIdTime: id,//976612,
      pIdCode:'',
      pDisplayRemainSeat: 0,
    };

    // todo 必须要有cookie
    request.post({url:url, form: param, headers: {
        'Cookie': 'ServiceCookies=MTQ0NDQzMjRgZmVpc2U1MTQ3YFpIT1UgWUlOR2AwYDA1YHNoaWJhYGAxNDQ0NDMyNGAzMWBNTS9sU21DOVlKVXZQbnBpNmRJa2hzSkZtY3RpU2xBQk9MaER3dWNtcVpNZUN1aGk3NS9WNjhVRHF4ZG43Y291eW5jRTJLQlFDaEQxL2VyVlRFcEVVZz09YGNoL3R2U3U5d1JYZ0dMQy85aiszSWZKcHJGWll1L2NOSVJ6TnlsTmFNS3RRVkRlTnNBSmRwcTdFZFBkZ2JIRWxjYUl0Qm5NOHI4SGUwZW1rMjhGaUE2N3BuNktqQVg0UXp6Nmtvd0hScjBwTGJNVmhaMG5Qa1lRYm9UcW1tdWw3c2Fabm9XK2UrcmtjdGUyQ1pKeWROc0J2MWVQVVR2TlkrbSt0NUVmV2JZTT1gNDJpSjRwbkRPbE1iVkthZko1NG5SZz09;'
      }}, function (error, response, body) {
      console.log('ssssssssss', body)

      if(error){
        return next(error);
      }

      if (response.statusCode == 200) {
        res.send(body)
      }
    })
  }

  /**
   * 本地详情
   * @param req
   * @param res
   * @param next
   */
  detail(req, res, next){
    res.render('detail')
  }
}

module.exports = Index;