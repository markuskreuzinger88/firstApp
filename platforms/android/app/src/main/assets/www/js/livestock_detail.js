var color = "";
var number = "";

$(document).on('prepop', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.enterPage.id === 'livestock_detail') {
        setMarkDetailView()
        setDrugDetailView()
        setActionDetailView('false')
        resetlivestockDetailActionColText()
    }
});

document.addEventListener("init", function (event) {
    color = String(localStorage.LivestockColor)
    number = String(localStorage.LivestockNumber)
    var page = event.target;
    if (page.id === 'Bestandsliste ID') {
        setMarkDetailView()
    }
    if (page.id === 'Bestandsliste Arzneimittel') {
        setDrugDetailView()
    }
    if (page.id === 'Bestandsliste Belegung') {
        setActionDetailView('false')
    }
});

function setMarkDetailView() {
    //calc window size and adapte SVG Object
    var w = window.innerWidth;
    var h = window.innerHeight;
    var OffsestWidthX = (w - 250 - 50) / 2
    //set Object width depending on Display width
    document.getElementById("SvgObjDetail").setAttribute("width", w - 30);
    document.getElementById("rect1Detail").setAttribute("x", OffsestWidthX);
    document.getElementById("circle1Detail").setAttribute("cx", OffsestWidthX + 130);
    document.getElementById("circle2Detail").setAttribute("cx", OffsestWidthX + 130);
    document.getElementById("rect2Detail").setAttribute("x", OffsestWidthX + 61);
    document.getElementById("CodeDigit0ObjDetail").setAttribute("x", OffsestWidthX + 40);
    document.getElementById("CodeDigit1ObjDetail").setAttribute("x", OffsestWidthX + 85);
    document.getElementById("CodeDigit2ObjDetail").setAttribute("x", OffsestWidthX + 130);
    document.getElementById("CodeDigit3ObjDetail").setAttribute("x", OffsestWidthX + 175);
    document.getElementById("Svgtext1Detail").setAttribute("x", OffsestWidthX + 40);
    document.getElementById("Svgtext2Detail").setAttribute("x", OffsestWidthX + 190);
    document.getElementById("Svgtext3Detail").setAttribute("x", OffsestWidthX + 70);
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM livestock WHERE Color = ? AND Number = ?', [color,
            number
        ], function (tx, results) {
            document.getElementById("ColorDetail").style.backgroundColor = results.rows.item(
                0).color;
            document.getElementById("rect1Detail").style.fill = results.rows.item(0).color;
            document.getElementById("rect2Detail").style.fill = results.rows.item(0).color;
            document.getElementById("circle1Detail").style.fill = results.rows.item(0).color;
            document.getElementById("CodeDigit0Detail").value = results.rows.item(0).number
                .charAt(0);
            document.getElementById("CodeDigit1Detail").value = results.rows.item(0).number
                .charAt(1);
            document.getElementById("CodeDigit2Detail").value = results.rows.item(0).number
                .charAt(2);
            document.getElementById("CodeDigit3Detail").value = results.rows.item(0).number
                .charAt(3);
            document.getElementById("PlaceDetail").value = results.rows.item(0).place;
            document.getElementById("BornOnDetail").value = results.rows.item(0).born;
        }, null);
    });
};

function setActionDetailView(trashActive) {
    livestock_id = String(localStorage.LivestockID)
    var list = document.getElementById("containerIndex");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    var actualDateNew = new Date();
    var actualDate = actualDateNew.getTime();
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM livestock_action WHERE livestock_id = ? ORDER BY date DESC',
            [livestock_id],
            function (tx, results) {
                for (i = 0; i < results.rows.length; i++) {
                    card = document.createElement("div")
                    card.setAttribute("class", "container right");
                    content = document.createElement("div")
                    content.setAttribute("class", "content");
                    /*generate Type*/
                    rowType = document.createElement("ons-row")
                    colType = document.createElement("ons-col")
                    if (trashActive == "true") {
                        colTypeTrash = document.createElement("ons-col")
                        iconTrash = document.createElement("ons-icon")
                        iconTrash.setAttribute("icon", "fa-trash");
                        iconTrash.setAttribute("style", "color: red; margin-left : 100%");
                        rowType.appendChild(colType);
                        colTypeTrash.appendChild(iconTrash);
                        rowType.appendChild(colTypeTrash);
                    } else {
                        rowType.appendChild(colType);
                    }
                    colType.innerHTML = results.rows.item(i).type
                    colType.style.fontWeight = "700";
                    colType.style.marginBottom = "10px";
                    /*generate Time*/
                    rowTime = document.createElement("ons-row")
                    colTimeHeader = document.createElement("ons-col")
                    colTime = document.createElement("ons-col")
                    colTimeHeader.innerHTML = ("Uhrzeit")
                    colTime.innerHTML = results.rows.item(i).time
                    /*generate Date*/
                    rowDate = document.createElement("ons-row")
                    colDateHeader = document.createElement("ons-col")
                    colDate = document.createElement("ons-col")
                    colDateHeader.innerHTML = ("Datum")
                    colDate.innerHTML = results.rows.item(i).date
                    actionDate = Date.parse(results.rows.item(i).date);
                    if (actionDate > actualDate) {
                        rowDate2 = document.createElement("ons-row")
                        colDateHeader2 = document.createElement("ons-col")
                        colDate2 = document.createElement("ons-col")
                        colDateHeader2.innerHTML = ("Noch");
                        // convert from milleseconds to days
                        var daysLeft = Math.ceil((actionDate - actualDate) / 24 / 60 / 60 / 1000);
                        colDate2.innerHTML = daysLeft + " Tage";
                        rowDate2.appendChild(colDateHeader2);
                        rowDate2.appendChild(colDate2);
                    }
                    /*result*/
                    if (results.rows.item(i).type == 'Abgeferkelt') {
                        rowResult1 = document.createElement("ons-row")
                        rowResult2 = document.createElement("ons-row")
                        rowResult3 = document.createElement("ons-row")
                        colresultHeader1 = document.createElement("ons-col")
                        colresultHeader2 = document.createElement("ons-col")
                        colresultHeader3 = document.createElement("ons-col")
                        colresultHeader1.innerHTML = ("lebendig")
                        colresultHeader2.innerHTML = ("tot")
                        colresultHeader3.innerHTML = ("Mumien")
                        colresult1 = document.createElement("ons-col")
                        colresult2 = document.createElement("ons-col")
                        colresult3 = document.createElement("ons-col")
                        str = results.rows.item(i).result
                        var res = str.split("+");
                        colresult1.innerHTML = res[0]
                        colresult2.innerHTML = res[1]
                        colresult3.innerHTML = res[2]
                        rowResult1.appendChild(colresultHeader1);
                        rowResult1.appendChild(colresult1);
                        rowResult2.appendChild(colresultHeader2);
                        rowResult2.appendChild(colresult2);
                        rowResult3.appendChild(colresultHeader3);
                        rowResult3.appendChild(colresult3);
                    } else {
                        rowResult = document.createElement("ons-row")
                        colresultHeader = document.createElement("ons-col")
                        colresult = document.createElement("ons-col")
                        colresultHeader.innerHTML = ("Ergebnis")
                        colresult.innerHTML = results.rows.item(i).result
                        rowResult.appendChild(colresultHeader);
                        rowResult.appendChild(colresult);
                    }
                    /*textfield*/
                    rowText = document.createElement("ons-row")
                    colTextHeader = document.createElement("ons-col")
                    colText = document.createElement("ons-col")
                    colTextArea = document.createElement("textarea")
                    colTextArea.setAttribute("class", "textarea");
                    colTextArea.setAttribute("rows", "3");
                    colTextHeader.innerHTML = ("Anmerkungen")
                    colTextArea.value = results.rows.item(i).text
                    rowText.appendChild(colTextHeader);
                    rowText.appendChild(colText);
                    /*append rows to container*/
                    content.appendChild(rowType);
                    rowTime.appendChild(colTimeHeader);
                    rowTime.appendChild(colTime);
                    content.appendChild(rowTime);
                    rowDate.appendChild(colDateHeader);
                    rowDate.appendChild(colDate);
                    content.appendChild(rowDate);
                    //add element if ction is in future
                    if (actionDate > actualDate) {
                        content.appendChild(rowDate2);
                    }
                    if (results.rows.item(i).type == 'Abgeferkelt') {
                        content.appendChild(rowResult1);
                        content.appendChild(rowResult2);
                        content.appendChild(rowResult3);
                    } else if (results.rows.item(i).type == 'Trächtigkeitsuntersuchung') {
                        content.appendChild(rowResult);
                    } else if (results.rows.item(i).type == 'Rauschekontrolle') {
                        content.appendChild(rowResult);
                    } else if (results.rows.item(i).type == 'Body Condition Score') {
                        content.appendChild(rowResult);
                    }
                    /*only add text if not empty*/
                    if (results.rows.item(i).text.length != 0) {
                        results.rows.item(i).text.length
                        content.appendChild(rowText);
                        content.appendChild(colTextArea);
                    }
                    card.appendChild(content);
                    if (trashActive == "true") {
                        card.setAttribute("onclick", "deleteActionItem(" + results.rows.item(i).id + ")");
                    }
                    document.getElementById("containerIndex").appendChild(card);
                    //current date between action in future and action in presence
                    if (actionDate > actualDate) {
                        if ((Date.parse(results.rows.item(i + 1).date)) <= actualDate) {
                            actualDateElement = document.createElement("div")
                            actualDateElement.innerHTML = ("Anmerkungen")
                            document.getElementById("containerIndex").appendChild(actualDateElement);
                        }
                    }
                }
                if (results.rows.length == 0) {
                    resetlivestockDetailActionColText();
                }
            }, null);
    });
};

function setDrugDetailView(trashActive) {
    livestock_id = (localStorage.LivestockID)
    var list = document.getElementById("containerMedical");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM drug_delivery WHERE livestock_id = ?',
            [livestock_id],
            function (tx, results) {
                for (i = 0; i < results.rows.length; i++) {
                    card = document.createElement("div")
                    card.setAttribute("class", "container right");
                    content = document.createElement("div")
                    content.setAttribute("class", "content");
                    /*generate Medical*/
                    rowMedical = document.createElement("ons-row")
                    colMedical = document.createElement("ons-col")
                    colMedical.innerHTML = results.rows.item(i).drug
                    colMedical.style.fontWeight = "700";
                    colMedical.style.marginBottom = "10px";
                    if (trashActive == "true") {
                        colTypeTrash = document.createElement("ons-col")
                        iconTrash = document.createElement("ons-icon")
                        iconTrash.setAttribute("icon", "fa-trash");
                        iconTrash.setAttribute("style", "color: red; margin-left : 100%");
                        rowMedical.appendChild(colMedical);
                        colTypeTrash.appendChild(iconTrash);
                        rowMedical.appendChild(colTypeTrash);
                    } else {
                        rowMedical.appendChild(colMedical);
                    }
                    /*generate Date*/
                    rowDate = document.createElement("ons-row")
                    colDateHeader = document.createElement("ons-col")
                    colDate = document.createElement("ons-col")
                    colDateHeader.innerHTML = ("Datum")
                    colDate.innerHTML = results.rows.item(i).created
                    colDate.setAttribute("style", "margin-left: 20px;");
                    /*generate Amount*/
                    rowAmount = document.createElement("ons-row")
                    colAmountHeader = document.createElement("ons-col")
                    colAmount = document.createElement("ons-col")
                    colAmountHeader.innerHTML = ("Abgabemenge")
                    colAmount.innerHTML = results.rows.item(i).amount + " ml";
                    colAmount.setAttribute("style", "margin-left: 10px;");
                    /*generate Delay*/
                    rowDelay = document.createElement("ons-row")
                    colDelayHeader = document.createElement("ons-col")
                    colDelay = document.createElement("ons-col")
                    colDelayHeader.innerHTML = ("Wartefrist")
                    colDelay.innerHTML = results.rows.item(i).delay + " Tage";
                    colDelay.setAttribute("style", "margin-left: 20px;");
                    /*append rows to container*/
                    // rowMedical.appendChild(colMedical);
                    content.appendChild(rowMedical);
                    rowDate.appendChild(colDateHeader);
                    rowDate.appendChild(colDate);
                    content.appendChild(rowDate);
                    rowAmount.appendChild(colAmountHeader);
                    rowAmount.appendChild(colAmount);
                    content.appendChild(rowAmount);
                    rowDelay.appendChild(colDelayHeader);
                    rowDelay.appendChild(colDelay);
                    content.appendChild(rowDelay);
                    card.appendChild(content);
                    document.getElementById("containerMedical").appendChild(card);
                    if (trashActive == "true") {
                        card.setAttribute("onclick", "deleteDrugItem(" + results.rows.item(i).id + ")");
                    }
                }
                if (results.rows.length == 0) {
                    resetlivestockDetailDrugColText();
                }
            }, null);
    });
};

var showTemplateDialogQRCode = function (my_dialog, my_dialog_html) {

    var dialog = document.getElementById(my_dialog);

    if (dialog) {
        dialog.show();
        createQR();
    } else {
        ons.createElement(my_dialog_html, {
                append: true
            })
            .then(function (dialog) {
                dialog.show();
                createQR();
            });
    }
};

//select color
var hideDialogColorDetail = function (id, checkbox, color) {
    document.getElementById("checkColor-1").checked = false;
    document.getElementById("checkColor-2").checked = false;
    document.getElementById("checkColor-3").checked = false;
    document.getElementById("checkColor-4").checked = false;
    document.getElementById("checkColor-5").checked = false;
    document.getElementById("checkColor-6").checked = false;
    document.getElementById(checkbox).checked = true;
    document.getElementById("ColorDetail").style.backgroundColor = color;
    document.getElementById("rect1Detail").style.fill = color;
    document.getElementById("rect2Detail").style.fill = color;
    document.getElementById("circle1Detail").style.fill = color;
    localStorage.setItem("LivestockColor", color);
    document.getElementById(id).hide();
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

var showTemplateDialogDetail = function (my_dialog, my_dialog_html) {

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

var hideDialog = function (id) {
    document
        .getElementById(id)
        .hide();
};

function setColor(color) {
    app1.hideFromTemplate()
    document.getElementById("Color").style.backgroundColor = color;
}

function modifyInputs() {
    if (document.getElementById('livestockDetailCol').innerHTML.includes("Bearbeiten")) {
        document.getElementById("CodeDigit0ObjDetail").removeAttribute("disabled");
        document.getElementById("CodeDigit1ObjDetail").removeAttribute("disabled");
        document.getElementById("CodeDigit2ObjDetail").removeAttribute("disabled");
        document.getElementById("CodeDigit3ObjDetail").removeAttribute("disabled");
        document.getElementById("ColorDetail").removeAttribute("disabled");
        document.getElementById("PlaceDetail").removeAttribute("disabled");
        document.getElementById("BornOnDetail").removeAttribute("disabled");
        document.getElementById('livestockDetailCol').innerHTML = "Fertig";
        icon = document.createElement("ons-icon")
        icon.setAttribute("icon", "fa-check");
        icon.setAttribute("style", "margin-left : 3px");
        document.getElementById('livestockDetailCol').appendChild(icon);
    } else {
        document.getElementById("CodeDigit0ObjDetail").removeAttribute("enabled");
        document.getElementById("CodeDigit1ObjDetail").removeAttribute("enabled");
        document.getElementById("CodeDigit2ObjDetail").removeAttribute("enabled");
        document.getElementById("CodeDigit3ObjDetail").removeAttribute("enabled");
        document.getElementById("ColorDetail").removeAttribute("enabled");
        document.getElementById("PlaceDetail").removeAttribute("enabled");
        document.getElementById("BornOnDetail").removeAttribute("enabled");
        document.getElementById('livestockDetailCol').innerHTML = "Bearbeiten";
        icon = document.createElement("ons-icon")
        icon.setAttribute("icon", "fa-edit");
        icon.setAttribute("style", "margin-left : 3px");
        document.getElementById('livestockDetailCol').appendChild(icon);
        updateLivestock()
    }
}

function deleteDB() {
    ons.notification.confirm({
        message: 'Möchtest du das Nutztier löschen?',
        title: 'Nutztier löschen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                var color = (localStorage.LivestockColor)
                var number = (localStorage.LivestockNumber)
                db.transaction(function (tx) {
                        tx.executeSql('DELETE FROM livestock WHERE color = ? AND number = ?',
                            [color, number]);
                    },
                    function (error) {
                        alert('Error: ' + error.message + ' code: ' + error.code);
                    },
                    function () {
                        document.querySelector('#nav1').popPage();
                    });
            }
        }
    });
}

function createQR() {
    document.getElementById("qrcodeTable").innerHTML = "";
    var CodeDigit0 = document.getElementById("CodeDigit0Detail").value;
    var CodeDigit1 = document.getElementById("CodeDigit1Detail").value;
    var CodeDigit2 = document.getElementById("CodeDigit2Detail").value;
    var CodeDigit3 = document.getElementById("CodeDigit3Detail").value;
    var Number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
    var Color = document.getElementById("ColorDetail").style.backgroundColor;
    var Place = document.getElementById("PlaceDetail").value;
    var CreatedOn = document.getElementById("BornOnDetail").value;
    var QRData = Color + "+" + Number + "+" + Place + "+" + CreatedOn;
    // Clear Previous QR Code
    $('#qrcode').empty();
    jQuery('#qrcodeTable').qrcode({
        render: "table",
        width: 128,
        height: 128,
        text: QRData
    });
}

function updateLivestock() {
    // tag livestock for new drug delivery
    var id = (localStorage.LivestockID)
    var CodeDigit0 = document.getElementById("CodeDigit0Detail").value;
    var CodeDigit1 = document.getElementById("CodeDigit1Detail").value;
    var CodeDigit2 = document.getElementById("CodeDigit2Detail").value;
    var CodeDigit3 = document.getElementById("CodeDigit3Detail").value;
    number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
    color = document.getElementById("ColorDetail").style.backgroundColor;
    place = document.getElementById("PlaceDetail").value;
    createdOn = document.getElementById("BornOnDetail").value;
    db.transaction(function (tx) {
        tx.executeSql("UPDATE livestock SET number=?, color = ?, place = ?, created = ? where id = ?", [number, color, place, createdOn, id]);
    }, function (error) {
        alert('Error: ' + error.message + ' code: ' + error.code);
    }, function () {
        ons.notification.alert({
            message: 'Die Änderungen wurden übernommen',
            title: 'Nutztier Änderungen',
        });
    });
}

function newDrugDelivery() {
    // tag livestock for new drug delivery
    var color = String(localStorage.LivestockColor)
    var number = String(localStorage.LivestockNumber)
    console.log(color)
    console.log(number)
    db.transaction(function (tx) {
        tx.executeSql("UPDATE livestock SET tagged=? where Color = ? AND Number = ?", ['true', color,
            number
        ]);
    }, function (error) {
        alert('Error: ' + error.message + ' code: ' + error.code);
    }, function () {
        document.querySelector('#nav1').pushPage('drug_delivery.html');
    });
}

function livestockDetailActionRemove(id, container) {
    //check actual action button state
    if (document.getElementById(id).innerHTML.includes("Löschen")) {
        //check if element has childs
        if (document.getElementById(container).hasChildNodes()) {
            document.getElementById(id).innerHTML = "Fertig";
            icon = document.createElement("ons-icon")
            icon.setAttribute("icon", "fa-check");
            icon.setAttribute("style", "margin-left : 3px");
            document.getElementById(id).appendChild(icon);
            if (container == "containerIndex") {
                setActionDetailView('true')
            } else {
                setDrugDetailView('true')
            }
        } else {
            ons.notification.alert({
                message: 'Es sind noch keine Einträge vorhanden',
                title: 'Nutztier Eintrag bearbeiten',
            });
        }
    } else {
        if (container == "containerIndex") {
            resetlivestockDetailActionColText()
            setActionDetailView('false')
        } else {
            resetlivestockDetailDrugColText()
            setDrugDetailView('false')
        }
    }
}

function deleteActionItem(id) {
    ons.notification.confirm({
        message: 'Möchtest du den Eintrag löschen?',
        title: 'Nutztier Eintrag bearbeiten',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                db.transaction(function (tx) {
                        tx.executeSql('DELETE FROM livestock_action WHERE id = ?',
                            [id]);
                    },
                    function (error) {
                        alert('Error: ' + error.message + ' code: ' + error.code);
                    },
                    function () {
                        setActionDetailView('true')
                    });
            }
        }
    });
}

function deleteDrugItem(id) {
    ons.notification.confirm({
        message: 'Möchtest du den Eintrag löschen?',
        title: 'Nutztier Eintrag bearbeiten',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                db.transaction(function (tx) {
                        tx.executeSql('DELETE FROM drug_delivery WHERE id = ?',
                            [id]);
                    },
                    function (error) {
                        alert('Error: ' + error.message + ' code: ' + error.code);
                    },
                    function () {
                        setDrugDetailView('true')
                    });
            }
        }
    });
}

function resetlivestockDetailActionColText() {
    document.getElementById("livestockDetailActionCol").innerHTML = "Löschen";
    icon = document.createElement("ons-icon")
    icon.setAttribute("icon", "fa-trash");
    icon.setAttribute("style", "margin-left : 3px");
    document.getElementById("livestockDetailActionCol").appendChild(icon);
}

function resetlivestockDetailDrugColText() {
    document.getElementById("livestockDetailDrugCol").innerHTML = "Löschen";
    icon = document.createElement("ons-icon")
    icon.setAttribute("icon", "fa-trash");
    icon.setAttribute("style", "margin-left : 3px");
    document.getElementById("livestockDetailDrugCol").appendChild(icon);
}
