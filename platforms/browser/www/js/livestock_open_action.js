$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.enterPage.id === 'livestock_open_action') {
        prepareContainerViewLivestockOpenAction()
    }
});

//prepare Container View
function prepareContainerViewLivestockOpenAction() {
    var list = document.getElementById("containerLivestockOpenAction");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    for (i = 0; i < arrLivestockIDs.length; i++) {
        (function (i) {
            getDBDataForLivestockOpenAction('SELECT * FROM livestock WHERE id = ?', arrLivestockIDs[i])
        })(i);
    };
}

async function getDBDataForLivestockOpenAction(Command1, Command2) {
    await db.transaction(function (transaction) {
        transaction.executeSql(Command1, [Command2], function (tx, results) {
            list = document.createElement("ons-list-item")
            div_center = document.createElement("div")
            div_center.setAttribute("id", i);
            div_center.setAttribute("class", "center");
            div_center.setAttribute("style", "margin-left: 10px");
            span_center1 = document.createElement("span")
            // span_center1.setAttribute("id", "livestockID" + i);
            span_center2 = document.createElement("span")
            span_center1.setAttribute("class", "list-item__title");
            span_center2.setAttribute("class", "list-item__subtitle");
            span_center1.innerHTML = LiveStockNbr + results.rows.item(0).number;
            span_center2.innerHTML = results.rows.item(0).place + "<br>" +
                "Gruppe " + results.rows.item(0).livestock_group + "<br>" + results.rows.item(0).born;
            div_left = document.createElement("div")
            div_left.setAttribute("class", "left");
            input = document.createElement("input")
            // input.setAttribute("id", "livestockColor" + i);
            input.setAttribute("style",
                "width: 40px; height :40px;margin-right: 5px;border-color : black; border: 2px solid black; border-radius: 10px; background-color:" + results.rows
                .item(0).color);
            input.setAttribute("disabled", "true");
            list.setAttribute("tappable", true);
            list.setAttribute("modifier", "chevron");
            list.setAttribute("onclick", "getLivestockDetail('" + results.rows.item(0).color + "','" + results.rows.item(0).number + "','" + results.rows.item(0).id + "')");
            div_left.appendChild(input);
            list.appendChild(div_left);
            div_center.appendChild(span_center1);
            div_center.appendChild(span_center2);
            list.appendChild(div_center);
            document.getElementById("containerLivestockOpenAction").appendChild(list);
        }, null);
    });
}

//prepare Container View
function getLivestockDetail(Command1, Command2, Command3) {
    console.log(Command1)
    console.log(Command2)
    localStorage.setItem("LivestockColor", Command1);
    localStorage.setItem("LivestockNumber", Command2);
    localStorage.setItem("LivestockID", Command3);
    document.querySelector('#nav1').pushPage('livestock_detail.html');
}