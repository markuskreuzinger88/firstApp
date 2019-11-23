// //check first the number of pages in stack. If number is 5 than 
// //the page livestock.html is already loaded --> bring the page to the front
// function nextPage() {
//     //livestock.html already in stack
//     // if (document.querySelector('#nav1').pages.length == 6) {
//     //     document.querySelector('#nav1').bringPageTop('livestock.html')
//     // } else {
//         document.querySelector('#nav1').replacePage('livestock.html')
//     // }
// }

//show Dialog for Livestock Groups
 function showTemplateDialogLivestockSelector() {
    document.getElementById("locationButton1").style.visibility = "hidden";
    document.getElementById("locationButton2").style.visibility = "hidden";
    document.getElementById("locationButton1").disabled = true;
    document.getElementById("locationButton2").disabled = true;
    showTemplateDialogAdd('locationAdd', 'locationAdd.html')
};

//get user Input Group
var hideDialogLivestockGroup = function (id, group, checkbox) {
    $("ons-checkbox").prop('checked', false);
    console.log(group)
    console.log(checkbox)
    document.getElementById(checkbox).checked = true;
    document.getElementById(id).hide();
    livestockTagGroup(group)
};

//tag livestock group
function livestockTagGroup(group) {
    db.transaction(function (tx) {
        tx.executeSql("UPDATE livestock SET tagged=? where livestock_group = ?", ['true', group],
            function (tx, result) {
                document.querySelector('#nav1').popPage();
            },
            function (error) {
                console.log('Error: ' + error.message + ' code: ' + error.code);
            });
    });
}