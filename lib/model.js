var mysql = require('mysql');
var nconf = require('nconf');

module.exports = {
    /**
     * 新增影片信息
     */
    add: function(detail) {
        var connection = mysql.createConnection({
            host: nconf.get('database:host'),
            user: nconf.get('database:username'),
            password: nconf.get('database:password'),
            database: nconf.get('database:dbname')
        });
        connection.connect();
        var charset = nconf.get('database:charset');
        connection.query('SET NAMES ' + charset, function(err) {
            if (err) throw err;
        });
        //写入影片信息
        var movies = {
            title: detail.title,
            type: detail.type,
            cover: detail.cover,
            duration: detail.duration,
            director: detail.director,
            company: detail.company,
            sn: detail.sn,
            series: detail.series
        };
        connection.query('INSERT IGNORE INTO movies SET ?', movies, function(err, results) {
            if (err) throw err;
            var moviesId = results.insertId;
            if (moviesId < 1) {
                connection.end();
                return;//影片主记录没插入
            }
            //写入预览图信息
            for (i in detail.preview_list) {
                (function(previewUrl) {
                    var previews = {
                        movies_id: moviesId,
                        url: previewUrl
                    };
                    connection.query('INSERT IGNORE INTO previews SET ?', previews, function(err) {
                        if (err) throw err;
                    });
                })(detail.preview_list[i]);
            }
            connection.end();
        });
    }
};