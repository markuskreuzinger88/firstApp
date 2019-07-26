db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    console.log(event)
    if (event.enterPage.id === 'drug') {
        localStorage.setItem('DBSortDrug', 'name_asc');
        localStorage.setItem('DBFilterDrug', 'none');
        ShowResultDBDrug1('SELECT * FROM drugs ORDER BY name ASC')
    }
});

//remove checked items from dialog
$(document).on('postpop', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.leavePage.id === 'drug') {
        var checkItemExists1 = document.getElementById("checkSortDrug-1");
        var checkItemExists2 = document.getElementById("checkFilterDrug-1");
        if (checkItemExists1 != null) {
            document.getElementById("checkSortDrug-1").checked = true;
            document.getElementById("checkSortDrug-2").checked = false;
            document.getElementById("checkSortDrug-3").checked = false;
            document.getElementById("checkSortDrug-4").checked = false;
        }
        if (checkItemExists2 != null) {
            document.getElementById("checkFilterDrug-1").checked = false;
            document.getElementById("checkFilterDrug-2").checked = false;
            document.getElementById("checkFilterDrug-3").checked = false;
            document.getElementById("checkFilterDrug-4").checked = false;
            document.getElementById("checkFilterDrug-5").checked = false;
            document.getElementById("checkFilterDrug-6").checked = true;
        }
    }
});

var showTemplateDialogDrug = function (my_dialog, my_dialog_html) {

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

//display sorted data
function ShowResultDBDrug1(Command) {
    db.transaction(function (transaction) {
        transaction.executeSql(Command, [], function (tx, results) {
            DisplayResultDrug(results)
        }, null);
    });
}

//display sort data with filter
function ShowResultDBDrug2(Command1, Command2) {
    db.transaction(function (transaction) {
        transaction.executeSql(Command1, [Command2], function (tx, results) {
            DisplayResultDrug(results)
        }, null);
    });
}

//display database results
function DisplayResultDrug(results) {
    for (i = 0; i < results.rows.length; i++) {
        list = document.createElement("ons-list-item")
        div_center = document.createElement("div")
        div_center.setAttribute("id", i);
        div_center.setAttribute("class", "center");
        div_center.setAttribute("style", "margin-left: 10px");
        span_center1 = document.createElement("span")
        span_center1.setAttribute("id", "drugID" + i);
        span_center2 = document.createElement("span")
        span_center1.setAttribute("class", "list-item__title");
        span_center2.setAttribute("class", "list-item__subtitle");
        span_center1.innerHTML = results.rows.item(i).name;
        span_center2.innerHTML = results.rows.item(i).category + "<br>" + "Zul-Nr.: " +
            results.rows.item(i).number;
        list.setAttribute("tappable", true);
        list.setAttribute("onclick", "drugTag(" + i + ")");
        div_right = document.createElement("ons-checkbox")
        div_right.setAttribute("class", "right");
        div_right.setAttribute("id", "tag" + i);
        div_right.setAttribute("onclick", "drugTag(" + i + ")");
        if (results.rows.item(i).tagged == "true") {
            div_right.checked = true;
        } else {
            div_right.checked = false;
        }
        list.appendChild(div_right);
        div_center.appendChild(span_center1);
        div_center.appendChild(span_center2);
        list.appendChild(div_center);
        console.log(list)
        document.getElementById("ContainerDrugs").appendChild(list);
    }
}

//add or remove tag drug for drug delivery
function drugTag(id) {
    console.log("TAGGED!!!!!!!!")
    var tag = document.getElementById("tag" + id);
    var name = document.getElementById("drugID" + id).innerHTML;
    console.log(tag)
    console.log(name)
    if (tag.checked == true) {
        tag.checked = false
        db.transaction(function (tx) {
            tx.executeSql("UPDATE drugs SET tagged=? where name = ?", ['false', name]);
        });
    } else {
        tag.checked = true
        db.transaction(function (tx) {
            tx.executeSql("UPDATE drugs SET tagged=? where name = ?", ['true', name]);
        });
    }
}

//select order
var hideDialogSortDrug = function (id, checkbox, icon, command) {
    document.getElementById("checkSortDrug-1").checked = false;
    document.getElementById("checkSortDrug-2").checked = false;
    document.getElementById("checkSortDrug-3").checked = false;
    document.getElementById("checkSortDrug-4").checked = false;
    document.getElementById(checkbox).checked = true;
    //change icon of button
    var SortIcon = document.getElementById("SortIconDrug");
    SortIcon.setAttribute("icon", icon);
    document.getElementById(id).hide();
    localStorage.setItem('DBSortDrug', command);
    CommandDBDrugs()
};

//select Filter
var hideDialogFilterDrug = function (id, checkbox, command) {
    document.getElementById("checkFilterDrug-1").checked = false;
    document.getElementById("checkFilterDrug-2").checked = false;
    document.getElementById("checkFilterDrug-3").checked = false;
    document.getElementById("checkFilterDrug-4").checked = false;
    document.getElementById("checkFilterDrug-5").checked = false;
    document.getElementById("checkFilterDrug-6").checked = false;
    document.getElementById(checkbox).checked = true;
    document.getElementById(id).hide();
    localStorage.setItem('DBFilterDrug', command);
    CommandDBDrugs()
};

//Command for Database sort or filter or search
function CommandDBDrugs() {
    //delete actual container
    var list = document.getElementById("ContainerDrugs");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    var sort = localStorage.DBSortDrug
    var filter = localStorage.DBFilterDrug
    console.log(sort)
    console.log(filter)
    if (sort == "name_asc") {
        if (filter == "none") {
            ShowResultDBDrug1('SELECT * FROM drugs ORDER BY name ASC')
        } else if (filter == "tagged") {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE tagged = ? ORDER BY name ASC', 'true')
        } else {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE category = ? ORDER BY name ASC', filter)
        }
    } else if (sort == "name_desc") {
        if (filter == "none") {
            ShowResultDBDrug1('SELECT * FROM drugs ORDER BY name DESC')
        } else if (filter == "tagged") {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE tagged = ? ORDER BY name DESC', 'true')
        } else {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE category = ? ORDER BY name DESC', filter)
        }
    } else if (sort == "number_asc") {
        if (filter == "none") {
            ShowResultDBDrug1('SELECT * FROM drugs ORDER BY number ASC')
        } else if (filter == "tagged") {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE tagged = ? ORDER BY number ASC', 'true')
        } else {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE category = ? ORDER BY number ASC', filter)
        }
    } else if (sort == "number_desc") {
        if (filter == "none") {
            ShowResultDBDrug1('SELECT * FROM drugs ORDER BY number DESC')
        } else if (filter == "tagged") {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE tagged = ? ORDER BY number DESC', 'true')
        } else {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE category = ? ORDER BY number DESC', filter)
        }
    }
}

function SearchDBDrug() {
    var regex = /^[0-9-]+$/;
    //disable filter and sort options
    localStorage.setItem('DBFilterDrug', 'none');
    localStorage.setItem('DBFilterDrug', 'name_asc');
    //change icon to default icon
    var SortIcon = document.getElementById("SortIconDrug");
    SortIcon.setAttribute("icon", 'fa-sort-numeric-up');
    //get number
    var searchInput = document.getElementById("SearchInputDrug").value;
    searchInputDB = String('%' + searchInput + '%')
    //delete actual container
    var list = document.getElementById("ContainerDrugs");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    if (searchInput.length > 0) {
        //check if input is letter or number
        //if string -> search name
        //if number -> search number
        if (searchInput.match(regex)) {
            console.log(searchInput)
            ShowResultDBDrug2('SELECT * FROM drugs WHERE number LIKE ?', searchInputDB)
        } else {
            ShowResultDBDrug2('SELECT * FROM drugs WHERE name LIKE ?', searchInputDB)
        }
    } else {
        ShowResultDBDrug1('SELECT * FROM drugs ORDER BY name ASC')
    }
}