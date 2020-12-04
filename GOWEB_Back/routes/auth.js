var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();

router.get('/login', function(req, res, next) {
    conn.query(function (err) {                                                   //select된 행을 가져와서 rows 변수에 담는다.오류가 있다면 err에 담는다.
        if (err) console.error("err : " + err);
        res.render('Login');                               //수행된 sql에 데이터를 list뷰로 랜더링함.
    });
});


module.exports = router;