var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
var multer = require('multer');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Budget_regist.html'));
});

router.post('/add',function (req,res,next){
    var sql2 = "select title from Project where projectSeq=?"
    conn.query(sql2,[project])
    var title = req.body.title;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var client = req.body.client;
    var price = req.body.price;
    var content = req.body.content;
    var data=[title,startdate,enddate,client,price,content];
    var sql = "insert into Budget(title,startdate,enddate,client,price,content) values(?,?,?,?,?,?)";
    conn.query(sql,data, function (err, rows) {
        if (err) console.error("err : " + err);
        res.sendFile(path.join(__dirname+'/../html/Budget_regist.html'),{title:title});
    });
})
module.exports=router;