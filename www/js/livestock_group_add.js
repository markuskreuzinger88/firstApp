// Create livestock object to check if changes occures by clicking backbuton
var livestockGroupObj = {
    place: "",
    number: "",
    count: "",
    category: "",
    born: "",
};

function LivestockGroupReady() {

    livestockGroupObj.number = document.getElementById("animalGroupNumberText").value;
    livestockGroupObj.count = document.getElementById("animalGroupCountText").value;

    //set the last selected place for livestock group
    if ("livestockPlaceAdd" in localStorage) {
        document.getElementById("animalGroupPlaceText").innerHTML = localStorage.getItem("livestockPlaceAdd")
        livestockGroupObj.place = localStorage.getItem("livestockPlaceAdd")
    } else {
        document.getElementById("animalGroupPlaceText").innerHTML = "Bitte wählen"
        livestockGroupObj.place = "Bitte wählen"
    }

    //set the last selected category for livestock group
    if ("lastAnimalCategory" in localStorage) {
        document.getElementById("animalGroupCategoryText").innerHTML = localStorage.getItem("lastAnimalCategory")
        livestockGroupObj.category = localStorage.getItem("lastAnimalCategory")
    } else {
        document.getElementById("animalGroupCategoryText").innerHTML = "Bitte wählen"
        livestockGroupObj.category = "Bitte wählen"
    }

    //get max date
    animalGroupBornOnText.max = new Date().toISOString().split("T")[0];

    let today = new Date().toISOString().substr(0, 10);
    document.querySelector("#animalGroupBornOnText").value = today;
    livestockGroupObj.born = today
}

function checkInputsGroupUnsaved() {

    var place = document.getElementById("animalGroupPlaceText").innerHTML;
    var number = document.getElementById("animalGroupNumberText").value;
    var count = document.getElementById("animalGroupCountText").value;
    var category = document.getElementById("animalGroupCategoryText").innerHTML;
    var born = document.getElementById("animalGroupBornOnText").value;

    if ((place !== livestockGroupObj.place) || (number !== livestockGroupObj.number) || (count !== livestockGroupObj.count) || (category !== livestockGroupObj.category) || (born !== livestockGroupObj.born)) {
        ons.notification.confirm({
            message: 'Das Profil hat ungespeicherte Änderungen. Bist du sicher, dass du das Profil verlassen möchtest?',
            title: 'Ungespeicherte Änderungen',
            buttonLabels: ['Ja', 'Nein'],
            animation: 'default',
            primaryButtonIndex: 1,
            cancelable: true,
            callback: function (index) {
                if (index == 0) {
                    document.querySelector('#nav1').popPage();
                }
            }
        });
    } else {
        document.querySelector('#nav1').popPage();
    }
}
