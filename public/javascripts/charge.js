function change_krw() {
    var coin = document.getElementById("coin_charge").value;
    var kr = 100 * coin;
    document.getElementById("krw_").innerHTML = kr;
}

function charge_alert() {
    alert("결제가 완료되었습니다.");
}
