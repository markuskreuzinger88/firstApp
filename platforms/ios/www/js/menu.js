window.fn = {};

window.fn.open = function () {
    var menu = document.getElementById('menu-splitter');
    menu.open();
};

window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu-splitter');
    content.load(page)
        .then(menu.close.bind(menu));
}

var pushNextPage = function (id) {
    document.getElementById(id).style.boxShadow = 'none';
    nav1.pushPage(id + ".html")
}

$(document).on('postpush', '#nav1', function (event) {
    document.getElementById("livestock_add").style.boxShadow = '10px 10px 5px #888888';
    document.getElementById("livestock").style.boxShadow = '10px 10px 5px #888888';
    document.getElementById("drug_delivery").style.boxShadow = '10px 10px 5px #888888';
    document.getElementById("drugs").style.boxShadow = '10px 10px 5px #888888';
});