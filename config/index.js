/**
 * Created by Administrator on 2017/9/18 0018.
 */

exports.getConfig = function(key){

    const env = process.env['node_env'] || 'dev';

    const config = require('./config_' + env);

    return config[key];
}

exports.config = function(){

    const env = process.env['node_env'] || 'dev';

    const _config = require('./config_' + env);

    return _config;
}