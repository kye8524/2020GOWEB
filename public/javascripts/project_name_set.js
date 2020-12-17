function setItem() {
    var projectName = document.getElementById("projectName").value;
    localStorage.setItem('name', projectName);
    fetch('/')
}

function setItem2() {
    var donateCoin = document.getElementById("donateCoin").value;
    localStorage.setItem('name2', donateCoin);
    fetch('/')
}