//global variables
var eventEnterPageId = ""
var leavePage = ""

//on init page
document.addEventListener("init", function (event) {

    //create livestock location view for different pages
    //to update dynamically
    ons.createElement("locationAdd.html", {
        append: true
    });

    ons.createElement("drugDeliveryTemplate.html", {
        append: true
    });

    //set menu background
    $("#menu .page__background").css("background", "linear-gradient(156deg, rgba(43,96,90,1) 0%, rgba(102,141,138,1) 40%, rgba(241,241,241,1) 40%)");

    //get page object
    var page = event.target;
    //set global page variable
    eventEnterPageId = page.id;

    //call main function for each page on init
    if (page.id === 'livestock_add') {
        updateLivestockAddView();
    } else if (page.id === 'livestock') {
        updateLivestockView()
    } else if (page.id === 'drug') {
        DisplayResultDrug()
    } else if (page.id === 'drug_delivery') {
        getDrugDeliveryView()
    } else if (page.id === 'Bestandsliste ID') {
        setMarkDetailView()
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
    } else if (event.enterPage.id === 'livestock_selector') {
        //update livestock locations after page load
        updateLivestockLocations()
    } else if (event.enterPage.id === 'drug_delivery') {
        //update diagnosis items after page load
        updateDiagnosis()
    }
});

//on page prepop
$(document).on('prepop', '#nav1', function (event) {
    var event = event.originalEvent;
    if (event.enterPage.id === 'drug_delivery') {
        getDrugDeliveryView()
    }
});