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

    var event = event.originalEvent;
    if (event.enterPage.id === 'home_splitter') {
        // $("#menu-splitter .page__background").css("background","rgba(255, 255, 255, .7)");
        $("#menu-splitter .page__background").css("background","white");
        document.getElementById("menu-splitter-list").style.background = 'white';
    }
});

// document.addEventListener("init", function (event) {
//     var event = event.originalEvent;
//     console.log("HHHHHHHHHHHHHHHHHHHHHHHH")
//     console.log(document.querySelector('#nav1'))
//     console.log("HHHHHHHHHHHHHHHHHHHHHHHH")
//     if (event.enterPage.id === 'login') {
//         alert("LOGIN")
//     }
// });

// $(document).on('postpush', '#nav1', function (event) {
//     var event = event.originalEvent;
//     leavePage = event.leavePage.id;
//     console.log("HHHHHHHHHHHHHHHHHHHHHHHH")
//     console.log(event)
//     console.log("HHHHHHHHHHHHHHHHHHHHHHHH")
// });
