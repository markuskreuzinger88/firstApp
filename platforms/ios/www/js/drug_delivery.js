db = window.openDatabase("Database", "1.0", "Nutztier DB", 20 * 1024 * 1024); //create 20MB Database
var email = "";
var token = "";
var color = "";
var number = "";
var drug = "";
var delay = "";
var amount = "";
var timestamp = "";
var approval_number = "";
var switchState = "";
var ipAdress = "";
var LiveStockNbr = "AT-3-4321056-";
var arrColor = [];
var arrNumber = [];
var createdOn = "";

document.addEventListener("init", function (event) {
    var page = event.target;
    if (page.id === 'drug_delivery') {
        CreatedOn.max = new Date().toISOString().split("T")[0];
        let today = new Date().toISOString().substr(0, 10);
        document.querySelector("#CreatedOn").value = today;
        switchState = localStorage.getItem("settings_request")
        ipAdress = localStorage.getItem("settings_ipAdress")
        var color = String(localStorage.LivestockColor)
        var number = String(localStorage.LivestockNumber)

        /*read from user table in DB*/
        db.transaction(function (transaction) {
            transaction.executeSql('SELECT * FROM user', [], function (tx, results) {
                //get buisness code for requests
                email = results.rows.item(0).email;
                //get user token
                token = results.rows.item(0).bearerToken;
            }, null);
        });
        GetDBTaggedResult()
    }
});

//get all livestocks which are tagged for drug delivery
function GetDBTaggedResult() {
    var list = document.getElementById("container");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    db.transaction(function (transaction) {
        transaction.executeSql(
            'SELECT * FROM livestock WHERE tagged = ? ORDER BY Number DESC', ['true'],
            function (tx, results) {
                console.log(results)
                DisplayResultDrugDelivery(results)
            }, null);
    });
}

function DisplayResultDrugDelivery(results) {
    console.log(results.rows.length)
    arrColor = [];
    arrNumber = [];
    if (results.rows.length > 0) {
        for (i = 0; i < results.rows.length; i++) {
            list = document.createElement("ons-list-item")
            list.setAttribute("onclick", "removeListItem(" + i + ")");
            //create text center
            div_center = document.createElement("div")
            div_center.setAttribute("id", i);
            div_center.setAttribute("class", "center");
            div_center.setAttribute("style", "margin-left: 10px");
            //create icon right
            div_right = document.createElement("div")
            div_right.setAttribute("class", "right");
            icon_right = document.createElement("ons-icon")
            icon_right.setAttribute("icon", "fa-trash");
            icon_right.setAttribute("style", "color: red");
            icon_right.setAttribute("size", "20px");
            icon_right.setAttribute("onclick", "removeListItem(" + i + ")");
            //add text center
            span_center1 = document.createElement("span")
            span_center1.setAttribute("id", "livestockID" + i);
            span_center2 = document.createElement("span")
            span_center1.setAttribute("class", "list-item__title");
            span_center2.setAttribute("class", "list-item__subtitle");
            span_center1.innerHTML = LiveStockNbr + results.rows.item(i).number;
            span_center2.innerHTML = results.rows.item(i).place;
            div_left = document.createElement("div")
            div_left.setAttribute("class", "left");
            //create color mark right
            input = document.createElement("input")
            input.setAttribute("id", "livestockColor" + i);
            input.setAttribute("style",
                "margin-right: 5px;border-color : black; border-width: medium; background-color:" + results
                .rows
                .item(i).color);
            input.setAttribute("size", "3");
            input.setAttribute("disabled", "true");
            list.setAttribute("tappable", true);
            //append childs
            div_left.appendChild(input);
            div_right.appendChild(icon_right);
            list.appendChild(div_left);
            list.appendChild(div_right);
            div_center.appendChild(span_center1);
            div_center.appendChild(span_center2);
            list.appendChild(div_center);
            document.getElementById("container").appendChild(list);
            arrColor.push(results.rows.item(i).color);
            arrNumber.push(results.rows.item(i).number);
            console.log(arrColor)
        }
    } else {
        list = document.createElement("ons-list-item")
        div = document.createElement("div")
        div.innerHTML = "Kein Nutztier ausgewählt"
        list.appendChild(div);
        document.getElementById("container").appendChild(list);
        document.getElementById("removeLivestocks").innerHTML = "";
        document.getElementById("removeLivestocks").disabled = true;
    }
}

function removeListItem(id) {
    var color = document.getElementById("livestockColor" + id).style.backgroundColor;
    var number = document.getElementById("livestockID" + id).innerHTML;
    //only use livestock 4 digit number
    number = number.slice(number.length - 4, number.length);
    ons.notification.confirm({
        message: 'Möchtest du das Nutztier aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Nutztier entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                db.transaction(function (tx) {
                    tx.executeSql(
                        "UPDATE livestock SET tagged=? where Color = ? AND Number = ?",
                        ['false', color, number]);
                }, function (error) {
                    alert('Error: ' + error.message + ' code: ' + error.code);
                }, function () {
                    GetDBTaggedResult()
                });
            }
        }
    });
}

function removetag() {
    ons.notification.confirm({
        message: 'Möchtest du alle Nutztier aus deiner Liste für die Arzneimittelvergabe löschen?',
        title: 'Nutztier entfernen',
        buttonLabels: ['Ja', 'Nein'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            if (index == 0) {
                db.transaction(function (tx) {
                    tx.executeSql(
                        "UPDATE livestock SET tagged=?",
                        ['false']);
                }, function (error) {
                    alert('Error: ' + error.message + ' code: ' + error.code);
                }, function () {
                    GetDBTaggedResult()
                });
            }
        }
    });
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
        //                arzneimittel=document.getElementById("Arzneimittel").value)
        arrayIndex = arzneimittel.indexOf(document.getElementById("arzneimittel").value)
        console.log(arrayIndex)
        if (arrayIndex != '-1') {
            document.getElementById("wartezeit").value = wartezeit[arrayIndex]
            document.getElementById("zulassungsnummer").value = zulassungsnummer[arrayIndex]
        } else {
            document.getElementById("wartezeit").value = ""
            document.getElementById("zulassungsnummer").value = ""
        }
    });
}

var arzneimittel = ['Aconitum RemaVet ', 'Adrisin', 'Advocid 25 mg/ml ', 'Agrimec 1 mg/g ',
    'Alamycin 300 long acting ', 'Albipenal Depot 100 mg/ml – ', 'Altidox 500 mg/g ', 'ALTRESYN 4 mg/ml ',
    'Amoxicillin Chevita 200 mg/g ', 'Amoxicillin', 'Amoxi', 'Amoxy Active', 'Ampicillin „Vana“ 200 mg/ml ',
    'Ampi', 'Amynin N', 'Anaestamine 100 mg/ml ', 'Animedazon Spray', 'Animeloxan', 'Apis comp. ',
    'Apis RemaVet ', 'Apravet 552 IE/mg ', 'Aqupharm Natriumchlorid', 'Aqupharm Ringer', 'Arnica RemaVet ',
    'Arsenicum album RemaVet ', 'Avena/Phosphor ', 'Axentyl 200 mg/ml ', 'Baycox Multi 50 mg/ml ',
    'Bayselen E ', 'Baytril Direct 100 mg/ml ', 'Baytril Direct 100 mg/ml ', 'Baytril One 100 mg/ml ',
    'Baytril RSI ', 'Baytril 100 mg/ml ', 'Baytril 25 mg/ml ', 'Baytril 5 mg/ml ', 'Baytril 50 mg/ml ',
    'Belfer 100 mg/ml ', 'Betamox ', 'Betamox long acting ', 'Bimectin 10 mg/ml ', 'Bimoxyl LA 150 mg/ml ',
    'Bioplex Colistin 25 mg/g ', 'Bisolvon 10 mg/g ', 'Bisolvon 3 mg/ml ', 'Borgal 200 mg/ 40 mg/ml ',
    'Bronchi comp. ', 'Broncho', 'Broncho', 'Bryonia RemaVet ', 'Buscopan compositum ',
    'Cadorex 300 mg/ml ', 'Calcibel 240/60/60 mg/ml ', 'Calcitat ', 'Calcitat forte ',
    'Calcium gluconicum „Jacoby“', 'Calendula ReVet RV 27 ', 'Carbo', 'Cardio ReVet RV 4 ',
    'Carofertin 10 mg/ml ', 'Cartilago comp. ', 'Cefenil RTU 50 mg/ml ', 'Cefenil 50 mg/ml ',
    'CEFFECT 25 mg/ml ', 'Ceftiocyl Flow 50 mg/ml', 'Ceftiocyl 50 mg/ml', 'CEFTIOMAX 50 mg/ml ',
    'Ceftiosan', 'Centidox 1000 mg/g ', 'CEVAXEL 50 mg/ml', 'CEVAXEL', 'CEVAZURIL 50 mg/ml',
    'Chanox Multi 50 mg/ml ', 'Chevicet 200 mg/g  ', 'Chevicet 200 mg/g ', 'Chevi', 'Chevi', 'Chevi',
    'Choliren ReVet RV5 ', 'Chorulon 1500 I.E. ', 'Cirbloc ', 'CIRCOVAC ', 'Citramox', 'Cobactan 2',
    'COFFEA PRAEPARATA ', 'Coglapix ', 'Colfive 5.000.000 I.E./ml ', 'Coliporc ', 'Coliprotec F4 ',
    'Coliprotec F4/F18 ', 'Colistin', 'Colistinsulfat PUR ', 'Colistinsulfat 1000 mg/g ',
    'Colistinsulfat 120 mg/g ', 'Colivet 2 000 000 IU/ml', 'Colixid 25 mg/g ', 'Colosan ', 'Combiotic ',
    'CORTEXONAVET 2 mg/ml ', 'Cotrimoxazol', 'Cuxacyclin 200 mg/ml ', 'Cyclix Porcine 87',
    'Cyclosol L.A. 200 mg/ml', 'CYCLO', 'Cylabel 1000 mg/g ', 'Dalmazin 75 µg/ml ', 'DANIDOL 150 mg/ml ',
    'DANIDOL 300 mg/ml ', 'DECTOMAX 10 mg/ml ', 'Denagard 100 mg/g ', 'Denagard 100 mg/ml ',
    'Denagard 125 mg/ml ', 'Denagard 20 mg/g ', 'Denagard 450 mg/g ', 'Depomycin 200/278',
    'Depotocin 35 µg/ml ', 'Depotocin 70 µg/ml ', 'Dexa ', 'Dexafast 2 mg/ml ', 'Dexa', 'Dexashot',
    'Dexatat 2 mg/ml ', 'DFV DOXIVET 200 mg/ml', 'DFV DOXIVET 500 mg/g', 'Diarrect ReVet RV6 ',
    'Diarrect ReVet RV6 ', 'Diatrim 200 mg/ml   40 mg/ml ', 'Dinalgen 150 mg/ml ', 'Dinolytic 5 mg/ml ',
    'Disci comp. ', 'DOPHALIN 400 mg/g ', 'Doxx', 'Doxycyclin „AniMed Service“ 100 mg/g ',
    'Doxycyclin Chevita 462', 'Doxy', 'Dozuril Pig 50 mg/ml ', 'Dozuril 50 mg/ml ', 'Draxxin 100 mg/ml ',
    'Duocylat 1000 mg/g ', 'Duphamox Depot 150 mg/ml ', 'Dysticum ', 'Ecomectin 10 mg/ml ', 'Econor 10% ',
    'Econor 10% ', 'Econor 50% ', 'EFICUR 50 mg/ml ', 'Ektoderm ReVet RV8 ', 'ELO', 'Endometrium comp. ',
    'Engemycin Spray', 'Engemycin 100 mg/ml ', 'Engystol ', 'ENRODEXIL 100 mg/ml ', 'Enrotron 100',
    'Enrotron 25', 'Enrotron 50', 'Enrox Max 100 mg/ml ', 'ENROXIL 100 mg/ml ', 'ENROXIL 50 mg/ml ',
    'Entericolix', 'Enterisol Ileitis', 'Enteroferment ', 'Enterolyt ', 'Enteroporc AC ', 'Enteroxid ',
    'ENZAPROST T 5 mg/ml ', 'Epispas ReVet RV10 ', 'Equilis Tetanus', 'Espacox 50 mg/ml ',
    'Estrumate 250 µg/ml ', 'Eucacomp ', 'Exagon 400 mg/ml ', 'Exagon 500 mg/ml ', 'Excenel Flow',
    'Exflow Vet 10 mg/g ', 'Febantel 2', 'Febrisept ReVet RV11 ', 'Febrisept ReVet RV11 ',
    'Fenflor 300 mg/ml ', 'Fenoflox 100 mg/ml ', 'Fenoflox 50 mg/ml ', 'Ferriphor 100 mg/ml ',
    'FERTIGEST 0', 'FLIMABEND 100 mg/g ', 'FLIMABO 100 mg/g ', 'Florgane 300 mg/ml ',
    'FLORINJECT 300 mg/ml ', 'FLORKEM 300 mg/ml ', 'Floron 40 mg/g ', 'Flubenol 50 mg/g ',
    'Folligon 1000 I.E. ', 'Forcyl Swine 160 mg/ml ', 'Gabbrovet 140 mg/ml ', 'Gastro ReVet RV12 ',
    'Genabil 100 mg/ml ', 'Genestran 75 Mikrogramm/ml ', 'Genta', 'Gentavan 50 mg/ml ',
    'GESTAVET HCG 1000 I.E./PMSG 2000 I.E.', 'GESTAVET HCG 200 I.E./PMSG 400 I.E.', 'Gleptosil 200 mg/ml ',
    'Glucose B. Braun Vet Care 40 g/100 ml ', 'Glucose B. Braun Vet Care 5 g/100 ml  ',
    'Gonavet Veyx 50 µg/ml ', 'Gutal 1000 mg/g ', 'Hepar comp. ', 'Hepar sulfuris RemaVet ',
    'Hipracin 10 IE/ml ', 'Hormon ReVet RV13 ', 'HydroDoxx 500 mg/g ', 'Hyogen ', 'Hyoresp ',
    'Hypertone Natriumchlorid', 'INDUPART 75 Mikrogramm/ml ', 'Ingelvac CircoFLEX ', 'Ingelvac MycoFLEX ',
    'Ingelvac PCV FLEX ', 'Ingelvac PRRSFLEX EU ', 'Intertocine 10 I.E. ', 'Interzol 67', 'Isotone ',
    'Ivermectin ', 'IVERTIN 10 mg/ml ', 'Ivomec ', 'Ivomec ', 'Juniperus sabina RemaVet ', 'Kamilloplant ',
    'KEFLORIL 300 mg/ml', 'Kelaprofen 100 mg/ml', 'Ketamidor 100 mg/ml ', 'Ketamin ', 'Ketasol 100 mg/ml ',
    'Ketink 100 mg/ml ', 'Ketink 300 mg/ml ', 'Ketodolor 100 mg/ml ', 'KetoProPig 100 mg/ml ',
    'Lachesis RemaVet ', 'Lacto ReVet RV15 ', 'Ladoxyn 100 mg/g', 'Larynx/Apis comp. ',
    'Lincospectin 222 mg/g   444', 'Linco', 'LongActon 0', 'Maprelin 75 µg/ml ', 'Marbim 100 mg/ml ',
    'Marbocyl 10 % ', 'Marbocyl 2% ', 'Marbosyva 100 mg/ml ', 'MARBOX 100 mg/ml ', 'Marfloquin 100 mg/ml ',
    'Marfloquin 20 mg/ml ', 'Masterflox 100 mg/ml ', 'Masterflox 40 mg/ml ', 'Maxyl',
    'Medicyclin 200 mg/ml', 'Melovem 20 mg/ml ', 'Melovem 30 mg/ml ', 'Melovem 5 mg/ml  ',
    'Membrana nasalium comp. ', 'Menbutil 100 mg/ml', 'Menbuton 100 mg/ml ', 'Metacam 15 mg/ml ',
    'Metaxol 20/100 mg/ml ', 'Methoxasol–T 20/100 mg/ml ', 'Metro ReVet RV 17 ', 'Miktiolith ReVet RV 18 ',
    'M Pac ', 'Mucosa compositum Heel ', 'Mypravac suis ', 'Narketan 100 mg/ml ', 'Natriumchlorid',
    'Nefotek 100 mg/ml ', 'Neocolipor', 'Neo', 'Neomycin', 'NIFENCOL 100 mg/ml ', 'Nifencol 300 mg/ml ',
    'Norfenicol 300 mg/ml ', 'Noromectin ', 'Noromectin ', 'Novacoc forte ', 'Novasul 500 mg/ml ',
    'Nuflor Schwein 300 mg/ml ', 'Nux vomica comp. ', 'Nux vomica RemaVet ', 'Nux vomica',
    'Nympho ReVet RV20 ', 'Octacillin 800 mg/g ', 'Odimar 100 mg/ml ', 'Odimar 20 mg/ml ',
    'Ovarium compositum Heel ', 'Oxytetracyclin ', 'Oxytetracyclin ', 'Oxytetracyclin ',
    'Oxytetracyclin 371 mg/g ', 'Oxytetra', 'Oxytocin „Vana“ 10 IE/ml – ', 'Panacur AquaSol 200 mg/ml ',
    'Panacur 4 % ', 'Paracillin 800 mg/g ', 'Parofor 140 mg/ml ', 'Parofor 70 mg/g ', 'Parvoruvac ', 'Peni',
    'PEN', 'P.G. 600 ', 'PGF Veyx forte 0', 'PGF Veyx 0', 'Pharmasin 1 g/g ', 'Pharmasin 100 mg/g ',
    'Pharmasin 20 mg/g ', 'PHARMASIN 200 mg/ml ', 'Pharmasin 250 mg/g ', 'Phlegmone Salbe ', 'Phlegmovet ',
    'Phytolacca RemaVet ', 'Pigfen 200 mg/ml ', 'Pigfen 40 mg/g ', 'Pigfen 40 mg/g ',
    'Porceptal 4 Mikrogramm/ml ', 'Porcilis AR', 'Porcilis Ery ', 'Porcilis Ery   Parvo ',
    'Porcilis Ery Parvo Lepto ', 'Porcilis Glässer ', 'Porcilis M Hyo ID ONCE', 'Porcilis M Hyo',
    'Porcilis Parvo ', 'Porcilis PCV ID ', 'Porcilis Pesti ', 'Porcilis Porcoli ', 'Porcilis PRRS',
    'Powdox 500 mg/g ', 'Powerflox 100 mg/ml ', 'Powerflox 50 mg/ml ', 'PRACETAM 200 mg/g ',
    'Pracetam 200 mg/ml ', 'Pracetam 400 mg/ml ', 'Previron 200 mg/ml ', 'Prisulfan 24 % ',
    'Procain Penicillin G ', 'Procamidor 20 mg/ml ', 'Progressis', 'Pronestesic 40 mg/ml / 0',
    'Prosolvin 7', 'Prosync 250µg/ml ', 'Pulmo/Bryonia comp. ', 'Pulmodox 5% PREMIX', 'Pulmodox 500 mg/g ',
    'Pulmo/Stibium comp. ', 'Pulmotil G 200 g/kg ', 'Pulsatilla RemaVet ', 'Qivitan 25 mg/ml ',
    'Quiflor 100 mg/ml ', 'Quiflor 20 mg/ml ', 'Rapidexon 2 mg/ml ', 'Receptal 0', 'Recocam 20 mg/ml ',
    'Release', 'Remalind ', 'Renes/Viscum comp. ', 'Repose 500 mg/ml ', 'ReproCyc PRRS EU ', 'Respiporc ',
    'RESPIPORC FLUpan H1N1 ', 'RESPIPORC FLU3 ', 'Rhemox 500 mg/g ', 'Rhiniffa T ', 'Rifen 100 mg/ml ',
    'Riketron N 200 mg/ml   40 mg/ml ', 'Ringer', 'Ringer', 'Ringer', 'Romefen 100 mg/ml ', 'Roxilin ',
    'Roxilin Depot ', 'Sabaco Colistin 120 mg/g ', 'Scilla comp. ', 'Sebacil 500 mg/ml ',
    'SELECTAN ORAL 23 mg/ml ', 'SELECTAN 300 mg/ml ', 'Selen E', 'Serocillin 300 mg/ml ', 'Serovit ',
    'Shotaflor 300 mg/ml ', 'Solacyl 1000 mg/g', 'Soludox 500 mg/g ', 'Spasmium comp. 500 mg/ml   4 mg/ml ',
    'Stalimox 364', 'Stalimox 81 mg/g ', 'Stellamune Mycoplasma ', 'Stellamune One ',
    'Stomato ReVet  RV24 ', 'Stomato ReVet RV24 ', 'STRENZEN 500/125 mg/g ', 'Stresnil 40 mg/ml ',
    'Stullmisan 30', 'Suifertil 4 mg/ml ', 'Suipravac', 'SUISENG ', 'Suispirin', 'Suivac APP ',
    'Sulfaprex 250/50 mg/g ', 'Sulfur RemaVet ', 'Suprarenales comp. ', 'SURAMOX 500 mg/g ', 'Surcalce ',
    'Suvaxyn Aujeszky 783   O/W ', 'Suvaxyn Circo ', 'Suvaxyn Circo MH RTU ', 'Suvaxyn M.hyo ',
    'Suvaxyn M.hyo', 'Suvaxyn Parvo/E', 'Suvaxyn PCV ', 'Suvaxyn PRRS MLV ', 'Suvaxyn (R) MH', 'Synpitan',
    'SYNULOX® RTU 140/35 mg/ml', 'T 61 ', 'TAF SPRAY 28', 'Tamox ', 'Terramycin 39',
    'Tetrasol LA 200 mg/ml ', 'Theranekron D6 ', 'Tialin 125 mg/ml ', 'Tialin 250 mg/ml ', 'Tiamulin',
    'Tildosin 250 mg/ml ', 'Tilmovet 100 g/kg ', 'Tilmovet 100 mg/g ', 'Tilmovet 200 g/kg ',
    'Tilmovet 250 mg/ml ', 'Tilmovet 40 g/kg ', 'Tolfedine 40 mg/ml ', 'Toltranil 50 mg/ml ',
    'TOLVET 50 mg/ml ', 'Tratol 50 mg/ml ', 'Traumato Revet RV 25 ', 'Traumato ReVet RV 25 ', 'Traumeel ',
    'Traumeel ', 'Trigantol ', 'Trimetho', 'Trimetotat 400 mg/ml   80 mg/ml ', 'Tylan 20 mg/g ',
    'Tylan 200 mg/ml ', 'TYLOGRAN', 'Tylosin', 'Tylosintartrat PUR „AniMed Service“ 1g/g – ',
    'Tylucyl 200 mg/ml ', 'UNISOL 100 mg/ml', 'UNISTRAIN PRRS ', 'Urtica/Stannum comp. ',
    'Vanacyclin 100 mg/ml ', 'Vanacyclin 20% LA ', 'Vanafer 100 mg/ml ', 'Vanapen ', 'Vanatyl 200 mg/ml ',
    'Vanavit B', 'VEPURED ', 'Versiguard Rabies – ', 'Vetalgin 500 mg/ml ', 'Veteglan 0', 'Veterelin 0',
    'Vetmulin 100 g/kg ', 'Vetmulin 100 mg/g ', 'Vetmulin 125 mg/ml ', 'VETMULIN 162 mg/ml ',
    'Vetmulin 450 mg/g  ', 'Vetrimoxin L.A. 150 mg/ml', 'VIRBAGEST 4 mg/ml', 'Virbamec 10 mg/ml  ',
    'Vitasol AD3E ', 'Vitasol AD3EC ', 'Voren ', 'Weravet Dermisal C 30 ', 'Weravet Staphylosal C30 ',
    'Weravet Traumisal C30 ', 'WERAVET Vomisal  C30 ', 'Zactran 150 mg/ml ', 'Zeel', 'Zuritol 50 mg/ml '
];
var wartezeit = ['0', '0', '3', '12', '28/14', '28', '4', '9', '14', '1', '14', '2', '21', '7', '0', '1', '0',
    '8', '0', '0', '0', '0', '0', '0', '0', '0', '14', '77', '0', '12', '12', '12', '12', '13', '13', '5',
    '13', '0', '18', '19', '28', '21', '2', '0', '2', '8', '0', '0', '0', '0', '12', '18', '0', '0', '0',
    '3', '0', '0', '0', '0', '0', '5', '2', '3', '2', '6', '5', '8', '8', '2', '5', '77', '77', '14', '14',
    '14', '1', '1', '0', '0', '0', '0', '2', '3', '0', '0', '1', '0', '0', '0', '2', '2', '2', '2', '1',
    '2', '0', '21', '2', '10', '28', '2', '28', '0', '0', '1', '3', '1', '77', '6/1', '21', '7', '6/1',
    '2/4', '21', '0', '0', '6', '2', '2', '2', '4', '4', '4', '0', '0', '20', '3', '1', '0', '1', '8', '12',
    '8', '12', '77', '77', '13', '0', '28', '0', '28', '1', '1', '1', '5', '0', '0', '0', '0', '8', '0',
    '13', '13', '13', '13', '12', '13', '13', '0', '0', '0', '20', '0', '2', '2', '0', '0', '73', '2', '0',
    '', '', '2', '0', '14', '0', '0', '18', '13', '13', '0', '0', '3/4', '3/4', '22', '18', '18', '14', '5',
    '0', '9', '3', '0', '3', '1', '20', '146', '0', '0', '0', '0', '0', '0', '28', '0', '0', '12', '0', '6',
    '0', '0', '0', '1', '0', '0', '0', '0', '0', '14', '0', '12', '28', '14', '12/3', '0', '0', '18', '2',
    '0', '0', '0', '4', '1', '4', '2', '0', '0', '7', '0', '0', '21', '0', '0', '4', '4', '4', '4', '4',
    '4', '4', '4', '6', '2', '21', '5', '5', '5', '0', '0', '0', '5', '8', '5', '0', '0', '0', '0', '2',
    '0', '0', '4', '0', '21', '45', '20', '18', '22', '18', '12', '3', '3', '18', '0', '0', '0', '0', '2',
    '4', '4', '0', '14', '14', '14', '14', '14', '0', '4', '7', '2', '3', '3', '0', '21', '21', '0', '2',
    '2', '1', '0', '1', '14', '0', '3', '0', '0', '4', '4', '4', '0', '0', '0', '0', '0', '0', '0', '0',
    '0', '0', '0', '0', '0', '4', '13', '13', '0', '0', '0', '0', '12', '15', '0', '0', '0', '0', '2', '0',
    '7', '4', '0', '21', '0', '3', '4', '4', '2', '0', '5', '', '0', '0', '', '0', '0', '0', '0', '6', '0',
    '4', '10', '0', '0', '0', '4', '16', '19', '2', '0', '9', '20', '18', '0', '6', '1', '18', '0', '4',
    '15', '2', '3', '0', '0', '0', '0', '1', '14', '0', '9', '0', '0', '1', '0', '5', '0', '0', '14', '0',
    '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '31', '', '14', '14', '10/0', '28', '0', '2/4', '4/2',
    '7', '14', '21', '21', '21', '14', '21', '6', '77', '73', '77', '0', '0', '0', '0', '0', '14', '10',
    '0', '7', '1', '0', '1', '14', '13', '0', '0', '21', '21', '0', '10', '7', '0', '0', '0', '3', '1', '0',
    '1/6', '7', '5', '21', '4/2', '20', '9', '28', '0', '0', '47', '0', '0', '0', '0', '16', '0', '77'
];
var zulassungsnummer = ['838031', '838423', '8-00295', '8-00773', '8-00479', '8-00037', '837155', '8-00771',
    '8-00708', '837234', '8-00522', '835600', '8-00505', '8-00636', '8-00073', '835772', '8-00762',
    '8-01036', '8-30013', '838045', '838497', '837173', '837174', '838047', '838071', '8-30009', '8-01158',
    '837293', '8-00246', '8-00988', '8-01123', '8-00755', '8-00424', '8-00059', '8-00166', '8-00060',
    '8-00058', '838090', '8-00477', '8-00476', '8-00474', '837697', '8-01164', '14144', '14143', '15705',
    '8-30007', '8-30097', '8-30098', '838028', '14155', '837636', '836855', '8-00020', '8-00021', '15252',
    '8-30103', '4222', '8-30100', '8-00290', '8-30014', '8-01097', '8-00835', '8-01136', '837993',
    '8-00879', '8-00859', '8-00946', '8-00896', '8-00763', '8-00938', '8-00875', '838261', '8-00010',
    '8-70054', '8-00915', '8-00657', '8-70017', '8-30049', '14623', '837400', 'EU/2/07/075/001-006',
    '835701', '8-00425', '8-00280', '836550', '836185', '8-20165', 'EU/2/14/180/001-003',
    'EU/2/16/202/001-003', '8-00588', '8-01195', '8-00507', '8-00717', '8-00710', '8-01192', '8-00287',
    '13117', '838289', '8-00624', '8-00475', '8-01051', '8-00577', '8-00492', '837995', '8-00470',
    '8-01005', '8-00841', '8-01110', '8-70035', '8-00094', '16507', '16850', '16508', '8-00044', '835602',
    '835603', '8-00339', '838634', '838339', '836943', '17734', '8-00983', '8-01086', '8-30046', '8-30062',
    '838179', '8-00860', '8-00003', '8-30010', '837829', '835972', '8-00627', '8-00719', '8-70057',
    '8-01068', '835283', 'EU/2/03/041/001-005', '8-00880', '8-00303', '8-00184', '8-00595',
    'EU/2/98/010/017-018', 'EU/2/98/010/025', 'EU/2/98/010/021-022', '8-00695', '8-30019', '836403',
    '8-30008', '8-00824', '8-00201', '8-30095', '8-00974', '8-01122', '8-01120', '8-01121', '835160',
    '8-00698', '8-00699', '836809', '8-20273', '8-20031', '8-00629', '838181', '8-00653', '8-00619',
    '8-30048', '8-20170', '835601', '16673', '8-00284', '835499', '837229', '8-00321', '836529', '8-70052',
    '8-30020', '8-30016', '8-00770', '8-00863', '8-00864', '16078', '837842', '8-01168', '8-01167',
    '8-00876', '835156', '8-00816', '8-70069', '16881', '14613', '8-01101', '838230', '8-30047', '12923',
    '8-01099', '8-00637', '8-00161', '8-00843', '8-00825', '8-01112', '835883', '8-01067', '836076',
    '836759', '8-30015', '838027', '8-00541', '8-30050', '8-00807', '836202', '8-20184', '8-00828',
    '835582', 'EU/2/07/079/001-008', '8-20319', 'EU/2/17/208/001-008', '836148', '14614', '8-01163',
    '836155', '8-00774', '8-00630', '8-00002', '8-70011', '838032', '8-00279', '8-00894', '835607',
    '8-01141', '8-00158', '8-00173', '8-01042', '836909', '8-01186', '8-00768', '838026', '8-30052',
    '8-70059', '8-30012', '8-00053', '8-00042', '8-00543', '8-00814', '837351', '8-00376', '8-00377',
    '8-01130', '8-00903', '8-00968', '8-00967', '837059', '835586', '835753', '8-00146',
    'EU/2/09/098/002-004', 'EU/2/09/098/005-007', 'EU/2/09/098/001', '8-30024', '8-00820', '836802',
    'EU/2/97/004/041-042', '836987', '8-00483', '8-30099', '8-30032', '8-20248', '8-30110', '8-20256',
    '8-00223', '835161', '8-01039', 'EU/2/98/008/001-004', '8-00639', '14689', '835584', '838308',
    '8-01070', '8-00481', '8-70056', '8-00520', '13661', '8-00472', '8-30006', '838029', '8-30094',
    '8-30033', '8-00914', '8-01134', '8-01133', '8-30108', '8-00399', '8-00616', '8-00609', '8-70013',
    '8-70023', '8-00340', 'EU/2/11/135/002-003', '16639', '8-00456', '837730', '835811', '8-20066', '17007',
    '8-00451', '14615', '8-01094', '8-01093', '8-00959', '8-70066', '8-00806', '8-01159', '8-70067', '9558',
    '14448', '838048', '838257', '837337', '836486', '835275', 'EU/2/00/026/001-006', '8-20021', '8-20185',
    '837110', '8-20260', '8-20328', '8-20284', '8-20262', 'EU/2/15/187/001-004', 'EU/2/99/016/001-006',
    'EU/2/96/001/003-008', '8-20227', '837609', '8-00796', '8-00795', '8-00827', '8-00855', '836951',
    '837260', '8-00247', '8-00147', '8-01119', '8-20229', '836934', '17573', '8-00842', '8-30022',
    '8-70049', '8-00715', '8-30030', '8-70042', '838030', '837357', '8-00981', '8-00980', '8-00739',
    '16887', 'EU/2/11/133/001-003', '8-00753', '838093', '8-30011', '837660', '836133', '8-20143',
    'EU/2/17/209/001-002', 'EU/2/09/103/001-006', '836487', '8-20090', '8-00692', '8-00346', '836145',
    '8-00872', '836146', '8-00209', '8-00179', '8-00180', '8-00718', '8-30017', '17506', '8-01125',
    '8-00716', '17296', '8-00313', '8-00268', '8-00772', '8-00745', '8-00902', '836428', '8-00676',
    '8-70055', '8-20154', '8-20246', '8-30039', '8-30051', '8-01189', '14797', '17854', '8-01185',
    '8-20187', '8-20320', '8-01050', '837171', '8-70073', '838046', '8-30028', '8-00495', '16368',
    'EU/2/98/009/001-006', 'EU/2/17/223/001-006', 'EU/2/15/190/001-006', '8-20177', '8-20309', '838513',
    'EU/2/09/099/001-006', 'EU/2/17/215/001-003', '8-20313', '13183', '8-00315', '12258', '835912',
    '8-00219', '13052', '8-00366', '8-30111', '838358', '838359', '8-00817', '838329', '8-70061', '8-00830',
    '8-70060', '8-00756', '8-70062', '8-00134', '8-00885', '835294', '8-00942', '8-30105', '8-30107',
    '835451', '8-30104', '12293', '8-00686', '8-00488', '8-70047', '13664', '835943', '8-00691', '837302',
    '836829', '8-00973', '8-20334', '8-30018', '8-00162', '8-00546', '16408', '8-00661', '8-00461',
    '8-00395', 'EU/2/17/214/001-005', '8-20285', '7118', '837610', '8-00975', '8-70064', '8-00829',
    '8-00862', '8-00832', '8-00805', '8-01135', '8-00818', '8-00503', '14250', '15145', '13910', '8-30066',
    '8-30061', '8-30055', '8-30056', 'EU/2/08/082/001-007', '838068', '835273'
];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("arzneimittel"), arzneimittel);


function getDrugs() {
    $.ajax({
        url: "http://192.168.0.111:5000/foo",
        contentType: "application/json; charset=utf-8",
        type: "POST",
        dataType: "json",
        crossDomain: true,
        data: JSON.stringify({
            "code": "XYZ"
        }),
        success: function (data) {
            //                    var fields = data.split(, );
            var jsonString = JSON.stringify(data);
            var DataObject = JSON.parse(jsonString);
            //                    $.each(DataObject.data.usedUnits, function(key, value) {
            //                        document.getElementById("test").innerHTML = value;
            //                    });
            alert(jsonString);
            var res = jsonString.replace("[", "")
            var res = res.replace("]", "")
            var res = res.split(",");
            countries = res;
            alert(arzneimittel);
            autocomplete(document.getElementById("arzneimittel"), arzneimittel);
            //                    document.getElementById("test").innerHTML = data;
            //                    countries = fields;
            //                    alert(countries)
        },
        failure: function (errMsg) {
            // navigator.notification.alert(errMsg);
        }
    });
}

function BackButton() {
    window.location = "menu.html";
}

function DoneButton() {
    drug = document.getElementById("arzneimittel").value
    delay = document.getElementById("wartezeit").value
    amount = document.getElementById("abgabemenge").value
    approval_number = document.getElementById("zulassungsnummer").value
    createdOn = document.querySelector("#CreatedOn").value
    let today = new Date().toISOString().substr(0, 10);
    //set timestamp to each database entry in millisec
    timestamp = Date.now();
    /*check livestock nummber and color*/
    if (arrNumber.length > 0) {
        /*check drug field and if drug exists*/
        if (drug.length != 0) {
            if (arzneimittel.includes(drug)) {
                /*check amount field*/
                if (amount.length != 0) {
                    if (switchState == 'true') {
                        requestData()
                    } else {
                        write2DB()
                    }
                } else {
                    ons.notification.alert({
                        message: 'Bitte die Abgabemenge eingeben',
                        title: 'Abgabemenge überprüfen',
                    });
                }
            } else {
                ons.notification.alert({
                    message: 'Das Arzneimittel befindet sich nicht in der Datenbank',
                    title: 'Arzneimittel überprüfen',
                });
            }
        } else {
            ons.notification.alert({
                message: 'Bitte vergib ein Arzneimittel',
                title: 'Arzneimittel überprüfen',
            });
        }
    } else {
        ons.notification.alert({
            message: 'Bitte wähle ein Nutztier aus deiner Datenbank aus',
            title: 'Nutztier auswählen',
        });
    }
}

function requestData() {
    var endpoint = ipAdress + "database/medical/" + code
    alert(endpoint)
    $.ajax({
        url: endpoint,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            "action": "commit",
            "number": number,
            "color": color,
            "drug": drug,
            "approval_number": approval_number,
            "delay": delay,
            "amount": amount,
            "timestamp": timestamp,
            "user": token
        }),
        success: function (data) {
            alert(data)
            write2DB()
        }
    });
}

function write2DB() {
    console.log(timestamp)
    for (i = 0; i < arrColor.length; i++) {
        (function (i) {
            db.transaction(function (transaction) {
                var executeQuery =
                    "INSERT INTO drug_delivery (color, number, drug, approval_number, delay, amount, created, DBSyncServer) VALUES (?,?,?,?,?,?,?,?)";
                transaction.executeSql(executeQuery, [arrColor[i], arrNumber[i], drug,
                    approval_number, delay, amount, createdOn, "true"
                ]);
            });
        })(i);
        // Remove taged entry i DB and change site to menu when for loop is done
        if (i == arrColor.length - 1) {
            db.transaction(function (tx) {
                tx.executeSql(
                    "UPDATE livestock SET tagged=?",
                    ['false']);
            }, function (error) {
                alert('Error: ' + error.message + ' code: ' + error.code);
            }, function () {
                document.querySelector('#nav1').popPage();  
            });
        }
    };
}