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

    var title = req.body.name;
    var field = req.body.field;
    var intro = req.body.intro;
    var content = req.body.content;
    //var image = req.file.path;
    var data = [title,field,intro,title,content];

    var sql = "insert into Project(title,field,intro,content) values(?,?,?,?)";
    conn.query(sql,data, function (err, rows) {
        if (err) console.error("err : " + err);
        res.status(200)
        console.log('complete')
        res.sendFile(path.join(__dirname+'/../html/Budget_regist.html'));
    });
});

router.get('/read/:idx',function(req,res,next)
{
    var idx = req.params.title;
    var sql = "select title, field,intro, content from Project where title=?";
    conn.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
        res.sendFile(path.join(__dirname+'/../html/Charity_explanation.html'),{rows: row[0]});
    });
});

module.exports=router;

