var pur;

function check_donor() {
    document.getElementById("donor").style.border="4px solid #30558A";
    document.getElementById("donor").style.boxShadow="3px 4px 6px gray;";
    pur = {UserType: "donor"};
}

function check_charity() {
    document.getElementById("charity").style.border="4px solid #30558A";
    document.getElementById("charity").style.boxShadow="3px 4px 6px gray;";
    pur = {UserType:"charity"};
}

function check_out_donor() {
    document.getElementById("donor").style.border="none";
    document.getElementById("donor").style.boxShadow="1px 2px 2px gray;";
}

function check_out_charity() {
    document.getElementById("charity").style.border="none";
    document.getElementById("charity").style.boxShadow="1px 2px 2px gray;";
}

function check_pwd() {
    var pwd = document.getElementById("pwd").value;
    var pwd2 = document.getElementById("pwd2").value;
    if(pwd !== pwd2){
        document.passwd.focus();
        return false;
    }else{
        return true;
    }
}

function UserType() {
    if(pur===0){
        document.UserType.focus();
        return false;
    }else{
        return true;
    }
}

function doAction() {
    var req = createRequest();
    req.open("post", "Sign_up.jsp?param="+encodeURI(pur));
    req.setRequestHeader("UserType", "XMLHttpRequest");
    req.send(pur);
}

function createRequest() {
    var httplist = [
        function () {
            return new XMLHttpRequest();
        },
        function () {
            return new ActiveXObject("Msxm12.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    ];
    for (var i = 0; i < httplist.length; i++) {
        try {
            var http = httplist[i]();
            if (http != null) return http;
        } catch (e) {
            continue;
        }
        return null;
    }
}
