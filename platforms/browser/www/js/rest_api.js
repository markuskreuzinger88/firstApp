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
function RESTAddLivestock(born, color, number, place, actualDate, email) {
    var DEBUGIP = localStorage.getItem("settings_ipAdress")
    var endpoint = 'http://' + DEBUGIP + '/AniCare/api/Animal/SaveAnimal'
    $.ajax({
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
            //check if livestock add is OK
            if (response.success === true) {
                write2DBLivestock(born, color, number, place, actualDate, email)
                // document.querySelector('#nav1').popPage();
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
            var obj = JSON.parse(data);
            alert(data)
            //get numbers of entries
            var LivestockNbrs = data.split("id").length - 1;

            for (i = 0; i < LivestockNbrs; i++) {
                // alert(obj.list[i].id)
                write2DBLivestockArr(obj.list[i].birthday, obj.list[i].color, obj.list[i].number, "dummy", obj.list[i].creationDate, obj.list[i].createdBy)
                // write2DBActionArr2(arrType[i], arrCreatedOnDate[i], arrCreatedOnTime[i], arrTextarea[i], result, arrFuture[i], display)
            };

            
            // alert(data)
            // alert(response.success)
            // var res = data.split('{')
            // alert(data.split("id").length - 1)
            //write2DBLivestock()
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}

//User Login
//username: AniCareAdmin
//password: anicare
function RESTLogin() {
    document.querySelector('#nav1').pushPage('home_splitter.html');
    // var email = document.getElementById("email").value;
    // var psw = document.getElementById("psw").value;
    // var DEBUGIP = localStorage.getItem("settings_ipAdress")
    // var endpoint = 'http://' + DEBUGIP + '/anicare/api/authentication/login'
    // $.ajax({
    //     url: endpoint,
    //     contentType: "application/json",
    //     type: "POST",
    //     data: JSON.stringify({
    //         "userName": email,
    //         "password": psw
    //     }),
    //     success: function (response) {
    //         var data = JSON.stringify(response);
    //         var obj = JSON.parse(data);
    //         //check if login is successfull
    //         if (response.success === true) {
    //             write2DBLogin()
    //         } else {
    //             pushMsg(obj.messages[0].message)
    //         }
    //     },
    //     error: function (xhr, status, error) {
    //         var errorMessage = xhr.status + ': ' + xhr.statusText
    //         alert('Livestock add failed! Error - ' + errorMessage);
    //     }
    // });
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
            alert('Livestock add failed! Error - ' + errorMessage);
        }
    });
}