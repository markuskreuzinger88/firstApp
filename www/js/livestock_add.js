db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
var number = "";
var email = "";
var bearerToken = "";
var switchState = "";
var ipAdress = "";
var place = "";
var color = "";
var born = "";
var createdOn = "";
var switchState = "";
var networkConnection = true;

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    leavePage = event.leavePage.id;
    if (event.enterPage.id === 'livestock_add') {

        // create element before use --> to update list in elemnt dynamically
        ons.createElement("locationAdd.html", {
            append: true
        });

        //set last selected place for livestock
        document.getElementById("livestockPlace").value = localStorage.getItem("livestockPlace")

        //if networkconnection is valid update view from Server
        //else use local database
        if (networkConnection == true) {
            // RESTGetLocation()
            getLocationDB()
        } else {
            // getLocationDB()
        }
    }
});

document.addEventListener("init", function (event) {
    var page = event.target;
    if (page.id === 'livestock_add') {
        BornOn.max = new Date().toISOString().split("T")[0];
        switchState = localStorage.getItem("settings_request")
        ipAdress = localStorage.getItem("settings_ipAdress")
        //calc window size and adapte SVG Object
        var w = window.innerWidth;
        var h = window.innerHeight;
        var OffsestWidthX = (w - 250 - 50) / 2
        //set Object width depending on Display width
        document.getElementById("SvgObj").setAttribute("width", w - 30);
        document.getElementById("rect1").setAttribute("x", OffsestWidthX);
        document.getElementById("circle1").setAttribute("cx", OffsestWidthX + 130);
        document.getElementById("circle2").setAttribute("cx", OffsestWidthX + 130);
        document.getElementById("rect2").setAttribute("x", OffsestWidthX + 61);
        document.getElementById("CodeDigit0Obj").setAttribute("x", OffsestWidthX + 40);
        document.getElementById("CodeDigit1Obj").setAttribute("x", OffsestWidthX + 85);
        document.getElementById("CodeDigit2Obj").setAttribute("x", OffsestWidthX + 130);
        document.getElementById("CodeDigit3Obj").setAttribute("x", OffsestWidthX + 175);
        document.getElementById("Svgtext1").setAttribute("x", OffsestWidthX + 40);
        document.getElementById("Svgtext2").setAttribute("x", OffsestWidthX + 190);
        document.getElementById("Svgtext3").setAttribute("x", OffsestWidthX + 70);
        if (localStorage.getItem("ChooseSelPlaceStorage") !== null) {
            document.getElementById("ChooseSelPlace").value = localStorage.getItem("ChooseSelPlaceStorage");
        }
        if (localStorage.getItem("MarkColor") !== null) {
            document.getElementById("Color").style.backgroundColor = localStorage.getItem("MarkColor");
            document.getElementById("rect1").style.fill = localStorage.getItem("MarkColor");
            document.getElementById("rect2").style.fill = localStorage.getItem("MarkColor");
            document.getElementById("circle1").style.fill = localStorage.getItem("MarkColor");
        }
        let today = new Date().toISOString().substr(0, 10);
        document.querySelector("#BornOn").value = today;
        //select between inputs
        $("#CodeDigit0").keyup(function () {
            if (document.getElementById("CodeDigit0").value != '') {
                if (document.getElementById("CodeDigit1").value == '') {
                    document.getElementById("CodeDigit1").focus();
                } else {
                    document.getElementById("CodeDigit0").blur();
                }
            }
        });
        $("#CodeDigit1").keyup(function () {
            if (document.getElementById("CodeDigit1").value != '') {
                if (document.getElementById("CodeDigit2").value == '') {
                    document.getElementById("CodeDigit2").focus();
                } else {
                    document.getElementById("CodeDigit1").blur();
                }
            }
        });
        $("#CodeDigit2").keyup(function () {
            if (document.getElementById("CodeDigit2").value != '') {
                if (document.getElementById("CodeDigit3").value == '') {
                    document.getElementById("CodeDigit3").focus();
                } else {
                    document.getElementById("CodeDigit2").blur();
                }
            }
        });
        $("#CodeDigit3").keyup(function () {
            if (document.getElementById("CodeDigit3").value != '') {
                document.getElementById("CodeDigit3").blur();
            }
        });
    }
});

var showTemplateDialogAdd = function (my_dialog, my_dialog_html) {

    var dialog = document.getElementById(my_dialog);
    console.log(dialog)
    if (dialog) {
        dialog.show();
    } else {
        ons.createElement(my_dialog_html, {
                append: true
            })
            .then(function (dialog) {
                dialog.show();
            });
    }
};

var showInfo = function (code) {
    if (code == "countryCode") {
        ons.notification.alert({
            message: 'Ländercode: AT steht für Österrreich',
            title: 'Ohrmarken Info',
        });
    } else if (code == "stateCode") {
        ons.notification.alert({
            message: 'Bundeslandcode: 3 steht für Oberösterreich',
            title: 'Ohrmarken Info',
        });
    } else if (code == "LFBISCode") {
        ons.notification.alert({
            message: 'LFBIS Nummer deines Betriebs',
            title: 'Ohrmarken Info',
        });
    }
};

//select color
var hideDialogColorAdd = function (id, checkbox, color) {
    document.getElementById("checkColor-1").checked = false;
    document.getElementById("checkColor-2").checked = false;
    document.getElementById("checkColor-3").checked = false;
    document.getElementById("checkColor-4").checked = false;
    document.getElementById("checkColor-5").checked = false;
    document.getElementById("checkColor-6").checked = false;
    document.getElementById(checkbox).checked = true;
    document.getElementById("Color").style.backgroundColor = color;
    document.getElementById("rect1").style.fill = color;
    document.getElementById("rect2").style.fill = color;
    document.getElementById("circle1").style.fill = color;
    localStorage.setItem("MarkColor", color);
    document.getElementById(id).hide();
};

//update livestock location list
function updateLivestockLocations(livestockLocationList, listLength) {
    //remove current items in view
    var list = document.getElementById("containerLivestockAdd");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    for (i = 0; i < listLength; i++) {
        var location = livestockLocationList[i].location
        list = document.createElement("ons-list-item")
        list.setAttribute("onchange", "hideDialogLocationAdd('" + location + "')");
        //label left
        label_left = document.createElement("label")
        label_left.setAttribute("class", "left");
        checkbox = document.createElement("ons-checkbox")
        checkbox.setAttribute("input-id", "checkbox" + location);
        label_left.appendChild(checkbox);
        //label center
        label_center = document.createElement("label")
        label_center.setAttribute("class", "center");
        label_center.innerHTML = location;
        //label right
        label_right = document.createElement("label")
        label_right.setAttribute("class", "right");
        trash = document.createElement("ons-icon")
        trash.setAttribute("icon", "fa-trash");
        trash.setAttribute("style", "color: #802000; display: none");
        trash.setAttribute("id", "livestockPlaceTrashIcon" + i);
        trash.setAttribute("onclick", "deleteDBLocation('" + location + "')");
        label_right.appendChild(trash);
        //append labels to list
        list.appendChild(label_left);
        list.appendChild(label_center);
        list.appendChild(label_right);
        document.getElementById("containerLivestockAdd").appendChild(list);
    }
}

//toggle livestock place trash icon
function showDeletePlaceIcon() {
    list = document.getElementById("containerLivestockAdd")
    for (i = 0; i < list.childElementCount; i++) {
        var icon = document.getElementById("livestockPlaceTrashIcon" + i);
        if (window.getComputedStyle(icon).display === "none") {
            icon.style.display = "block";
        } else {
            icon.style.display = "none";
        }
    }
}

//show prompt to enter new livestock place
var showPrompt = function () {
    ons.notification.prompt({
            title: '',
            message: 'neuen Standort anlegen',
            cancelable: true,
        })
        .then(function (input) {
            var input = input.trim()
            var message = input ? 'Neuer Standort: ' + input : 'Du hast keinen Standort eingegeben';
            ons.notification.confirm({
                title: '',
                message: message,
                cancelable: true,
                buttonLabels: ['OK'],
                callback: function (index) {
                    if (index == 0) {
                        if (input !== "") {
                            write2DBLocation("", input)
                        }
                    }
                }
            })
        });
};

//select color
var hideDialogLocationAdd = function (location) {
    list = document.getElementById("containerLivestockAdd")
    console.log(list.childElementCount)
    var elements = [];
    //first get all items
    for (var i = 1; i <= list.childElementCount; i++) {
        var text = document.querySelector("#containerLivestockAdd > ons-list-item:nth-child(" + i + ") > label.center.list-item__center")
        elements.push(text.innerHTML)
        console.log(text.innerHTML)
    }
    //uncheck all checkboxes and check selected checkbox
    for (i = 0; i < elements.length; i++) {
        if (elements[i] != location) {
            document.getElementById("checkbox" + elements[i]).checked = false;
        } else {
            document.getElementById("checkbox" + elements[i]).checked = true;
        }
    }
    localStorage.setItem("livestockPlace", location);
    document.getElementById("livestockPlace").value = location;
    document.getElementById("locationAdd").hide();
};


function checkInputs() {
    let today = new Date().toISOString().substr(0, 10);
    var actualDate = today;
    var CodeDigit0 = document.getElementById("CodeDigit0").value;
    var CodeDigit1 = document.getElementById("CodeDigit1").value;
    var CodeDigit2 = document.getElementById("CodeDigit2").value;
    var CodeDigit3 = document.getElementById("CodeDigit3").value;
    place = document.getElementById("ChooseSelPlace").value;
    color = document.getElementById("Color").style.backgroundColor;
    born = document.getElementById("BornOn").value;
    localStorage.setItem("ChooseSelPlaceStorage", place);
    number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
    if (number.length == 4) {
        checkLivestockDB(born, color, number, place, actualDate, email)
    } else {
        ons.notification.alert({
            message: 'Die Nummer muss aus 4 Ziffern bestehen',
            title: 'Ohrmarkennummer Fehler',
        });
    }
}

function checkLivestockDB(born, color, number, place, actualDate, email) {
    db.transaction(function (transaction) {
        transaction.executeSql(
            'SELECT * FROM livestock WHERE color = ? AND number = ?', [color, number],
            function (tx, results) {
                if (results.rows.length == 0) {
                    if (switchState == 'true') {
                        RESTAddLivestock(born, color, number, place, actualDate, email)
                    } else {
                        write2DBLivestock(born, color, number, place, actualDate, email)
                    }
                } else {
                    ons.notification.alert({
                        message: 'Nutztier ist bereits in der Datenbank hinterlegt',
                        title: 'Nutztier vorhanden',
                    });
                }
            }, null);
    });
}