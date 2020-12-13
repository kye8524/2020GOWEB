var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
const mysql = require('mysql');
var path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../customUtil');

function cryPw(password) {
    return new Promise(function (resolve, reject) {
        let salt = "";
        let newPw;
        crypto.randomBytes(64, function (err, buf) {
            if (err) {
                console.error(err);
                res.status(500).send('500 SERVER ERROR');
            } else {
                salt = buf.toString('base64');
                crypto.pbkdf2(password, salt, 98523, 64, 'sha512', function (error, key) {
                    if (error) {
                        console.log(error);
                        res.status(400).send("crypto error");
                    } else {
                        newPw = key.toString('base64');
                    }
                })
            }
        })
        setTimeout(() => {
            resolve([salt, newPw]);
        }, 500);
    })
}

function pwBySalt(password, salt) {
    return new Promise(function (resolve, reject) {
        crypto.pbkdf2(password, salt, 98523, 64, 'sha512', function (err, key) {
            resolve(key.toString('base64'));
        })
    })
}
router.get('/register', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Sign_up.html'));
});
router.post('/login', obtainToken);
router.post('/register', registerUser);

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

function registerUser(req, res) {
    let array = {
        name: req.body.name,
        email: req.body.email,
        passwd: req.body.passwd,
        nickName : req.body.nickName,
        gender: req.body.gender,
        userType: req.body.userType,
        phoneNum: req.body.phoneNum,
        signTime: Date.now()

    }
    if (!cUtil.isDelivered(array)) {
        res.status(400).send("ALL CONTENTS ARE NOT DELIVERED");
    } else {
        console.log("All contents are delivered");
    }
    const sql1 = "SELECT userSeq FROM UserInfo WHERE email = ?;";
    conn.query(sql1, array.email, function (err, rows, field) {
        if (err) {
            console.log("check info before insert");
            console.log(err);
            res.status(500).send('500 SERVER ERROR, db1');
        } else if (rows.length !== 0) {
            console.log("ALREADY EXIST ACCOUNT");
            res.status(400).send('ALREADY EXIST ACCOUNT');
        } else {
            cryPw(array.password)
                .then(function (resolve) {
                    const salt = resolve[0];
                    const hsPw = resolve[1];
                    const sql2 = "INSERT INTO UserInfo (email,passwd,name,nickName,gender,phoneNum,signTime,accessToken,salt) VALUES(?,?,?,?,?,?,now(),?,?)";
                    let timestamp = new Date().getTime();
                    let token = jwt.sign(req.body.email, timestamp.toString(16), {
                        algorithm: 'HS256'
                    });
                    let accessTokenSubStr = token.substr(0, 64);
                    let param2 = {
                        name: array.name,
                        email: array.email,
                        passwd: hsPw,
                        nickName: array.nickName,
                        gender: array.gender,
                        userType: array.userType,
                        phoneNum: array.phoneNum,
                        accessToken: accessTokenSubStr,
                        salt: salt,
                        signTime: array.signTime
                    };
                    const sqls2 = mysql.format(sql2, param2);
                    conn.query(sqls2, function (err, rows, fields) {
                        if (err) {
                            console.log("insert query error")
                            console.log(err);
                            res.status(500).send('500 SERVER ERROR, db3');
                        } else {
                            console.log('REGISTER SUCCESS');
                        }
                    })
                    conn.query("select * from UserInfo where email = ?", array.email, function (error, result, next) {
                        if (error) {
                            console.log(error);
                            console.log("reqLectureSeq error");
                        } else {
                            res.status(200).send(result[0]);
                        }
                    })
                })
        }
    })
}

module.exports = router;