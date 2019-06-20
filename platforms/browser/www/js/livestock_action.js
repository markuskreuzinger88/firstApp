db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
var born_alive = "";
var born_dead = "";

//set list item active handler on livestock action page
$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.enterPage.id === 'livestock_action') {
        livestock_id = String(localStorage.LivestockID)
        livestockActionEdit = String(localStorage.actionEdit)
        livestockActionDate = Date.parse(localStorage.actionDate)
        var actualDateNew = new Date();
        var actualDate = actualDateNew.getTime();
        var daysLeft = Math.ceil((livestockActionDate - actualDate) / 24 / 60 / 60 / 1000);
        var daysLeftABS = Math.abs(daysLeft);
        console.log(daysLeftABS)
        db.transaction(function (transaction) {
            transaction.executeSql(
                'SELECT * FROM livestock_action WHERE future = ? AND livestock_id = ? ORDER BY date DESC', ['false', livestock_id],
                function (tx, results) {
                    if (daysLeftABS != 0) {
                        if (livestockActionEdit == 'true') {
                            if (results.rows.item(0).type == 'Belegung') {
                                document.getElementById('livestockActionListField1').setAttribute('disabled')
                                document.getElementById('livestockActionListField1').removeAttribute('modifier')
                                document.getElementById('livestockActionListField3').setAttribute('disabled')
                                document.getElementById('livestockActionListField3').removeAttribute('modifier')
                                document.getElementById('livestockActionListField4').setAttribute('disabled')
                                document.getElementById('livestockActionListField4').removeAttribute('modifier')
                                document.getElementById('livestockActionListField5').setAttribute('disabled')
                                document.getElementById('livestockActionListField5').removeAttribute('modifier')
                            } else if (results.rows.item(0).type == 'Kontrolle 1') {
                                document.getElementById('livestockActionListField1').setAttribute('disabled')
                                document.getElementById('livestockActionListField1').removeAttribute('modifier')
                                document.getElementById('livestockActionListField2').setAttribute('disabled')
                                document.getElementById('livestockActionListField2').removeAttribute('modifier')
                                document.getElementById('livestockActionListField4').setAttribute('disabled')
                                document.getElementById('livestockActionListField4').removeAttribute('modifier')
                                document.getElementById('livestockActionListField5').setAttribute('disabled')
                                document.getElementById('livestockActionListField5').removeAttribute('modifier')
                            } else if (results.rows.item(0).type == 'Kontrolle 2') {
                                document.getElementById('livestockActionListField1').setAttribute('disabled')
                                document.getElementById('livestockActionListField1').removeAttribute('modifier')
                                document.getElementById('livestockActionListField2').setAttribute('disabled')
                                document.getElementById('livestockActionListField2').removeAttribute('modifier')
                                document.getElementById('livestockActionListField3').setAttribute('disabled')
                                document.getElementById('livestockActionListField3').removeAttribute('modifier')
                                document.getElementById('livestockActionListField5').setAttribute('disabled')
                                document.getElementById('livestockActionListField5').removeAttribute('modifier')
                            } else if (results.rows.item(0).type == 'Abgeferkelt') {
                                document.getElementById('livestockActionListField1').setAttribute('disabled')
                                document.getElementById('livestockActionListField1').removeAttribute('modifier')
                                document.getElementById('livestockActionListField2').setAttribute('disabled')
                                document.getElementById('livestockActionListField2').removeAttribute('modifier')
                                document.getElementById('livestockActionListField3').setAttribute('disabled')
                                document.getElementById('livestockActionListField3').removeAttribute('modifier')
                                document.getElementById('livestockActionListField4').setAttribute('disabled')
                                document.getElementById('livestockActionListField4').removeAttribute('modifier')
                            } else if (results.rows.item(0).type == 'Abgesetzt') {
                                document.getElementById('livestockActionListField2').setAttribute('disabled')
                                document.getElementById('livestockActionListField2').removeAttribute('modifier')
                                document.getElementById('livestockActionListField3').setAttribute('disabled')
                                document.getElementById('livestockActionListField3').removeAttribute('modifier')
                                document.getElementById('livestockActionListField4').setAttribute('disabled')
                                document.getElementById('livestockActionListField4').removeAttribute('modifier')
                                document.getElementById('livestockActionListField5').setAttribute('disabled')
                                document.getElementById('livestockActionListField5').removeAttribute('modifier')
                            }
                        } else {
                            //if no date from each action is reached than user can do nothing
                            document.getElementById('livestockActionListField1').setAttribute('disabled')
                            document.getElementById('livestockActionListField1').removeAttribute('modifier')
                            document.getElementById('livestockActionListField2').setAttribute('disabled')
                            document.getElementById('livestockActionListField2').removeAttribute('modifier')
                            document.getElementById('livestockActionListField3').setAttribute('disabled')
                            document.getElementById('livestockActionListField3').removeAttribute('modifier')
                            document.getElementById('livestockActionListField4').setAttribute('disabled')
                            document.getElementById('livestockActionListField4').removeAttribute('modifier')
                            document.getElementById('livestockActionListField5').setAttribute('disabled')
                            document.getElementById('livestockActionListField5').removeAttribute('modifier')
                            livestockActionEditAlert('Du kannst den Wurfindex dieses Nutztieres erst 7 Tage vor dem ersten ausgewählten Datum wieder bearbeiten')
                        }
                    } else { 
                        //if last action date is equal than current date
                        document.getElementById('livestockActionListField1').setAttribute('disabled')
                        document.getElementById('livestockActionListField1').removeAttribute('modifier')
                        document.getElementById('livestockActionListField2').setAttribute('disabled')
                        document.getElementById('livestockActionListField2').removeAttribute('modifier')
                        document.getElementById('livestockActionListField3').setAttribute('disabled')
                        document.getElementById('livestockActionListField3').removeAttribute('modifier')
                        document.getElementById('livestockActionListField4').setAttribute('disabled')
                        document.getElementById('livestockActionListField4').removeAttribute('modifier')
                        document.getElementById('livestockActionListField5').setAttribute('disabled')
                        document.getElementById('livestockActionListField5').removeAttribute('modifier')
                        livestockActionEditAlert('Du hast heute schon ein Ereigniss für diese Nutztier abgespeichert')
                    }
                }, null);
        });
    }
});

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
    var arrType = ["Belegung", "Kontrolle 1", "Kontrolle 2", "Abgeferkelt", "Abgesetzt"];
    var arrCreatedOnDate = [];
    var arrCreatedOnTime = [];
    var arrTextarea = [];
    var arrFuture = [];
    document.getElementById(id).hide();
    if (id == 'occupancy') {
        //calculate dates depending on user input
        startDate = Date.parse(document.getElementById(CreatedOnDateID).value);
        var newDate1 = (document.getElementById("possibleFarrow").value * 24 * 60 * 60 * 1000) + startDate;
        var possibleFarrowDate = new Date(newDate1).toISOString().substr(0, 10);
        var newDate2 = (document.getElementById("possibleStripOff").value * 24 * 60 * 60 * 1000) + newDate1;
        var possibleStripOff = new Date(newDate2).toISOString().substr(0, 10);
        var newDate3 = (document.getElementById("possibleCheck1").value * 24 * 60 * 60 * 1000) + startDate;
        var possibleCheck1 = new Date(newDate3).toISOString().substr(0, 10);
        var newDate4 = (document.getElementById("possibleCheck2").value * 24 * 60 * 60 * 1000) + startDate;
        var possibleCheck2 = new Date(newDate4).toISOString().substr(0, 10);
        // add variables to Array
        //occupancy
        arrCreatedOnDate[0] = document.getElementById(CreatedOnDateID).value;
        arrCreatedOnTime[0] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[0] = document.getElementById(textareaID).value;
        arrFuture[0] = "false";
        //first check from vet
        arrCreatedOnDate[1] = possibleCheck1;
        arrCreatedOnTime[1] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[1] = "";
        arrFuture[1] = "true";
        //second check from vet
        arrCreatedOnDate[2] = possibleCheck2;
        arrCreatedOnTime[2] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[2] = "";
        arrFuture[2] = "true";
        //possible farrow date
        arrCreatedOnDate[3] = possibleFarrowDate;
        arrCreatedOnTime[3] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[3] = "";
        arrFuture[3] = "true";
        //possible strip off date
        arrCreatedOnDate[4] = possibleStripOff;
        arrCreatedOnTime[4] = document.getElementById(CreatedOnTimeID).value;
        arrTextarea[4] = "";
        arrFuture[4] = "true";
        var result = "";
        write2DBActionArr(arrType, arrCreatedOnDate, arrCreatedOnTime, arrTextarea, result, arrFuture, "true")
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
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result, "false", "true")
    } else if (id == 'stripOff') {
        var result = "";
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result, "false", "true")
    } else if ((id == 'pregnancyCheck1') || (id == 'pregnancyCheck2')) {
        var check1 = document.getElementById("pregnancy-check-1");
        var check2 = document.getElementById("pregnancy-check-2");
        if (check1.checked == true) {
            var result = 'positiv';
        } else {
            var result = 'negativ';
        }
        write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result, "false", "true")
    }
};

//if no date from each action is reached than user can do nothing
function livestockActionEditAlert(msg) {
    ons.notification.confirm({
        message: msg,
        title: 'Nutztier Wurfindex Datum',
        buttonLabels: ['OK'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: false,
        callback: function (index) {
            if (index == 0) {
                document.querySelector('#nav1').popPage();
            }
        }
    });
}