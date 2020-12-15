var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');


router.get('/register', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Sign_up.html'));
});
router.get('/out', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/Sign_out.html'));
});

router.get('/login', function(req, res, next) {
    cookie.getCookie("acessCookie");
    cookie.setCookie("acessCookie","cookie_value",1,"/");
    res.sendFile(path.join(__dirname+'/../html/Login.html'),{});
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
                res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다.");history.back();</script>');
            }
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
}

router.post('/donor_register',function (req,res,next){
    var email = req.body.email;
    var passwd = req.body.passwd;
    var name = req.body.name;
    var nickname = req.body.nickName;
    var gender = req.body.gender;
    var phonenum = req.body.phoneNum;
    var accesstoken = jwt.sign(req.body.email, Date.now().toString(16), {
        algorithm: 'HS256'
    });
    var data = [email,passwd,name,nickname,gender,phonenum,'donor',accesstoken];
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

router.post('/charity_register',function (req,res,next){
    var email = req.body.email;
    var passwd = req.body.passwd;
    var name = req.body.name;
    var nickname = req.body.nickName;
    var gender = req.body.gender;
    var phonenum = req.body.phoneNum;
    var accesstoken = jwt.sign(req.body.email, Date.now().toString(16), {
        algorithm: 'HS256'
    });
    var data = [email,passwd,name,nickname,gender,phonenum,'charity',accesstoken];
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

router.post('/out',function(req,res,next)
{
    var email = req.body.email;
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

module.exports = router;