var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
var session = require('express-session');


router.get('/', function(req, res, next) {
    var sql="select * from notice";
    var sql2="select * from project";
    conn.query(sql2,function(err,result){
        conn.query(sql,function (err,rows){
            if(err) console.log(err);
            if(req.cookies.accessToken){
                var userInfo = req.userInfo;
                if(userInfo){
                    let userType=userInfo.userType;
                    userType='/mypage/'+userType;
                    res.render('index',{projects:result,length:result.length, rows:rows,rows_length:rows.length,link:userType,val1:'마이메이지',val2:'로그아웃'});
                }
            }else {
                console.log('cookie none');
                res.render('index',{projects:result,length:result.length,rows:rows,rows_length:rows.length,link:'/auth/register',val1:'회원가입',val2:'로그인'});
            }
        })
    })

});
router.get('/introduce',function (req,res,next){
    if(req.cookies.accessToken){
        var userInfo = req.userInfo;
        if(userInfo){
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('introduce',{link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('introduce',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
});
module.exports=router;