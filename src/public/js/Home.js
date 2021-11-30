getContent();
getHistory();
async function getContent() {
  let response = await getmediaHandler(urlAPI, localStorage.getItem("token"));
  if (response.status == 200) {
    localStorage.setItem("movielist", JSON.stringify(response.message));
    return movieListToHtml(response.message);
  } else {
    return movieListToHtml([]);
  }
}

function movieToHtml(movie) {
  return `
  <div class="swiper-slide">
  <a href="/movie-detail/${movie._id}">
  <img
    src="${movie.cover}"
    alt="${movie.title}"
    class="movieCover"
  />
  </a>

</div>
    `;
}

function movieListToHtml(movies) {
  let movieContainerComedy = document.getElementById("rowComedy");
  let comedyMovies = movies.filter((mov) => mov.genre == "comedy");
  movieContainerComedy.innerHTML = comedyMovies.map(movieToHtml);

  let movieContainerAction = document.getElementById("rowAction");
  let actionMovies = movies.filter((mov) => mov.genre == "action");
  movieContainerAction.innerHTML = actionMovies.map(movieToHtml);

  let movieContainerDoc = document.getElementById("rowDocumentary");
  let docMovies = movies.filter((mov) => mov.genre == "documentary");
  movieContainerDoc.innerHTML = docMovies.map(movieToHtml);

  let movieContainerDrama = document.getElementById("rowDrama");
  let dramaMovies = movies.filter((mov) => mov.genre == "drama");
  movieContainerDrama.innerHTML = dramaMovies.map(movieToHtml);

  let movieContainerHorror = document.getElementById("rowHorror");
  let horrorMovies = movies.filter((mov) => mov.genre == "horror");
  movieContainerHorror.innerHTML = horrorMovies.map(movieToHtml);

  let movieContainerMusic = document.getElementById("rowMusic");
  let musicMovies = movies.filter((mov) => mov.genre == "music");
  movieContainerMusic.innerHTML = musicMovies.map(movieToHtml);

  let movieContainerRomance = document.getElementById("rowRomance");
  let romanceMovies = movies.filter((mov) => mov.genre == "romance");
  movieContainerRomance.innerHTML = romanceMovies.map(movieToHtml);

  let movieContainerTV = document.getElementById("rowTV");
  let romanceTV = movies.filter((mov) => mov.genre == "tv-shows");
  movieContainerTV.innerHTML = romanceTV.map(movieToHtml);
}

async function getHistory() {
  let response = await profileHandler(urlAPI, localStorage.getItem("token"));
  if (response.status == 200) {
    let dataHistory = response.message.history;
    let moviesArray = dataHistory.map(async (movie) => {
      let petition = await getmediabyidHandler(
        urlAPI,
        localStorage.getItem("token"),
        movie
      );
      if (petition.status == 200) {
        moviesArray.push(petition.message[0]);
        return petition.message[0];
      }
    });
    Promise.all(moviesArray).then(function (res) {
      let movieContainerComedy = document.getElementById("myHistory");
      movieContainerComedy.innerHTML = res.map(movieToHtml);
    });
  }
}

function searchMovies() {
  let value = document.getElementById("inpt_search").value;
  if (value == "") {
    getContent();
    getHistory();
    return;
  }

  let data = localStorage.getItem("movielist");
  let parsedData = JSON.parse(data);

  let filteredResults = [];
  parsedData.find((movie) => {
    if (movie.title.toLowerCase() === value.toLowerCase()) {
      filteredResults.push(movie);
    }
  });
  if (filteredResults.length > 0) {
    window.open(`/movie-detail/${filteredResults[0]._id}`);
  } else {
    window.alert("No hay resultados con este título.");
  }
}
