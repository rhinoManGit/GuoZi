/**
 * Created by Administrator on 2017/9/27 0027.
 */
var uuid = require('node-uuid');

module.exports = function(req, res, next) {
    req.log_uuid = uuid.v4();

    next()
}