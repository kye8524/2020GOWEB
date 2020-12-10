var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var fs = require('fs');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');


router.get('/register', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Sign_up.html'));
});

router.post('/register', function(req, res,next) {
    var email = req.body.email;
    var passwd = req.body.passwd;
    var name = req.body.name;
    var nickname = req.body.nickname;
    var gender = req.body.gender;
    var phonenum = req.body.phonenum;
    var data = [email,passwd,name,nickname,gender,phonenum];
    var sql1 = "SELECT * FROM Donor WHERE passwd = ? AND email = ?";
    var sql2 = "INSERT INTO Donor (email,passwd,name,nickName,gender,phoneNum,signTime,acessToken) VALUES(?,?,?,?,?,?,now(),1)";
    if (true) {
        conn.query(sql1,data, function(error, results, fields) {
            if (error) throw error;
            if (results.length <= 0) {
                conn.query(sql2, data,
                    function (error, data) {
                        if (error)
                            console.log(error);
                        else
                            console.log(data);
                    });
                res.send(name + ' Registered Successfully!<br><a href="/home">Home</a>');
            } else {
                res.send(name + ' Already exists!<br><a href="/home">Home</a>');
            }
            res.end();
        });
    } else {
        res.send('Please enter User Information!');
        res.end();
    }
});

module.exports = router;