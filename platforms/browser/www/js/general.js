//set page item to modify livestock view
// document.addEventListener("init", function (event) {
//     event = event.originalEvent
//     console.log(event)
//     // var page = event.leavePage.name;
//     // console.log(page)
//     // if (page.id === 'drug_delivery') {
//     //     localStorage.setItem("lastPage", "drug_delivery");
//     // } else {
//     //     localStorage.setItem("lastPage", "menu");
//     // }
// });
// document.addEventListener("init", function (event) {
//     $(document).on('ons-navigator:postpush', 'ons-navigator', function(event) {
    //     $(document).on('prepop', '#nav1', function (event) {

    //       event = event.originalEvent;
    //       console.log(event.leavePage.id)
    //       // Do something
    //      if (event.leavePage) { console.log('From',event.leavePage.name, 'to', event.enterPage.name);
    //                           }
    // });
// });

//close keyboard if user press enter (öffnen)
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    this.console.log(event.key)
    if (event.key == "Enter")
    {
        $(document.activeElement).filter(':input:focus').blur();
    }
    // Cancel the default action to avoid it being handled twice
    // event.preventDefault();
  }, true);


function underConstruction() {
  ons.notification.alert({
    message: 'Diese Funktion wurde noch nicht implementiert',
    //title: 'Funktion',
});

}