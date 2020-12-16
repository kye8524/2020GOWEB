$(document).ready(function() {

    // css에서 플로팅 배너 위치(top)값을 가져와 저장
    var floatPosition = parseInt($(".Side_nav").css('top'));

    $(window).scroll(function() {

        var scrollTop = ($(window).scrollTop())/3;
        var newPosition = scrollTop + floatPosition + "px";


        $(".Side_nav").stop().animate({
            "top" : newPosition
        }, 500);

    }).scroll();

});