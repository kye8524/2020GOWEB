var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
const mysql = require('mysql');
var path = require('path');
const jwt = require('jsonwebtoken');


router.get('/register', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Sign_up.html'));
});

router.get('/login', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Login.html'));
});
router.post('/login', obtainToken);


function obtainToken(req, res) {
    const email = req.body.email;
    const passwd = req.body.passwd;

    const sql = "SELECT * FROM UserInfo WHERE email = ? AND passwd=?";
    if (email && passwd) {
        conn.query(sql, [email,passwd], function(error, results, fields) {
            if (error) throw error;
            if (results.length !== 0) {
                res.redirect('/index');
                res.end();
            } else {
                console.log('Incorrect');
                res.send("Incorrect Username and/or Password!");
            }
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
}

router.post('/register',function (req,res,next){
    var email = req.body.email;
    var passwd = req.body.passwd;
    var name = req.body.name;
    var nickname = req.body.nickName;
    var gender = req.body.gender;
    var phonenum = req.body.phoneNum;
    var userType = req.header.UserType;
    var accesstoken = jwt.sign(req.body.email, Date.now().toString(16), {
        algorithm: 'HS256'
    });
    var data = [email,passwd,name,nickname,gender,phonenum,userType,accesstoken];
    var sql1 = "SELECT * FROM UserInfo WHERE email = ?";
    var sql2 = "INSERT INTO UserInfo (email,passwd,name,nickName,gender,phoneNum,userType,accessToken,signTime) VALUES(?,?,?,?,?,?,?,?,now())";

    if (true) {
        conn.query(sql1,email, function(error, results, fields) {
            if (error) throw error;
            if (results!=0) {
                res.send(email + ' Already exists!<br><a href="/home">Home</a>');
            } else {
                conn.query(sql2, data,
                    function (error, data) {
                        if (error)
                            console.log(error);
                        else
                            console.log(data);
                    });
                console.log('regist success');
                res.redirect('/auth/login');
            }
        });
    } else {
        res.send('Please enter User Information!');
        res.end();
    }
});


module.exports = router;