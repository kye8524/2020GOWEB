var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
const mysql = require('mysql');
var path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../customUtil');

router.get('/', function(req, res, next) {
    var userSeq=req.params.userSeq;
    var sql="select totalCoin from userInfo where userSeq=?;";
    conn.query(sql,userSeq,function (err,results){
        if(err)console.error('err : ' + err);
        res.render('/',{result:results});
        res.sendFile(path.join(__dirname+'/../html/charge.html'));
    })
});

router.post('/',function (req,res,next){
    var userSeq=req.params.userSeq;
    var charge = req.body.coin_charge;
    const sql1 = "SELECT userSeq FROM UserInfo WHERE userSeq=?;";
    conn.query(sql1,userSeq,function (err,rows,field){
        if(err){
            console.log(err);
        }
        else{
            const sql2="UPDATE userInfo set totalCoin=totalCoin+charge where userSeq=?;";
            conn.query(sql2,userSeq,function (err){
                if(err)console.log(err);
                else res.redirect('/');
            })
        }
    })
})
module.exports = router;