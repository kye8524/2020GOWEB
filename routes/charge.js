var express = require('express');
var router = express.Router();
var mysql_odbc = require('../database/db_conn')();
var conn = mysql_odbc.init();
const mysql = require('mysql');
var path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../customUtil');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../html/charge.html'));
});

module.exports = router;