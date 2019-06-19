db = window.openDatabase("Database", "1.0", "Nutztier db", 20 * 1024 * 1024); //create 20MB Database

//add livestock action Array to database
function write2DBActionArr(arrType, arrCreatedOnDate, arrCreatedOnTime, arrTextarea, result, arrFuture) {
    for (i = 0; i < arrType.length; i++) {
        (function (i) {
            write2DBActionArr2(arrType[i], arrCreatedOnDate[i], arrCreatedOnTime[i], arrTextarea[i], result, arrFuture[i])
        })(i);
        if (i == arrType.length-1) {
            document.querySelector('#nav1').popPage();
        }
    };
}

async function write2DBActionArr2(type, date, time, text, result, future) {
    await db.transaction(async function (transaction) {
        var livestock_id = String(localStorage.LivestockID)
        var executeQuery =
            "INSERT INTO livestock_action (livestock_id, type, date, time, result, text, future, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [livestock_id, type, date, time, result, text, future , "true"],
            function (tx, result) {
                console.log("success")
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//add livestock action to database
function write2DBAction(type, CreatedOnDateID, CreatedOnTimeID, textareaID, result, future) {
    var livestock_id = String(localStorage.LivestockID)
    var date = document.getElementById(CreatedOnDateID).value;
    var time = document.getElementById(CreatedOnTimeID).value;
    var text = document.getElementById(textareaID).value;
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock_action (livestock_id, type, date, time, result, text, future, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [livestock_id, type, date, time, result, text, future, "true"],
            function (tx, result) {
                deleteFromDBAction(livestock_id, type)
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//delete livestock action in future from database
function deleteFromDBAction(id, type) {
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM livestock_action WHERE livestock_id = ? AND type = ? AND future = ?',
            [id, type, 'true']);
    },
    function (error) {
        alert('Error: ' + error.message + ' code: ' + error.code);
    },
    function () {
        document.querySelector('#nav1').popPage();
    });
}

//add livestock to database
function write2DBLivestock(born, color, number, place, created, email) {
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
async function write2DBDrugDelivery() {
    for (i = 0; i < arrID.length; i++) {
        (function (i) {
            for (j = 0; j < arrDrug.length; j++) {
                write2DBDrugDelivery2(String(arrID[i]), arrDrug[j], arrDrugNumber[j], arrDrugDelay[j], arrDrugAmount[j])
            };
        })(i);
        document.querySelector('#nav1').popPage();
        // Remove taged entry i DB and change site to menu when for loop is done
        // if (i == arrColor.length - 1) {
        //     db.transaction(function (tx) {
        //         tx.executeSql(
        //             "UPDATE livestock SET tagged=?",
        //             ['false']);
        //     }, function (error) {
        //         alert('Error: ' + error.message + ' code: ' + error.code);
        //     }, function () {
        //         document.querySelector('#nav1').popPage();
        //     });
        // }
    };
}

async function write2DBDrugDelivery2(id, drug, approval_number, delay, amount) {
    await db.transaction(async function (transaction) {
            var executeQuery =
                "INSERT INTO drug_delivery (livestock_id, drug, approval_number, delay, amount, created, DBSyncServer) VALUES (?,?,?,?,?,?,?)";
            transaction.executeSql(executeQuery, [id, drug,
                approval_number, delay, amount, createdOn, "true"
            ]);
        },
        function (error) {
            alert('Error: ' + error.message + ' code: ' + error.code);
        },
        function () {
            console.log('success')
        });
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

function sampleDrugs() {
    write2DBDrug('Aconitum', '838031', '0', 'Homöopathika', 'mg/ml', 'false')
    write2DBDrug('Advocid', '8-00295', '3', 'Standardarzneimittel', 'mg/ml', 'false')
    write2DBDrug('Baytril', '8-00988', '7', 'Fütterungsarzneimittel', 'mg/ml', 'false')
    write2DBDrug('Ceftiocyl Flow', '836487', '1', 'Homöopathika', 'µg/ml', 'false')
    write2DBDrug('Dexatat', 'EU/2/17/209/001-002', '30', 'Fütterungsarzneimittel', 'mg/ml', 'false')
    write2DBDrug('Melovem', '8-00718', '0', 'Standardarzneimittel', 'mg/ml', 'false')
    write2DBDrug('Neomycin-Penicillin', '837660', '20', 'Fütterungsarzneimittel', 'mg/ml', 'false')
    write2DBDrug('Oxytetracyclin', '13910', '100', 'Standardarzneimittel', 'g/kg', 'false')
    write2DBDrug('Porcilis M Hyo', '838068', '0', 'Homöopathika', 'IU/ml', 'false')
    write2DBDrug('Repose 500', '838093', '17', 'Biologika', 'g/g', 'false')

}

function sampleLivestocks() {
    write2DBLivestockTester('2019-05-31', 'yellow', '1234', 'Dekzentrum', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-02', 'red', '4567', 'Wartestall', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-01', 'green', '8743', 'Abferkelbox', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-30', 'blue', '1256', 'Futterventile', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-27', 'orange', '7890', 'Abferkelbox', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-09', 'white', '3456', 'Abferkelbox', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-03', 'red', '4390', 'Futterventile', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-19', 'blue', '4567', 'Wartestall', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-15', 'yellow', '1238', 'Dekzentrum', 'example@example.com', 'example@example.com')
    write2DBLivestockTester('2019-05-29', 'red', '9805', 'Dekzentrum', 'example@example.com', 'example@example.com')
}

//add livestock to database
function write2DBLivestockTester(born, color, number, place, created, email) {
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock (born, color, number, place, created, user, tagged, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [born, color, number, place, created, email, "false", "true"],
            function (tx, result) {
                console.log("Livestock added")
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//ONLY FOR TESTING!!!!!
function write2DBDrug(name, number, delay, category, drug_unit, tagged) {

    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO drugs (name, number, delay, category, drug_unit, tagged) VALUES (?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [name, number, delay, category, drug_unit, tagged],
            function (tx, result) {
                console.log("Drug added")
            },
            function (error) {
                console.log('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}