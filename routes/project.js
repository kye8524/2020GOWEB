var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination:function (req,file,cb){
        console.log('이미지파일')
        cb(null,'uploads/images')
    },
    filename:function (req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    }
})
var upload = multer({storage:storage});

router.get('/',function (req,res,next){
    res.redirect('/charity/list/1');
});

router.get('/list/:page', function(req, res, next) {                                                //uri를 'list/:page'형태로 받음.board/list/(페이지숫자)형식으로 게시판리스트 노출
    var page = req.params.page;
    var sql = "select title,image from Project";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.sendFile(path.join(__dirname+'/../html/Charity.html'),{rows: rows, page:page, length:rows.length-1, page_num:5, pass:true});
        console.log(rows.length-1);
    });
});
router.get('/add', function (req,res,next) {
    res.sendFile(path.join(__dirname+'/../html/Project_add.html'));
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
        //var image = req.file.path;
        var data = [title,field,intro,content,userSeq];

        var sql = "insert into Project(title,field,intro,content, userSeq) values(?,?,?,?,?)";
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
    var sql="SELECT pro.*, U.name, U.email, B.* FROM Project AS pro JOIN UserInfo U on U.userSeq = pro.userSeq join Budget B on pro.projectSeq = B.projectSeq and pro.projectSeq = ? ";
    conn.query(sql,[seq],function (err,row){
    if(err) console.error(err);
    console.log(row);
    res.render('Charity_explanation', {row:row[0]})
    //res.sendFile(path.join(__dirname+'/../html/Charity_explanation.html'),{row:row[0]});
});

});

module.exports=router;

