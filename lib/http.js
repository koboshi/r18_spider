var http = require('http');

module.exports = {
    /**
     * r18.com get请求通用方法
     */
    r18_get: function (path, callback) {
        var options = {
            hostname: 'www.r18.com',
            method: 'GET',
            path: path,
            timeout: 30000,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml',
                'Cache-Control': 'no-cache',
                'Connection': 'close',
                'Cookie': 'ab=a; gid=DQY%2F9rykDerqQwceojB21mErUb0krjDFYC0Mttsj7TkxA%2FAc0BVU%2B9xBWctAXUzgK%2BUBwUnYLMQBvVGF%2F7J0A6dJsKQ%3D; rtt=stgVHXgT7m8cQSTYKcu2leep2utFyUM7YseEUtBEdjKShM53vU31rNtKrCZWkdp98oEddB8FMisfpIC9tITltfoGu3AHZE22piVvQ%2FCBtVWnAOWhVNL4rub4H%2B3G881J%2Fz2nuA%3D%3D; video_total_1014=46229; country=CN; currencies=%7B%22JPY%22%3A%221%22%2C%22USD%22%3A%220.0089%22%2C%22EUR%22%3A%220.0076%22%2C%22GBP%22%3A%220.0068%22%2C%22AUD%22%3A%220.0114%22%2C%22CAD%22%3A%220.0111%22%2C%22SGD%22%3A%220.0121%22%2C%22KRW%22%3A%2210.138%22%2C%22TWD%22%3A%220.2673%22%2C%22CNY%22%3A%220.059%22%2C%22HKD%22%3A%220.0691%22%2C%22NZD%22%3A%220.0125%22%2C%22PHP%22%3A%220.4517%22%2C%22MXN%22%3A%220.1645%22%2C%22CHF%22%3A%220.0087%22%2C%22RUB%22%3A%220.5112%22%7D; mack=1; vpfl=eyJzb3J0IjoicG9wdWxhciJ9; bh=eyJzbmlzMDA5NDBkbDYiOiJtb3ZpZXMiLCJwcHBkMDA1ODdkbDYiOiJtb3ZpZXMifQ%3D%3D; vpl=eyJzb3J0IjoibmV3IiwicHJpY2UiOiJhbGwiLCJwYWdlc2l6ZSI6IjMwIn0%3D; _ga=GA1.2.143338726.1507434973; _gid=GA1.2.1907311331.1507434973; lg=zh; ex=USD',
                'Pragma': 'no-cache',
                'Referer': 'http://www.r18.com/videos/vod/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            }
        };
        var req = http.request(options, function(res) {
            var statusCode= res.statusCode;
            res.setEncoding('utf8');
            var content = ''
            res.on('data', function(data) {
                content += data;
            });
            res.on('end', function() {
                callback(null, statusCode, content, res);
            })
        });
        req.on('error', function(err) {
                callback(err);
        })
        req.end();
    }
};