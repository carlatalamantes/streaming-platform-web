"use strict";
getContent();

async function createContent() {
  let type = document.getElementById("inpt_type").value;
  let year = document.getElementById("inpt_year").value;
  let genre = document.getElementById("inpt_genre").value;
  let title = document.getElementById("inpt_title").value;
  let actors = document.getElementById("inpt_actors").value;
  let cover = document.getElementById("inpt_image").value;
  let file = document.getElementById("inpt_video").value;
  let trailer = document.getElementById("inpt_trailer").value;
  let synopsis = document.getElementById("inpt_syn").value;

  let response = await mediaHandler(
    urlAPI,
    {
      type,
      year,
      genre,
      title,
      actors,
      cover,
      file,
      trailer,
      synopsis,
    },
    localStorage.getItem("token")
  );
  if (response.status == 400) {
    let errorsArray = [];
    for (let i = 0; i < response.message.length; i++) {
      errorsArray.push(response.message[i].msg);
    }
    window.alert(errorsArray);
  } else if (response.status == 201) {
    $("#createModal").modal("hide");
    document.getElementById("createContentform").reset();
    window.alert(response.message);
    //Llamar al fetch de pelis
  }
}

async function getContent() {
  let response = await getmediaHandler(urlAPI, localStorage.getItem("token"));
  if (response.status == 200) {
    localStorage.setItem("movielistAdmin", JSON.stringify(response.message));
    return movieListToHtml(response.message);
  } else {
    return movieListToHtml([]);
  }
}

function movieToHtml(movie) {
  return `
  <a  data-bs-toggle="modal"
          data-bs-target="#editModal" href="#" onClick="getMovieInfo('${movie._id}')">
          <img
          src="${movie.cover}"
          alt="${movie.title}"
          class="movieCover"
        />
    </a>
  `;
}

function movieListToHtml(movies) {
  let movieContainer = document.getElementById("containerMov");
  movieContainer.innerHTML = movies.map(movieToHtml);
}

async function getMovieInfo(id) {
  let response = await getmediabyidHandler(
    urlAPI,
    localStorage.getItem("token"),
    id
  );
  if (response.status == 200 && Array.isArray(response.message)) {
    let { type, year, genre, title, actors, cover, file, trailer, synopsis } =
      response.message[0];
    document.getElementById("inpt_type").value = type;
    document.getElementById("inpt_year").value = year;
    document.getElementById("inpt_genre").value = genre;
    document.getElementById("inpt_title").value = title;
    document.getElementById("inpt_actors").value = actors;
    document.getElementById("inpt_image").value = cover;
    document.getElementById("inpt_video").value = file;
    document.getElementById("inpt_trailer").value = trailer;
    document.getElementById("inpt_syn").value = synopsis;
    document.getElementById("deleteBtn").value = id;
    document.getElementById("saveBtn").value = id;
  }
}

async function deleteMovie() {
  let id = document.getElementById("deleteBtn").value;
  let response = await deletemediabyidHandler(
    urlAPI,
    localStorage.getItem("token"),
    id
  );

  if (response.status == 200) {
    $("#editModal").modal("hide");
    window.alert(response.message.message);
    window.location.reload();
  } else {
    $("#editModal").modal("hide");
    window.alert(response.message.error);
  }
}

async function editMovie() {
  let id = document.getElementById("saveBtn").value;
  let type = document.getElementById("inpt_type").value;
  let year = document.getElementById("inpt_year").value;
  let genre = document.getElementById("inpt_genre").value;
  let title = document.getElementById("inpt_title").value;
  let actors = document.getElementById("inpt_actors").value;
  let cover = document.getElementById("inpt_image").value;
  let file = document.getElementById("inpt_video").value;
  let trailer = document.getElementById("inpt_trailer").value;
  let synopsis = document.getElementById("inpt_syn").value;
  let response = await updatemediabyidHandler(
    urlAPI,
    localStorage.getItem("token"),
    id,
    { type, year, genre, title, actors, cover, file, trailer, synopsis }
  );

  if (response.status == 200) {
    $("#editModal").modal("hide");
    window.alert(response.message.message);
    window.location.reload();
  } else if (response.status == 400) {
    let errorsArray = [];
    for (let i = 0; i < response.message.length; i++) {
      errorsArray.push(response.message[i].msg);
    }
    window.alert(errorsArray);
  } else {
    $("#editModal").modal("hide");
    window.alert(response.message.error);
  }
}

function filterMovies() {
  let value = document.getElementById("inpt_search").value;
  if (value == "") {
    getContent();
    return;
  }
  let data = localStorage.getItem("movielistAdmin");
  let parsedData = JSON.parse(data);
  console.log(value);

  let filteredResults = [];
  parsedData.find((movie) => {
    if (movie.title.toLowerCase() === value.toLowerCase()) {
      filteredResults.push(movie);
    }
  });
  if (filteredResults.length > 0) {
    movieListToHtml(filteredResults);
  }
}
