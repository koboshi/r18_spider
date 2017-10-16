/**
 * 爬取小工具
 * 针对一下网站
 * http://www.r18.com
 * http://www.javzoo.com/
 * http://www.javzooso.com/
 * @author SamDing
 */
var path = require('path');
var nconf = require('nconf');
var App = new require('./app');

//初始化配置
var configFile = path.resolve(__dirname, 'config', 'config.json');
nconf.file({file: configFile});

var type = '';
if (process.argv[2]) {
    type = process.argv[2].toLowerCase();
}

var index = 0;
if (process.argv[3]) {
    index = parseInt(process.argv[3]);
}
var total = 1;
if (process.argv[4]) {
    total = parseInt(process.argv[4]);
}

var app = new App(type, index, total);
app.start(nconf.get('list_size'));