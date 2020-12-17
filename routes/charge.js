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
<<<<<<< HEAD
=======
            let coinAvailable = userInfo.coinAvailable;
>>>>>>> ac9e770325e3ec132e72e65d94436083555b7bfd
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('charge',{link:userType,val1:'마이메이지',val2:'로그아웃',coinAvailable:coinAvailable});
    }else {
        console.log('cookie none');
        res.render('charge',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }}
});
router.post('/',function (req,res,next){
    if(req.cookies.accessToken){
        var userInfo = req.userInfo;
        let coin = parseInt(req.body.coin_charge);
        if(userInfo){
            let userSeq = userInfo.userSeq;
            let coinAvailable = parseInt(userInfo.coinAvailable,10);
            let tocoin = coinAvailable+coin;
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            var sql = "update UserInfo set coinAvailable=? where userSeq=?";
            conn.query(sql,[tocoin,userSeq],function (err,rows){
                if(err) console.log('error'+err);
                console.log("update success");
                res.redirect('/index');
            })
        }else {
            console.log('cookie none');
            res.render('charge',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
        }}
})
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