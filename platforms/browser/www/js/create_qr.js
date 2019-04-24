document.addEventListener("init", function (event) {
    var db = window.openDatabase("Database", "1.0", "LogC DB", 20 * 1024 * 1024);
    var StringStored = "";

    function getData() {
        //        setInterval(function() {
        //                modal.hide();
        db.transaction(function (tx) {
            tx.executeSql(
                "SELECT * FROM LOGS", [],
                function (tx, results) {
                    var chosenCompany = results.rows.item(5).log; //company
                    var ChosenfavouredDeliveryPoints = results.rows.item(6).log; //adress
                    var SupplierCompany = results.rows.item(7).log; //supplier company
                    var chosenCompany = chosenCompany.replace(/&amp;/g, "&");
                    var SupplierCompany = SupplierCompany.replace(/&amp;/g, "&");
                    document.getElementById(
                        "SupplierCreateQR"
                    ).innerHTML = SupplierCompany;
                    var ChosenfavouredDeliveryPoints = ChosenfavouredDeliveryPoints.replace(
                        ",",
                        "<br>"
                    );
                    if (chosenCompany == "") {
                        document.getElementById("ReceiverCreateQR").innerHTML =
                            "Empfänger" + "<br>" + "auswählen";
                    } else {
                        document.getElementById("ReceiverCreateQR").innerHTML =
                            chosenCompany + "<br>" + ChosenfavouredDeliveryPoints;
                        GetServerInformation();
                    }
                },
                null
            );
        });
    }
    //        }, 1500);
    setTimeout(getData, 100);

    //get current Time every seconds
    setInterval(function () {
        var hours = "00";
        var minutes = "00";
        //get time
        heute = new Date();
        hours = heute.getHours();
        hours = (hours < 10 ? "0" : "") + hours;
        hours = hours.substring(0, 2);
        minutes = heute.getMinutes();
        minutes = (minutes < 10 ? "0" : "") + minutes;
        minutes = minutes.substring(0, 2);
        //get date
        day = heute.getDate();
        month = heute.getMonth() + 1;
        year = heute.getFullYear();
        //write to element
        document.getElementById("TimeCreateQR").innerHTML = hours + ":" + minutes;
        document.getElementById("DateCreateQR").innerHTML =
            "" + day + "/" + month + "/" + year;
    }, 1000);

    function GetServerInformation() {
        var cnt = 1;
        var StringCnt1 = "";
        var StringCnt2 = "";
        //get company
        var networkState = navigator.connection.type;
        if (networkState !== Connection.NONE) {
            var link =
                "https://logcontract.com/api/company/" + localStorage.Company + "/info";

            $.get(link, function (data) {
                //                    modal.hide();
                var jsonString = JSON.stringify(data);
                var DataObject = JSON.parse(jsonString);
                //get each key and value form object usedUnits
                $.each(DataObject.data.usedUnits, function (key, value) {
                    console.log("Key: " + key + ", Value: " + value);
                    StringCnt1 = "CreateQR" + cnt;
                    StringCnt2 = "CreateQR" + (cnt + 1);
                    document.getElementById(StringCnt1).innerHTML = value;
                    document.getElementById(StringCnt2).value = key;
                    StringStored += "+" + value + "+" + key;
                    document.getElementById(StringCnt2).removeAttribute("readonly");
                    document.getElementById(StringCnt2).style =
                        "border: 0; text-align: center; font-family: Calibri; font-size: 18px; width: 30%; border-bottom: 2px solid black";
                    console.log(cnt);
                    cnt += 2;
                });
                writeReceiver2DB();
            });
        } else {
            //if there is not internet Connection read out Receiver from DB
            GetDBInformation();
        }
    }

    function GetDBInformation() {
        var StringCnt1 = "";
        var StringCnt2 = "";
        db.transaction(function (tx) {
            tx.executeSql(
                "SELECT * FROM LOGS", [],
                function (tx, results) {
                    var CompanyInfoStored = results.rows.item(19).log; //get stored Company Info
                    var fields = CompanyInfoStored.split("+");
                    for (i = 1; i <= CompanyInfoStored.split("+").length - 1; i = i + 2) {
                        StringCnt1 = "CreateQR" + i;
                        StringCnt2 = "CreateQR" + (i + 1);
                        document.getElementById(StringCnt1).innerHTML = fields[i];
                        document.getElementById(StringCnt2).value = fields[i + 1];
                        document.getElementById(StringCnt2).removeAttribute("readonly");
                        document.getElementById(StringCnt2).style =
                            "border: 0; text-align: center; font-family: Calibri; font-size: 18px; width: 30%; border-bottom: 2px solid black";
                    }
                },
                null
            );
        });
    }

    function writeReceiver2DB() {
        if (StringStored != "") {
            db.transaction(
                function (tx) {
                    tx.executeSql("UPDATE LOGS SET log=? where id=?;", [
            StringStored,
            20
          ]);
                },
                function (error) {
                    alert("Error: " + error.message + " code: " + error.code);
                },
                function () {}
            );
        }
    }
});
