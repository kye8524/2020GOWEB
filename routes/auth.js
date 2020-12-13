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
    const reqPw = req.body.passwd;

    const sql = "SELECT * FROM UserInfo WHERE email = ?";
    const sql4 = "update UserInfo set accessToken = ? where email = ?";
    const sql1 = mysql.format(sql, email);
    conn.query(sql1, function (err, rows) {
        if (err) {
            console.log("SELECT ERROR : " + err);
            res.status(500).send('500 SERVER ERROR');
        } else if (rows.length === 0) {
            console.log("NO ACCOUNT");
            res.status(204).send('NO ACCOUNT');
        } else {
            const dbPw = rows[0].passwd;
            const salt = rows[0].salt;
            pwBySalt(reqPw, salt).then(function (resolve) {
                const crypReqPw = resolve;
                if (dbPw !== crypReqPw) {
                    console.log("uncorrect pw : " + resolve);
                    res.status(204).send('UNCORRECT PW');
                } else {
                    let timestamp = new Date().getTime();
                    console.log("timeStamp : " + timestamp);
                    let token = jwt.sign(email, timestamp.toString(16), {
                        algorithm: 'HS256'
                    });
                    let accessTokenSubStr = token.substr(0, 64);
                    conn.query(sql4, [accessTokenSubStr, email], function (error, results, nexts) {
                        if (error) {
                            console.log(error);
                            res.status(400).send("insert token error");
                        } else {
                            console.log("insert token");
                            conn.query(sql, email, function (errors, result, field) {
                                if (errors) {
                                    console.log("select error");
                                    res.status(400).send("token error");
                                } else {
                                    console.log("login success");
                                    res.status(200).send(result[0]);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
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
    var sql1 = "SELECT * FROM UserInfo WHERE passwd = ? AND email = ?";
    var sql2 = "INSERT INTO UserInfo (email,passwd,name,nickName,gender,phoneNum,userType,accessToken,signTime) VALUES(?,?,?,?,?,?,?,?,now())";

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