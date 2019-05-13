var color = "";
var number = "";

$(document).on('prepop', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.enterPage.id === 'livestock_detail') {
        setMarkDetailView()
        setDrugDetailView()
        setActionDetailView()
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
        setActionDetailView()
    }
});

function setMarkDetailView() {
    console.log('jep1')
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

function setActionDetailView() {
    console.log('jep2')
    var list = document.getElementById("containerIndex");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM livestock_action WHERE Color = ? AND Number = ?',
            [color, number],
            function (tx, results) {
                for (i = 0; i < results.rows.length; i++) {
                    card = document.createElement("div")
                    card.setAttribute("class", "container right");
                    content = document.createElement("div")
                    content.setAttribute("class", "content");
                    /*generate Type*/
                    rowType = document.createElement("ons-row")
                    colType = document.createElement("ons-col")
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
                    /*result*/
                    rowResult = document.createElement("ons-row")
                    colresultHeader = document.createElement("ons-col")
                    colresult = document.createElement("ons-col")
                    colresultHeader.innerHTML = ("Ergebnis")
                    /*we have to add a new line if action farraw is selected --> positiv, negativ...*/
                    str = results.rows.item(i).result
                    console.log(str)
                    var res = str.replace("+", "<br>");
                    var res = res.replace("+", "<br>");
                    console.log(res)
                    colresult.innerHTML = res
                    rowResult.appendChild(colresultHeader);
                    rowResult.appendChild(colresult);
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
                    rowType.appendChild(colType);
                    content.appendChild(rowType);
                    rowTime.appendChild(colTimeHeader);
                    rowTime.appendChild(colTime);
                    content.appendChild(rowTime);
                    rowDate.appendChild(colDateHeader);
                    rowDate.appendChild(colDate);
                    content.appendChild(rowDate);
                    if (results.rows.item(i).type == 'Abgeferkelt') {
                        content.appendChild(rowResult);
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
                    document.getElementById("containerIndex").appendChild(card);
                }
            }, null);
    });
};

function setDrugDetailView() {
    console.log('jep3')
    var list = document.getElementById("containerMedical");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM drug_delivery WHERE Color = ? AND Number = ?', [
            color, number
        ], function (tx, results) {
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
                /*generate Date*/
                rowDate = document.createElement("ons-row")
                colDateHeader = document.createElement("ons-col")
                colDate = document.createElement("ons-col")
                colDateHeader.innerHTML = ("Datum")
                colDate.innerHTML = results.rows.item(i).created
                /*generate Amount*/
                rowAmount = document.createElement("ons-row")
                colAmountHeader = document.createElement("ons-col")
                colAmount = document.createElement("ons-col")
                colAmountHeader.innerHTML = ("Abgabemenge")
                colAmount.innerHTML = results.rows.item(i).amount + " ml";
                /*generate Delay*/
                rowDelay = document.createElement("ons-row")
                colDelayHeader = document.createElement("ons-col")
                colDelay = document.createElement("ons-col")
                colDelayHeader.innerHTML = ("Wartefrist")
                colDelay.innerHTML = results.rows.item(i).delay + " Tage";
                /*append rows to container*/
                rowMedical.appendChild(colMedical);
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
            }
        }, null);
    });
};

var showTemplateDialog = function (my_dialog, my_dialog_html) {

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
var hideDialogColor = function (id, checkbox, color) {
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
    document.getElementById("CodeDigit0").removeAttribute("disabled");
    document.getElementById("CodeDigit1").removeAttribute("disabled");
    document.getElementById("CodeDigit2").removeAttribute("disabled");
    document.getElementById("CodeDigit3").removeAttribute("disabled");
    document.getElementById("Color").removeAttribute("disabled");
    document.getElementById("Number").removeAttribute("disabled");
    document.getElementById("Place").removeAttribute("disabled");
    document.getElementById("BornOn").removeAttribute("disabled");
    document.getElementById('ChangeFab').style.visibility = "visible";
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
                var color = String(localStorage.LivestockColor)
                var number = String(localStorage.LivestockNumber)
                db1.transaction(function (tx, results) {
                        tx.executeSql('SELECT * FROM livestock WHERE Color = ? AND Number = ?',
                            [color, number]);
                    },
                    function (error) {
                        alert('Error: ' + error.message + ' code: ' + error.code);
                    },
                    function (success) {
                        window.location = "livestock.html ";
                    });
            }
        }
    });
}

function createQR() {
    document.getElementById("qrcodeTable").innerHTML = "";
    var CodeDigit0 = document.getElementById("CodeDigit0").value;
    var CodeDigit1 = document.getElementById("CodeDigit1").value;
    var CodeDigit2 = document.getElementById("CodeDigit2").value;
    var CodeDigit3 = document.getElementById("CodeDigit3").value;
    var Number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
    var Color = document.getElementById("Color").style.backgroundColor;
    var Place = document.getElementById("Place").value;
    var CreatedOn = document.getElementById("BornOn").value;
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

function newDrugDelivery() {
    // tag livestock for new drug delivery
    var color = String(localStorage.LivestockColor)
    var number = String(localStorage.LivestockNumber)
    db.transaction(function (tx) {
        tx.executeSql("UPDATE livestock SET tagged=? where Color = ? AND Number = ?", ['true', color,
            number
        ]);
    }, function (error) {
        alert('Error: ' + error.message + ' code: ' + error.code);
    }, function () {
        nextPage('drug_delivery.html');
    });
}