let express = require('express');
let router = express.Router();
let mysql_odbc = require('../db/db_conn')();
let conn = mysql_odbc.init();


router.get('/list', function(req, res, next) {
    res.redirect('/notice/list/1');
});
router.get('/list/:page', function(req, res, next) {                                                //uri를 'list/:page'형태로 받음.board/list/(페이지숫자)형식으로 게시판리스트 노출
    let page = req.params.page;                                                                     //uri변수 'page'로 맴핑된 page값을 req객체로 가져옴 > 페이징개발을 위해 미리 선언함
    let sql = "select idx, title,date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from board";
    conn.query(sql, function (err, rows) {                                                          //select된 행을 가져와서 rows 변수에 담는다.오류가 있다면 err에 담는다.
        if (err) console.error("err : " + err);
        res.render('notice_list', {rows: rows});                                                    //수행된 sql에 데이터를 list뷰로 랜더링함.
    });
});
module.exports = router;