document.addEventListener("init", function(event) {
  db = window.openDatabase("Database", "1.0", "LogC DB", 20 * 1024 * 1024);

  var NbrofCol = 10;

  $(document).ready(function() {
    if (localStorage.getItem("ScanQRData") === null) {
      localStorage.ScanQRData = "";
    }
    GetQRData();
  });

  function GetQRData() {
    var QRData = localStorage.ScanQRData;
    if (QRData == "") {
      document.getElementById("ScannerFab").style.visibility = "visible";
      document.getElementById("Date").innerHTML = "-";
      document.getElementById("Time").innerHTML = "-";
      document.getElementById("Supplier").innerHTML = "-";
      document.getElementById("Receiver").innerHTML = "-";
    } else {
      document.getElementById("CloseFab").style.visibility = "visible";
      document.getElementById("CheckFab").style.visibility = "visible";
      document.getElementById("ScanTab").getAttribute("badge");
      document.getElementById("ScanTab").setAttribute("badge", 1);
      var fields = QRData.split("+");
      document.getElementById("Date").innerHTML = fields[0];
      document.getElementById("Time").innerHTML = fields[1];
      document.getElementById("Supplier").innerHTML = fields[2];
      document.getElementById("Receiver").innerHTML = fields[3];


      for (i = 1; i <= QRData.split("+").length - 1; i = i + 2) {
        document.getElementById(i).innerHTML = fields[i + 3];
        document.getElementById(i + 1).value = fields[i + 4];
        document.getElementById(i + 1).style =
          "border: 0; text-align: center; font-family: Calibri; font-size: 18px; width: 30%";
      }
    }
  }
});
