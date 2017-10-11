var mysql = require('mysql');

module.exports = {
    /**
     * 新增影片信息
     */
    add: function(detail) {
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'r18'
        });
        connection.connect();
        connection.query('SET NAMES utf8', function(err) {
            if (err) throw err;
        });
        //写入影片信息
        var movies = {
            title: detail.title,
            cover: detail.cover,
            duration: detail.duration,
            director: detail.director,
            company: detail.company,
            sn: detail.sn,
            series: detail.series
        };
        connection.query('INSERT INTO movies SET ?', movies, function(err, results) {
            if (err) throw err;
            var moviesId = results.insertId;
            //写入预览图信息
            for (i in detail.preview_list) {
                (function(previewUrl) {
                    var previews = {
                        movies_id: moviesId,
                        url: previewUrl
                    };
                    connection.query('INSERT INTO previews SET ?', previews, function(err) {
                        if (err) throw err;
                    });
                })(detail.preview_list[i]);
            }
            connection.end();
        });
    }
};