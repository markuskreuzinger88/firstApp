db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database

//set first ons page
ons.ready(function() {
    if (localStorage.getItem("login") == 'true') {
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

checkInputsLogin = function () {
    var DEBUGCredentials = localStorage.getItem("settings_credentials")
    var DEBUGswitchState = localStorage.getItem("settings_request")
    if (DEBUGCredentials == 'false') {
        var email = document.getElementById("email");
        var psw = document.getElementById("psw");
        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // Validate email
        if (email.value.match(mailformat)) {
            // Validate lowercase letters
            if (psw.value.match(lowerCaseLetters)) {
                // Validate capital letters
                if (psw.value.match(upperCaseLetters)) {
                    // Validate numbers
                    if (psw.value.match(numbers)) {
                        // Validate length
                        if (psw.value.length >= 8) {
                            if (DEBUGswitchState == 'true') {
                                RESTLogin()
                            } else {
                                write2DB("dummy_token1", "dummy_token2")
                            }
                        } else {
                            pushMsg('Passwort überprüfen',
                                'Dein Passwort muss mindestens 8 Zeichen lang sein')
                        }
                    } else {
                        pushMsg('Passwort überprüfen',
                            'Dein Passwort muss mindestens eine Ziffer enthalten')
                    }
                } else {
                    pushMsg('Passwort überprüfen',
                        'Dein Passwort muss mindestens einen Großbuchstaben enthalten')
                }
            } else {
                pushMsg('Passwort überprüfen',
                    'Dein Passwort muss mindestens einen Kleinbuchstaben enthalten')
            }
        } else {
            pushMsg('Email überprüfen', 'Bitte gib deine korrekte Email Adresse ein')
        }
    } else {
        if (DEBUGswitchState == 'true') {
            RESTLogin()
        } else {
            write2DBLogin("dummy_token1", "dummy_token2")
        }
    }
}
pushMsg = function (title, msg) {
    ons.notification.toast(msg, {
        timeout: 3000,
        animation: 'fall'
    })
}

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