//global variables
var eventEnterPageId = ""

//on init page
document.addEventListener("init", function (event) {
    var page = event.target;
    //set global page variable
    eventEnterPageId = page.id;
    //livestock add page
    if (page.id === 'livestock_add') {
        updateLivestockAddView();
    } else if (page.id === 'livestock') {
        updateLivestockView()
    }
});

//on page postpush
$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    leavePage = event.leavePage.id;
    if (event.enterPage.id === 'livestock_add') {
        //update livestock locations after page load
        updateLivestockLocations()
    } else if (event.enterPage.id === 'livestock') {
        //update livestock locations for Filter after page load
        updateLivestockLocationsFilter()
    }
});

//on page prepop
$(document).on('prepop', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.enterPage.id === 'livestock') {

    }
});