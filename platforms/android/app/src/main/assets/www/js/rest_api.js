var eventTarget = "";
var LivestockLocationNbrs = "";
var LivestockPlaces = "";
var LivestockListLength = "";
var LivestockList = "";
var DrugNbrs = "";
var Drugs = "";

document.addEventListener('init', function (event) {
    eventTarget = event.target
    // if (event.target.matches('#page1')) {
    //   ons.notification.alert('Page 1 is initiated.');
    //   // Set up content...
    // }
}, false);

//User Login
function RESTLogin() {
    // document.querySelector('#nav1').pushPage('home_splitter.html');
    var email = document.getElementById("email").value;
    var psw = document.getElementById("psw").value;
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/authentication/login'
    $.ajax({
        url: endpoint,
        // contentType: "application/x-www-form-urlencoded",
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "userName": email,
            "password": psw
        }),
        success: function (response) {
            var token = "bearer " + response.token
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);

            localStorage.setItem("firstname", response.user.firstName);
            localStorage.setItem("lastname", response.user.lastName);
            localStorage.setItem("password", response.user.password);
            localStorage.setItem("lfbis", response.customer.lfbisId);
            localStorage.setItem("bearerToken", token);

            // check if login is successfull
            if (response.success == true) {
                //get Livestock Database from server
                RESTGetLivestock()
                //get Livestock location
                RESTGetLocation()
                //get Drugs 
                RESTGetDrugs()
                document.querySelector('#nav1').pushPage('home_splitter.html');
            } else {
                pushMsg(obj.messages[0].message)
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Login failed! Error - ' + errorMessage);
        }
    });
}

//REST get all Livestocks
function RESTGetLivestock() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/Animal/GetAnimals'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //get numbers of entries
            LivestockListLength = data.split("id").length - 1;
            //save livestocks in global variable
            LivestockList = obj.list;
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock get failed! Error - ' + errorMessage);
        }
    });
}

//REST add Livestock 
function RESTAddLivestock(birthday, color, number, AnimalLocationId) {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/Animal/SaveAnimal'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "model": {
                "animalLocationId": AnimalLocationId,
                "typeId": 2,
                "number": number,
                "color": color,
                "birthday": birthday
            }
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //check if livestock add is OK
            if (response.success === true) {
                RESTGetLivestock()
                document.querySelector('#nav1').popPage();
            } else {
                //check if current page is livestock_add page
                // if (eventEnterPageId === 'livestock_add') {
                //     ons.notification.alert({
                //         message: 'Nutztier ist bereits in der Datenbank hinterlegt',
                //         title: 'Nutztier vorhanden',
                //     });
                // }
                pushMsg(obj.messages[0].message)
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}

//REST delete Livestock 
function RESTDeleteAnimal(id) {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/Animal/DeleteAnimal'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "model": {
                "ID": id
            }
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //check if livestock delete is OK
            if (response.success === true) {
                document.querySelector('#nav1').popPage();
            } else {
                pushMsg(obj.messages[0].message)
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock delete failed! Error - ' + errorMessage);
        }
    });
}

function RESTGetLocation() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/Animallocation/Getanimallocations'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //get numbers of entries
            LivestockLocationNbrs = data.split("id").length - 1;
            //save places in global variable
            LivestockPlaces = obj.list;
            if (eventEnterPageId === 'livestock_add') {
                updateLivestockLocations()
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Get Location failed! Error - ' + errorMessage);
        }
    });
}

function RESTSaveLocation(location) {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/Animallocation/Saveanimallocation'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "model": {
                "CreatedBy": "IMPORT_STABLEX",
                "CustomerId": 20,
                "name": location
            }
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            // check if new Location was successfully saved
            if (response.success == true) {
                RESTGetLocation()
            } else { 
                pushMsg(obj.messages[0].message) 
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Get Location failed! Error - ' + errorMessage);
        }
    });
}

function RESTGetDrugs() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/stablex/api/Drug/GetDrugs'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //get numbers of entries
            DrugNbrs = data.split("id").length - 1;
            //save drugs in global variable
            Drugs = obj.list;
            console.log("WWWWWWWWWWWWWWWWWWWWW")
            console.log(obj.list)
            console.log(DrugNbrs)   
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Get Drugs failed! Error - ' + errorMessage);
        }
    });
}

pushMsg = function (msg) {
    ons.notification.toast(msg, {
        timeout: 3000,
        animation: 'fall'
    })
}