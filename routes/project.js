var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');

router.get('/',function (req,res,next){
    res.redirect('/charity/list/1');
});

router.get('/list/:page', function(req, res, next) {                                                //uri를 'list/:page'형태로 받음.board/list/(페이지숫자)형식으로 게시판리스트 노출
    var page = req.params.page;
    res.sendFile(path.join(__dirname+'/../html/Charity.html'));
});


module.exports=router;

