var email = "";
var token = "";
var drug = "";
var delay = "";
var amount = "";
var timestamp = "";
var approval_number = "";
var switchState = "";
var ipAdress = "";
var LiveStockNbr = "AT-3-4321056-";
var createdOn = "";
var drugResultsRowslLength = 0;
var livestockResultsRowslLength = 0;
var arrColor = [];
var arrID = [];
var arrDrugNumber = [];
var arrDrugDelay = [];
var arrDrugAmount = [];
var pageSelector = "";


function getDrugDeliveryView() {
    document.getElementById("removeLivestocks").style.visibility = "hidden";
    document.getElementById("removeDrugs").style.visibility = "hidden";
    if (localStorage.getItem("lastDiagnosis") === null){
        document.getElementById("diagnosisContainer").innerHTML = 'Keine Diagnose ausgewählt'
    } else {
        document.getElementById("diagnosisContainer").innerHTML = localStorage.getItem("lastDiagnosis");
    }

    CreatedOn.max = new Date().toISOString().split("T")[0];
    let today = new Date().toISOString().substr(0, 10);
    document.querySelector("#CreatedOn").value = today;

    DisplayLivestocks()
}

function DisplayLivestocks() {

    //remove childs from container
    var list = document.getElementById("livestockContainer");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }

    if (taggedLivestock.length > 0) {
        for (i = 0; i < LivestockListLength; i++) {
            if (taggedLivestock.includes(LivestockList[i].id) === true) {
                //remove onlick attribute
                document.getElementById("livestockContainer").removeAttribute("onclick");
                list = document.createElement("ons-list-item")
                list.setAttribute("onclick", "removeListItemLivestock(" + LivestockList[i].id + ")");
                //create text center
                div_center = document.createElement("div")
                div_center.setAttribute("id", LivestockList[i].id);
                div_center.setAttribute("class", "center");
                div_center.setAttribute("style", "margin-left: 10px");
                //create icon right
                div_right = document.createElement("div")
                div_right.setAttribute("class", "right");
                icon_right = document.createElement("ons-icon")
                icon_right.setAttribute("icon", "fa-trash");
                icon_right.setAttribute("style", "color: red");
                icon_right.setAttribute("size", "20px");
                icon_right.setAttribute("onclick", "removeListItemLivestock(" + LivestockList[i].id + ")");
                //add text center
                span_center1 = document.createElement("span")
                span_center1.setAttribute("id", "livestockIDDrug" + LivestockList[i].id);
                span_center2 = document.createElement("span")
                span_center1.setAttribute("class", "list-item__title");
                span_center2.setAttribute("class", "list-item__subtitle");
                span_center1.innerHTML = LiveStockNbr + LivestockList[i].number;
                span_center2.innerHTML = LivestockList[i].animalLocationName + "<br>" + LivestockList[i].birthday.substring(0, 10);
                div_left = document.createElement("div")
                div_left.setAttribute("class", "left");
                //create color mark right
                input = document.createElement("input")
                input.setAttribute("id", "livestockColorDrug" + LivestockList[i].id);
                input.setAttribute("style",
                    "width: 40px; height :40px;margin-right: 5px;border-color : black; border: 2px solid black; border-radius: 10px; background-color:" + LivestockList[i].color);
                input.setAttribute("size", "3");
                input.setAttribute("disabled", "true");
                list.setAttribute("tappable", true);
                //append childs
                div_left.appendChild(input);
                div_right.appendChild(icon_right);
                list.appendChild(div_left);
                list.appendChild(div_right);
                div_center.appendChild(span_center1);
                div_center.appendChild(span_center2);
                list.appendChild(div_center);
                document.getElementById("livestockContainer").appendChild(list);
                document.getElementById("removeLivestocks").style.visibility = "visible";
                document.getElementById("removeLivestocks").disabled = false;
                // document.getElementById("livestockDrugDeliveryText").innerHTML = "Ausgewählte Nutztiere";
            }
        }
    } else {
        document.getElementById("livestockContainer").setAttribute("onclick", "nav1.pushPage('livestock_selector.html')");
        document.getElementById("livestockContainer").innerHTML = "Kein Nutztier ausgewählt";
        document.getElementById("removeLivestocks").style.visibility = "hidden";
        document.getElementById("removeLivestocks").disabled = true;
    }
    DisplayDrugs()
}

function DisplayDrugs() {

    //remove childs from container
    var list = document.getElementById("drugContainer");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }

    if (taggedDrugs.length > 0) {
        for (i = 0; i < DrugNbrs; i++) {
            if (taggedDrugs.includes(Drugs[i].id) === true) {
                //remove onlick attribute
                document.getElementById("drugContainer").removeAttribute("onclick");
                list = document.createElement("ons-list-item")
                listInput = document.createElement("ons-list-item")
                list.setAttribute("onclick", "removeListItemDrug(" + Drugs[i].id + ")");
                //create text center
                div_center = document.createElement("div")
                div_center.setAttribute("id", Drugs[i].id);
                div_center.setAttribute("class", "center");
                div_center.setAttribute("style", "margin-left: 10px");
                //create text center Input
                div_centerInput = document.createElement("div")
                div_centerInput.setAttribute("id", Drugs[i].id);
                div_centerInput.setAttribute("class", "center");
                div_centerInput.setAttribute("style", "margin-left: 10px");
                //create Input right
                div_rightInput = document.createElement("div")
                div_rightInput.setAttribute("class", "right");
                in_rightInput = document.createElement("input")
                in_rightInput.setAttribute("type", "number");
                in_rightInput.setAttribute("id", "drugAmountInputID" + Drugs[i].id);
                in_rightInput.setAttribute("style", "text-align: right; margin-right: 10px; margin-left: 25px;");
                p_rightInput = document.createElement("div")
                p_rightInput.innerHTML = "???";
                //create icon right
                div_right = document.createElement("div")
                div_right.setAttribute("class", "right");
                icon_right = document.createElement("ons-icon")
                icon_right.setAttribute("icon", "fa-trash");
                icon_right.setAttribute("style", "color: red");
                icon_right.setAttribute("size", "20px");
                icon_right.setAttribute("onclick", "removeListItemDrug(" + Drugs[i].id + ")");
                //add text center
                span_center1 = document.createElement("span")
                span_center1.setAttribute("id", "drugID" + Drugs[i].id);
                span_center2 = document.createElement("span")
                span_center1.setAttribute("class", "list-item__title");
                span_center2.setAttribute("class", "list-item__subtitle");
                span_center1.innerHTML = Drugs[i].name;
                span_center2.innerHTML = Drugs[i].drugCategoryName + "<br>" + "Zul-Nr.: " +
                    Drugs[i].approvalNumber + "<br>" + "Wartezeit: " + "!3!" + " Tag(e)";
                list.setAttribute("tappable", true);
                //add text center Input
                span_center1Input = document.createElement("span")
                span_center1Input.setAttribute("class", "list-item__title");
                span_center1Input.innerHTML = 'Abgabemenge';
                //append childs
                div_right.appendChild(icon_right);
                list.appendChild(div_right);
                div_center.appendChild(span_center1);
                div_center.appendChild(span_center2);
                list.appendChild(div_center);
                div_centerInput.appendChild(span_center1Input);
                div_rightInput.appendChild(in_rightInput);
                div_rightInput.appendChild(p_rightInput);
                listInput.appendChild(div_rightInput);
                listInput.appendChild(div_centerInput);
                document.getElementById("drugContainer").appendChild(list);
                document.getElementById("drugContainer").appendChild(listInput);
                document.getElementById("removeDrugs").style.visibility = "visible";
                document.getElementById("removeDrugs").disabled = false;
            }
        }
    } else {
        document.getElementById("drugContainer").setAttribute("onclick", "nav1.pushPage('drug.html')");
        document.getElementById("drugContainer").innerHTML = "Kein Arzneimittel ausgewählt"
        document.getElementById("removeDrugs").style.visibility = "hidden";
        document.getElementById("removeDrugs").disabled = true;
    }
}

function removeListItemDrug(id) {
    ons.notification.confirm({
        message: 'Möchtest du das Arzneimittel aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Arzneimittel entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                taggedDrugs.splice( taggedDrugs.indexOf(id), 1 );
                getDrugDeliveryView()
            }
        }
    });
}

function removeListItemLivestock(id) {
    ons.notification.confirm({
        message: 'Möchtest du das Nutztier aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Nutztier entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                taggedLivestock.splice( taggedLivestock.indexOf(id), 1 );
                DisplayLivestocks()
            }
        }
    });
}

function removeTagLivestock() {
    ons.notification.confirm({
        message: 'Möchtest du alle Nutztier aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Nutztier entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                //delete array
                taggedLivestock = [];
                DisplayLivestocks()
            }
        }
    });
}

function removeTagDrugs() {
    ons.notification.confirm({
        message: 'Möchtest du alle Arzneimittel aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Arzneimittel entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                //delete array
                taggedDrugs = [];
                getDrugDeliveryView()
            }
        }
    });
}

function DoneButton() {
    createdOn = document.querySelector("#CreatedOn").value
    /*check livestock nummber and color*/
    if (livestockResultsRowslLength > 0) {
        /*check drug field and if drug exists*/
        if (drugResultsRowslLength > 0) {
            /*check amount field*/
            var fields = checkAmoutInputFields();
            console.log(fields)
            if (fields == true) {
                userTakeOverDrugs();
            } else {
                ons.notification.alert({
                    message: 'Bitte die Abgabemenge eingeben',
                    title: 'Abgabemenge überprüfen',
                });
            }
        } else {
            ons.notification.alert({
                message: 'Bitte vergib ein Arzneimittel',
                title: 'Arzneimittel vergeben',
            });
        }
    } else {
        ons.notification.alert({
            message: 'Bitte wähle ein Nutztier aus deiner Datenbank aus',
            title: 'Nutztier auswählen',
        });
    }
}

function userTakeOverDrugs() {
    ons.notification.confirm({
        message: 'Arzneimittelabgabe übernehmen',
        title: 'Arzneimittelabgabe',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "UPDATE drugs SET tagged=?", ['false']);
                tx.executeSql(
                    "UPDATE livestock SET tagged=?", ['false']);
            }, function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            }, function () {
                if (switchState == 'true') {
                    requestData()
                } else {
                    write2DBDrugDelivery();
                }
            });
        }
    });
}

//update livestock location list
function updateDiagnosis() {
    var lastDiagnosis = localStorage.getItem("lastDiagnosis");
    list = document.getElementById("containerDiagnosis")
    //remove current items in view
    if (list) {
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
    }

    for (i = 0; i < DiagnosisNbrs; i++) {
        var diagnosis = Diagnosis[i].name

        list = document.createElement("ons-list-item")
        list.setAttribute("onchange", "hideDialogDiagnosis('" + diagnosis + "')");
        list.setAttribute("tappable");
        //label left
        label_left = document.createElement("label")
        label_left.setAttribute("class", "left");
        checkbox = document.createElement("ons-checkbox")
        checkbox.setAttribute("input-id", "checkbox" + diagnosis);
        //check checkbox if last diagnosis = current diagnosis
        if (lastDiagnosis == diagnosis) {
            checkbox.setAttribute("checked");
        }
        label_left.appendChild(checkbox);
        //label center
        label_center = document.createElement("label")
        label_center.setAttribute("class", "center");
        label_center.innerHTML = diagnosis;
        label_center.setAttribute("onclick", "hideDialogDiagnosis('" + diagnosis + "')");
        //append labels to list
        list.appendChild(label_left);
        list.appendChild(label_center);
        document.getElementById("containerDiagnosis").appendChild(list);
    }
}

//select location
var hideDialogDiagnosis = function (diagnosis) {
    list = document.getElementById("containerDiagnosis")
    console.log(list.childElementCount)
    var elements = [];
    //first get all place items
    for (var i = 1; i <= list.childElementCount; i++) {
        var text = document.querySelector("#containerDiagnosis > ons-list-item:nth-child(" + i + ") > label.center.list-item__center")
        elements.push(text.innerHTML)
    }
    //uncheck all checkboxes and check selected checkbox
    for (i = 0; i < elements.length; i++) {
        if (elements[i] != diagnosis) {
            document.getElementById("checkbox" + elements[i]).checked = false;
        } else {
            document.getElementById("checkbox" + elements[i]).checked = true;
        }
    }
    localStorage.setItem("lastDiagnosis", diagnosis);
    document.getElementById("diagnosisContainer").innerHTML = diagnosis;
    document.getElementById("drugDeliveryTemplate").hide();
};

//open Templates for current page
var showTemplateDiagnosis = function (my_dialog, my_dialog_html) {

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

function checkAmoutInputFields() {
    arrDrugAmount = []
    for (var i = 0; i < drugResultsRowslLength; i++) {
        var userAmountInput = document.getElementById("drugAmountInputID" + i).value;
        arrDrugAmount.push(userAmountInput);
        if (userAmountInput == "") {
            return false;
        }
    }
    return true;
}