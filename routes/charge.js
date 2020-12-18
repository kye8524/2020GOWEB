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
            let coinAvailable = userInfo.coinAvailable;
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('charge',{link:userType,val1:'마이페이지',val2:'로그아웃',coinAvailable:coinAvailable});
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
            var sql = "update userInfo set coinAvailable=? where userSeq=?";
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
router.get('/donation/:seq',function (req,res,next){
    if(req.cookies.accessToken){
        let seq = req.params.seq;
        console.log(seq);
        var userInfo = req.userInfo;
        if(userInfo){
            let coinAvailable = userInfo.coinAvailable;
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('donation',{link:userType,val1:'마이페이지',val2:'로그아웃',seq:seq,coinAvailable:coinAvailable});
        }
    }else {
        console.log('cookie none');
        res.render('donation',{link:'/auth/register',val1:'회원가입',val2:'로그인',seq:seq,coinAvailable:coinAvailable});
    }
})
router.post('/donation/:seq',function (req,res,next){
    if(req.cookies.accessToken){
        let seq = req.params.seq;
        console.log("projectSeq:"+seq);
        let coin = parseInt(req.body.donate_coin);
        console.log(coin);
        conn.query("select userSeq from Project where projectSeq=?",[seq],function (err,row){
            if (err) console.error("err : " + err);
            var parsedResult = JSON.parse(JSON.stringify(row));
            let prouserseq = parsedResult[0].userSeq;
            console.log("proUserSeq: "+prouserseq);
            conn.query("select totalCoin from UserInfo where userSeq=?",[prouserseq],function (err,result){
                if (err) console.error("err : " + err);
                var parsedResult = JSON.parse(JSON.stringify(result));
                let totalCoin = parsedResult[0].totalCoin;
                let coin_total = totalCoin+coin;
                console.log("totalCoin:"+coin_total);
                conn.query("update userInfo set totalCoin=? where userSeq=?",[coin_total,prouserseq],function (err,rows){
                    if(err) console.log("err:"+err);
                    console.log("totalCoin update success");
                })

            })
        })
        var userInfo = req.userInfo;
        if(userInfo){
            let userSeq = userInfo.userSeq;
            let coinAvailable = parseInt(userInfo.coinAvailable,10);
            let donateCoin = parseInt(userInfo.donateCoin,10);
            let coin_available = coinAvailable-coin;
            let coin_donate=donateCoin+coin;
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            var sql = "update userInfo set coinAvailable=?,donateCoin=?,donateNum=donateNum+1 where userSeq=?";
            var sql2 ="insert into activity(projectSeq, donaterSeq) VALUES (?,?)";
            conn.query(sql,[coin_available,coin_donate,userSeq],function (err,rows){
                if(err) console.log('error'+err);
                console.log("donate update success");
                conn.query(sql2,[seq,userSeq],function (err,row){
                    if(err) console.log('error'+err);
                    console.log("activity insert success");
                    res.redirect('/charge/complete');
                })

            })
        }else {
            console.log('cookie none');
            res.render('charge',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
        }}
})
router.get('/complete',function (req,res,next){
    if(req.cookies.accessToken){
        var userInfo = req.userInfo;
        if(userInfo){
            let coinAvailable = userInfo.coinAvailable;
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('donation_complete',{link:userType,val1:'마이페이지',val2:'로그아웃',coinAvailable:coinAvailable});
        }
    }else {
        console.log('cookie none');
        res.render('Login',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
})
module.exports = router;