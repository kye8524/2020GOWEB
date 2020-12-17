
$(document).ready(function(){
    document.getElementById("projectName_").innerText = localStorage.getItem('name') ? localStorage.getItem('name') : "default";
});

$(document).ready(function(){
    document.getElementById("donateCoin_").innerText = localStorage.getItem('name2') ? localStorage.getItem('name2') : "default";
});