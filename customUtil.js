var util= {};


util.tokenMiddleWare = function(req, res, next){
    var token = req.headers['x-access-token'];
    if(token){
        util.connection.query("select * from UserInfo where accessToken = ?", token, function (err ,userInfo) {
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
    var token = req.headers['x-access-token'];
    this.connection.query("select * from UserInfo where accessToken = ?", token, function(err, userInfos){
        if(err){
            res.send(500)
        }
    })
};

module.exports=util;