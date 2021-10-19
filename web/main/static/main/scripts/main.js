


var ML_CLAIM_REPORT_URL = "http://127.0.0.1:8000/api/v1/ml/claim-report/";
var DETAIL_TITLE_SELECTOR = "";
var ESC_KEY = 27;

function setDetailsFromRelation(relation) {
    'use strict';
    // console.log(relation);
    // console.log(claim);
  
    var selectedRelation = document.getElementById("evi-"+relation._id);
    var evidenceList = document.querySelector(".evidence-list");

    evidenceList.innerHTML = evidenceList.innerHTML + (
        "<li><a href=#"+relation+">"+selectedRelation.innerText+"</li>");

    selectedRelation.classList.add("focus");
    selectedRelation.classList.add("supports");
}

function hideDetails() {
    'use strict';
    var selectedClaim = document.querySelector("section .select-claim");
    var evidenceList = document.querySelector(".evidence-list");

    selectedClaim.innerHTML = "";
    evidenceList.innerHTML = "";

    var sectionLeft = document.querySelector(".section-left-div");
    sectionLeft.classList.remove("film");
}

function setDetailsFromClaim(claim) {
    'use strict';
    hideDetails();
    var selectedClaim = document.querySelector("section .select-claim");
    // selectedClaim.textContent = "<a href=#"+claim.id+">"+claim.textContent+"</a>";
    selectedClaim.innerHTML = "<a href=#"+claim.id+">"+claim.textContent+"</a>";
    claim.classList.add("focus");
    
        
    //console.log(data_map);
    //console.log(data_map[claim.id]);
    var relations = data_map[claim.id].children;
    //console.log(relations);

    //var relations = claim.getAttribute("data-related").split(" ");
    if (relations) {
        relations.forEach(setDetailsFromRelation);
    } else {
        ;
  }

    var sectionLeft = document.querySelector(".section-left-div");
    sectionLeft.classList.add("film");
  
}

// function showDetails() {
//   'use strict';
//   var frame = document.querySelector(DETAIL_FRAME_SELECTOR);
//   document.body.classList.remove(HIDDEN_DETAIL_CLASS);

//   frame.classList.add(TINY_EFFECT_CLASS);
//   setTimeout(function () {
//     frame.classList.remove(TINY_EFFECT_CLASS);
//   }, 50);
// }

function addClaimClickHandler(claim) {
    'use strict';
    claim.addEventListener('click', function (event) {
        event.preventDefault();
        setDetailsFromClaim(claim);
    });
}

function getClaimArray() {
    'use strict';
    var claims = document.querySelectorAll(".claim-txt");
    var claimArray = [].slice.call(claims);
    return claimArray;
}

function addKeyPressHandler() {
    'use strict';
    document.body.addEventListener('keyup', function (event) {
        event.preventDefault();
        console.log(event.keyCode);

        if (event.keyCode === ESC_KEY) {
            hideDetails();
        }
    });
}

function initializeEvents() {
    'use strict';
    var claims = getClaimArray();
    claims.forEach(addClaimClickHandler);
    addKeyPressHandler();
}

var data_map = [];

function profile_claims() {
    $.ajax({
        "async": true,
        "type": "POST",
        "url": ML_CLAIM_REPORT_URL,
        "data": {"text": "hello"},
        "dataType": "json",
        "success": function(data){
            var query_text = data.text;
            var result = data.result;

        var itemId = ""

        result.forEach(function(r) {
            if (r.label === "CLAIM") {
                console.log("0");
                itemId = `clm-${r._id}`;
                query_text = query_text.replace(r.text,
                    `<span id=${itemId} class="claim-txt"><a>${r.text}</a></span>`)
            }
            else if (r.label === "EVIDENCE") {
                console.log("1");
                itemId = `evi-${r._id}`;
                query_text = query_text.replace(r.text,
                    `<span id=${itemId} class="evidence-txt">${r.text}</span>`)
            }

            data_map[itemId] = r;// = data_map.concat([{itemId: r}]);
        });

        while (query_text.search("\n") > 0) {
            query_text = query_text.replace("\n", "<br /><br />");
        }

        $(".section-left-div").html(`<p>${query_text}</p>`);

        initializeEvents();
        },
        error: function(msg) {
            // modal.append(msg);
        }
    });
}


/*
<!--
    //var claims = data.result.filter(function(dt) {
          //console.log(dt);
          //return dt.label === "CLAIM";
        //});
        //console.log(claims);


        //$("#select-claim").text(data);//.result[0].text);
        //$("#select-claim").css("background", "yellow").text(""+data);//.html(data);

    -->
  <!-- // data = {{ result.result }}; -->

  <!-- // var originalText = "{{ query_text|safe }}"; -->
*/

