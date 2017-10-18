var util = require('util');
var cheerio = require('cheerio');
var async = require('async');
var nconf = require('nconf');
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
App.prototype.start = function(pageSize) {
    if (this.type == 'movies') {
        //开始成人影片抓取
        this._main(this.type, pageSize);
    }else if (this.type == 'amateur') {
        //开始素人影片抓取
        this._main(this.type, pageSize);
    }else {
        console.error('not support type');
        return;
    }
}

/**
 * 爬取影片列表页资料
 */
App.prototype._list = function(listPath) {
    var obj = this;
    return function(callback) {
        lib.http.r18_get(listPath, function(err, statusCode, content) {
            console.log('start:', listPath);//开始列表页请求
            if (err) {
                console.error('error:', listPath, err.message);//请求异常
                callback(null);//调用回调
                return;
            }
            if (statusCode != 200) {
                console.error('request:', listPath, statusCode);//请求失败
                callback(null);//调用回调
                return;
            }
            //解析html内容
            var infoList = lib.r18.list(content);
            var detailTask = [];
            //爬取详情信息
            for (i in infoList) {
                var func = obj._detail(infoList[i].path);
                detailTask.push(func);
            }
            //按次序执行详情爬取
            async.series(detailTask, function(err, result) {
                console.log('done:', listPath);
                //抓取完毕，停止5s
                setTimeout(function() {
                    callback(null);//调用回调
                }, nconf.get('interval'));
            });
        });
    };
}

/**
 * 爬取影片详细资料入库
 */
App.prototype._detail = function(detailPath) {
    var obj = this;
    return function(callback) {
        lib.http.r18_get(detailPath, function(err, statusCode, content) {
            if (err) {
                console.error('error:', detailPath, err.message);//请求异常
                callback(null);//调用回调
                return;
            }
            if (statusCode != 200) {
                console.error('request:', detailPath, statusCode);//请求失败
                callback(null);//调用回调
                return;
            }
            //解析html内容
            var detailInfo = lib.r18.detail(content, obj.type);
            console.log(detailInfo.title);
            //抓取完毕，停止5s
            setTimeout(function() {
                callback(null);//调用回调
            }, nconf.get('interval'));
            //写入数据库
            lib.model.add(detailInfo);
        });
    };
};

App.prototype._main = function(type, pageSize) {
    var obj = this;
    console.log('start grab', type, this.index, this.total);
    //获取最大页码
    var path = '/videos/vod/' + type + '/list/pagesize=30/price=all/sort=new/type=all/page=1/';
    lib.http.r18_get(path, function(err, statusCode, content) {
        if (err) {
            console.error('error:', path, err.message);//请求异常
            return;
        }
        if (statusCode != 200) {
            console.error('request:', path, statusCode);//请求失败
            return;
        }
        var listTask = [];
        //获取当前最大页码
        var maxPage = lib.r18.maxPage(content);
        console.log(obj.type, 'max_page', maxPage);
        //按页码循环爬取列表页
        for (var i = 1; i <= maxPage; i++) {
            var listPath = '/videos/vod/' + type + '/list/pagesize=' + pageSize + '/price=all/sort=new/type=all/page=' + i + '/';
            var func = obj._list(listPath);
            listTask.push(func);
        }
        //按次序执行列表爬取
        async.series(listTask, function(err) {
            console.log('done grab', type, this.index, this.total);
        });
    });
}