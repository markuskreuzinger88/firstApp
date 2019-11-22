document.addEventListener("init", function (event) {
    if ("settings_ipAdress" in localStorage) {
        document.getElementById("ipAdress").value = localStorage.getItem("settings_ipAdress")
    } else {
        ipAdress = document.getElementById("ipAdress").value
        localStorage.setItem("settings_ipAdress", ipAdress);
    }
});

function inputFunc() {
    ipAdress = document.getElementById("ipAdress").value
    localStorage.setItem("settings_ipAdress", ipAdress);
}
