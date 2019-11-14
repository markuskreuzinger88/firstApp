    db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
    var LFBISNbr = "AT-3-4321056-"
    var leavePage = "";
    var LivestockList = [];
    var LivestockListFiltered = [];
    var networkConnection = true;

    //display Livestocks
    function updateLivestockView() {
        // create element before use --> to update list in elemnt dynamically
        ons.createElement("locationFilter.html", {
            append: true
        });
        //reset local storage variables
        resetLocalStorgageVariables()
        //check leaved page --> change icon
        setIconForAction()
        //sort list
        sortLivestockView('number', 'asc')
    }

    //display sorted livestock list
    function sortLivestockView(key, order) {
        //sort list -> select item to sort and asc/desc
        //obj.list.sort(compareValues('number', 'desc'))
        if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null) && (localStorage.getItem("SearchFilter") === null)) {
            var updatedList = LivestockList.sort(compareValues(key, order))
            var updatedListLength = Object.keys(updatedList).length;
        } else {
            var updatedList = LivestockListFiltered.sort(compareValues(key, order))
            var updatedListLength = Object.keys(updatedList).length;
        }
        //remove current items in view
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        DisplayResult(updatedList, updatedListLength)
    }

    //display filtered livestock list
    function filterLivestockView(listFiltered, listLengthFiltered) {
        //remove current items in view
        var list = document.getElementById("containerLivestock");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        DisplayResult(listFiltered, listLengthFiltered)
    }

    //reset local storage variables
    function resetLocalStorgageVariables() {
        localStorage.removeItem('ColorFilter');
        localStorage.removeItem('PlaceFilter');
        localStorage.removeItem('SearchFilter');
    }

    //check leaved page --> change icon
    function setIconForAction() {
        if (leavePage == "livestock_selector") {
            col = document.getElementById("actionCol").innerHTML = "Scannen"
            icon = document.createElement("ons-icon")
            icon.setAttribute("icon", "fa-qrcode")
            icon.setAttribute("style", "margin-left: 10px");
            document.getElementById("actionCol").removeAttribute("onclick");
            document.getElementById("actionCol").setAttribute("onclick", "scan()");
            document.getElementById("actionCol").appendChild(icon);
        }
    }

    //open sort or filter template 
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

    //function for sort Livestock view
    var hideDialogSort = function (id, checkbox, icon) {
        document.getElementById("checkSort-1").checked = false;
        document.getElementById("checkSort-2").checked = false;
        document.getElementById("checkSort-3").checked = false;
        document.getElementById("checkSort-4").checked = false;
        // document.getElementById("checkSort-5").checked = false;
        document.getElementById(checkbox).checked = true;
        document.getElementById(id).hide();
        //change icon of button
        var SortIcon = document.getElementById("SortIcon");
        SortIcon.setAttribute("icon", icon);
        if (checkbox == "checkSort-1") {
            sortLivestockView('number', 'asc')
        } else if (checkbox == "checkSort-2") {
            sortLivestockView('number', 'desc')
        } else if (checkbox == "checkSort-3") {
            sortLivestockView('color', 'asc')
        } else if (checkbox == "checkSort-4") {
            sortLivestockView('place', 'asc')
        }
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
            LivestockListFiltered = LivestockList
        } else {
            localStorage.setItem('ColorFilter', color);
            // LivestockListFiltered = LivestockList.filter(filterLivestockListColor)
            if ((localStorage.getItem("PlaceFilter") === null) && (localStorage.getItem("SearchFilter") === null)) {
                LivestockListFiltered = LivestockList.filter(filterLivestockListColor)
            } else {
                LivestockListFiltered = LivestockListFiltered.filter(filterLivestockListColor)
            }
        }
        showTemplateDialogView('locationFilter', 'locationFilter.html')
    };



    //select location filter
    var hideDialogFilterPlace = function (location) {
        list = document.getElementById("containerLivestockFilter")
        var elements = [];
        //first get all place items
        for (var i = 1; i <= list.childElementCount; i++) {
            var text = document.querySelector("#containerLivestockFilter > ons-list-item:nth-child(" + i + ") > label.center.list-item__center")
            elements.push(text.innerHTML)
        }
        //uncheck all checkboxes and check selected checkbox
        for (i = 0; i < elements.length; i++) {
            if (elements[i] != location) {
                document.getElementById("checkboxFilter" + elements[i]).checked = false;
            } else {
                document.getElementById("checkboxFilter" + elements[i]).checked = true;
            }
        }
        if (location == "kein Standort Filter") {
            localStorage.removeItem('PlaceFilter');
            if (localStorage.getItem("ColorFilter") === null) {
                LivestockListFiltered = LivestockList
            }
        } else {
            localStorage.setItem('PlaceFilter', location);
            if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("SearchFilter") === null)) {
                LivestockListFiltered = LivestockList.filter(filterLivestockListPlace)
            } else {
                LivestockListFiltered = LivestockListFiltered.filter(filterLivestockListPlace)
            }
        }
        document.getElementById("locationFilter").hide();
        var listLength = Object.keys(LivestockListFiltered).length;
        console.log(LivestockListFiltered)
        filterLivestockView(LivestockListFiltered, listLength)
    };


    // //function for filter database
    // var hideDialogFilterPlace = function (location) {
    //     document.getElementById("checkFilterPlace-1").checked = false;
    //     document.getElementById("checkFilterPlace-2").checked = false;
    //     document.getElementById("checkFilterPlace-3").checked = false;
    //     document.getElementById("checkFilterPlace-4").checked = false;
    //     document.getElementById("checkFilterPlace-5").checked = false;
    //     document.getElementById("checkFilterPlace-6").checked = false;
    //     document.getElementById(checkbox).checked = true;
    //     document.getElementById("locationFilter").hide();
    //     //remove Color Filter Storage if use disable filter
    //     if (location == "noFilter") {
    //         localStorage.removeItem('PlaceFilter');
    //         if (localStorage.getItem("ColorFilter") === null) {
    //             LivestockListFiltered = LivestockList
    //         }
    //     } else {
    //         localStorage.setItem('PlaceFilter', location);
    //         if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("SearchFilter") === null)) {
    //             LivestockListFiltered = LivestockList.filter(filterLivestockListPlace)
    //         } else {
    //             LivestockListFiltered = LivestockListFiltered.filter(filterLivestockListPlace)
    //         }
    //     }
    //     var listLength = Object.keys(LivestockListFiltered).length;
    //     filterLivestockView(LivestockListFiltered, listLength)
    // };

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

    //search livestock view from input
    function searchInputList() {
        // console.log(document.getElementById("SearchInput").value)
        localStorage.setItem('SearchFilter', document.getElementById("SearchInput").value);
        if ((localStorage.getItem("ColorFilter") === null) && (localStorage.getItem("PlaceFilter") === null)) {
            var LivestockListFiltered = LivestockList.filter(filterLivestockListInput)
            var listLength = Object.keys(LivestockListFiltered).length;
        } else {
            var LivestockListFiltered = LivestockListFiltered.filter(filterLivestockListInput)
            var listLength = Object.keys(LivestockListFiltered).length;
        }
        filterLivestockView(LivestockListFiltered, listLength)
    }

    //filter livestock view Color
    function filterLivestockListColor(livestock) {
        return livestock.color == localStorage.getItem('ColorFilter')
    }

    //filter livestock view Place
    function filterLivestockListPlace(livestock) {
        return livestock.place == localStorage.getItem('PlaceFilter')
    }

    //filter livestock view input
    function filterLivestockListInput(livestock) {
        var searchInputlength = localStorage.getItem('SearchFilter').length
        return livestock.number.substring(0, searchInputlength) == localStorage.getItem('SearchFilter')
    }

    //display livestock list result
    function DisplayResult(livestockList, listLength) {
        // console.log(livestockList)
        // var LivestockNumber = [];
        // var LivestockPlace = [];
        // var LivestockBorn = [];
        // var LivestockColor = [];
        // for (i = 0; i < listLength; i++) {
        //     LivestockNumber.push(livestockList[i].number);
        //     LivestockPlace.push(livestockList[i].place);
        //     LivestockBorn.push(livestockList[i].birthday);
        //     LivestockColor.push(livestockList[i].color);
        // }
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
            span_center1.innerHTML = LiveStockNbr + livestockList[i].number;
            span_center2.innerHTML = livestockList[i].animalLocationName + "<br>" + livestockList[i].birthday.substring(0, 10);
            div_left = document.createElement("div")
            div_left.setAttribute("class", "left");
            input = document.createElement("input")
            input.setAttribute("id", "livestockColor" + i);
            input.setAttribute("style",
                "width: 40px; height :40px;margin-right: 5px;border-color : black; border: 2px solid black; border-radius: 10px; background-color:" + livestockList[i].color);
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
                if (livestockList[i].tagged == "true") {
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

    //get livestock number 
    function livestockDetail(ID) {
        localStorage.LivestockColor = (document.getElementById("livestockColor" + ID).style.backgroundColor);
        var LivestockNumber = (document.getElementById("livestockID" + ID).innerHTML);
        var stringLen = LivestockNumber.length;
        //only select last four numbers
        localStorage.LivestockNumber = (document.getElementById("livestockID" + ID).innerHTML).slice(stringLen - 4,
            stringLen);
        getLivestockDBID()
    }

    //get livestock database id
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

    //update livestock location list
    function updateLivestockLocationsFilter() {
        list = document.getElementById("containerLivestockFilter")
        noFilterParamter = "kein Standort Filter";
        //remove current items in view
        if (list) {
            while (list.hasChildNodes()) {
                list.removeChild(list.firstChild);
            }
        }
        for (i = 0; i <= LivestockLocationNbrs; i++) {
            if (i != LivestockLocationNbrs) {
                var location = LivestockPlaces[i].name
            } else {
                //last item -> no filter
                var location = noFilterParamter
            }
            list = document.createElement("ons-list-item")
            list.setAttribute("onchange", "hideDialogFilterPlace('" + location + "')");
            list.setAttribute("tappable");
            //label left
            label_left = document.createElement("label")
            label_left.setAttribute("class", "left");
            checkbox = document.createElement("ons-checkbox")
            checkbox.setAttribute("input-id", "checkboxFilter" + location);
            label_left.appendChild(checkbox);
            //label center
            label_center = document.createElement("label")
            label_center.setAttribute("class", "center");
            label_center.innerHTML = location;
            label_center.setAttribute("onclick", "hideDialogFilterPlace('" + location + "')");
            //append labels to list
            list.appendChild(label_left);
            list.appendChild(label_center);
            document.getElementById("containerLivestockFilter").appendChild(list);
        }
    }