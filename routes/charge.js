var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
const mysql = require('mysql');
var path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../customUtil');
var fs = require('fs');

router.get('/', function (req,res,next) {
    if(req.cookies.accessToken){
        var userInfo = req.userInfo;
        if(userInfo){
            let userSeq = userInfo.userSeq;
            let userType=userinfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            var sql = "select * from UserInfo where userSeq=?";
            conn.query(sql,[userSeq],function (err,rows){
                if(err) console.log('error'+err);
                res.render('charge',{link:userType,val1:'마이메이지',val2:'로그아웃',rows:rows[0]});
            })
    }else {
        console.log('cookie none');
        res.render('charge',{link:'/auth/register',val1:'회원가입',val2:'로그인',rows:rows[0]});
    }}
});
router.get('/donation',function (req,res,next){
    if(req.cookies.accessToken){
        var userinfo = req.userInfo;
        if(userinfo){
            let userType=userinfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('donation',{link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('donation',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
})
module.exports = router;