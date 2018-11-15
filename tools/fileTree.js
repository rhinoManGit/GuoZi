/**
 * Created by Administrator on 2017/9/18 0018.
 */
var fs   = require('fs');

/*
*  首次读取control文件树结构，首次阻塞
* */
function ergodicDir(){

    var aPath = __dirname.split('\\');

    aPath.pop();
    aPath.push('controllers');

    var sPath = aPath.join('\\');

    var files = fs.readdirSync(sPath);

    /*
    * files: ['index.js']
    * */
    files = files.map(function(e){
        return e.replace(/\.(js)?(css)?/, '');
    });

    return files;
}

module.exports = ergodicDir();