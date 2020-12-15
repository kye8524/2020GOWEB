
$(document).ready(function(){
    document.getElementById("projectName_").innerText = localStorage.getItem('name') ? localStorage.getItem('name') : "default";
});