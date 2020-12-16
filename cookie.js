var cookie= {};
cookie.setCookie=function (cookieName, cookieValue, cookieExpire, cookiePath, cookieDomain, cookieSecure){
    var cookieText=escape(cookieName)+'='+escape(cookieValue);
    cookieText+=(cookieExpire ? '; EXPIRES='+cookieExpire.toUTCString() : '');
    cookieText+=(cookiePath ? '; PATH='+cookiePath : '');
    cookieText+=(cookieDomain ? '; DOMAIN='+cookieDomain : '');
    cookieText+=(cookieSecure ? '; SECURE' : '');
    document.cookie=cookieText;
}

    cookie.getCookie=function(cookieName){
    var cookieValue=null;
    if(document.cookie){
    var array=document.cookie.split((escape(cookieName)+'='));
    if(array.length >= 2){
    var arraySub=array[1].split(';');
    cookieValue=unescape(arraySub[0]);
}
}
    return cookieValue;
}

    cookie.deleteCookie=function(cookieName){
    var temp=getCookie(cookieName);
    if(temp){
    setCookie(cookieName,temp,(new Date(1)));
}
}
module.exports=cookie;