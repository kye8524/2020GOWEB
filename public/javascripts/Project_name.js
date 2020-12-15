var name;

function saveName() {
    name = document.getElementById("project_name").value;
    var name_project = document.getElementById("name_project");
    name_project.innerText = name;
}

