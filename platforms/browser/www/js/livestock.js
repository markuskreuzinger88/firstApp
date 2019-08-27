    db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
    var LFBISNbr = "AT-3-4321056-"
    var leavePage = "";
    var networkConnection = true;

    // const testLivestocDataArray = {
    //     "list": [{
    //             "id": 10,
    //             "creationDate": "2019-07-24T19:33:39",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 0,
    //             "number": "5888",
    //             "color": null,
    //             "birthday": "0001-01-01T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 11,
    //             "creationDate": "2019-07-24T19:34:15",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 0,
    //             "number": "1111",
    //             "color": null,
    //             "birthday": "0001-01-01T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 12,
    //             "creationDate": "2019-07-25T13:46:47",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 2,
    //             "number": "6796",
    //             "color": "blue",
    //             "birthday": "2019-07-24T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 13,
    //             "creationDate": "2019-07-25T13:48:40",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 0,
    //             "number": "6436",
    //             "color": "blue",
    //             "birthday": "2019-07-24T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 14,
    //             "creationDate": "2019-07-25T14:00:34",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 2,
    //             "number": "1234",
    //             "color": "yellow",
    //             "birthday": "2019-07-25T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 15,
    //             "creationDate": "2019-07-25T14:01:46",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 2,
    //             "number": "2234",
    //             "color": "yellow",
    //             "birthday": "2019-07-25T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 16,
    //             "creationDate": "2019-07-25T15:47:59",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 2,
    //             "number": "5698",
    //             "color": "red",
    //             "birthday": "2019-07-25T00:00:00",
    //             "isLocked": false
    //         },
    //         {
    //             "id": 17,
    //             "creationDate": "2019-07-25T15:49:56",
    //             "createdBy": "API_DEFAULT",
    //             "customerId": 0,
    //             "typeId": 2,
    //             "number": "5896",
    //             "color": "red",
    //             "birthday": "2019-07-25T00:00:00",
    //             "isLocked": false
    //         }
    //     ],
    //     "count": null,
    //     "messages": [],
    //     "success": true
    // };


    //detect if livestock add is popped, then update livestock view on page livestock
    $(document).on('prepop', '#nav1', function (event) {
        var event = event.originalEvent;
        leavePage = "dummy";
        if (event.enterPage.id === 'livestock') {
            //if networkconnection is valid update view from Server
            //else use local database
            if (networkConnection == true) {
                //                RESTGetLivestock()
                readDBLivestock()
            } else {
                readDBLivestock()
            }
        }
    });

    $(document).on('postpush', '#nav1', function (event) {
        var event = event.originalEvent;
        leavePage = event.leavePage.id;
        if (event.enterPage.id === 'livestock') {
            //if networkconnection is valid update view from Server
            //else use local database
            if (networkConnection == true) {
                //                RESTGetLivestock()
                readDBLivestock()
            } else {
                readDBLivestock()
            }
        }
    });

    //display results from Server if Networkconnection is valid
    async function updateLivestockView(obj, LivestockNbrs) {
        //sort list -> select item to sort and asc/desc
        obj.list.sort(compareValues('number', 'desc'))

        var r = $.Deferred();
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        DisplayResult("", "online", obj, LivestockNbrs)
        return r;
    }

    // function for dynamic sorting of livestock data list
    function compareValues(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) ||
                !b.hasOwnProperty(key)) {
                return 0;
            }
            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ?
                (comparison * -1) : comparison
            );
        };
    }

    function readDBLivestock() {
        var livestockData = []
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        localStorage.removeItem('ColorFilter');
        localStorage.setItem('DBSort', "checkSort-1");
        localStorage.removeItem('PlaceFilter');
        if (leavePage == "livestock_selector") {
            col = document.getElementById("actionCol").innerHTML = "Scannen"
            icon = document.createElement("ons-icon")
            icon.setAttribute("icon", "fa-qrcode")
            icon.setAttribute("style", "margin-left: 10px");
            document.getElementById("actionCol").removeAttribute("onclick");
            document.getElementById("actionCol").setAttribute("onclick", "scan()");
            document.getElementById("actionCol").appendChild(icon);
        }
        getLivestockDB()
        //        livestockData.sort(compareValues('number', 'asc'))
        //        console.log(livestockData)
        //        console.log(livestockData)
        //        livestockData.sort(compareValues('number', 'desc'))
        //                        DisplayResult(results, "offline", null, null)
        //        console.log(livestockData)
        //        ShowResultDBSort('SELECT * FROM livestock ORDER BY Number DESC')
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
    function DisplayResult(results, updateType, obj, amount) {
        var LivestockNumber = [];
        var LivestockPlace = [];
        var LivestockGroup = [];
        var LivestockBorn = [];
        var LivestockColor = [];
        if (updateType == "online") {
            var listLength = amount;
            for (i = 0; i < listLength; i++) {
                LivestockNumber.push(obj.list[i].number);
                LivestockPlace.push('dummy');
                LivestockGroup.push('dummy');
                LivestockBorn.push(obj.list[i].birthday);
                LivestockColor.push(obj.list[i].color);
            }
        } else {
            var listLength = results.rows.length;
            for (i = 0; i < listLength; i++) {
                LivestockNumber.push(results.rows.item(i).number);
                LivestockPlace.push(results.rows.item(i).place);
                LivestockGroup.push(results.rows.item(i).livestock_group);
                LivestockBorn.push(results.rows.item(i).born);
                LivestockColor.push(results.rows.item(i).color);
            }
        }
        for (i = 0; i < listLength; i++) {
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
            span_center1.innerHTML = LiveStockNbr + LivestockNumber[i];
            span_center2.innerHTML = LivestockPlace[i] + "<br>" +
                "Gruppe " + LivestockGroup[i] + "<br>" + LivestockBorn[i];
            div_left = document.createElement("div")
            div_left.setAttribute("class", "left");
            input = document.createElement("input")
            input.setAttribute("id", "livestockColor" + i);
            input.setAttribute("style",
                "width: 40px; height :40px;margin-right: 5px;border-color : black; border: 2px solid black; border-radius: 10px; background-color:" + LivestockColor[i]);
            input.setAttribute("disabled", "true");
            list.setAttribute("tappable", true);
            //modify selection depending on last site --> when last page drug delivery
            //use tag icon else use chevron
            if (leavePage == "livestock_selector") {
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
                DisplayResult(results, "offline", null, null)
            }, null);
        });
    }

    //Function for use color filter in Database
    function ShowResultDBColorFilter(Command1, Command2) {
        db.transaction(function (transaction) {
            transaction.executeSql(Command1, [Command2], function (tx, results) {
                DisplayResult(results, "offline", null, null)
            }, null);
        });
    }

    //Function for get livestock Data from Database
    async function getLivestockDB() {
        await db.transaction(function (transaction) {
            transaction.executeSql('SELECT * FROM livestock', [], function (tx, results) {
                var data2Arr = Array.from(results.rows);
                console.log(data2Arr)
                console.log('hallo2')
                return data2Arr
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
        } else if (Checkbox == "checkSort-5") {
            if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null)) {
                ShowResultDBSort('SELECT * FROM livestock ORDER BY livestock_group')
            } else if ((localStorage.getItem("ColorFilter") !== null) && (localStorage.getItem("PlaceFilter") ===
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Color = ? ORDER BY livestock_group', ColorFilter)
            } else if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") !==
                    null)) {
                ShowResultDBColorFilter('SELECT * FROM livestock WHERE Place = ? ORDER BY livestock_group', PlaceFilter)
            } else {
                ShowResultDBColorPlaceFilter('SELECT * FROM livestock WHERE Color = ? and Place = ? ORDER BY livestock_group',
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
        document.getElementById("checkSort-5").checked = false;
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
