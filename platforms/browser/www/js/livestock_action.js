db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
var born_alive = "";
var born_dead = "";

var showPopover = function (target) {
    document
        .getElementById('popover')
        .show(target);
};

var hidePopover = function () {
    document
        .getElementById('popover')
        .hide();
};

var showTemplateDialog = function (my_dialog, my_dialog_html, CreatedOnDate, CreatedOnTime) {

    var dialog = document.getElementById(my_dialog);

    if (dialog) {
        dialog.show();
    } else {
        ons.createElement(my_dialog_html, {
                append: true
            })
            .then(function (dialog) {
                dialog.show();
                let date = new Date().toISOString().substr(0, 10);
                var time = new Date().toLocaleTimeString()
                document.querySelector(CreatedOnDate).value = date;
                document.querySelector(CreatedOnTime).value = time.substr(0, 5);
            });
    }
};

var hideDialog = function (id) {
    document.getElementById(id).hide();
};

//function handle checkbox
var DialogCheckboxBCS = function (checkbox) {
    document.getElementById("bcs-check-1").checked = false;
    document.getElementById("bcs-check-2").checked = false;
    document.getElementById("bcs-check-3").checked = false;
    document.getElementById("bcs-check-4").checked = false;
    document.getElementById("bcs-check-5").checked = false;
    document.getElementById(checkbox).checked = true;
};

//function handle checkbox
var DialogCheckboxPregnancy = function (checkbox) {
    document.getElementById("pregnancy-check-1").checked = false;
    document.getElementById("pregnancy-check-2").checked = false;
    document.getElementById("pregnancy-check-3").checked = false;
    document.getElementById(checkbox).checked = true;
};

//function handle checkbox
var DialogCheckbox = function (checkbox) {
    document.getElementById("check-1").checked = false;
    document.getElementById("check-2").checked = false;
    document.getElementById("check-3").checked = false;
    document.getElementById("check-4").checked = false;
    document.getElementById(checkbox).checked = true;
};

var saveDialog = function (id, type, CreatedOnDateID, CreatedOnTimeID, textareaID) {
    var arrType = ["Belegung", "mögliches Abferkeln", "mögliches Absetzen"];
    var arrCreatedOnDate = [];
    var arrCreatedOnTime = [];
    var arrTextarea = [];
    document.getElementById(id).hide();
    if (id == 'occupancy') {
        startDate = Date.parse(document.getElementById(CreatedOnDateID).value);
        var newDate1 = (document.getElementById("possibleFarrow").value * 24 * 60 * 60 * 1000) + startDate;
        var possibleFarrowDate = new Date(newDate1).toISOString().substr(0, 10);
        var newDate2 = (document.getElementById("possibleStripOff").value * 24 * 60 * 60 * 1000) + newDate1;
        var possibleStripOff = new Date(newDate2).toISOString().substr(0, 10);

        arrCreatedOnDate[0] = document.getElementById(CreatedOnDateID).value;
        arrCreatedOnTime[0] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[0] = document.getElementById(textareaID).value;
        arrCreatedOnDate[1] = possibleFarrowDate;
        arrCreatedOnTime[1] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[1] = "";
        arrCreatedOnDate[2] = possibleStripOff;
        arrCreatedOnTime[2] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[2] = "";
        var result = "";
        write2DBActionArr(arrType, arrCreatedOnDate, arrCreatedOnTime, arrTextarea, result)
    } else if (id == 'farrow') {
        var BornAlive = document.getElementById("BornAlive");
        var BornDead = document.getElementById("BornDead");
        var BornMummified = document.getElementById("BornMummified");
        var result = BornAlive.value + "+" + BornDead.value + "+" + BornMummified.value;
        console.log(result)
        if (BornAlive.value.length == 0) {
            ons.notification.alert({
                message: 'Bitte überprüfe das Eingabefeld "Lebend geboren"!',
                title: 'Eingabefelder Fehler',
            });
            return
        }
        if (BornDead.value.length == 0) {
            ons.notification.alert({
                message: 'Bitte überprüfe das Eingabefeld "Tot geboren"!',
                title: 'Eingabefelder Fehler',
            });
            return
        }
        if (BornMummified.value.length == 0) {
            ons.notification.alert({
                message: 'Bitte überprüfe das Eingabefeld "Mumien"!',
                title: 'Eingabefelder Fehler',
            });
            return
        }
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result)
    } else if (id == 'stripOff') {
        var result = "";
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result)
    } else if (id == 'pregnancy') {
        var check1 = document.getElementById("pregnancy-check-1");
        var check2 = document.getElementById("pregnancy-check-2");
        var check3 = document.getElementById("pregnancy-check-3");
        if (check1.checked == true) {
            var result = 'positiv';
        } else if (check2.checked == true) {
            var result = 'fraglich';
        } else if (check3.checked == true) {
            var result = 'negativ';
        }
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result)
    } else if (id == 'estrusControl') {
        var check1 = document.getElementById("check-1");
        var check2 = document.getElementById("check-2");
        var check3 = document.getElementById("check-3");
        var check4 = document.getElementById("check-4");
        if (check1.checked == true) {
            var result = 'keine Symptome';
        } else if (check2.checked == true) {
            var result = 'Duldung';
        } else if (check3.checked == true) {
            var result = 'Rötung';
        } else if (check4.checked == true) {
            var result = 'Belegaktion';
        }
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result)
    } else if (id == 'bcs') {
        var check1 = document.getElementById("bcs-check-1");
        var check2 = document.getElementById("bcs-check-2");
        var check3 = document.getElementById("bcs-check-3");
        var check4 = document.getElementById("bcs-check-4");
        var check5 = document.getElementById("bcs-check-5");
        if (check1.checked == true) {
            var result = 'Zu mager';
        } else if (check2.checked == true) {
            var result = 'Mager';
        } else if (check3.checked == true) {
            var result = 'Gut';
        } else if (check4.checked == true) {
            var result = 'Fett';
        } else if (check5.checked == true) {
            var result = 'Zu Fett';
        }
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result)
    }
};