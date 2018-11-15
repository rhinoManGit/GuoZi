/*
*
*
* */
const Redis = require("ioredis");
const config = require('./../../config').config();


function Index() {
    this.redis = new Redis(config['redis_port'], config['redis_ip'])
}

/*
* @param expire second
* redis : command [SET]
*
* */
Index.prototype.set= async function(key, value, expire){

    this.redis.set(key, value, 'EX', expire);
}

/*
*
* redis : command [GET]
*
* */
Index.prototype.get= async function (key) {

    let that =this;

    return new Promise(function(resolve, reject){

        that.redis.get(key, function (err, result) {
            resolve(result)
        });
    });
}

module.exports = new Index();
