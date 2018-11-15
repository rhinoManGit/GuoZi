/**
 * Created by Administrator on 2017/9/18 0018.
 */
var url         = require('url');
var errorHandle = require('./../../tools/handleError');
var handle500   = errorHandle.handle500;
var handle404   = errorHandle.handle404;
var fileTree    = require('./../../tools/fileTree');
var staticFix   = ['.js', '.css', '.jpg', '.gif', '.png', '.jpeg'];

function mvc(req, res, next) {

  var pathname   = url.parse(req.url).pathname;
  var paths      = pathname.split('/');
  var controller = paths[1] || 'index';
  var action     = paths[2] || 'index';
  var args       = paths.slice(3);
  var module;

  /*
   * 静态资源不走control
   * 默认静态文件是直接不走，control，但是找不到的时候会走路由查找
   * */

  var a = paths.pop().match(/\.(.*)?/g);

  if (staticFix.indexOf(a && a.length > 0 ? a[0] : '') !== -1) {

    next();
    return;
    /*var err    = new Error(pathname + ' No Find!');

     err.status = 404;

     handle404(req, res, next, err);
     return;*/
  }

  /*
   * controller test before you visit
   * */
  if (fileTree.indexOf(controller) === -1) {

    var e = new Error('No find ' + controller);

    e.status = 404;

    handle404(req, res, next, e);
    return;
  }

  try {
    // require的缓存机制使首次会有阻塞的
    module = require('./../../controllers/' + controller);
  }
  catch (ex) {
    handle500(req, res, next, ex);
    return;
  }

  try {
    var method = module[action];

    method.apply(null, [req, res, next].concat(args));
  }
  catch (ex) {
    handle500(req, res, next, ex);
  }
}

module.exports = mvc;