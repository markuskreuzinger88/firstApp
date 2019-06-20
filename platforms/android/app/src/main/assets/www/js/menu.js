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

var pushNextPage = function (id, page) {
    document.getElementById(id).style.boxShadow = 'none';
    localStorage.setItem("PageSelector", id);
    nav1.pushPage(page + ".html")
}

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    if ((event.enterPage.id === 'drug_action_delivery') || (event.enterPage.id === 'livestock') || (event.enterPage.id === 'livestock_add')) {
        document.getElementById("livestock_add").style.boxShadow = '10px 10px 5px #888888';
        document.getElementById("livestock").style.boxShadow = '10px 10px 5px #888888';
        document.getElementById("drug_delivery").style.boxShadow = '10px 10px 5px #888888';
        document.getElementById("wurfindex").style.boxShadow = '10px 10px 5px #888888';
    }
    if (event.enterPage.id === 'home_splitter') {
        // $("#menu-splitter .page__background").css("background","rgba(255, 255, 255, .7)");
        // $("#menu-splitter .page__background").css("background", "white");
        // document.getElementById("menu-splitter-list").style.background = 'white';
    }
});

// $(document).on('postpush', '#nav1', function (event) {
//     var event = event.originalEvent;
//     enterPage = event.enterPage.id;
//     if (event.enterPage.id === 'login') {
//         $("#login .page__background").css("background", "#ffffff");
//     }
// });


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