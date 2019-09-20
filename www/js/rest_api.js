var eventTarget = "";

document.addEventListener('init', function (event) {
    eventTarget = event.target
    // if (event.target.matches('#page1')) {
    //   ons.notification.alert('Page 1 is initiated.');
    //   // Set up content...
    // }
}, false);

//REST Login
// function RESTLogin() {
//     var DEBUGIP = localStorage.getItem("settings_ipAdress")
//     var DEBUGCredentials = localStorage.getItem("settings_credentials")
//     var email = document.getElementById("email").value;
//     var psw = document.getElementById("psw").value;
//     // var endpoint = 'http://' + DEBUGIP + '/AniCare/api/token'
//     var endpoint = 'https://' + DEBUGIP + ':44350/api/authentification/login'
//     // var data = "grant_type=password&username=" + email + "&password=" + psw + "&client_id=app";
//     // alert("Endpoint: " + endpoint + "\n" + "Data: " + data)
//     alert(endpoint)
//     $.ajax({
//         url: endpoint,
//         // contentType: "application/x-www-form-urlencoded",
//         contentType: "application/json",
//         type: "POST",
//         // data: data,
//         data: JSON.stringify({
//             "password": 'test',
//             "userName": 'password'
//         }),
//         success: function (response) {
//             console.log(response)
//             alert(response)
//             // var bearerToken = "Bearer " + response.access_token
//             // var refreshToken = response.refresh_token
//             // alert(bearerToken)
//             // RESTAddDrug(bearerToken)
//             // write2DBLogin(bearerToken, refreshToken)
//         },
//         error: function (xhr, status, error) {
//             var errorMessage = xhr.status + ': ' + xhr.statusText
//             alert('Login failed! Error - ' + errorMessage);
//         }
//     });
// }

// {
//     "criterion": [
//       {
//         "expression": 3,
//         "parameter": [
//           "Id", 0
//         ],
//         "criterion": [
//           {}
//         ]
//       }
//     ]
//   }

//REST add Livestock 

async function RESTAddLivestock(born, color, number, place, actualDate, email, guid) {
    alert("hallo")
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/AniCare/api/Animal/SaveAnimal'
    await $.ajax({
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "model": {
                "id": 0,
                "creationDate": actualDate,
                "createdBy": email,
                "typeId": 2,
                "number": number,
                "color": color,
                "birthday": born,
                "isLocked": false
            }
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            alert("Response ID = " + response.id)
            //check if livestock add is OK
            if (response.success === true) {
                //update ID if trasnsfer to Server was successfully
                updateDBLivestockID(response.id, color, number)
                document.querySelector('#nav1').popPage();
            } else {
                //delete livestock if it already exists on server
                deleteDBLivestock(color, number)
                //check if current page is livestock_add page
                if (eventTarget.matches('#livestock_add')) {
                    ons.notification.alert({
                        message: 'Nutztier ist bereits in der Datenbank hinterlegt',
                        title: 'Nutztier vorhanden',
                    });
                }
                //pushMsg(obj.messages[0].message)
            }
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}

//REST get Livestock
function RESTGetLivestock() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    var endpoint = 'http://' + DEBUGIP + '/AniCare/api/Animal/GetAnimals'
    //var endpoint = 'http://' + DEBUGIP + '/api/Animal/GetAnimals'
    $.ajax({
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //     'Authorization': token
        // },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            var obj = JSON.parse(data);
            //get numbers of entries
            var LivestockNbrs = data.split("id").length - 1;
            alert(LivestockNbrs)
            //update livestock view in livestock.js file
            //save data to local database in second step (wait done)
            updateLivestockView(obj.list, LivestockNbrs).done(write2DBServerLivestockData(obj, LivestockNbrs));
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock get failed! Error - ' + errorMessage);
        }
    });
}

//write Server Data to local database
//GUID NOT IMPLEMENTED ON SERVER!!!!!!!!!!!!!!!
function write2DBServerLivestockData(obj, LivestockNbrs) {
    for (i = 0; i < LivestockNbrs; i++) {
        write2DBLivestockArr(obj.list[i].id, obj.list[i].birthday, obj.list[i].color, obj.list[i].number, "dummy", obj.list[i].creationDate, obj.list[i].createdBy, "guid_dummy")
    };
}

//User Login
//username: AniCareAdmin
//password: anicare
function RESTLogin() {
    document.querySelector('#nav1').pushPage('home_splitter.html');
    // var email = document.getElementById("email").value;
    // var psw = document.getElementById("psw").value;
    // var DEBUGIP = localStorage.getItem("settings_ipAdress")
    //  var endpoint = 'http://' + DEBUGIP + '/anicare/api/authentication/login'
    // //var endpoint = 'http://' + DEBUGIP + '/api/authentication/login'
    // $.ajax({
    //     url: endpoint,
    //     // contentType: "application/x-www-form-urlencoded",
    //     contentType: "application/json",
    //     type: "POST",
    //     data: JSON.stringify({
    //         "userName": email,
    //         "password": psw
    //     }),
    //     success: function (response) {
    //         console.log(response)
    //         var firstname = response.user.firstName
    //         var lastname = response.user.lastName
    //         var password = response.user.password
    //         var lfbis = response.customer.lfbisId
    //         var token = "bearer " + response.token
    //         localStorage.setItem('bearerToken', token);
    //         var data = JSON.stringify(response);
    //         var obj = JSON.parse(data);
    //         alert(password)
    //         //EncryptData = CryptoJS.AES.encrypt(CommonColData + "+" + device.uuid + "+" + hash, LogContractAESKey);
    //         //localStorage.QRData = EncryptData;


    //         // check if login is successfull
    //         if (response.success == true) {
    //             write2DBLogin(firstname, lastname, token, lfbis)
    //         } else {
    //             pushMsg(obj.messages[0].message)
    //         }
    //     },
    //     error: function (xhr, status, error) {
    //         var errorMessage = xhr.status + ': ' + xhr.statusText
    //         alert('Login failed! Error - ' + errorMessage);
    //     }
    // });
}

function RESTGetLocation() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var token = localStorage.getItem("bearerToken")
    // var endpoint = 'http://' + DEBUGIP + '/AniCare/api/Animal/GetAnimals'
    var endpoint = 'http://' + DEBUGIP + '/api/Animallocation/Getanimallocations'
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
            var id = response.list.id
            var locations = response.list.name
            console.log('HHHHHHHH')
            console.log(response)
            alert(response.list.name)
            write2DBLocation(id, locations)
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
    // var endpoint = 'http://' + DEBUGIP + '/AniCare/api/Animal/GetAnimals'
    var endpoint = 'http://' + DEBUGIP + '/api/Animallocation/Getanimallocations'
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
            var id = response.list.id
            var locations = response.list.name
            console.log('HHHHHHHH')
            console.log(response)
            alert(response.list.name)
            write2DBLocation(id, locations)
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


var test = {
    "model": {
        "id": 0,
        "creationDate": "2019-05-19T18:03:45.135Z",
        "createdBy": "string",
        "name": "string",
        "note": "string",
        "approvalNumber": "string",
        "unitCode": "string"
    }
}

//REST add drug
function RESTAddDrug(bearerToken) {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/AniCare/Drug/SaveDrug?api_key=AniCareAdmin%3Aanicare'
    alert(endpoint)
    alert(bearerToken)
    alert(test)
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearerToken
        },
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "model": {
                "id": 0,
                "creationDate": '19.05.2019',
                "createdBy": 'me',
                "name": 'Aconitum RemaVet',
                "note": 0,
                "approvalNumber": '838031',
                "unitCode": "test"
            }
        }),
        // data : JSON.stringify(test),
        success: function (response) {
            var data = JSON.stringify(response);
            alert(data)
            alert(response.success)
            write2DBLivestock()
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Add Drugs failed! Error - ' + errorMessage);
        }
    });
}