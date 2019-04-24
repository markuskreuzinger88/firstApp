document.addEventListener("init", function (event) {
    var db = window.openDatabase("Database", "1.0", "LogC DB", 20 * 1024 * 1024);
    var LogFieldarr = [];
    var LogFieldarrSort = [];
    var res = [];
    var ArraySort = [];
    var NbrLogFields = 5;

    function ReadDBLog() {
        db.transaction(
            function (tx) {
                tx.executeSql(
                    "SELECT * FROM LOGS", [],
                    function (tx, results) {
                        LogFieldarr.push(results.rows.item(27).log);
                        LogFieldarr.push(results.rows.item(28).log);
                        LogFieldarr.push(results.rows.item(29).log);
                        LogFieldarr.push(results.rows.item(30).log);
                        LogFieldarr.push(results.rows.item(31).log);
                    },
                    null
                );
            },
            function (error) {
                alert("Error: " + error.message + " code: " + error.code);
            },
            function (success) {
                SortArray();
            }
        );
    }
    setTimeout(ReadDBLog, 10);

    function SortArray() {
        LogFieldarr.sort(function (a, b) {
            //sort arry by timestmap
            //split field and get first string --> timestamp
            //return a.split('+')[0] - b.split('+')[0];
            return b.split("+")[0] - a.split("+")[0];
        });
        CreateCard();
    }

    function CreateCard() {
        for (i = 1; i <= NbrLogFields; i = i + 1) {
            //check if array is not empty
            if (LogFieldarr[i - 1].length != 0) {
                $("#DivLog").remove();
                var Card = document.getElementById("Card" + i);
                document.getElementById("Card" + i).style.visibility = "visible";
                var fields = LogFieldarr[i - 1].split("+");
                var fieldlength = LogFieldarr[i - 1].split("+").length - 1;
                document.getElementById("MsgTypCard" + i).innerHTML = fields[1];
                document.getElementById("DateCard" + i).innerHTML = fields[2];
                document.getElementById("TimeCard" + i).innerHTML = fields[3];
                document.getElementById("SupplierCard" + i).innerHTML = fields[4];
                document.getElementById("ReceiverCard" + i).innerHTML = fields[5];
                //first check if element TR already exists
                var elementExists = "TableCard" + i;
                if (document.getElementById(elementExists)) {} else {
                    var Table = document.createElement("TABLE");
                    Table.setAttribute(
                        "style",
                        "width: 53%; margin-left: 10px; border-spacing: 0 10px;"
                    );
                    for (j = 1; j <= fieldlength; j = j + 2) {
                        //check if valid data is between ++
                        if (fields[j + 5] === "") {
                            break;
                        } else {
                            var Row = document.createElement("TR");
                            Row.setAttribute("ID", "TableCard" + i);
                            Row.setAttribute("style", "margin-top: 50px;");
                            var x = Row.insertCell(0);
                            //                            x.setAttribute("style", "border: 1px solid black;");
                            var y = Row.insertCell(1);
                            x.innerHTML = fields[j + 5];
                            y.innerHTML = fields[j + 6];
                            Table.appendChild(Row);
                            Card.appendChild(Table);
                        }
                    }
                }
            }
        }
    }
});
