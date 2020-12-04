var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();

router.get('/list', function(req, res, next) {
    res.redirect('/notice/Notice_list/1')
});

router.get('/Notice_list/:page', function(req, res, next) {                                                //uri를 'list/:page'형태로 받음.board/list/(페이지숫자)형식으로 게시판리스트 노출
    var page = req.params.page;                                                                     //uri변수 'page'로 맴핑된 page값을 req객체로 가져옴 > 페이징개발을 위해 미리 선언함
    var sql = "select idx, title," +                                                                //sql문 수행
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from Notice";
    conn.query(sql, function (err, rows) {                                                   //select된 행을 가져와서 rows 변수에 담는다.오류가 있다면 err에 담는다.
        if (err) console.error("err : " + err);
        res.render('Notice_list', {title: 'GiveCoin', rows: rows});                               //수행된 sql에 데이터를 list뷰로 랜더링함.
    });
});

module.exports = router;