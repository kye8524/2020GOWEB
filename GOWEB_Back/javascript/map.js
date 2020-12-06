<!-- GoogoleMap Asynchronously Loading the API ********************************************* -->
let infoWindow = null;
function initialize() {
    let latlng = new google.maps.LatLng(37.62944891957678, 127.081551726778);
    let myOptions = {
        zoom: 16,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP };
    let map = new google.maps.Map (document.getElementById("map_canvas"), myOptions);

    let marker= new google.maps.Marker({
        position: latlng,
        map: map,
        title: '서울과학기술대학교 미래관'  //마커에 마우스 포인트를 갖다댔을 때 뜨는 타이틀
    });

    let content = "GiveCoin 본사";		 // 말풍선 안에 들어갈 내용

    // 마커를 클릭했을 때의 이벤트 > 말풍선 뜸
    infoWindow = new google.maps.InfoWindow({ content: content});

    google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map,marker);
    });

}


