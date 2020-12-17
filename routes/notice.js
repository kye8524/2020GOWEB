var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path= require('path');

router.get('/list', function(req, res, next) {
    res.redirect('/notice/Notice_list/1')
});

router.get('/Notice_list/:page', function(req, res, next) {                                                //uri를 'list/:page'형태로 받음.board/list/(페이지숫자)형식으로 게시판리스트 노출
    var page = req.params.page;                                                                     //uri변수 'page'로 맴핑된 page값을 req객체로 가져옴 > 페이징개발을 위해 미리 선언함
    var sql = "select idx, title," +                                                                //sql문 수행
        "date_format(regdate,'%Y-%m-%d') regdate,view from Notice";
    conn.query(sql, function (err, rows) {                                                   //select된 행을 가져와서 rows 변수에 담는다.오류가 있다면 err에 담는다.
        if (err) console.error("err : " + err);
        if(req.cookies.accessToken){
            var userinfo = req.userInfo;
            if(userinfo){
                let userType=userinfo.userType;
                userType='/mypage/'+userType;
                console.log(userType);
                res.render('Notice_list',{title: 'GiveCoin', rows: rows, page:page, length:rows.length-1, page_num:5, pass:true,link:userType,val1:'마이메이지',val2:'로그아웃'});
            }
        }else {
            console.log('cookie none');
            res.render('Notice_list',{title: 'GiveCoin', rows: rows, page:page, length:rows.length-1, page_num:5, pass:true,link:'/auth/register',val1:'회원가입',val2:'로그인'});
        }
        console.log(rows.length-1);
    });
});

router.get('/write', function (req,res,next) {
    if(req.cookies.accessToken){
        var userinfo = req.userInfo;
        if(userinfo){
            let userType=userinfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('Notice_write',{link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('Notice_write',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
});

router.post('/write', function(req,res,next){
    var title = req.body.title;
    var content = req.body.content;
    var data = [title,content];


    var sql = "insert into Notice(title, content, regdate) values(?,?,now())";
    conn.query(sql,data, function (err, rows) {
        if (err) console.error("err : " + err);
        res.redirect('/notice/list');
    });
});

router.get('/read/:idx',function(req,res,next)
{
    var idx = req.params.idx;
    var sql = "select idx, title, content," +
        "date_format(regdate,'%Y-%m-%d') regdate,view from Notice where idx=?";
    var sql2 = "update Notice set view=view+1 where idx=?";
    conn.query(sql2,[idx],function (err){
        if(err) console.error(err);
    })
    conn.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        if(req.cookies.accessToken){
            var userinfo = req.userInfo;
            if(userinfo){
                let userType=userinfo.userType;
                userType='/mypage/'+userType;
                console.log(userType);
                res.render('Notice_read',{row:row[0],link:userType,val1:'마이메이지',val2:'로그아웃'});
            }
        }else {
            console.log('cookie none');
            res.render('Notice_read',{row:row[0],link:'/auth/register',val1:'회원가입',val2:'로그인'});
        }
    });
});
router.post('/update',function(req,res,next)
{
    var idx = req.body.idx;
    var title = req.body.title;
    var content = req.body.content;
    var data = [title,content,idx];


    var sql = "update Notice set title=?,content=? where idx=?";
    conn.query(sql,data, function(err,result)
    {
        if(err) console.error(err);
        res.redirect('/notice/read/'+idx);
    });
});


router.post('/delete',function(req,res,next)
{
    var idx = req.body.idx;
    var data = [idx];

    var sql = "delete from Notice where idx=?";
    conn.query(sql,data, function(err,result)
    {
        if(err) console.error(err);
        res.redirect('/notice/list/');
    });
});

router.get('/map',function(req,res,next){
    if(req.cookies.accessToken){
        var userinfo = req.userInfo;
        if(userinfo){
            let userType=userinfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('map',{link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('map',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
})

module.exports = router;