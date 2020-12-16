var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
var session = require('express-session');
var pur;


$.ajax({
    url : "/auth/index",
    type : 'GET',
    data : "UserType",
    async : false,
    success : function (res) {
        pur = res;
    }
});

router.get('/', function(req, res, next) {
    if(req.cookies){
        console.log('cookie exist'+req.cookies);
        res.render('index',{val1:'마이메이지',val2:'로그아웃'});
        if(pur === "donor"){
            $('#mypage').href = '/mypage/donor';
        }else{
            $('#mypage').href = '/mypage/charity';
        }
        $('#logout').href = '/auth/logout';
    }else {
        console.log('cookie none');
        res.render('index',{val1:'회원가입',val2:'로그인'});
    }

});
router.get('/introduce',function (req,res,next){
    res.sendFile(path.join(__dirname+'/../html/introduce.html'));
});
module.exports=router;