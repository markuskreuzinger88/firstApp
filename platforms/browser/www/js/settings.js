document.addEventListener("init", function (event) {
    db = window.openDatabase("Database", "1.0", "LogC DB", 20 * 1024 * 1024);

    //  function readDB() {
    db.transaction(function (tx) {
        tx.executeSql(
            "SELECT * FROM LOGS", [],
            function (tx, results) {
                //get password
                localStorage.Password = results.rows.item(4).log;
                //get settings
                var fields = results.rows.item(18).log.split("+");
                localStorage.SoundSetting = fields[0];
                localStorage.PasswordSetting = fields[1];
                document.getElementById("SoundSwitch").checked = JSON.parse(fields[0]);
                document.getElementById("PasswordSwitch").checked = JSON.parse(
                    fields[1]
                );
            },
            null
        );
    });
    //  }
});
