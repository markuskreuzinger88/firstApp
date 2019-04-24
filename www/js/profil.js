document.addEventListener("init", function(event) {
  db = window.openDatabase("Database", "1.0", "LogC DB", 20 * 1024 * 1024);

  db.transaction(function(tx) {
    tx.executeSql(
      "SELECT * FROM LOGS",
      [],
      function(tx, results) {
        document.getElementById("email").innerHTML = results.rows.item(1).log;
        document.getElementById("firstname").innerHTML = results.rows.item(
          2
        ).log;
        document.getElementById("lastname").innerHTML = results.rows.item(
          3
        ).log;
        document.getElementById("handynummer").innerHTML = results.rows.item(
          0
        ).log;
        document.getElementById("chosenCompany").innerHTML = results.rows.item(
          7
        ).log;
      },
      null
    );
  });
});
