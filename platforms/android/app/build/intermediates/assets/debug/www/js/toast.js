document.addEventListener("init", function (event) {
    var toastShow = 0;
    var toastHide = 0;

    setInterval(function () {
        var networkState = navigator.connection.type;
        if (networkState === Connection.NONE) {
            toastHide = 0;
            if (toastShow == 0) {
                document.querySelector("ons-toast").show();
                toastShow = 1;
            }
        } else {
            toastShow = 0;
            if (toastHide == 0) {
                document.querySelector("ons-toast").hide();
                toastHide = 1;
            }
        }
    }, 1000);
});
