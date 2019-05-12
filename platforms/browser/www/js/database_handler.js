db = window.openDatabase("Database", "1.0", "Nutztier db", 20 * 1024 * 1024); //create 20MB Database

//add livestock action to database
function write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result) {
    var color = String(localStorage.LivestockColor)
    var number = String(localStorage.LivestockNumber)
    var date = document.getElementById(CreatedOnDateID).value;
    var time = document.getElementById(CreatedOnTimeID).value;
    var text = document.getElementById(textareaID).value;
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock_action (color, number, type, date, time, result, text, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [color, number, type, date, time, result, text, "true"],
            function (tx, result) {
                document.querySelector('#nav1').popPage();   
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//add livestock to database
function write2DBLivestock() {
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock (born, color, number, place, created, user, tagged, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [born, color, number, place, created, email, "false", "true"],
            function (tx, result) {
                document.querySelector('#nav1').popPage();  
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//add drug delivery to database
function write2DBdrug() {
    for (i = 0; i < arrColor.length; i++) {
        (function (i) {
            db.transaction(function (transaction) {
                var executeQuery =
                    "INSERT INTO drug_delivery (color, number, drug, approval_number, delay, amount, created, DBSyncServer) VALUES (?,?,?,?,?,?,?,?)";
                transaction.executeSql(executeQuery, [arrColor[i], arrNumber[i], drug,
                    approval_number, delay, amount, createdOn, "true"
                ]);
            });
        })(i);
        // Remove taged entry i DB and change site to menu when for loop is done
        if (i == arrColor.length - 1) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "UPDATE livestock SET tagged=?",
                    ['false']);
            }, function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            }, function () {
                document.querySelector('#nav1').popPage();  
            });
        }
    };
}

//Write to database
function write2DBLogin(bearerToken, refreshToken) {
    var email = document.getElementById("email").value;
    var psw = document.getElementById("psw").value;
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO user (bearerToken, refreshToken, email, password) VALUES (?,?,?,?)";
        transaction.executeSql(executeQuery, [bearerToken, refreshToken, email, psw],
            function (tx, result) {
                document.querySelector('#nav1').pushPage('home_splitter.html');  
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}