//global variables
var eventEnterPageId = ""



// $(document).on('postpush', '#nav1', function (event) {
//     var event = event.originalEvent;
//     leavePage = event.leavePage.id;
//     if (event.enterPage.id === 'livestock_add') {
//         //updateLivestockAddView()
//     }
// });

//on init page
document.addEventListener("init", function (event) {
    var page = event.target;
    //set global page variable
    eventEnterPageId = page.id;
    //livestock add page
    if (page.id === 'livestock_add') {
        updateLivestockAddView()
        //TODO: CHECK NETWORK CONNECTION!!!!
        getLocationDB()
    }
});