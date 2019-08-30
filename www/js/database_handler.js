db = window.openDatabase("Database", "1.0", "Nutztier db", 20 * 1024 * 1024); //create 20MB Database
var enterPage = ""

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    enterPage = event.enterPage.id;
});

$(document).on('postpop', '#nav1', function (event) {
    var event = event.originalEvent;
    enterPage = event.enterPage.id;
});

//add livestock action Array to database
function write2DBActionArr(arrType, arrCreatedOnDate, arrCreatedOnTime, arrTextarea, result, arrFuture, display) {
    for (i = 0; i < arrType.length; i++) {
        (function (i) {
            write2DBActionArr2(arrType[i], arrCreatedOnDate[i], arrCreatedOnTime[i], arrTextarea[i], result, arrFuture[i], display)
        })(i);
        //pop page if last entry was written to database
        if (i == arrType.length - 1) {
            document.querySelector('#nav1').popPage();
        }
    };
}

async function write2DBActionArr2(type, date, time, text, result, future, display) {
    await db.transaction(async function (transaction) {
        var livestock_id = String(localStorage.LivestockID)
        var executeQuery =
            "INSERT INTO livestock_action (livestock_id, type, date, time, result, text, future, display, sync) VALUES (?,?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [livestock_id, type, date, time, result, text, future, display, "true"],
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
            "INSERT INTO livestock_action (livestock_id, type, date, time, result, text, future, display, sync) VALUES (?,?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [livestock_id, type, date, time, result, text, future, "true", "true"],
            function (tx, result) {
                updateDBActionFutureElement(livestock_id, type, 'false')
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//update display field from livestock future action
//dont show future action if actual action is displayed
//e.g Kontrolle 1 future action is not displayed if Kontrolle 1 ia actually set by user
function updateDBActionFutureElement(id, type, display) {
    var startPointID = String(localStorage.startPointIDBelegung)
    db.transaction(function (tx) {
            tx.executeSql('UPDATE livestock_action SET display = ? WHERE livestock_id = ? AND type = ? AND future = ? AND id > ?',
                [display, id, type, 'true', startPointID]);
        },
        function (error) {
            alert('Error: ' + error.message + ' code: ' + error.code);
        },
        function () {
            if (enterPage == 'livestock_action') {
                document.querySelector('#nav1').popPage();
            } else {
                setActionDetailView('false')
            }
        });
}

//delete action Item from database
function deleteActionItem(id, type) {
    var livestock_id = String(localStorage.LivestockID)
    var startPointID = String(localStorage.startPointIDBelegung)
    ons.notification.confirm({
        message: 'Möchtest du den Eintrag löschen?',
        title: 'Nutztier Eintrag löschen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                //if type is 'Belegung' then delete also future action items
                if (type == "Belegung") {
                    db.transaction(function (tx) {
                            tx.executeSql('DELETE FROM livestock_action WHERE id = ? OR future = ?',
                                [id, 'true']);
                        },
                        function (error) {
                            alert('Error: ' + error.message + ' code: ' + error.code);
                        },
                        function () {
                            setActionDetailView('true')
                        });
                    //all others only delete action item and update futer itmes display field
                } else {
                    db.transaction(function (tx) {
                            tx.executeSql('DELETE FROM livestock_action WHERE id = ?', [id]);
                            tx.executeSql('UPDATE livestock_action SET display = ? WHERE livestock_id = ? AND type = ? AND future = ? AND id > ?', ['true', livestock_id, type, 'true', startPointID]);
                        },
                        function (error) {
                            alert('Error: ' + error.message + ' code: ' + error.code);
                        },
                        function () {
                            setActionDetailView('true')
                        });
                }
            }
        }
    });
}


//write single livestock to database
function write2DBLivestock(birthday, color, number, place, created, email) {
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock (birt, color, number, place, created, user, tagged, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [birthday, color, number, place, created, email, "false", "true"],
            function (tx, result) {
                document.querySelector('#nav1').popPage();
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//write livestock list to Database
//check first if ID already exists in Database
//if ID exists than update Database entry else
//insert entry to Database
async function write2DBLivestockArr(id, birthday, color, number, place, created, email) {
    await db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM livestock WHERE id = ?', [id], function (tx, results) {
            if (results.rows.length > 0) {
                //ID exits in Database
                tx.executeSql("UPDATE livestock SET birthday = ?, color = ?, number = ?, place = ?, created = ?, user = ?, tagged = ?, sync = ? WHERE id=?" [birthday, color, number, place, created, email, "false", "true", id]);
            } else {
                //ID does not exits
                //Note: remove success and error function after development process 
                var executeQuery =
                    "INSERT INTO livestock (id, birthday, color, number, place, created, user, tagged, sync) VALUES (?,?,?,?,?,?,?,?,?)";
                tx.executeSql(executeQuery, [id, birthday, color, number, place, created, email, "false", "true"],
                    function (tx, result) {
                        console.log("success")
                    },
                    function (error) {
                        alert('Error: ' + error.message + ' code: ' + error.code);
                    });
            }
        }, null);
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

//Write Login Data to Database
function write2DBLogin(firstname, lastname, token) {
    var email = document.getElementById("email").value;
    var psw = document.getElementById("psw").value;
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO user (email, password, firstname, lastname, token) VALUES (?,?,?,?,?)";
        transaction.executeSql(executeQuery, [email, psw, firstname, lastname, token],
            function (tx, result) {
                //get Livestock Database from server
                RESTGetLivestock()
                document.querySelector('#nav1').pushPage('home_splitter.html');
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//Function for get livestock Data from Database --> show livestock data in view
function getLivestockDB() {
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM livestock', [], function (tx, results) {
            var data2Arr = Array.from(results.rows);
            updateLivestockView(data2Arr, results.rows.length)
        }, null);
    });
}

function sampleDrugs() {
    write2DBDrug('Aconitum', '838031', '0', 'Homöopathika', 'ml', '', 'false')
    write2DBDrug('Advocid', '8-00295', '3', 'Standardarzneimittel', 'ml', '', 'false')
    write2DBDrug('Baytril', '8-00988', '7', 'Fütterungsarzneimittel', 'ml', '', 'false')
    write2DBDrug('Ceftiocyl Flow', '836487', '1', 'Homöopathika', 'ml', '', 'false')
    write2DBDrug('Dexatat', 'EU/2/17/209/001-002', '30', 'Fütterungsarzneimittel', 'ml', '', 'false')
    write2DBDrug('Melovem', '8-00718', '0', 'Standardarzneimittel', 'ml', '', 'false')
    write2DBDrug('Neomycin-Penicillin', '837660', '20', 'Fütterungsarzneimittel', 'ml', '', 'false')
    write2DBDrug('Oxytetracyclin', '13910', '100', 'Standardarzneimittel', 'ml', '', 'false')
    write2DBDrug('Porcilis M Hyo', '838068', '0', 'Homöopathika', 'ml', '', 'false')
    write2DBDrug('Repose 500', '838093', '17', 'Biologika', 'ml', '', 'false')
    write2DBDrug('Dinolytic 5 mg/ml', '8-00003', '1', 'Standardarzneimittel', 'ml', '9088881277538', 'false')
    write2DBDrug('Parvoruvac', '8-20066', '0', 'Standardarzneimittel', 'ml', '3411112293773', 'false')
}

function sampleLivestocks() {
    write2DBLivestockTester('2019-05-31', 'yellow', '1234', 'Dekzentrum', 'A', '2019-06-01', 'example@example.com')
    write2DBLivestockTester('2019-05-02', 'red', '4567', 'Wartestall', 'A', '2019-04-01', 'example@example.com')
    write2DBLivestockTester('2019-05-01', 'green', '8743', 'Abferkelbox', 'D', '2019-05-21', 'example@example.com')
    write2DBLivestockTester('2019-05-30', 'blue', '1256', 'Futterventile', 'A', '2019-06-26', 'example@example.com')
    write2DBLivestockTester('2019-05-27', 'orange', '7890', 'Abferkelbox', 'C', '2019-04-12', 'example@example.com')
    write2DBLivestockTester('2019-05-09', 'white', '3456', 'Abferkelbox', 'C', '2019-03-01', 'example@example.com')
    write2DBLivestockTester('2019-05-03', 'red', '4390', 'Futterventile', 'A', '2019-01-01', 'example@example.com')
    write2DBLivestockTester('2019-05-19', 'blue', '4567', 'Wartestall', 'D', '2019-02-24', 'example@example.com')
    write2DBLivestockTester('2019-05-15', 'yellow', '1238', 'Dekzentrum', 'B', '2019-01-16', 'example@example.com')
    write2DBLivestockTester('2019-05-29', 'red', '9805', 'Dekzentrum', 'A', '2019-03-12', 'example@example.com')
}

//add livestock to database
async function write2DBLivestockTester(birthday, color, number, place, group, created, email) {
    await db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock (birthday, color, number, place, created, user, tagged, sync) VALUES (?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [birthday, color, number, place, created, email, "false", "true"],
            function (tx, result) {
                console.log("Livestock added")
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//ONLY FOR TESTING!!!!!
async function write2DBDrug(name, number, delay, category, drug_unit, barcode, tagged) {

    await db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO drugs (name, number, delay, category, drug_unit, barcode, tagged) VALUES (?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [name, number, delay, category, drug_unit, barcode, tagged],
            function (tx, result) {
                console.log("Drug added")
            },
            function (error) {
                console.log('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}