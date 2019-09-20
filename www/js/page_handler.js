$(document).on('postpush', '#nav1', function (event) {
    var event = event.originalEvent;
    leavePage = event.leavePage.id;
    if (event.enterPage.id === 'livestock_add') {
        updateLivestockAddView()
    }
});

document.addEventListener("init", function (event) {
    var page = event.target;
    //livestock add page
    if (page.id === 'livestock_add') {

        updateLivestockAddView2(
    }
});