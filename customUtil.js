var util= {};
var mysql_odbc = require('./database/db_conn')();
var conn = mysql_odbc.init();

util.tokenMiddleWare = function(req, res, next){
    var token = req.cookies.accessToken;
    console.log(token);
    if(token){
        conn.query("select * from UserInfo where accessToken = ?", token, function (err ,userInfo) {
            if(err){
                console.log(err);
                next();
            }else if(!userInfo){
                next();
            }else if(userInfo.length === 0){
                next();
            }else{
                req.userInfo = userInfo[0];
                next();
            }
        });
    }else{
        next();
    }
};
util.isDelivered = function(arr){
    isDelivered = true;
    for (var i = 0; i < arr.length; i++) {
        if (!toString(arr[i])) {
            isDelivered = false;
        }
    }
    return isDelivered;
};

util.checkAuth = function(req, res){
    var token = req.headers['accessToken'];
    conn.query("select * from UserInfo where accessToken = ?", token, function(err, userInfos){
        if(err){
            res.send(500)
        }
    })
};

module.exports=util;