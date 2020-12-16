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
    var title = req.body.title;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var client = req.body.client;
    var price = req.body.price;
    var content = req.body.content;
    var sql2 = "insert into Budget(title,startdate,enddate,client,price,contents,projectSeq) values(?,?,?,?,?,?,?)";
    var sql1 = "select projectSeq from Project where title=?"
    conn.query(sql1,[title],function (err,result){
        if (err) console.error("err : " + err);
        var parsedResult = JSON.parse(JSON.stringify(result));
        var proseq = parsedResult[0].projectSeq;
        var data=[title,startdate,enddate,client,price,content,proseq];
        conn.query(sql2,data, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log(rows);
            res.redirect('/charity/read/'+rows.insertId);
        });
    })
})
module.exports=router;