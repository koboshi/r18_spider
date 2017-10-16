var cheerio = require('cheerio');
var url = require('url');
var r18_http = require('./http');

module.exports = {
    /**
     * 最大页码
     */
    maxPage: function(html) {
        var $ = cheerio.load(html);
        var pageNum = $('ul.cmn-box-tabMain01 li.col04Wrap01 ol li').eq(-2).children('a').text();
        return pageNum;
    },
    /**
     * 列表页抓取
     */
    list: function(html) {
        var $ = cheerio.load(html);
        var listWrapper = $('ul.cmn-list-product01 li');
        var result = [];
        listWrapper.each(function(i, elem) {
            var title = $(this).children('a').children('dl').children('dt').text();//影片标题
            var cover = $(this).children('a').children('p').children('img').attr('data-original');//封面图
            var detailUrl = $(this).children('a').attr('href');//详情页
            var tmp = url.parse(detailUrl);
            var detailPath = tmp.path;
            result.push({title: title, cover: cover, path: detailPath});
        });
        return result;
    },
    /**
     * 详情页抓取
     */
    detail: function(html, type) {
        var $ = cheerio.load(html);
        var title = $('h1 cite').text();//影片标题
        var cover = $('div.product-image div.js-detail-single-picture img').attr('src');//封面图
        var pubDate = '';
        var duration = '';
        var director = '';
        var company = '';
        var sn = '';
        var series = '';
        if (type == 'movies') {
            //影片
            pubDate = $('div.product-details dd').first().text()//发行日期
            duration = $('div.product-details dd[itemprop="duration"]').text();//时长
            director = $('div.product-details dd[itemprop="director"]').text();//导演
            company = $('div.product-details dd[itemprop="productionCompany"] a').text();//发行商
            secDetailWrapper = $('div.product-details dl').last();
            sn = $(secDetailWrapper).children('dd').eq(2).text();//番号
            series = $(secDetailWrapper).children('dd').eq(3).text();//系列
        }else if(type == 'amateur') {
            //素人
            pubDate = $('div.product-details dd').first().text()//发行日期
            duration = $('div.product-details dd[itemprop="duration"]').text();//时长
            director = '';//导演
            company = $('div.product-details dd').eq(2).children('a').text();//发行商
            secDetailWrapper = $('div.product-details dl').last();
            sn = $(secDetailWrapper).children('dd').eq(2).text();//番号
            series = '';
        }


        //抓取预览图
        var previewList = [];
        var previewWrapper = $('ul.product-gallery img.lazy');
        previewWrapper.each(function(i, elem) {
            var previewUrl = $(this).attr('data-original');
            previewList.push(previewUrl);
        });

        return {
            title: title,
            cover: cover,
            type: type,
            publish_date: pubDate.trim(),
            duration: duration.replace(/\s+/g, ''),
            director: director.trim(),
            company: company.trim(),
            sn: sn.trim(),
            series: series.trim(),
            preview_list: previewList
        };
    }
};