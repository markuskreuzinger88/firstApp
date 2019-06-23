var enterPage = ""

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    enterPage = event.enterPage.id;
});

$(document).on('postpop', '#nav1', function (event) {
    var event = event.originalEvent;
    enterPage = event.enterPage.id;
});

//scan QR code
function scan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                if (result.format == "QR_CODE") {
                    if (enterPage == 'livestock') {
                        tagLivestock(result.text)
                    } else {
                        getLivestock(result.text)
                    }
                } else if (result.format == "EAN_13") {
                    tagDrug(result.text)
                }
            }
        },
        function (error) {
            ons.notification.alert({
                message: 'Scanning failed: ' + error,
                title: 'Bad Scan',
            });
        }, {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: false, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats: "QR_CODE,PDF_417, EAN_13", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
        }
    );
}

//spilt data from QR Code
function getLivestock(CodeData) {
    var res = CodeData.split("+");
    var color = String(res[0]);
    var number = String(res[1]);
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT id FROM livestock WHERE color = ? AND number = ?', [color, number], function (tx, results) {
            if (results.rows.length > 0) {
                localStorage.setItem("LivestockColor", res[0]);
                localStorage.setItem("LivestockNumber", res[1]);
                localStorage.setItem("LivestockID", results.rows.item(0).id);
                document.querySelector('#nav1').pushPage('livestock_detail.html');
            } else {
                ons.notification.alert({
                    message: 'Das Nutztier ist nicht in deiner Datenbank hinterlegt',
                    title: 'Nutztier nicht vorhanden',
                });
            }
        }, null);
    });
}

//tag livestock for drug delivery 
function tagLivestock(CodeData) {
    var res = CodeData.split("+");
    var color = String(res[0]);
    var number = String(res[1]);
    db.transaction(function (tx) {
        tx.executeSql("UPDATE livestock SET tagged=? where Color = ? AND Number = ?", ['true', color, number],
            function (tx, result) {
                ons.notification.alert({
                    message: 'Das Nutztier mit der Kennzeichnung: ' + color + " " + number + ' wurde ausgewählt',
                    title: 'Nutztier ausgewählt',
                });
                readDBLivestock()
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//tag drug for drug delivery 
function tagDrug(CodeData) {
    db.transaction(function (tx) {
        tx.executeSql("UPDATE drugs SET tagged=? where barcode = ?", ['true', CodeData],
            function (tx, result) {
                if (results.rows.length > 0) {
                    if (enterPage == 'drug') {
                        CommandDBDrugs()
                    } else {
                        nav1.pushPage('drug_action_delivery.html')
                    }
                } else {
                    ons.notification.alert({
                        message: 'Das Medikament ist nicht in deiner Datenbank hinterlegt',
                        title: 'Medikament nicht vorhanden',
                    });
                }
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}