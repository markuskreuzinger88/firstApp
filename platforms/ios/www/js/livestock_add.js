db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
var number = "";
var email = "";
var bearerToken = "";
var selectedLocationGroup = "dummy"
var place = "";
var createdOn = "";

var networkConnection = false;

// Create livestock object to check if changes occures by clicking backbuton
var livestockObj = {
    color: "",
    place: "",
    born: "",
    number: "",
};

function updateLivestockAddView() {

    // //create livestock location view
    // ons.createElement("locationAdd.html", {
    //     append: true
    // });

    //set the last selected place for livestock
    if ("livestockPlaceAdd" in localStorage) {
        document.getElementById("livestockPlaceAdd").innerHTML = localStorage.getItem("livestockPlaceAdd")
        livestockObj.place = localStorage.getItem("livestockPlaceAdd")
    } else {
        document.getElementById("livestockPlaceAdd").innerHTML = "Bitte wählen"
        livestockObj.place = "Bitte wählen"
    }

    //set color of livestock mark and color selector
    if ("MarkColor" in localStorage) {
        document.getElementById("rect1").style.fill = localStorage.getItem("MarkColor");
        document.getElementById("rect2").style.fill = localStorage.getItem("MarkColor");
        document.getElementById("circle1").style.fill = localStorage.getItem("MarkColor");
    } else {
        document.getElementById("rect1").style.fill = "#ffff00";
        document.getElementById("rect2").style.fill = "#ffff00";
        document.getElementById("circle1").style.fill = "#ffff00";
    }
    //set color of livestock Text Field
    if ("MarkColorText" in localStorage) {
        document.getElementById("livestockColorAdd").innerHTML = localStorage.getItem("MarkColorText");
        livestockObj.color = localStorage.getItem("MarkColorText")
    } else {
        document.getElementById("livestockColorAdd").innerHTML = "Gelb";
        livestockObj.color = "Gelb"
    }

    //set  cuurent view livestock number
    var CodeDigit0 = document.getElementById("CodeDigit0").value;
    var CodeDigit1 = document.getElementById("CodeDigit1").value;
    var CodeDigit2 = document.getElementById("CodeDigit2").value;
    var CodeDigit3 = document.getElementById("CodeDigit3").value;
    var number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
    livestockObj.number = number

    //get max date
    BornOn.max = new Date().toISOString().split("T")[0];
    console.log(BornOn.max)

    //calc window size of current device and adapte SVG Object
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
    let today = new Date().toISOString().substr(0, 10);
    document.querySelector("#BornOn").value = today;
    livestockObj.born = today

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

//only for Inormation
//MAYBE DELETE????
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

//open Teplates for current page
var showTemplateDialogAdd = function (my_dialog, my_dialog_html) {

    var dialog = document.getElementById(my_dialog);

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

//select color
var hideDialogColorAdd = function (color, colorText) {
    //get index and color from parameter
    var res = color.split("+");
    var setIndex = res[0]
    var setColor = res[1]
    list = document.querySelector("#colorAdd > div.dialog > div > ons-list")
    //set selected checbox and unset all other checkboxes
    for (var i = 1; i <= list.childElementCount; i++) {
        var checkboxID = "checkbox-" + i
        if (setIndex == i) {
            document.getElementById(checkboxID).checked = true;
            localStorage.setItem("livestockColorCheckbox", checkboxID);
        } else {
            document.getElementById(checkboxID).checked = false;
        }
    }
    // localStorage.setItem("livestockColor", setColor);
    document.getElementById("rect1").style.fill = setColor;
    document.getElementById("rect2").style.fill = setColor;
    document.getElementById("circle1").style.fill = setColor;
    document.getElementById("livestockColorAdd").innerHTML = colorText;
    localStorage.setItem("MarkColor", setColor);
    localStorage.setItem("MarkColorText", colorText);
    document.getElementById("colorAdd").hide();
};

//update livestock location list
function updateLivestockLocations() {
    var lastSelectedPlace = localStorage.getItem("livestockPlaceAdd");
    document.getElementById("locationButton1").style.visibility = "visible";
    document.getElementById("locationButton2").style.visibility = "visible";
    document.getElementById("locationButton1").disabled = false;
    document.getElementById("locationButton2").disabled = false;

    list = document.getElementById("containerLivestockAdd")
    //remove current items in view
    if (list) {
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
    }

    for (i = 0; i < LivestockLocationNbrs; i++) {
        var location = LivestockPlaces[i].name

        list = document.createElement("ons-list-item")
        list.setAttribute("onchange", "hideDialogLocationAdd('" + location + "')");
        list.setAttribute("tappable");
        //label left
        label_left = document.createElement("label")
        label_left.setAttribute("class", "left");
        checkbox = document.createElement("ons-checkbox")
        checkbox.setAttribute("input-id", "checkbox" + location);
        //check checkbox if last selected place = current list place 
        if (lastSelectedPlace == location) {
            checkbox.setAttribute("checked");
        }
        label_left.appendChild(checkbox);
        //label center
        label_center = document.createElement("label")
        label_center.setAttribute("class", "center");
        label_center.innerHTML = location;
        label_center.setAttribute("onclick", "hideDialogLocationAdd('" + location + "')");
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
    // updateLivestockLocations(LivestockPlaces, LivestockLocationNbrs)
    ons.notification.prompt({
            title: '',
            message: 'neuen Standort anlegen',
            cancelable: true,
        })
        .then(function (input) {
            var input = input.trim()
            var message = input ? 'Neuer Standort: ' + '<b>' + input + '</b>' : 'Du hast keinen Standort eingegeben';
            ons.notification.confirm({
                title: '',
                message: message,
                cancelable: true,
                buttonLabels: ['OK'],
                callback: function (index) {
                    if (index == 0) {
                        if (input !== "") {
                            RESTSaveLocation(input)
                        }
                    }
                }
            })
        });
};

//select location
var hideDialogLocationAdd = function (location) {
    list = document.getElementById("containerLivestockAdd")
    console.log(list.childElementCount)
    var elements = [];
    //first get all place items
    for (var i = 1; i <= list.childElementCount; i++) {
        var text = document.querySelector("#containerLivestockAdd > ons-list-item:nth-child(" + i + ") > label.center.list-item__center")
        elements.push(text.innerHTML)
    }
    //uncheck all checkboxes and check selected checkbox
    for (i = 0; i < elements.length; i++) {
        if (elements[i] != location) {
            document.getElementById("checkbox" + elements[i]).checked = false;
        } else {
            document.getElementById("checkbox" + elements[i]).checked = true;
        }
    }
    if (eventEnterPageId == "livestock_selector") {
        //get selected location
        //get all livestocks ID with this location
        //save livestok ID in global array for drug delivery
        selectedLocationGroup = location;
        for (i = 0; i < LivestockListLength; i++) {
            if (location.includes(LivestockList[i].animalLocationName) === true) {
                alert(LivestockList[i].id)
                //add item to array
                if (taggedLivestock.includes(LivestockList[i].id) === false) {
                    taggedLivestock.push(LivestockList[i].id);
                }
            }
        }
    } else {
        localStorage.setItem("livestockPlaceAdd", location);
        document.getElementById("livestockPlaceAdd").innerHTML = location;
    }
    document.getElementById("locationAdd").hide(); 
};

function checkInputs() {
    let today = new Date().toISOString().substr(0, 10);
    var actualDate = today;
    var CodeDigit0 = document.getElementById("CodeDigit0").value;
    var CodeDigit1 = document.getElementById("CodeDigit1").value;
    var CodeDigit2 = document.getElementById("CodeDigit2").value;
    var CodeDigit3 = document.getElementById("CodeDigit3").value;
    var place = document.getElementById("livestockPlaceAdd").innerHTML;
    var color = fullColorHex(document.getElementById("rect1").style.fill);
    born = document.getElementById("BornOn").value;
    // localStorage.setItem("ChooseSelPlaceStorage", place);
    number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
    //generate guid for livestock
    guid = create_UUID();
    //get animal location ID
    for (i = 0; i < LivestockLocationNbrs; i++) {
        if (place == LivestockPlaces[i].name) {
            AnimalLocationId = LivestockPlaces[i].id
        }
    }
    if ((number.length == 4) && (place != "Bitte wählen")) {
        RESTAddLivestock(born, color, number, AnimalLocationId)
    } else if (number.length != 4) {
        ons.notification.alert({
            message: 'Die Nummer muss aus 4 Ziffern bestehen',
            title: 'Ohrmarkennummer Fehler',
        });
    } else if (place == "Bitte wählen") {
        ons.notification.alert({
            message: 'Bitte wählen Sie einen Standort aus',
            title: 'Standort Fehler',
        });
    }
}

//split rgb string
var fullColorHex = function (rgb) {
    var rgb = rgb.replace("rgb(", "");
    var rgb = rgb.replace(")", "");
    var rgb = rgb.split(",");
    var red = rgbToHex(rgb[0]);
    var green = rgbToHex(rgb[1]);
    var blue = rgbToHex(rgb[2]);
    return red + green + blue;
};

//red, green, blue from rgb to hex
var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};


function checkInputsUnsaved() {
    //set  cuurent view livestock number
    var CodeDigit0 = document.getElementById("CodeDigit0").value;
    var CodeDigit1 = document.getElementById("CodeDigit1").value;
    var CodeDigit2 = document.getElementById("CodeDigit2").value;
    var CodeDigit3 = document.getElementById("CodeDigit3").value;
    var number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3

    var color = document.getElementById("livestockColorAdd").innerHTML;
    var place = document.getElementById("livestockPlaceAdd").innerHTML;
    var birthay = document.getElementById("BornOn").value;

    if ((number !== livestockObj.number) || (color !== livestockObj.color) || (place !== livestockObj.place) || (birthay !== livestockObj.born)) {
        ons.notification.confirm({
            message: 'Das Profil hat ungespeicherte Änderungen. Bist du sicher, dass du das Profil verlassen möchtest?',
            title: 'Ungespeicherte Änderungen',
            buttonLabels: ['Ja', 'Nein'],
            animation: 'default',
            primaryButtonIndex: 1,
            cancelable: true,
            callback: function (index) {
                if (index == 0) {
                    document.querySelector('#nav1').popPage();
                }
            }
        });
    } else {
        document.querySelector('#nav1').popPage();
    }
}

//create livestock guid
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// function checkLivestockDB(born, color, number, place, actualDate, email, guid) {
//     var id = '-1'
//     db.transaction(function (transaction) {
//         transaction.executeSql(
//             'SELECT * FROM livestock WHERE color = ? AND number = ?', [color, number],
//             function (tx, results) {
//                 if (results.rows.length == 0) {
//                     writeLivestockDatabaseAndServer(id, born, color, number, place, actualDate, "dummy@dummy.at", "no_tag", guid)
//                 } else {
//                     ons.notification.alert({
//                         message: 'Nutztier ist bereits in der Datenbank hinterlegt',
//                         title: 'Nutztier vorhanden',
//                     });
//                 }
//                 document.querySelector('#nav1').popPage();
//             }, null);
//     });
// }