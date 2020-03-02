var color = "";
var number = "";
var actualDate = "";
var actualDateNew = "";
var days = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];

// Create livestock object to check if changes occures by clicking backbuton
var livestockObj = {
    color: "",
    place: "",
    category: "",
    born: "",
    number: "",
};


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
    //set livestock color
    document.getElementById("rect1Detail").style.fill = localStorage.getItem('LivestockColorDetail')
    document.getElementById("rect2Detail").style.fill = localStorage.getItem('LivestockColorDetail')
    document.getElementById("circle1Detail").style.fill = localStorage.getItem('LivestockColorDetail')
    document.getElementById("livestockColorDetail").innerHTML = localStorage.getItem('LivestockColorNameDetail');
    livestockObj.color = localStorage.getItem('LivestockColorNameDetail');
    //set livestock number
    document.getElementById("CodeDigit0Detail").value = localStorage.getItem('LivestockNumberDetail').charAt(0);
    document.getElementById("CodeDigit1Detail").value = localStorage.getItem('LivestockNumberDetail').charAt(1);
    document.getElementById("CodeDigit2Detail").value = localStorage.getItem('LivestockNumberDetail').charAt(2);
    document.getElementById("CodeDigit3Detail").value = localStorage.getItem('LivestockNumberDetail').charAt(3);
    livestockObj.number = localStorage.getItem('LivestockNumberDetail');
    //set livestock location
    document.getElementById("livestockPlaceDetail").innerHTML = localStorage.getItem('LivestockLocationDetail');
    livestockObj.place = localStorage.getItem('LivestockLocationDetail');
    //set livestock birthday
    document.getElementById("BornOnDetail").value = localStorage.getItem('LivestockBornOnDetail');
    livestockObj.born = localStorage.getItem('LivestockBornOnDetail');
    //set livestock category
    document.getElementById("livestockCategoryDetail").innerHTML = localStorage.getItem('LivestockCategoryDetail');
    livestockObj.category = localStorage.getItem('LivestockCategoryDetail');
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

    function deleteLivestockDetail() {
        ons.notification.confirm({
            message: 'Möchtest du das Nutztier löschen?',
            title: 'Nutztier löschen',
            buttonLabels: ['Ja', 'Nein'],
            animation: 'default',
            primaryButtonIndex: 1,
            cancelable: true,
            callback: function (index) {
                if (index == 0) {
                    RESTDeleteAnimal(localStorage.getItem('LivestockIdDetail'))
                }
            }
        });
    }

    function createQR() {
        guid = "1112ced9-2786-4032-aca2-3cd8b234efc2"
        document.getElementById("qrcodeTable").innerHTML = "";
        // Clear Previous QR Code
        $('#qrcode').empty();
        jQuery('#qrcodeTable').qrcode({
            render: "table",
            width: 128,
            height: 128,
            text: guid
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
        livestockGroup = document.getElementById("livestockGroup").value;
        db.transaction(function (tx) {
            tx.executeSql("UPDATE livestock SET number=?, color = ?, place = ?, created = ?, livestock_group = ? where id = ?", [number, color, place, createdOn, livestockGroup, id]);
        }, function (error) {
            alert('Error: ' + error.message + ' code: ' + error.code);
        }, function () {
            ons.notification.alert({
                message: 'Die Änderungen wurden übernommen',
                title: 'Nutztier Änderungen',
            });
        });
    }

    function editLivestock() {
            document.getElementById("saveEditButton").hidden = false;
            document.getElementById("BornOnDetail").disabled = false;
            document.getElementById("CodeDigit0Detail").disabled = false;
            document.getElementById("CodeDigit1Detail").disabled = false;
            document.getElementById("CodeDigit2Detail").disabled = false;
            document.getElementById("CodeDigit3Detail").disabled = false;
    }

    function checkInputsUnsavedDetail() {
        var button = document.getElementById("saveEditButton");
        //set  cuurent view livestock number
        var CodeDigit0 = document.getElementById("CodeDigit0Detail").value;
        var CodeDigit1 = document.getElementById("CodeDigit1Detail").value;
        var CodeDigit2 = document.getElementById("CodeDigit2Detail").value;
        var CodeDigit3 = document.getElementById("CodeDigit3Detail").value;
        var number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
        var color = document.getElementById("livestockColorDetail").innerHTML;
        var place = document.getElementById("livestockPlaceDetail").innerHTML;
        var category = document.getElementById("livestockCategoryDetail").innerHTML;
        var birthay = document.getElementById("BornOnDetail").value;

        if ((number !== livestockObj.number) || (color !== livestockObj.color) || (category !== livestockObj.category) || (place !== livestockObj.place) || (birthay !== livestockObj.born)) {
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
            if (button.hidden === false) {
                ons.notification.confirm({
                    message: 'Du hast bei diesem Profil keine Änderungen durchgeführt. Bist du sicher, dass du das Profil verlassen möchtest?',
                    title: 'Keine Änderungen',
                    buttonLabels: ['OK'],
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
    }

    function checkInputsDetail() {
        var CodeDigit0 = document.getElementById("CodeDigit0Detail").value;
        var CodeDigit1 = document.getElementById("CodeDigit1Detail").value;
        var CodeDigit2 = document.getElementById("CodeDigit2Detail").value;
        var CodeDigit3 = document.getElementById("CodeDigit3Detail").value;
        var number = CodeDigit0 + CodeDigit1 + CodeDigit2 + CodeDigit3
        var color = document.getElementById("livestockColorDetail").innerHTML;
        var place = document.getElementById("livestockPlaceDetail").innerHTML;
        var category = document.getElementById("livestockCategoryDetail").innerHTML;
        var birthay = document.getElementById("BornOnDetail").value;
        var ID = localStorage.getItem('LivestockIdDetail');
        //get animal location ID
        for (i = 0; i < LivestockLocationNbrs; i++) {
            if (place == LivestockPlaces[i].name) {
                AnimalLocationId = LivestockPlaces[i].id
            }
        }
        if ((number.length == 4) && (place != "Bitte wählen")) {
            if ((number !== livestockObj.number) || (color !== livestockObj.color) || (category !== livestockObj.category) || (place !== livestockObj.place) || (birthay !== livestockObj.born)) {
                RESTUpdateLivestock(ID, born, color, number, AnimalLocationId)
            } else{
                ons.notification.confirm({
                    message: 'Du hast bei diesem Profil keine Änderungen durchgeführt',
                    title: 'Keine Änderungen',
                    buttonLabels: ['OK'],
                    animation: 'default',
                    primaryButtonIndex: 1,
                    cancelable: true,
                    callback: function (index) {
                        if (index == 0) {
                            document.getElementById("saveEditButton").hidden = true;
                            document.getElementById("BornOnDetail").disabled = true;
                            document.getElementById("CodeDigit0Detail").disabled = true;
                            document.getElementById("CodeDigit1Detail").disabled = true;
                            document.getElementById("CodeDigit2Detail").disabled = true;
                            document.getElementById("CodeDigit3Detail").disabled = true;
                        }
                    }
                });
            }
            
                // RESTUpdateLivestock(id, born, color, number, AnimalLocationId)
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
    