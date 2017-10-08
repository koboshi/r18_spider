var util = require('util');
var lib = require('./lib');

module.exports = App;

function App(type, index, total) {
    this.type = type;
    this.index = index;
    this.total = total;
}

util.inherits(App, Object);

/**
 * 爬取入口
 * 成人影片 http://www.r18.com/videos/vod/movies/list/pagesize=30/price=all/sort=new/type=all/page=1/
 * 素人影片 http://www.r18.com/videos/vod/amateur/list/pagesize=30/price=all/sort=new/type=all/page=1/
 */
App.prototype.start = function() {
    if (this.type == 'movies') {
        //开始成人影片抓取
        this.movies();
    }else if (this.type == 'amateur') {
        //开始素人影片抓取
    }else {
        console.log('not support type');
        return;
    }
}

/**
 * 成人影片抓取
 */
App.prototype.movies = function() {
    console.log('grabing');
    lib.http.r18_get('/videos/vod/movies/list/pagesize=30/price=all/sort=new/type=all/page=1/',
    function(err, statusCode, content) {
        if (err) {
            throw err;
        }
        if (statusCode == 200) {
            console.log(content);
        }else {
            console.warn('request_error:/videos/vod/movies/list/pagesize=30/price=all/sort=new/type=all/page=1/', statusCode);
        }

    });
}

/**
 * 素人影片抓取
 */
App.prototype.amateur = function() {

}