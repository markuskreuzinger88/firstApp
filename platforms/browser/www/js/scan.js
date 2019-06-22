//scan QR code
function scan() {
    cordova.plugins.barcodeScanner.scan(
        function(result) {
            if (!result.cancelled) {
                if (result.format == "QR_CODE") {
                    getLivestock(result.text)
                }
            }
        },
        function(error) {
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
            formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
        }
    );
}

//spilt data from QR Code
function getLivestock(CodeData) {
    var res = CodeData.split("+");
    alert(res[0])
    alert(res[1])
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT livestock_id FROM livestock WHERE color = ? AND number = ?', [res[0], res[1]], function (tx, results) {
            if (results.rows.length > 0) {
                alert(results.rows.item(i).livestock_id)
            } else {
                ons.notification.alert({
                    message: 'Nutztier ist nicht in deiner Datenbank hinterlegt',
                    title: 'Nutztier nicht vorhanden',
                });
            }
            // document.querySelector('#nav1').pushPage('livestock_open_action.html');
        }, null);
    });
}