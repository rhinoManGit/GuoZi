/**
 * Created by Administrator on 2017/9/18 0018.
 */
exports.handle500 =  function(req, res, next, e){

    if(!e){
        var e = new Error('The page has been lost!');

        e.status = 500;
    }
    e['log_uuid'] = req.log_uuid;

    next(e);
};

exports.handle404 = function(req, res, next, e){

    if(!e){
        var e = new Error('The page has been lost!');

        e.status = 404;
    }

    e['log_uuid'] = req.log_uuid;

    next(e);
};