var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
var path = require('path');

router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports=router;