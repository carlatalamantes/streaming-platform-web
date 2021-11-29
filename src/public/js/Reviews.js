"use strict";
getReview();

async function createReview() {
  let name = document.getElementById("inpt_user").value;
  let review = document.getElementById("inpt_text").value;
  let movieId = window.location.pathname.split("/")[2];
  let token = localStorage.getItem("token");
  var decoded = jwt_decode(token);
  let userId = decoded.id;

  let response = await reviewHandler(urlAPI, localStorage.getItem("token"), {
    name,
    userId,
    movieId,
    review,
  });
  if (response.status == 201) {
    $("#exampleModal").modal("hide");
    window.alert(response.message.message);
    window.location.reload();
    getElementById("formMovieDetail").reset();
  } else if (response.status == 400) {
    let errorsArray = [];
    for (let i = 0; i < response.message.length; i++) {
      errorsArray.push(response.message[i].msg);
    }
    window.alert(errorsArray);
  } else if (response.status == 401) {
    window.alert(response.message);
  }
}

async function getReview() {
  let id = window.location.pathname.split("/")[2];
  let response = await reviewHandler(urlAPI, localStorage.getItem("token"), id);
  if (response.status == 200) {
    reviewListToHtml(response.message);
  } else {
    window.alert(response.message);
  }
}

function reviewToHtml(review) {
  return `
  <div class="swiper-slide">
  <div class="card">
    <div class="card-header">${review.name}</div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p>
        ${review.review}
        </p>
      </blockquote>
    </div>
  </div>
</div>
    `;
}

function reviewListToHtml(reviews) {
  let rowContainer = document.getElementById("reviewList");
  rowContainer.innerHTML = reviews.map(reviewToHtml);
}
