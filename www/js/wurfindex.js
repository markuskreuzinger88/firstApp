var maxDate = "";
var delayDate = 30; //set delay beteween actual date and max date in future
var arrLivestockIDs = [];

$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    leavePage = event.leavePage.id;
    if (event.enterPage.id === 'wurfindex') {
        var actualDateNew = new Date();
        var actualDate = actualDateNew.getTime();
        var delayDateNew = delayDate * 24 * 60 * 60 * 1000
        maxDate = new Date(actualDate + delayDateNew).toISOString().split("T")[0];
        prepareContainerView()
    }
});

//prepare Container View
function prepareContainerView() {
    var list = document.getElementById("containerWurfindex");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    getDBDataForWurfindex('SELECT * FROM livestock_action WHERE future = ? AND date < ? ORDER BY date DESC', 'true', maxDate)
}

//Read out Database Table Livestock Action
function getDBDataForWurfindex(Command1, Command2, Command3) {
    db.transaction(function (transaction) {
        transaction.executeSql(Command1, [Command2, Command3], function (tx, results) {
            DisplayResultWurfindex(results)
        }, null);
    });
}

//Display Livestock Action Results
function DisplayResultWurfindex(results) {
    console.log(results)
    console.log(results.rows.length)
    var prevDate = "";
    var prevType = "";
    var actDate = "";
    var actType = "";
    var setActualDateFieldOnce = false;
    var amountCounter = 1;
    for (i = 0; i < results.rows.length; i++) {
        if (results.rows.item(i).display == "true") {
            var actDate = results.rows.item(i).date
            var actType = results.rows.item(i).type
            if ((prevDate != actDate) || (prevType != actType)) {
                amountCounter = 1;
                console.log("hi1")
                console.log(amountCounter)
                var prevDate = results.rows.item(i).date
                var prevType = results.rows.item(i).type
                card = document.createElement("div")
                card.setAttribute("class", "container right");
                content = document.createElement("div")
                content.setAttribute("class", "content");
                /*get action Date*/
                actionDate = Date.parse(prevDate);
                /*convert date difference from milleseconds to days*/
                var daysLeft = Math.ceil((actionDate - actualDate) / 24 / 60 / 60 / 1000);
                /*generate Type*/
                rowType = document.createElement("ons-row")
                colType = document.createElement("ons-col")
                //set only trash icon on last element in database if selected
                localStorage.setItem("actionEdit", 'false');
                //set Icon
                colTypeIcon = document.createElement("ons-col")
                icon = document.createElement("ons-icon")
                rowType.appendChild(colType);
                colTypeIcon.appendChild(icon);
                rowType.appendChild(colTypeIcon);
                //set days left
                rowDate2 = document.createElement("ons-row")
                colDateHeader2 = document.createElement("ons-col")
                colDate2 = document.createElement("ons-col")
                colDateHeader2.innerHTML = ("In");
                colDateHeader2.style.fontWeight = "700";
                colDate2.innerHTML = daysLeft + " Tage";
                colDate2.style.fontWeight = "700";
                rowDate2.appendChild(colDateHeader2);
                rowDate2.appendChild(colDate2);
                icon.setAttribute("icon", "fa-hand-pointer");
                icon.setAttribute("style", "color: #3399ff; margin-left : 100%");
                /*set days left color to signal user when livestock is ready for next action*/
                if (daysLeft > 7) {
                    //do not change any color
                } else if ((daysLeft < 7) && (daysLeft > 0)) {
                    colDate2.style.color = "green";
                    colDateHeader2.style.color = "green";
                } else {
                    colDate2.style.color = "red";
                    colDateHeader2.style.color = "red";
                }
                colType.innerHTML = results.rows.item(i).type
                colType.style.fontWeight = "700";
                colType.style.marginBottom = "10px";
                /*generate Date*/
                rowDate = document.createElement("ons-row")
                colDateHeader = document.createElement("ons-col")
                colDate = document.createElement("ons-col")
                colDateHeader.innerHTML = ("Datum")
                colDate.innerHTML = results.rows.item(i).date
                rowDate.appendChild(colDateHeader);
                rowDate.appendChild(colDate);
                /*amount Livestock affected*/
                rowAmountAff = document.createElement("ons-row")
                colAmountAffHeader = document.createElement("ons-col")
                colAmountAff = document.createElement("ons-col")
                colAmountAffHeader.innerHTML = ("Nutztier")
                colAmountAff.innerHTML = "1"
                colAmountAff.setAttribute("id", prevDate + '+' + prevType);
                rowAmountAff.appendChild(colAmountAffHeader);
                rowAmountAff.appendChild(colAmountAff);
                /*append rows to container*/
                content.appendChild(rowType);
                content.appendChild(rowAmountAff);
                content.appendChild(rowDate);
                content.appendChild(rowDate2);
                card.appendChild(content);
                card.setAttribute("onclick", "getLivestockIDFromAction('" + prevDate + "','" + prevType + "')");
                document.getElementById("containerWurfindex").appendChild(card);
                console.log(i)
                // //current date between action in future and action in presence
                // if (((actionDate <= actualDate) && (setActualDateFieldOnce == false)) || (i = results.rows.length)) {
                //     actualDateElement = document.createElement("div")
                //     actualDateElement.style.fontWeight = "700";
                //     actualDateElement.style.marginBottom = "10px";
                //     actualDateElement.style.marginTop = "10px";
                //     actualDateElement.style.marginTop = "10px";
                //     actualDateElement.style.marginLeft = "30%";
                //     actualDateElement.style.textAlign = "center";
                //     actualDateElement.style.backgroundColor = "white";
                //     actualDateElement.style.width = "50%";
                //     actualDateElement.style.padding = "10px";
                //     actualDateElement.style.borderRadius = "10px";
                //     actualDateElement.style.border = "4px solid #3399ff";
                //     var day = days[actualDateNew.getDay()];
                //     var actualDateFormat = new Date(actualDate).toISOString().substr(0, 10);
                //     actualDateElement.innerHTML = day + " - " + actualDateFormat
                //     document.getElementById("containerWurfindex").appendChild(actualDateElement);
                //     setActualDateFieldOnce = true;
                // }
            } else if ((prevDate == actDate) && (prevType == actType)) {
                amountCounter += 1;
                console.log("hi2")
                console.log(amountCounter)
                document.getElementById(prevDate + '+' + prevType).innerHTML = amountCounter;
            } else {
                console.log("hi3")
                amountCounter = 1;
                console.log(amountCounter)
            }
        }
    }
}

//Read out Database Table Livestock Action
function getLivestockIDFromAction(Command1, Command2) {
    arrLivestockIDs = []
    db.transaction(function (transaction) {
        transaction.executeSql('SELECT livestock_id FROM livestock_action WHERE future = ? AND date = ? AND type = ?', ['true', Command1, Command2], function (tx, results) {
            console.log(results.rows)
            for (i = 0; i < results.rows.length; i++) {
                arrLivestockIDs.push(results.rows.item(i).livestock_id);
            }
            document.querySelector('#nav1').pushPage('livestock_open_action.html');
        }, null);
    });
}