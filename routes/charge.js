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

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/charge.html'));
});
router.post('/', getUserInfo);

function getUserInfo(req, res) {
    let accessToken = req.headers['x-access-token'];
    conn.query("select userSeq,userType from UserInfo where accessToken = ?", accessToken, function (err, requestUser) {
        if (err) {
            console.log(err);
            res.status(400).send("token error");
        }else {
            conn.query("select totalCoin from UserInfo where userSeq = ?", userSeq, function (err, userInfos) {
                if (err) {
                    console.log(err);
                    res.status(400).send("query error");
                } else {
                    res.status(200).send(userInfos[0]);
                    fs.readFile('charge.html','utf-8',(error,data)=>{
                        conn.query("select totalCoin from UserInfo where userSeq = ?",(error,results,fields)=>{
                            if(error)throw error;
                            res.send(ejs.render(data,{
                                data:results
                            }))
                        })
                    })
                    var chargecoin=req.body.coin_charge;
                    var totalcoin= req.params.totalcoin;
                    var data = [totalcoin+chargecoin,userSeq]
                    conn.query("update UserInfo set totalCoin=? where userSeq=?",data,function(err,result)
                    {
                        if(err) console.error(err);
                        res.redirect('/charge');
                    })
                }
            })
        }
    })
}
module.exports = router;