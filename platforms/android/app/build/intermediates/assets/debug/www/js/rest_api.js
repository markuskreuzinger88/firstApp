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
var AnimalColorNbr = "";
var UnitsLength = "";
var UnitsList = "";

// var BaseUrl = 'http://3.126.208.157:81' 
var BaseUrl = 'http://ec2-3-126-208-157.eu-central-1.compute.amazonaws.com:81' 

//User  Login
function RESTLogin() {
    const loginParameter = new LoginParameter();

    loginParameter.UserName = document.getElementById("email").value;
    loginParameter.Password = document.getElementById("psw").value;

    const newAuth = new AuthenticationClient();

    newAuth.Login(loginParameter, function (response) {
        var token = "bearer " + response.token
        localStorage.setItem("firstname", response.user.firstName);
        localStorage.setItem("lastname", response.user.lastName);
        localStorage.setItem("password", response.user.password);
        localStorage.setItem("lfbis", response.customer.lfbisId);
        localStorage.setItem("user_email", email);
        localStorage.setItem("bearerToken", token);
        //check if login is successfull
        if (response.success == true) {
            //get Livestock Database from server
            RESTGetLivestock()
            //get Livestock location
            RESTGetLocation()
            //get Drugs 
            RESTGetDrugs()
            // //get Diagnosis 
            // RESTGetDiagnosis()
            //get Animal Species 
            RESTGetAnimalSpecies()
            //get Animal Groups
            RESTGetAnimalGroup()
            //get Animal Color
            RESTGetAnimalColor()
            //get Units
            RESTGetUnits()
            document.querySelector('#nav1').pushPage('home_splitter.html');
        } else {
            pushMsg(obj.messages[0].message)
        }
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Login failed! Error - ' + errorMessage);
    });
}

//REST get all Livestocks
function RESTGetLivestock() {

    const getParameter = new APIGetParameter();
    const newGetAnimals = new AnimalClient();

    newGetAnimals.GetAnimals(getParameter, function (response) {
        var data = JSON.stringify(response);
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
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Animals failed! Error - ' + errorMessage);
    });
}

//REST add Livestock 
function RESTAddLivestock(birthday, color, number, AnimalLocationId) {

    alert(birthday +" "+ color +" "+ number +" "+ AnimalLocationId)
    var newAnimalModel = new AnimalModel();
    
    newAnimalModel.AnimalLocationId = AnimalLocationId;
    newAnimalModel.Color = color;
    newAnimalModel.Number = number;
    newAnimalModel.Birthday = birthday;

    var newSaveAnimalParameter = new SaveAnimalParameter();
    newSaveAnimalParameter.model = newAnimalModel;

    var newAnimalClient = new AnimalClient();  

    newAnimalClient.SaveAnimal(newSaveAnimalParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //check if livestock add is OK
        if (response.success === true) {
            RESTGetLivestock()
            document.querySelector('#nav1').popPage();
        } else {
            pushMsg(obj.messages[0].message)
        }
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Animal Save failed! Error - ' + errorMessage);
    });
}

//REST add Livestock 
function RESTUpdateLivestock(ID, born, color, number, AnimalLocationId) {
    alert('hallo')
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
                "id": ID,
                "animalLocationId": AnimalLocationId,
                "typeId": 2,
                "number": number,
                "color": color,
                "birthday": born
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

    const newCreateGroupOfAnimalsParameter = new CreateGroupOfAnimalsParameter();
    
    newCreateGroupOfAnimalsParameter.Count = document.getElementById("animalGroupCountText").value;
    newCreateGroupOfAnimalsParameter.AnimalLocationId = document.getElementById("animalGroupPlaceText").innerHTML;
    newCreateGroupOfAnimalsParameter.AnimalLocationBoxNumber = document.getElementById("animalGroupNumberText").value;
    newCreateGroupOfAnimalsParameter.AnimalSpeciesId = document.getElementById("animalGroupCategoryText").innerHTML;
    newCreateGroupOfAnimalsParameter.Birthday = document.getElementById("animalGroupBornOnText").value;
    newCreateGroupOfAnimalsParameter.GroupName = document.getElementById("animalGroupCategoryText").innerHTML;

    const newAnimalClient = new AnimalClient();

    newAnimalClient.CreateGroupOfAnimals(newCreateGroupOfAnimalsParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //check if livestock group add is OK
        if (response.success === true) {
            document.querySelector('#nav1').popPage();
        } else {
            pushMsg(obj.messages[0].message)
        }
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Animal Group Save failed! Error - ' + errorMessage);
    });
}

//REST get group of livestocks
function RESTGetAnimalGroup() {

    const getParameter = new APIGetParameter();
    const newAnimalGroupClient = new AnimalGroupClient();

    newAnimalGroupClient.GetAnimalGroups(getParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //get numbers of entries
        LivestockGroupListLength = data.split("id").length - 1;
        //save livestocks in global variable
        LivestockGroupList = obj.list;
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Animal Group failed! Error - ' + errorMessage);
    });
}

//REST get group of livestocks
function RESTGetUnits() {

    const getParameter = new APIGetParameter();
    const newUnitClient = new UnitClient();

    newUnitClient.GetUnits(getParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //get numbers of entries
        UnitsLength = data.split("id").length - 1;
        //save livestocks in global variable
        UnitsList = obj.list;
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Units failed! Error - ' + errorMessage);
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

    const getParameter = new APIGetParameter();
    const newAnimalSpeciesClient = new AnimalSpeciesClient();

    newAnimalSpeciesClient.GetAnimalSpecies(getParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //get numbers of entries
        AnimalSpeciesLength = data.split("id").length - 1;
        //save Animal Species in global variable
        AnimalSpeciesList = obj.list;
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Drugs failed! Error - ' + errorMessage);
    });
}

function RESTGetLocation() {

    const getParameter = new APIGetParameter();
    const newAnimalLocation = new AnimalLocationClient();

    newAnimalLocation.GetAnimalLocations(getParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //get numbers of entries
        LivestockLocationNbrs = data.split("id").length - 1;
        //save places in global variable
        LivestockPlaces = obj.list;

        if (eventEnterPageId === 'livestock_add') {
            updateLivestockLocations()
        }
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Animals Location failed! Error - ' + errorMessage);
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

    const getParameter = new APIGetParameter();
    const newAnimalColorClient = new AnimalColorClient();

    newAnimalColorClient.GetAnimalColors(getParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //get numbers of entries
        AnimalColorNbr = data.split("id").length - 1;
        //save places in global variable
        AnimalColor = obj.list;
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Animal Group failed! Error - ' + errorMessage);
    });
}

function RESTGetDrugs() {

    const getParameter = new APIGetParameter();
    const newDrugClient = new DrugClient();

    newDrugClient.GetDrugs(getParameter, function (response) {
        var data = JSON.stringify(response);
        var obj = JSON.parse(data);
        //get numbers of entries
        DrugNbrs = data.split("id").length - 1;
        //save drugs in global variable
        Drugs = obj.list;
        if (eventEnterPageId === 'livestock_add') {
            updateLivestockLocations()
        }
    }, function (xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Get Drugs failed! Error - ' + errorMessage);
    });
}

pushMsg = function (msg) {
    ons.notification.toast(msg, {
        timeout: 3000,
        animation: 'fall'
    })
}