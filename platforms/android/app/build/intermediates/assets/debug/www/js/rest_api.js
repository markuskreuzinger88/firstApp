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

//REST add Livestock
function RESTAddLivestock() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/api/Animal/SaveAnimal'
    alert(endpoint)
    $.ajax({
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "model": {
                "id": 0,
                "creationDate": "24.07.2019",
                "createdBy": "dummy@dummy.at",
                "customerId": 0,
                "typeId": 0,
                "number": 12,
                "color": "blue",
                "birthday": "24.07.2019",
                "isLocked": true
            }
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            alert(data)
            alert(response.success)
            write2DBLivestock()
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}

//REST add Livestock
function RESTGetLivestock() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/AniCare/api/Animal/GetAnimals'
    alert(endpoint)
    $.ajax({
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({}),
        success: function (response) {
            var data = JSON.stringify(response);
            alert(data)
            alert(response.success)
            write2DBLivestock()
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}

//REST add Livestock
function RESTLogin() {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/anicare/api/authentication/login'
    // var endpoint = 'http://localhost:62935/api/Animal/SaveAnimal'
    alert(endpoint)
    $.ajax({
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "userName": "AniCareAdmin",
            "password": "anicare"
        }),
        success: function (response) {
            var data = JSON.stringify(response);
            alert(data)
            alert(response.success)
            // write2DBLivestock()
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
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
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}