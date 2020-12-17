var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
var multer = require('multer');
var cUtil = require('../customUtil');
var fs = require('fs');

var storage = multer.diskStorage({
    destination:function (req,file,cb){
        console.log('이미지파일')
        cb(null,'public/image')
    },
    filename:function (req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    }
})
var upload = multer({storage:storage});

router.get('/',function (req,res,next){
    res.redirect('/charity/list/1');
});
router.get('/list',function (req,res,next){
    res.redirect('/charity/list/1');
});
router.get('/list/:page', function(req, res, next) {                                                //uri를 'list/:page'형태로 받음.board/list/(페이지숫자)형식으로 게시판리스트 노출
    var page = req.params.page;
    var sql = "select title,image from Project";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        if(req.cookies.accessToken){
            var userInfo = req.userInfo;
            if(userInfo){
                let userType=userInfo.userType;
                userType='/mypage/'+userType;
                console.log(userType);
                res.render('Charity',{rows: rows, field:page, length:rows.length-1, page_num:5, pass:true,link:userType,val1:'마이메이지',val2:'로그아웃'});
            }
        }else {
            console.log('cookie none');
            res.render('Charity',{rows: rows, field:page, length:rows.length-1, page_num:5, pass:true,link:'/auth/register',val1:'회원가입',val2:'로그인'});
        }
        console.log(rows.length-1);
    });

});
router.get('/add', function (req,res,next) {
    if(req.cookies.accessToken){
        var userInfo = req.userInfo;
        if(userInfo){
            let userType=userInfo.userType;
            userType='/mypage/'+userType;
            console.log(userType);
            res.render('Project_add',{link:userType,val1:'마이메이지',val2:'로그아웃'});
        }
    }else {
        console.log('cookie none');
        res.render('Project_add',{link:'/auth/register',val1:'회원가입',val2:'로그인'});
    }
});

router.post('/add', upload.single('file'),function(req,res,next){
    console.log("post")
    console.log(upload)
    console.log(upload.storage.getFilename)

    var userInfo = req.userInfo;
    if(userInfo){
        let userSeq = userInfo.userSeq;
        var title = req.body.name;
        var field = req.body.field;
        var intro = req.body.intro;
        var content = req.body.content;
        var image = req.file.path;
        image=image.replace('public','');
        var data = [title,field,intro,content,userSeq,image];


        var sql = "insert into Project(title,field,intro,content, userSeq,image) values(?,?,?,?,?,?)";
        var sql2 = "update userInfo set projectNum=projectNum+1 where userSeq=?";
        conn.query(sql2,[userSeq],function (err){
            if(err) console.error(err);
        })
        conn.query(sql,data, function (err, rows) {
            if (err) console.error("err : " + err);
            res.status(200)
            console.log('complete')
            res.sendFile(path.join(__dirname+'/../html/Budget_regist.html'));
        });
    }else{
        res.status(403).send({"msg": "토큰이 만료되었습니다."})
    }

});

router.get('/read/:seq',function(req,res,next)
{
    let seq = req.params.seq;
    console.log(seq);
    var sql_img="select image from project where projectSeq=?"
    var sql="SELECT pro.*, U.name, U.email, date_format(B.startdate,'%Y-%m-%d') startdate ,date_format(B.enddate,'%Y-%m-%d') enddate,B.client,B.contents,B.price FROM Project AS pro JOIN userInfo U on U.userSeq = pro.userSeq join Budget B on pro.projectSeq = B.projectSeq and pro.projectSeq = ? ";
    conn.query(sql,[seq],function (err,row){
    if(err) console.error(err);
    console.log(row);
    conn.query(sql_img,[seq],function (err,result){
        if(req.cookies.accessToken){
            var userInfo = req.userInfo;
            if(userInfo){
                let userType=userInfo.userType;
                userType='/mypage/'+userType;
                console.log(userType);
                res.render('Charity_explanation',{row:row[0],imgR:result[0],link:userType,val1:'마이메이지',val2:'로그아웃',seq:seq});
            }
        }else {
            console.log('cookie none');
            res.render('Charity_explanation',{row:row[0],imgR:result[0],link:'/auth/register',val1:'회원가입',val2:'로그인',seq:seq});
        }
    })
    });
});
router.post('/read/:seq',function (req,res,next){
    let seq = req.params.seq;
    res.redirect('/charge/donation/'+seq);
})
module.exports=router;

