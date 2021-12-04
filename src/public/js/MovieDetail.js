"use strict";
getMovie();

async function getMovie() {
  let id = window.location.pathname.split("/")[2];
  let response = await getmediabyidHandler(
    urlAPI,
    localStorage.getItem("token"),
    id
  );
  if (response.status == 200 && Array.isArray(response.message)) {
    let { genre, title, actors, cover, file, trailer, synopsis } =
      response.message[0];

    if (genre == "comedy") {
      genre = "Comedia";
    } else if (genre == "action") {
      genre = "Acción";
    } else if (genre == "documentary") {
      genre = "Documental";
    } else if (genre == "drama") {
      genre = "Drama";
    } else if (genre == "horror") {
      genre = "Horror";
    } else if (genre == "music") {
      genre = "Musical";
    } else if (genre == "romance") {
      genre = "Romance";
    } else if (genre == "tv-shows") {
      genre = "Serie de TV";
    }

    document.getElementById("movieImg").src = cover;
    document.getElementById("movTitle").innerHTML = title;
    document.getElementById("movSyn").innerHTML = synopsis;
    document.getElementById("movieGenre").innerText = genre;
    document.getElementById("movieActors").innerHTML = actors;
    document.getElementById("playMovie").value = file;
    document.getElementById("watchTrailer").value = trailer;
  }
}

async function playMovie() {
  let movieid = window.location.pathname.split("/")[2];
  let url = document.getElementById("playMovie").value;
  document.getElementById("modalVideoBody").innerHTML =
    " <iframe  id='frame' name='frame' src='" +
    url +
    "' width='100%'  height='315'   allowfullscreen></iframe>";

  let response = await historyHandler(urlAPI, localStorage.getItem("token"), {
    history: movieid,
  });

  // window.open(url);
}

function playTrailer() {
  let url = document.getElementById("watchTrailer").value;
  window.open(url);
}
