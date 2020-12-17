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
        var userInfo = req.userInfo;
        if(userInfo){
            let userType=userInfo.userType;
            let name=userInfo.name;
            let donateNum=userInfo.donateNum;
            let donateCoin=userInfo.donateCoin;
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
        var userInfo = req.userInfo;
        var userSeq=userInfo.userSeq;
        sql1="select * from project where userSeq=?";
        conn.query(sql1,userSeq,function (err,rows){
            if(userInfo){
                let userType=userInfo.userType;
                let name=userInfo.name;
                let projectNum=userInfo.projectNum;
                let totalCoin=userInfo.totalCoin;
                userType='/mypage/'+userType;
                res.render('Mypage_charity',{rows:rows,length:rows.length, name:name,projectNum:projectNum,totalCoin:totalCoin, link:userType,val1:'마이메이지',val2:'로그아웃'});
            }
        })
    }else {
        console.log('cookie none');
        res.render('Mypage_charity',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
})

module.exports = router;