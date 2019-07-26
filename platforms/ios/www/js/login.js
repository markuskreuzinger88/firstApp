db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database

//set first ons page
ons.ready(function () {
    if (localStorage.getItem("login") == 'true') {
        RESTGetLivestock()
        document.querySelector('#nav1').pushPage('home_splitter.html');
    } else {
        document.querySelector('#nav1').pushPage('login.html');
    }
});

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    enterPage = event.enterPage.id;
    if (event.enterPage.id === 'login') {
        $("#login .page__background").css("background", "#ffffff");
    }
});

logout = function () {
    ons.notification.confirm({
        message: 'Möchtest du dich Abmelden?',
        title: 'Abmelden',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                db.transaction(function (tx) {
                    tx.executeSql('DROP TABLE IF EXISTS user');
                }, function (error) {
                    alert('Error: ' + error.message + ' code: ' + error.code);
                }, function () {
                    navigator.app.exitApp();
                });
            }
        }
    });
}
