var eventTarget = "";
var LivestockLocationNbrs = "";
var LivestockPlaces = "";
var LivestockListLength = "";
var LivestockList = "";
var DrugNbrs = "";
var Drugs = "";
var DiagnosisNbrs = "";
var Diagnosis = "";
var AnimalSpeciesLength = "";
var AnimalSpeciesList = "";
var LivestockGroupListLength = "";
var LivestockGroupList = "";
var AnimalColorNbr = "";
var AnimalColor = "";

var EndpointLink = 'http://stablex-dev.eu-central-1.elasticbeanstalk.com'

//User Login
function RESTLogin() {
    // document.querySelector('#nav1').pushPage('home_splitter.html');
    var email = document.getElementById("email").value;
    var psw = document.getElementById("psw").value;
    var endpoint = EndpointLink + '/api/authentication/login'
    $.ajax({
        url: endpoint,
        crossDomain: true,
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
            localStorage.setItem("user_email", email);
            localStorage.setItem("bearerToken", token);

            // check if login is successfull
            if (response.success == true) {
                //get Livestock Database from server
                RESTGetLivestock()
                //get Livestock location
                RESTGetLocation()
                //get Drugs 
                RESTGetDrugs()
                //get Diagnosis 
                RESTGetDiagnosis()
                //get Animal Species 
                RESTGetAnimalSpecies()
                //get Animal Groups
                // RESTGetLivestockGroup()
                //get Animal Color
                RESTGetAnimalColor()
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
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/animal/getanimals'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        crossDomain: true,
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
            if (eventEnterPageId === 'Bestandsliste Arzneimittel') {
                document.querySelector('#nav1').popPage();
                updateLivestockView()
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock get failed! Error - ' + errorMessage);
        }
    });
}

//REST add Livestock 
function RESTAddLivestock(birthday, color, number, AnimalLocationId) {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/Animal/SaveAnimal'
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

//REST add group of livestocks 
function RESTAddLivestockGroup() {
    var place = document.getElementById("animalGroupPlaceText").innerHTML;
    var number = document.getElementById("animalGroupNumberText").value;
    var count = document.getElementById("animalGroupCountText").value;
    var category = document.getElementById("animalGroupCategoryText").innerHTML;
    var born = document.getElementById("animalGroupBornOnText").value;
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/animal/creategroupofanimals'
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
                "count": count,
                "animalLocationId": place,
                "animalSpeciesId": category,
                "birthday": born,
                "GroupName": number,
            }
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //check if livestock add is OK
            if (response.success === true) {
                document.querySelector('#nav1').popPage();
            } else {
                pushMsg(obj.messages[0].message)
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}

//REST get group of livestocks
function RESTGetLivestockGroup() {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/animal/getgroupofanimals'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        crossDomain: true,
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //get numbers of entries
            LivestockGroupListLength = data.split("id").length - 1;
            alert(LivestockGroupListLength)
            //save livestocks in global variable
            LivestockGroupList = obj.list;
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock Group get failed! Error - ' + errorMessage);
        }
    });
}

//REST delete Livestock 
function RESTDeleteAnimal(id) {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/Animal/DeleteAnimal'
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
            "id": id
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //check if livestock delete is OK
            if (response.success === true) {
                RESTGetLivestock();
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

//REST get all Livestocks
function RESTGetAnimalSpecies() {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/animalspecies/getanimalspecies'
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        crossDomain: true,
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //get numbers of entries
            AnimalSpeciesLength = data.split("id").length - 1;
            //save Animal Species in global variable
            AnimalSpeciesList = obj.list;
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock get species failed! Error - ' + errorMessage);
        }
    });
}

function RESTGetLocation() {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/Animallocation/Getanimallocations'
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
    var token = localStorage.getItem("bearerToken")
    var user_email = localStorage.getItem("user_email")
    var endpoint = EndpointLink + '/api/Animallocation/Saveanimallocation'
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
                "CreatedBy": user_email,
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
            alert('Save Location failed! Error - ' + errorMessage);
        }
    });
}

function RESTDeleteLocation(id) {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/Animallocation/Deleteanimallocation'
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
            "id": id
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            // check if new Location was successfully deleted
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

function RESTGetAnimalColor() {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/animalcolor/getanimalcolors'
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
            AnimalColorNbr = data.split("id").length - 1;
            //save places in global variable
            AnimalColor = obj.list;
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Get Animal Color failed! Error - ' + errorMessage);
        }
    });
}

function RESTGetDrugs() {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/Drug/GetDrugs'
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
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Get Drugs failed! Error - ' + errorMessage);
        }
    });
}

function RESTGetDiagnosis() {
    var token = localStorage.getItem("bearerToken")
    var endpoint = EndpointLink + '/api/Diagnosis/GetDiagnoses'
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
            DiagnosisNbrs = data.split("id").length - 1;
            //save drugs in global variable
            Diagnosis = obj.list;
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