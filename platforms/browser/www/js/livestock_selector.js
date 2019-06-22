//check first the number of pages in stack. If number is 5 than 
//the page livestock.html is already loaded --> bring the page to the front
function nextPage() {
    //livestock.html already in stack
    // if (document.querySelector('#nav1').pages.length == 6) {
    //     document.querySelector('#nav1').bringPageTop('livestock.html')
    // } else {
        document.querySelector('#nav1').replacePage('livestock.html')
    // }
}

//show Dialog for Livestock Groups
var showTemplateDialogLivestockGroup = function (my_dialog, my_dialog_html) {

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