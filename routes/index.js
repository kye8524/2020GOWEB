var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
var session = require('express-session');


router.get('/', function(req, res, next) {
    if(req.cookies.accessToken){
        res.render('index',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('index',{val1:'회원가입',val2:'로그인'});
    }

});
router.get('/introduce',function (req,res,next){
    res.sendFile(path.join(__dirname+'/../html/introduce.html'));
});
module.exports=router;