var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../customUtil');
require('dotenv').config();
const session = require('express-session');


router.get('/register', function(req, res, next) {
    if(req.cookies.accessToken){
        res.render('Sign_up',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('Sign_up',{val1:'회원가입',val2:'로그인'});
    }
});

router.get('/out', function(req, res, next) {
    if(req.cookies.accessToken){
        res.render('Sign_out',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('Sign_out',{val1:'회원가입',val2:'로그인'});
    }
});

router.get('/login', function(req, res, next) {
    if(req.cookies.accessToken){
        res.render('Login',{val1:'마이메이지',val2:'로그아웃'});
    }else {
        console.log('cookie none');
        res.render('Login',{val1:'회원가입',val2:'로그인'});
    }
});
router.post('/login', obtainToken2);

router.get('/logout',function (req,res,next){
    res.clearCookie('accessToken');
    res.redirect('/auth/login');
})

router.post('/donor_register2',function (req,res,next) {
    let array = {
        email: req.body.email,
        passwd: req.body.passwd,
        name: req.body.name,
        nickName: req.body.nickName,
        gender: req.body.gender,
        phoneNum: req.body.phoneNum,
        userType: 'donor'
    }
    if (!cUtil.isDelivered(array)) {
        res.status(400).send("ALL CONTENTS ARE NOT DELIVERED");
    } else {
        console.log("All contents are delivered");
    }
    var sql1 = "SELECT userSeq FROM UserInfo WHERE email = ?";
    conn.query(sql1, array.email, function (err, rows, field) {
        if (err) {
            console.log("check info before insert");
            console.log(err);
            res.status(500).send('500 SERVER ERROR, db1');
        } else if (rows.length !== 0) {
            console.log("ALREADY EXIST ACCOUNT");
            res.send('<script type="text/javascript">alert("이미 존재하는 계정입니다.");history.back();</script>');
        } else {
            crypPw(array.passwd)
                .then(function (resolve) {
                    const salt = resolve[0];
                    const hsPw = resolve[1];
                    let timestamp = new Date().getTime();
                    let token = jwt.sign(req.body.email, timestamp.toString(16), {
                        algorithm: 'HS256'
                    });
                    let accessTokenSubStr = token.substr(0, 64);
                    let param2 = {
                        name: array.name,
                        nickName: array.nickName,
                        email: array.email,
                        passwd: hsPw,
                        gender: array.gender,
                        userType: array.userType,
                        phoneNum: array.phoneNum,
                        accessToken: accessTokenSubStr,
                        salt: salt,
                        signTime : Date.now()
                    };
                    const sql2 = "INSERT INTO UserInfo SET ?;";
                    conn.query(sql2,param2, function (err, rows, fields) {
                        if (err) {
                            console.log("insert query error")
                            console.log(err);
                            res.status(500).send('500 SERVER ERROR, db3');
                        } else {
                            console.log('REGISTER SUCCESS');
                            res.redirect('/auth/login');
                        }
                    })
                })
        }
    })
})
router.post('/charity_register2',function (req,res,next) {
    let array = {
        email: req.body.email,
        passwd: req.body.passwd,
        name: req.body.name,
        nickName: req.body.nickName,
        gender: req.body.gender,
        phoneNum: req.body.phoneNum,
        userType: 'charity'
    }
    if (!cUtil.isDelivered(array)) {
        res.status(400).send("ALL CONTENTS ARE NOT DELIVERED");
    } else {
        console.log("All contents are delivered");
    }
    var sql1 = "SELECT userSeq FROM UserInfo WHERE email = ?";
    conn.query(sql1, array.email, function (err, rows, field) {
        if (err) {
            console.log("check info before insert");
            console.log(err);
            res.status(500).send('500 SERVER ERROR, db1');
        } else if (rows.length !== 0) {
            console.log("ALREADY EXIST ACCOUNT");
            res.send('<script type="text/javascript">alert("이미 존재하는 계정입니다.");history.back();</script>');
        } else {
            crypPw(array.passwd)
                .then(function (resolve) {
                    const salt = resolve[0];
                    const hsPw = resolve[1];
                    let timestamp = new Date().getTime();
                    let token = jwt.sign(req.body.email, timestamp.toString(16), {
                        algorithm: 'HS256'
                    });
                    let accessTokenSubStr = token.substr(0, 64);
                    let param2 = {
                        name: array.name,
                        nickName: array.nickName,
                        email: array.email,
                        passwd: hsPw,
                        gender: array.gender,
                        userType: array.userType,
                        phoneNum: array.phoneNum,
                        accessToken: accessTokenSubStr,
                        salt: salt,
                        signTime : Date.now()
                    };
                    const sql2 = "INSERT INTO UserInfo SET ?;";
                    conn.query(sql2,param2, function (err, rows, fields) {
                        if (err) {
                            console.log("insert query error")
                            console.log(err);
                            res.status(500).send('500 SERVER ERROR, db3');
                        } else {
                            console.log('REGISTER SUCCESS');
                            res.redirect('/auth/login');
                        }
                    })
                })
        }
    })
})

router.post('/signout',function(req,res,next)
{
    var passwd = req.body.passwd;
    var data = [email,passwd];

    var sql1 = "delete from UserInfo where email=?";
    var sql2= "select totalcoin from UserInfo where email=?";
    conn.query(sql1,data, function(err,row)
    {
        if(err) console.error(err);
        console.log('delete');
        res.redirect('/index');
    });
});

function obtainToken2(req, res) {
    const email = req.body.email;
    const reqPw = req.body.passwd;

    const sql = "SELECT * FROM UserInfo WHERE email = ?";
    const sql2 = "update UserInfo set accessToken=? where email=?";
    const sql3 = mysql.format(sql, [email]);
    conn.query(sql3, function (err, rows) {
        if (err) {
            console.log("SELECT ERROR : " + err);
        } else if (rows.length === 0) {
            console.log("NO ACCOUNT");
            res.send('<script type="text/javascript">alert("계정 정보가 없습니다. 회원가입후 이용 부탁드립니다.");history.back();</script>');
        } else {
            const dbPw = rows[0].passwd;
            const salt = rows[0].salt;
            pwBySalt(reqPw, salt).then(function (resolve) {
                const crypReqPw = resolve;
                if (dbPw !== crypReqPw) {
                    console.log("uncorrect pw : " + resolve);
                    res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다.");history.back();</script>');
                } else {
                    let timestamp = new Date().getTime();
                    console.log("timeStamp : " + timestamp);
                    let token = jwt.sign(email, timestamp.toString(16), {
                        algorithm: 'HS256'
                    });
                    let accessTokenSubStr = token.substr(0, 64);
                    conn.query(sql2, [accessTokenSubStr, email], function (error, results, next) {
                        if (error) {
                            console.log(error);
                            res.status(400).send("insert token error");
                        } else {
                            console.log("insert token");
                            conn.query(sql, [email,reqPw], function (errors, result, field) {
                                if (errors) {
                                    console.log("select error");
                                    res.status(400).send("token error");
                                } else {
                                    console.log("login success");
                                    res.cookie('accessToken',result[0].accessToken,{
                                        expires :new Date(Date.now()+900000),
                                        httpOnly:true
                                    });
                                    res.redirect('/index');
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

function crypPw(password) {
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
                        console.log("crypto : "+newPw);
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
            resolve(key.toString('base64'));//replace추가
        })
    })
}

module.exports = router;