db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
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

    CreatedOn.max = new Date().toISOString().split("T")[0];
    let today = new Date().toISOString().substr(0, 10);
    document.querySelector("#CreatedOn").value = today;

    //remove childs from both containers
    var list = document.getElementById("livestockContainer");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    var list = document.getElementById("drugContainer");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }

    DisplayTaggedDrug()
}

//get all livestocks and drugs which are tagged for drug delivery
// function GetDBTaggedResult() {
//     //check if element cointainer has onlick element for switch page to drug page
//     //remove attribute becuase otherwise we swicht page if we want to set drug amount
//     var checkAttr = document.getElementById("drugContainer").hasAttribute("onclick"); 
//     if (checkAttr){
//         $( "#drugContainer" ).removeAttr("onclick");
//     }
//     var checkAttr = document.getElementById("drugDeliveryContainer").hasAttribute("onclick"); 
//     if (checkAttr){
//         $( "#drugDeliveryContainer" ).removeAttr("onclick");
//     }
//     //remove childs from both containers
//     var list = document.getElementById("drugDeliveryContainer");
//     while (list.hasChildNodes()) {
//         list.removeChild(list.firstChild);
//     }
//     var list = document.getElementById("drugContainer");
//     while (list.hasChildNodes()) {
//         list.removeChild(list.firstChild);
//     }
//     //read out Database
//     db.transaction(function (transaction) {
//         transaction.executeSql(
//             'SELECT * FROM livestock WHERE tagged = ? ORDER BY number ASC', ['true'],
//             function (tx, results) {
//                 DisplayResultDrugDelivery(results)
//             }, null);
//     });
//     db.transaction(function (transaction) {
//         transaction.executeSql(
//             'SELECT * FROM drugs WHERE tagged = ? ORDER BY Number DESC', ['true'],
//             function (tx, results) {
//                 DisplayTaggedDrug(results)
//             }, null);
//     });
// }

function DisplayResultDrugDelivery(results) {
    arrID = [];
    livestockResultsRowslLength = results.rows.length;
    if (results.rows.length > 0) {
        for (i = 0; i < results.rows.length; i++) {
            list = document.createElement("ons-list-item")
            list.setAttribute("onclick", "removeListItemLivestock(" + i + ")");
            //create text center
            div_center = document.createElement("div")
            div_center.setAttribute("id", i);
            div_center.setAttribute("class", "center");
            div_center.setAttribute("style", "margin-left: 10px");
            //create icon right
            div_right = document.createElement("div")
            div_right.setAttribute("class", "right");
            icon_right = document.createElement("ons-icon")
            icon_right.setAttribute("icon", "fa-trash");
            icon_right.setAttribute("style", "color: red");
            icon_right.setAttribute("size", "20px");
            icon_right.setAttribute("onclick", "removeListItemLivestock(" + i + ")");
            //add text center
            span_center1 = document.createElement("span")
            span_center1.setAttribute("id", "livestockIDDrug" + i);
            span_center2 = document.createElement("span")
            span_center1.setAttribute("class", "list-item__title");
            span_center2.setAttribute("class", "list-item__subtitle");
            span_center1.innerHTML = LiveStockNbr + results.rows.item(i).number;
            span_center2.innerHTML = results.rows.item(i).place + "<br>" +
                "Gruppe " + results.rows.item(i).livestock_group + "<br>" + results.rows.item(i).born;
            div_left = document.createElement("div")
            div_left.setAttribute("class", "left");
            //create color mark right
            input = document.createElement("input")
            input.setAttribute("id", "livestockColorDrug" + i);
            input.setAttribute("style",
                "width: 40px; height :40px;margin-right: 5px;border-color : black; border: 2px solid black; border-radius: 10px; background-color:" + results.rows
                .item(i).color);
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
            document.getElementById("drugDeliveryContainer").appendChild(list);
            arrID.push(results.rows.item(i).id);
            document.getElementById("removeLivestocks").style.visibility = "visible";
            document.getElementById("removeLivestocks").disabled = false;
            document.getElementById("livestockDrugDeliveryText").innerHTML = "Ausgewählte Nutztiere";
        }
    } else {
        list = document.createElement("ons-list-item")
        div = document.createElement("div")
        div.innerHTML = "Kein Nutztier ausgewählt"
        div.setAttribute("id", "livestockEmpty");
        list.appendChild(div);
        document.getElementById("drugDeliveryContainer").appendChild(list);
        document.getElementById("drugDeliveryContainer").setAttribute("onclick", "onclick=nav1.pushPage('livestock_selector.html')");
        document.getElementById("livestockDrugDeliveryText").innerHTML = "Nutztier auswählen";
        document.getElementById("removeLivestocks").style.visibility = "hidden";
        document.getElementById("removeLivestocks").disabled = true;
    }
}

function DisplayTaggedDrug() {
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
        document.getElementById("drugContainer").innerHTML = "Arzneimittel auswählen"
        document.getElementById("removeDrugs").style.visibility = "hidden";
        document.getElementById("removeDrugs").disabled = true;
    }
}

function removeListItemDrug(id) {
    alert(id)
    alert(taggedDrugs)
    ons.notification.confirm({
        message: 'Möchtest du das Arzneimittel aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Arzneimittel entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                taggedDrugs = taggedDrugs.filter(function (item) {
                    return item !== id
                })
                getDrugDeliveryView()
            }
        }
    });
}

function removeListItemLivestock(id) {
    var color = document.getElementById("livestockColorDrug" + id).style.backgroundColor;
    var number = document.getElementById("livestockIDDrug" + id).innerHTML;
    //only use livestock 4 digit number
    number = number.slice(number.length - 4, number.length);
    ons.notification.confirm({
        message: 'Möchtest du das Nutztier aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Nutztier entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                db.transaction(function (tx) {
                    tx.executeSql(
                        "UPDATE livestock SET tagged=? where Color = ? AND Number = ?",
                        ['false', color, number]);
                }, function (error) {
                    alert('Error: ' + error.message + ' code: ' + error.code);
                }, function () {
                    GetDBTaggedResult()
                });
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
                db.transaction(function (tx) {
                    tx.executeSql(
                        "UPDATE livestock SET tagged=?",
                        ['false']);
                }, function (error) {
                    alert('Error: ' + error.message + ' code: ' + error.code);
                }, function () {
                    GetDBTaggedResult()
                });
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
    console.log(createdOn)
    console.log(drugResultsRowslLength)
    console.log(livestockResultsRowslLength)
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

function selectNextPage() {
    if (pageSelector == 'wurfindex') {
        nav1.pushPage('livestock_action.html')
    } else {
        nav1.pushPage('drug.html')
    }
}