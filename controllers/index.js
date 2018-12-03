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