let userInputEl = document.querySelector("#searchBox");
let searchResultsSection = document.querySelector("#searchResultsSection");
let carouselList1 = document.querySelector("#carouselList1");
let carouselList2 = document.querySelector("#carouselList2");

let searchText = document.querySelector("#searchText");
let faviMoviesList = [];
let sortedFav;

const sortElement = document.querySelector(".drop-down-options");

// sorted the faviroteMovies by relesedYear and movieName
sortElement.addEventListener("change", (event) => {
  if (event.target.value === "name") {
    sortedFav = faviMoviesList.sort((a, b) => a.title.localeCompare(b.title)); //sorted for name
  } else if (event.target.value === "year") {
    sortedFav = faviMoviesList.sort(
      (a, b) =>
        parseInt(a.release_date.split("-")[0]) -
        parseInt(b.release_date.split("-")[0])
    ); //sorted for year
  }
  localStorage.setItem("faviMovies", JSON.stringify(sortedFav)); //storing data into localStorage
  faviroteSlideList();
});

//faviroteMovie slide functionality
function faviroteSlideList() {
  carouselList2.textContent = "";
  const localdata = localStorage.getItem("faviMovies")
  if (localdata===null){
    faviMoviesList = []
  }else{
    faviMoviesList = JSON.parse(localdata)
  }
  faviMoviesList.forEach(async (each) => {
    const { title, poster_path, id } = each;
    const movieDetail = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=2ad18877c2ecce5382256b80fefda964`
    );
    const res = await movieDetail.json();

    const { genres } = res;
    let genereNames = "";
    genres.forEach((each) => {
      genereNames += each.name + " ";
    });

    splide2.destroy();
    let listItem2 = document.createElement("li");
    listItem2.id = id;
    listItem2.classList.add("splide__slide");
    carouselList2.appendChild(listItem2);

    let heartEL = document.createElement("img");
    heartEL.src = "./images/redliked.png";
    heartEL.classList.add("heart-icon");
    heartEL.addEventListener("click", () => {
      const index = faviMoviesList.findIndex((each) => {
        if (each.id === id) {
          return true;
        } else {
          return false;
        }
      });
      faviMoviesList.splice(index, 1);
      localStorage.setItem("faviMovies", JSON.stringify(faviMoviesList));

      faviroteSlideList(faviMoviesList);
    });
    listItem2.appendChild(heartEL);

    let imgEl = document.createElement("img");
    imgEl.classList.add("carousel-img");
    imgEl.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
    listItem2.appendChild(imgEl);

    let movieTitle = document.createElement("p");
    movieTitle.classList.add("movie-title");
    movieTitle.textContent = title;
    listItem2.appendChild(movieTitle);

    let genreEl = document.createElement("p");
    genreEl.textContent = genereNames;
    listItem2.appendChild(genreEl);
    splide2.mount();
  });
}

faviroteSlideList();

//recommended slide functionality
function carouselList(recommendedMoviesList) {
  carouselList1.textContent = "";
  recommendedMoviesList.forEach(async (Movie) => {
    const { title, poster_path, id } = Movie;
    const movieDetail = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=2ad18877c2ecce5382256b80fefda964`
    );
    const res = await movieDetail.json();

    const { genres } = res;
    let genereNames = "";
    genres.forEach((each) => {
      genereNames += each.name + " ";
    });

    splide1.destroy();
    searchText.textContent = "";
    let listItem = document.createElement("li");
    listItem.classList.add("splide__slide");
    carouselList1.appendChild(listItem);
    let heartEL = document.createElement("img");
    heartEL.src = "./images/Favorite.png";
    heartEL.addEventListener("click", () => {
      const faviObj = faviMoviesList.find((each) => each.id === id);

      if (faviObj === undefined) {
        faviMoviesList.push(Movie);
      }
      localStorage.setItem("faviMovies", JSON.stringify(faviMoviesList)); //storing data into localStorage
      faviroteSlideList();
    });

    heartEL.classList.add("heart-icon");
    listItem.appendChild(heartEL);
    let imgEl = document.createElement("img");
    imgEl.classList.add("carousel-img");
    imgEl.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
    listItem.appendChild(imgEl);
    let movieTitle = document.createElement("h1");
    movieTitle.classList.add("movie-title");
    movieTitle.textContent = title;
    listItem.appendChild(movieTitle);
    let genreEl = document.createElement("p");
    genreEl.textContent = genereNames;
    listItem.appendChild(genreEl);
    splide1.mount();
  });
}

//render the searched movie functionality
async function renderSearchMovie(movie) {
  const { genre_ids, title, poster_path, release_date, overview, id } = movie;
  const movieDetail = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=2ad18877c2ecce5382256b80fefda964`
  );
  const res = await movieDetail.json();

  const { genres } = res;
  let genereNames = "";
  genres.forEach((each) => {
    genereNames += each.name + " ";
  });

  const getRecommended = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=2ad18877c2ecce5382256b80fefda964&with_genres=${genre_ids.join(
      ","
    )}`
  );
  const recommendedData = await getRecommended.json();
  const { results } = recommendedData;

  searchResultsSection.innerHTML = `
    <img class="search-movie" src=https://image.tmdb.org/t/p/w500/${poster_path} alt=${title} />
    <div class="search-movie-content">
    <h1 class="search-movie-title">${title}</h1>
    <p class="genere">${genereNames}</p>
    <p class="search-movie-release-date">Release Date: ${release_date}</p>
    <p class="search-movie-description">${overview}</p>
    </div>
    `;
  carouselList(results);
}

//getting data from API Call
async function getValue() {
  const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${this.value}&api_key=2ad18877c2ecce5382256b80fefda964`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWQxODg3N2MyZWNjZTUzODIyNTZiODBmZWZkYTk2NCIsInN1YiI6IjY1YjIzMjY1NmVlY2VlMDBjOTMzZjA2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L1aSTQjDzIQ1BAH2OCc2A0kqegYT53YPtUNQHT2FD40`,
    },
  };
  const responseData = await fetch(apiUrl, options);
  const data = await responseData.json();

  const { results } = data;
  const firstMovieData = results[0];
  renderSearchMovie(firstMovieData);
}
const fetchData = () => {
  userInputEl.addEventListener("change", getValue);
};

//carousel for recommendationMovies
let splide1 = new Splide("#carousel1", {
  type: "loop",
  gap: "15px",
  perPage: 4,
  pagination: false,
  breakpoints: {
    700: {
      perPage: 2,
    },
    1100: {
      perPage: 3,
    },
  },
});

//carousel for faviroteMovies
let splide2 = new Splide("#carousel2", {
  gap: "15px",
  perPage: 4,
  pagination: false,
  breakpoints: {
    700: {
      perPage: 2,
    },
    1100: {
      perPage: 3,
    },
  },
});

fetchData();
