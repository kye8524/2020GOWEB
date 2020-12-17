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
            var sql = "select * from UserInfo where userSeq=?";
            conn.query(sql,[userSeq],function (err,rows){
                if(err) console.log('error'+err);
                res.render('charge',{val1:'마이메이지',val2:'로그아웃',rows:rows[0]});
            })
        }
    }else {
        console.log('cookie none');
        res.render('charge',{val1:'회원가입',val2:'로그인'});
    }
});
router.post('/',function (req,res,next{
    
}))
router.get('/donation',function (req,res,next){
    if(req.cookies.accessToken){
        res.render('donation',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('donation',{val1:'회원가입',val2:'로그인'});
    }
})
module.exports = router;