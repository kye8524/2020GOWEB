var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');

router.get('/', function(req, res, next) {
    res.render('index');
});
router.get('/introduce',function (req,res,next){
    res.sendFile(path.join(__dirname+'/../html/introduce.html'));
})
module.exports=router;