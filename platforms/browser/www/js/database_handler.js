db = window.openDatabase("Database", "1.0", "Nutztier db", 20 * 1024 * 1024); //create 20MB Database
var enterPage = ""
var MinLocationIDDB = "";
var MinAnimalIDDB = "";

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

//write a single new livestock to database
function writeLivestockDatabaseAndServer(id, birthday, color, number, place, created, user, tagged, guid) {
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock (id, birthday, color, number, place, created, user, tagged, guid) VALUES (?,?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [id, birthday, color, number, place, created, user, tagged, guid],
            function (tx, result) {
                //if data is successfully stored in DB and Networkconnection is valid --> write Data to Server DB
                if (networkConnection == true) {
                    RESTAddLivestock(birthday, color, number, place, created, email, guid)
                }
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//update DB LIvestock ID after sync with Server
function updateDBLivestockID(id, color, number) {
    alert("ID = " + id)
    db.transaction(function (tx) {
        tx.executeSql("UPDATE livestock SET id = ? WHERE color = ? and number = ?" [id, color, number]);
    });
}

// //delete Livestock from DB
// function deleteDBLivestock(color, number) {
//     alert("delete Livestock")
//     db.transaction(function (tx) {
//         tx.executeSql("DELETE FROM livestock WHERE color = ? and number = ?", [color, number]);
//     });
// }

// //write livestock list to Database
// //check first if ID already exists in Database
// //if ID exists than update Database entry else
// //insert entry to Database
// async function write2DBLivestockArr(id, birthday, color, number, place, created, email, guid) {
//     await db.transaction(function (tx) {
//         //search livestock in database
//         tx.executeSql('SELECT * FROM livestock WHERE id = ?', [id], function (tx, results) {
//             if (results.rows.length > 0) {
//                 //ID exits in Database
//                 tx.executeSql("UPDATE livestock SET birthday = ?, color = ?, number = ?, place = ?, created = ?, user = ?, tagged = ?, guid = ? WHERE id=?" [birthday, color, number, place, created, email, "false", guid, id]);
//             } else {
//                 //ID does not exits
//                 //Note: remove success and error function after development process 
//                 var executeQuery =
//                     "INSERT INTO livestock (id, birthday, color, number, place, created, user, tagged, guid) VALUES (?,?,?,?,?,?,?,?,?)";
//                 tx.executeSql(executeQuery, [id, birthday, color, number, place, created, email, "false", guid],
//                     function (tx, result) {
//                         console.log("success")
//                     },
//                     function (error) {
//                         alert('Error: ' + error.message + ' code: ' + error.code);
//                     });
//             }
//         }, null);
//     });
// }

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

// //Write Login Data to Database
// function write2DBLogin(firstname, lastname, token, lfbis) {
//     var email = document.getElementById("email").value;
//     var psw = document.getElementById("psw").value;
//     db.transaction(function (transaction) {
//         var executeQuery =
//             "INSERT INTO user (email, password, firstname, lastname, token, lfbis) VALUES (?,?,?,?,?,?)";
//         transaction.executeSql(executeQuery, [email, psw, firstname, lastname, token, lfbis],
//             function (tx, result) {
//                 //get Livestock Database from server
//                 RESTGetLivestock()
//                 //get Livestock location
//                 RESTGetLocation()
//                 document.querySelector('#nav1').pushPage('home_splitter.html');
//             },
//             function (error) {
//                 alert('Error: ' + error.message + ' code: ' + error.code);
//             });
//     });
// }


//write animal location to Database
function write2DBLocation(id, location) {
    db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO animal_location (id, location) VALUES (?,?)";
        transaction.executeSql(executeQuery, [id, location],
            function (tx, result) {
                getLocationDB()
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//delete animal location from Database
function deleteDBLocation(location) {
    var lastSelectedPlace = localStorage.getItem("livestockPlace");
    ons.notification.confirm({
        title: '',
        message: "Möchtest du " + '<b>' + location + '</b>' + " löschen?",
        cancelable: true,
        buttonLabels: ['Ja', 'Nein'],
        callback: function (index) {
            if (index == 0) {
                //delete local storage if last selected place is place to be deleted
                if (lastSelectedPlace == location) {
                    localStorage.removeItem('livestockPlace');
                    document.getElementById("livestockPlace").value = "Auswählen"
                }
                //remove from database
                db.transaction(function (tx) {
                        tx.executeSql('DELETE FROM animal_location WHERE location = ?', [location]);
                    },
                    function (error) {
                        alert('Error: ' + error.message + ' code: ' + error.code);
                    },
                    function () {
                        getLocationDB()
                    });
            }
        }
    })
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

//Function for get livestock unsafed items from database
function checkLivestockUnsafedIems() {
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM livestock WHERE id = ?', ['-1'], function (tx, results) {
            var data2Arr = Array.from(results.rows);
            alert("Unsafed ITEMS = " + results.rows.length)
            for (i = 0; i < results.rows.length; i++) {
                alert(data2Arr[i].birthday + " " + data2Arr[i].color + " " + data2Arr[i].number + " " + data2Arr[i].created + " " + data2Arr[i].user + " " + data2Arr[i].guid)
                RESTAddLivestock(data2Arr[i].birthday, data2Arr[i].color, data2Arr[i].number, "place_dummy", data2Arr[i].created, data2Arr[i].user, data2Arr[i].guid)
            };
        }, null);
    });
} 

// //Function get min ID from database
// function getMinIDDB() {
//     var DatabaseTables = ["animal_location", "livestock"];
//     for (i = 0; i < DatabaseTables.length; i++) {
//         console.log(DatabaseTables[i]); 
//         var testString = toString(DatabaseTables[i])
//         db.transaction(function (transaction) {
//             transaction.executeSql("SELECT MIN(id) FROM " + testString + "", [], function (tx, results) {
//                 var minID = (results.rows[0]["MIN(id)"]);
//                 //check if ID is negative
//                 if (Math.sign(minID) == "-1") {
//                     MinLocationIDDB = minID;
//                 } else {
//                     MinLocationIDDB = "0";
//                 }
//                 console.log("LocationID: " + MinLocationIDDB);
//                 return MinLocationIDDB;
//             }, null);
//             // transaction.executeSql('SELECT MIN(id) FROM livestock', [], function (tx, results) {
//             //     var minID = (results.rows[0]["MIN(id)"]);
//             //     MinAnimalIDDB = minID;
//             //     console.log("AnimalID: " + MinAnimalIDDB);
//             // }, null);
//         });
//     }
// }

//Function get max ID from database
function getMaxIDDB() {
    db.transaction(function (transaction) {
        console.log("MAX") 
        transaction.executeSql('SELECT MAX(id) FROM animal_location', [], function (tx, results) {
            console.log(results.rows[0]["MAX(id)"]);
        }, null);
    });
}

//add locations to database
async function write2DBLivestockLocationTester(id, location) {
    await db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO animal_location (id, location) VALUES (?,?)";
        transaction.executeSql(executeQuery, [id, location],
            function (tx, result) {
                console.log("Animal location added")
            },
            function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}

//add livestock to database
async function write2DBLivestockTester(id, birthday, color, number, place, created, email, guid) {
    await db.transaction(function (transaction) {
        var executeQuery =
            "INSERT INTO livestock (id, birthday, color, number, place, created, user, tagged, guid) VALUES (?,?,?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [id, birthday, color, number, place, created, email, "false", guid],
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