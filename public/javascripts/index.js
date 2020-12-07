function show() {
    document.getElementById("menu").style.visibility = "visible";
}
function hide() {
    document.getElementById("menu").style.visibility = "hidden";
}

(function(){
    var current = 0;
    var max = 0;
    var container;
    var interval;

    function init (){
        container = jQuery(".Banner ul");
        max = container.children().length;
        events();

        console.log('init')

        interval = setInterval(next, 3000);
    }
    function events(){
        jQuery("button.left_btn").on("click", prev);
        jQuery("button.right_btn").on("click", next);
    }

    function prev ( e ){
        current--;
        if( current<0 ) current = max-1;
        animate();
    }
    function next( e ){
        current++;
        if(current>max-1) current = 0;
        animate();
    }
    function animate(){
        const moveX = current * 1200;
        TweenMax.to( container, 0.8, { marginLeft: -moveX, ease: Expo.easeOut });

        clearInterval(interval);
        interval = setInterval(next, 3000);
    }
    $(window).load(init);
})();