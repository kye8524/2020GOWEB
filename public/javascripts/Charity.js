$(document).ready(function() {

    // css에서 플로팅 배너 위치(top)값을 가져와 저장
    var floatPosition = parseInt($(".Side_nav").css('top'));

    $(window).scroll(function() {
        // 현재 스크롤 위치를 가져옴
        var scrollTop = $(window).scrollTop();
        var newPosition = scrollTop + floatPosition + "px";


        $(".Side_nav").stop().animate({
            "top" : newPosition
        }, 500);

    }).scroll();

});