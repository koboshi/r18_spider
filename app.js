var util = require('util');
var cheerio = require('cheerio');
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
 * 成人影片 http://www.r18.com/videos/vod/movies/list/pagesize=120/price=all/sort=new/type=all/page=1/
 * 素人影片 http://www.r18.com/videos/vod/amateur/list/pagesize=120/price=all/sort=new/type=all/page=1/
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
    console.log('start grab', this.type, this.index, this.total);
    var page = 1;
    while (1) {
        var path = '/videos/vod/movies/list/pagesize=30/price=all/sort=new/type=all/page=' + page + '/';
        lib.http.r18_get(path, function(err, statusCode, content) {
            if (err) {
                console.log('error:', path, err.message);//请求异常
                return;
            }
            if (statusCode != 200) {
                console.log('request:', path, statusCode);//请求失败
                return;
            }
            //解析html内容
            var infoList = lib.r18.list(content);
            //爬取详情信息
            for (i in infoList) {
                var info = infoList[i];
                var title = info.title;
                var cover = info.cover;
                var detailPath = info.path;
                lib.http.r18_get(detailPath, function(err, statusCode, content) {
                    if (err) {
                        console.log('error:', path, err.message);//请求异常
                        return;
                    }
                    if (statusCode != 200) {
                        console.log('request:', path, statusCode);//请求失败
                        return;
                    }
                    //解析html内容
                    var detailInfo = lib.r18.detail(content);
                    console.log(detailInfo);
                    //TODO 写入数据库
                });
                break;
            }
        });
        break;
    }
}

/**
 * 素人影片抓取
 */
App.prototype.amateur = function() {

}