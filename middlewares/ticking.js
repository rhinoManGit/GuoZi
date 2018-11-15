/**
 * Created by Administrator on 2017/9/26 0026.
 * 所有与请求无关的定时任务
 *
 */
// var autoSendEmailForAgent= require('./../tools/autoSendEmailForAgent');
var sendSummaryByEmail= require('./../tools/sendSummaryByEmail');

function Ticking(){

  console.log('......定时器正常启动！')
    // 定时发送邮件
  sendSummaryByEmail();
}

module.exports = Ticking;
