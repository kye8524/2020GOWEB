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

router.get('/donor',function (req,res,next){
    if(req.cookies.accessToken){
        var userinfo = req.userInfo;
        if(userinfo){
            let userType=userinfo.userType;
            let name=userinfo.name;
            let donateNum=userinfo.donateNum;
            let donateCoin=userinfo.donateCoin;
            userType='/mypage/'+userType;
            res.render('Mypage_Donor',{name:name,donateCoin:donateCoin,donateNum:donateNum,link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('Mypage_Donor',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
})
router.get('/charity',function (req,res,next){
    if(req.cookies.accessToken){
        var userinfo = req.userInfo;
        if(userinfo){
            let userType=userinfo.userType;
            let name=userinfo.name;
            let projectNum=userinfo.projectNum;
            let totalCoin=userinfo.totalCoin;
            userType='/mypage/'+userType;
            res.render('Mypage_charity',{name:name,projectNum:projectNum,totalCoin:totalCoin, link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('Mypage_charity',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
})

module.exports = router;