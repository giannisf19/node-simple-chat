
function get(id) {
    return document.getElementById(id);
}


function setStyle(item, st, val) {
    item.style[st] = val;
}

function addChild(item, child) {
    item.innerHTML += (child);
}

function changeContent(item, content) {
    item.innerHTML = content;
}