var taggedDrugs = [];

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

// //display sort data with filter
// function ShowResultDBDrug2(Command1, Command2) {
//     db.transaction(function (transaction) {
//         transaction.executeSql(Command1, [Command2], function (tx, results) {
//             DisplayResultDrug(results)
//         }, null);
//     });
// }

//display database results
function DisplayResultDrug() {
    var infiniteList = document.getElementById('ContainerDrugs');
    infiniteList.delegate = {
        createItemContent: function (i) {
            list = document.createElement("ons-list-item")
            div_center = document.createElement("div")
            div_center.setAttribute("id", Drugs[i].id);
            div_center.setAttribute("class", "center");
            div_center.setAttribute("style", "margin-left: 10px");
            span_center1 = document.createElement("span")
            span_center1.setAttribute("id", "drugID" + Drugs[i].id);
            span_center2 = document.createElement("span")
            span_center1.setAttribute("class", "list-item__title");
            span_center2.setAttribute("class", "list-item__subtitle");
            span_center1.innerHTML = Drugs[i].name;
            span_center2.innerHTML = Drugs[i].drugCategoryName + "<br>" + "Zul-Nr.: " +
                Drugs[i].approvalNumber;
            list.setAttribute("tappable", true);
            list.setAttribute("onclick", "drugTag(" + Drugs[i].id + ")");
            div_right = document.createElement("ons-checkbox")
            div_right.setAttribute("class", "right");
            div_right.setAttribute("id", "tag" + Drugs[i].id);
            //set item tag
            if (taggedDrugs.includes(Drugs[i].id) === true) {
                div_right.checked = true;
            } else {
                div_right.checked = false;
            }
            list.appendChild(div_right);
            div_center.appendChild(span_center1);
            div_center.appendChild(span_center2);
            list.appendChild(div_center);
            return document.getElementById("ContainerDrugs").appendChild(list);
        },
        countItems: function () {
            return DrugNbrs;
        }
    };

    infiniteList.refresh();
}

//add or remove tag drug for drug delivery
function drugTag(id) {
    var tagState = document.getElementById("tag" + id);
    if (tagState.checked === true) {
        tagState.checked = false;
        //delete item from array
        taggedDrugs = taggedDrugs.filter(function (item) {
            return item !== id
        })
    } else {
        tagState.checked = true;
        //add item to array
        if (taggedDrugs.includes(id) === false) {
            taggedDrugs.push(id);
        }
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