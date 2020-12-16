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
    res.render('Mypage_Donor');
})
router.get('/charity',function (req,res,next){
    res.render('Mypage_charity');
})

module.exports = router;