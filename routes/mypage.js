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
        res.render('Mypage_Donor',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('Mypage_Donor',{val1:'회원가입',val2:'로그인'});
    }
})
router.get('/charity',function (req,res,next){
    if(req.cookies.accessToken){
        res.render('Mypage_charity',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('Mypage_charity',{val1:'회원가입',val2:'로그인'});
    }
})

module.exports = router;