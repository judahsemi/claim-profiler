


var ML_CLAIM_REPORT_URL = "http://127.0.0.1:8000/api/v1/ml/claim-report/";

var data_map = [];


function fillLeftScreen(query_text, result) {
  'use strict';
  query_text = updateQueryText(query_text, result);
  $("#query-text").html(`${query_text.trimLeft("\n")}`).focus();
}

function updateQueryText(query_text, result) {
  'use strict';
  result.forEach(function(r) {
    var itemId = ""

    if (r.label === "CLAIM") {
      itemId = `clm-${r._id}`;
      query_text = query_text.replace(r.text,
        `<a id=${itemId} class="claim-text" onclick="fillRightScreen(this);">${r.text}</a>`)
    }
    else if (r.label === "EVIDENCE") {
      itemId = `evi-${r._id}`;
      query_text = query_text.replace(r.text,
        `<span id=${itemId} class="evidence-text">${r.text}</span>`)
    }

    data_map[itemId] = r;
  });
  return query_text
}

function fillRightScreen(claim) {
  'use strict';
  clearRightScreen();

  $("#selected-claim-text").html(`<a href=#${claim.id}>${claim.textContent}</a>`).focus();

  var evidenceList = data_map[claim.id].children;
  var evidenceListTag = $(".evidence-list");
  if (evidenceList.length > 0) {
    evidenceList.forEach(function(r) {
      var voteClass = "";
      if (r.vote == "SUPPORTS") {
        voteClass = "vote-supports";
      }
      else if (r.vote == "REFUTES") {
        voteClass = "vote-refutes"
      }
      else {
        voteClass = "vote-notenoughinfo"
      }
      $("#evi-"+r._id).addClass(voteClass);

      evidenceListTag.html(
        `${evidenceListTag.html()}<li><a href=#evi-${r._id}>${r.text}</li>`);
    });
  }
  else {
    evidenceListTag.html(`<li>None was found</li>`);
  }

  $(".right-screen *").removeClass("hidden");
}

function clearRightScreen() {
  'use strict';

  $("#selected-claim-text").html("");
  $(".evidence-list").html("");
  $(".right-screen *").addClass("hidden");
  $(".evidence-text").removeClass(["vote-supports", "vote-refutes", "vote-notenoughinfo"]);
}

function profile_claims(formData) {
  $.ajax({
    "async": true,
    "type": "POST",
    "url": ML_CLAIM_REPORT_URL,
    "data": formData,
    "dataType": "json",
    "encode": true,
  })
  .done(function(data) {
    var query_text = data.text;
    var result = data.result;

    $(".header-content").removeClass("hidden");
    $(".h-content").removeClass("hidden");
    fillLeftScreen(query_text, result);
  })
  .fail(function(msg) {
    console.log(msg);
  });
}

$(document).ready(function() {
  $("form").submit(function(event) {
    var formData = {
      text: $("#form-field-text").val(),
      url: $("#form-field-url").val(),
      file: $("#form-field-file").val(),
    };

    profile_claims(formData);
    event.preventDefault();
  });
});

