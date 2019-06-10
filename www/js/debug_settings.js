document.addEventListener("init", function (event) {
    if ("settings_request" in localStorage) {
        switchState = localStorage.getItem("settings_request")
        if (switchState == 'true') {
            document.getElementById("switch").checked = true
        } else {
            document.getElementById("switch").checked = false
        }
    }
    if ("settings_credentials" in localStorage) {
        switchStateCredentials = localStorage.getItem("settings_credentials")
        if (switchStateCredentials == 'true') {
            document.getElementById("switchCredentials").checked = true
        } else {
            document.getElementById("switchCredentials").checked = false
        }
    }
    if ("settings_ipAdress" in localStorage) {
        document.getElementById("ipAdress").value = localStorage.getItem("settings_ipAdress")
    } else {
        ipAdress = document.getElementById("ipAdress").value
        localStorage.setItem("settings_ipAdress", ipAdress);
    }
});

function switchFunc() {
    switchState = document.getElementById("switch").checked
    localStorage.setItem("settings_request", switchState);
}

function inputFunc() {
    ipAdress = document.getElementById("ipAdress").value
    localStorage.setItem("settings_ipAdress", ipAdress);
}

function switchFuncCredentials() {
    switchState = document.getElementById("switchCredentials").checked
    localStorage.setItem("settings_credentials", switchState);
    if (switchState == true) {
        document.getElementById("firstname").value = "Max";
        document.getElementById("lastname").value = "Muster";
        document.getElementById("email").value = "AniCareAdmin";
        document.getElementById("psw").value = "anicare";
    } else {
        document.getElementById("firstname").value = "";
        document.getElementById("lastname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("psw").value = "";
    }
}