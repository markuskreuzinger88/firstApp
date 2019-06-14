    db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
    var LiveStockNbr = "AT-3-4321056-"
    var leavePage = "";

    //detect if livestock add is popped, then update livestock view on page livestock
    $(document).on('prepop', '#nav1', function (event) {
        var event = event.originalEvent;
        if (event.enterPage.id === 'livestock') {
            readDBLivestock()
        }
    });

    $(document).on('postpush', '#nav1', function (event) {
        var event = event.originalEvent;
        leavePage = event.leavePage.id;
        if (event.enterPage.id === 'livestock') {
            readDBLivestock()
        }
    });

    function readDBLivestock() {
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        localStorage.removeItem('ColorFilter');
        localStorage.setItem('DBSort', "checkSort-1");
        localStorage.removeItem('PlaceFilter');
        if (leavePage == "drug_delivery") {
            col = document.getElementById("actionCol").innerHTML = "Scannen"
            icon = document.createElement("ons-icon")
            icon.setAttribute("icon", "fa-qrcode")
            icon.setAttribute("style", "margin-left: 10px");
            document.getElementById("actionCol").appendChild(icon);
        }
        ShowResultDBSort('SELECT * FROM livestock ORDER BY Number DESC')
    }

    function showTemplateDialogView(my_dialog, my_dialog_html) {

        var dialog = document.getElementById(my_dialog);

        if (dialog) {
            dialog.show();
        } else {
            ons.createElement(my_dialog_html, {
                    append: true
                })
                .then(function (dialog) {
                    dialog.show();
                });
        }
    };

    //do not know how to use one or two command in function. this is only a workaround
    function DisplayResult(results) {
        for (i = 0; i < results.rows.length; i++) {
            list = document.createElement("ons-list-item")
            div_center = document.createElement("div")
            div_center.setAttribute("id", i);
            div_center.setAttribute("class", "center");
            div_center.setAttribute("style", "margin-left: 10px");
            span_center1 = document.createElement("span")
            span_center1.setAttribute("id", "livestockID" + i);
            span_center2 = document.createElement("span")
            span_center1.setAttribute("class", "list-item__title");
            span_center2.setAttribute("class", "list-item__subtitle");
            span_center1.innerHTML = LiveStockNbr + results.rows.item(i).number;
            span_center2.innerHTML = results.rows.item(i).place + "<br>" +
                results.rows.item(i).born;
            div_left = document.createElement("div")
            div_left.setAttribute("class", "left");
            input = document.createElement("input")
            input.setAttribute("id", "livestockColor" + i);
            input.setAttribute("style",
                "width: 40px; height :40px;margin-right: 5px;border-color : black; border: 2px solid black; border-radius: 10px; background-color:" + results.rows
                .item(i).color);
            input.setAttribute("disabled", "true");
            list.setAttribute("tappable", true);
            //modify selection depending on last site --> when last page drug delivery
            //use tag icon else use chevron
            if (leavePage == "drug_delivery") {
                list.setAttribute("onclick", "livestockTag(" + i + ")");
                div_right = document.createElement("ons-checkbox")
                div_right.setAttribute("class", "right");
                div_right.setAttribute("id", "tag" + i);
                div_right.setAttribute("onclick", "livestockTag(" + i + ")");
                if (results.rows.item(i).tagged == "true") {
                    div_right.checked = true;
                } else {
                    div_right.checked = false;
                }
                list.appendChild(div_right);
                document.getElementById('livestockFab').style.visibility = 'visible';
            } else {
                list.setAttribute("modifier", "chevron");
                list.setAttribute("onclick", "livestockDetail(" + i + ")");
            }
            div_left.appendChild(input);
            list.appendChild(div_left);
            div_center.appendChild(span_center1);
            div_center.appendChild(span_center2);
            list.appendChild(div_center);
            document.getElementById("containerLivestock").appendChild(list);
        }
    }

    //remove Livestock Tag for drug delivery
    function livestockTag(id) {
        var tag = document.getElementById("tag" + id);
        var color = document.getElementById("livestockColor" + id).style.backgroundColor;
        var number = document.getElementById("livestockID" + id).innerHTML;
        console.log(number)
        //only use livestock 4 digit number
        number = number.slice(number.length - 4, number.length);
        console.log(number)
        console.log(id)
        console.log(tag.checked)
        if (tag.checked == true) {
            tag.checked = false
            db.transaction(function (tx) {
                tx.executeSql("UPDATE livestock SET tagged=? where Color = ? AND Number = ?", ['false',
                    color, number
                ]);
            });
        } else {
            tag.checked = true
            db.transaction(function (tx) {
                tx.executeSql("UPDATE livestock SET tagged=? where Color = ? AND Number = ?", ['true',
                    color, number
                ]);
            });
        }
    }

    //Function for use color and place filter in Database
    function ShowResultDBColorPlaceFilter(Command1, Command2, Command3) {
        db.transaction(function (transaction) {
            transaction.executeSql(Command1, [Command2, Command3], function (tx, results) {
                DisplayResult(results)
            }, null);
        });
    }

    //Function for use color filter in Database
    function ShowResultDBColorFilter(Command1, Command2) {
        db.transaction(function (transaction) {
            transaction.executeSql(Command1, [Command2], function (tx, results) {
                DisplayResult(results)
            }, null);
        });
    }

    //Function for sort Database
    function ShowResultDBSort(Command) {
        console.log("READ DATABASE")
        db.transaction(function (transaction) {
            transaction.executeSql(Command, [], function (tx, results) {
                console.log(results)
                DisplayResult(results)
            }, null);
        });
    }

    //Command for Database sort or filter or search
    function CommandDB() {
        //delete actual container
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        console.log(localStorage.ColorFilter)
        console.log(localStorage.PlaceFilter)
        var ColorFilter = localStorage.ColorFilter
        var PlaceFilter = String(localStorage.PlaceFilter)
        var Checkbox = localStorage.DBSort
        if (Checkbox == "checkSort-1") {
            if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null)) {
                ShowResultDBSort('SELECT * FROM livestock ORDER BY Number DESC')
            } else if ((localStorage.getItem("ColorFilter") !== null) && (localStorage.getItem("PlaceFilter") ===
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Color = ? ORDER BY Number DESC', ColorFilter)
            } else if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") !==
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Place = ? ORDER BY Number DESC', PlaceFilter)
            } else {
                ShowResultDBColorPlaceFilter(
                    'SELECT * FROM Nutztiere WHERE Color = ? and Place = ? ORDER BY Number DESC', ColorFilter,
                    PlaceFilter)
            }
        } else if (Checkbox == "checkSort-2") {
            if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null)) {
                ShowResultDBSort('SELECT * FROM livestock ORDER BY Number ASC')
            } else if ((localStorage.getItem("ColorFilter") !== null) && (localStorage.getItem("PlaceFilter") ===
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Color = ? ORDER BY Number ASC', ColorFilter)
            } else if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") !==
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Place = ? ORDER BY Number ASC', PlaceFilter)
            } else {
                ShowResultDBColorPlaceFilter(
                    'SELECT * FROM livestock WHERE Color = ? and Place = ? ORDER BY Number ASC', ColorFilter,
                    PlaceFilter)
            }
        } else if (Checkbox == "checkSort-3") {
            if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null)) {
                ShowResultDBSort('SELECT * FROM livestock ORDER BY Color')
            } else if ((localStorage.getItem("ColorFilter") !== null) && (localStorage.getItem("PlaceFilter") ===
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Color = ? ORDER BY Color', ColorFilter)
            } else if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") !==
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Place = ? ORDER BY Color', PlaceFilter)
            } else {
                ShowResultDBColorPlaceFilter('SELECT * FROM livestock WHERE Color = ? and Place = ? ORDER BY Color',
                    ColorFilter, PlaceFilter)
            }
        } else if (Checkbox == "checkSort-4") {
            if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null)) {
                ShowResultDBSort('SELECT * FROM livestock ORDER BY Place')
            } else if ((localStorage.getItem("ColorFilter") !== null) && (localStorage.getItem("PlaceFilter") ===
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Color = ? ORDER BY Place', ColorFilter)
            } else if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") !==
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Place = ? ORDER BY Place', PlaceFilter)
            } else {
                ShowResultDBColorPlaceFilter('SELECT * FROM livestock WHERE Color = ? and Place = ? ORDER BY Place',
                    ColorFilter, PlaceFilter)
            }
        }
    }

    //function for sort Database
    var hideDialogSort = function (id, checkbox, icon) {
        document.getElementById("checkSort-1").checked = false;
        document.getElementById("checkSort-2").checked = false;
        document.getElementById("checkSort-3").checked = false;
        document.getElementById("checkSort-4").checked = false;
        document.getElementById(checkbox).checked = true;
        document.getElementById(id).hide();
        //change icon of button
        var SortIcon = document.getElementById("SortIcon");
        SortIcon.setAttribute("icon", icon);
        localStorage.setItem('DBSort', checkbox);
        CommandDB()
    };

    //function for filter database
    var hideDialogFilter = function (id, checkbox, color) {
        document.getElementById("checkFilter-1").checked = false;
        document.getElementById("checkFilter-2").checked = false;
        document.getElementById("checkFilter-3").checked = false;
        document.getElementById("checkFilter-4").checked = false;
        document.getElementById("checkFilter-5").checked = false;
        document.getElementById("checkFilter-6").checked = false;
        document.getElementById("checkFilter-7").checked = false;
        document.getElementById(checkbox).checked = true;
        document.getElementById(id).hide();
        //change icon color of button
        var SortIcon = document.getElementById("FilterIcon");
        SortIcon.style.color = color;
        //remove Color Filter Storage if use disable filter
        if (checkbox == "checkFilter-7") {
            localStorage.removeItem('ColorFilter');
        } else {
            localStorage.setItem('ColorFilter', color);
        }
        showTemplateDialogView('FilterPlace', 'FilterPlace.html')
        //            CommandDB()
    };

    //function for filter database
    var hideDialogFilterPlace = function (id, checkbox, place) {
        document.getElementById("checkFilterPlace-1").checked = false;
        document.getElementById("checkFilterPlace-2").checked = false;
        document.getElementById("checkFilterPlace-3").checked = false;
        document.getElementById("checkFilterPlace-4").checked = false;
        document.getElementById("checkFilterPlace-5").checked = false;
        document.getElementById("checkFilterPlace-6").checked = false;
        document.getElementById(checkbox).checked = true;
        document.getElementById(id).hide();
        //remove Color Filter Storage if use disable filter
        if (checkbox == "checkFilterPlace-6") {
            localStorage.removeItem('PlaceFilter');
        } else {
            localStorage.setItem('PlaceFilter', place);
        }
        CommandDB()
    };

    function UpdateDBResult() {
        //disable filter options
        if (localStorage.getItem("ColorFilter") !== null) {
            document.getElementById("checkFilter-1").checked = false;
            document.getElementById("checkFilter-2").checked = false;
            document.getElementById("checkFilter-3").checked = false;
            document.getElementById("checkFilter-4").checked = false;
            document.getElementById("checkFilter-5").checked = false;
            document.getElementById("checkFilter-6").checked = false;
            document.getElementById("checkFilter-7").checked = true; //check no filter
            localStorage.removeItem('ColorFilter');
        }
        if (localStorage.getItem("PlaceFilter") !== null) {
            document.getElementById("checkFilterPlace-1").checked = false;
            document.getElementById("checkFilterPlace-2").checked = false;
            document.getElementById("checkFilterPlace-3").checked = false;
            document.getElementById("checkFilterPlace-4").checked = false;
            document.getElementById("checkFilterPlace-5").checked = false;
            document.getElementById("checkFilterPlace-6").checked = true; //check no filter
            localStorage.removeItem('PlaceFilter');
        }
        //change icon color of button filter
        var SortIcon = document.getElementById("FilterIcon");
        SortIcon.style.color = "black";
        //get number
        var number = document.getElementById("SearchInput").value;
        numberSearch = '%' + number + '%'
        console.log(number)
        //delete actual container
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        var Checkbox = localStorage.DBSort
        if (Checkbox == "checkSort-1") {
            ShowResultDBColorFilter('SELECT * FROM livestock WHERE Number LIKE ? ORDER BY Number DESC',
                numberSearch)
        } else if (Checkbox == "checkSort-2") {
            ShowResultDBColorFilter('SELECT * FROM livestock WHERE Number LIKE ? ORDER BY Number ASC', numberSearch)
        } else if (Checkbox == "checkSort-3") {
            ShowResultDBColorFilter('SELECT * FROM livestock WHERE Number LIKE ? ORDER BY Color', numberSearch)
        } else if (Checkbox == "checkSort-4") {
            ShowResultDBColorFilter('SELECT * FROM livestock WHERE Number LIKE ? ORDER BY Place', numberSearch)
        }
    }

    function livestockDetail(ID) {
        localStorage.LivestockColor = (document.getElementById("livestockColor" + ID).style.backgroundColor);
        var LivestockNumber = (document.getElementById("livestockID" + ID).innerHTML);
        var stringLen = LivestockNumber.length;
        //only select last four numbers
        localStorage.LivestockNumber = (document.getElementById("livestockID" + ID).innerHTML).slice(stringLen - 4,
            stringLen);
        getLivestockDBID()
    }

    function getLivestockDBID() {
        var color = (localStorage.LivestockColor)
        var number = (localStorage.LivestockNumber)
        db.transaction(function (transaction) {
            transaction.executeSql(
                'SELECT * FROM livestock WHERE color = ? AND number = ?', [color, number],
                function (tx, results) {
                    localStorage.setItem("LivestockID", results.rows.item(0).id);
                    document.querySelector('#nav1').pushPage('livestock_detail.html');
                }, null);
        });
    }