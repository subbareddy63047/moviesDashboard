let userInputEl = document.querySelector("#searchBox");
let searchResultsSection = document.querySelector("#searchResultsSection");
let carouselList1 = document.querySelector("#carouselList1");
let carouselList2 = document.querySelector("#carouselList2");
console.log(carouselList2)
let searchText = document.querySelector("#searchText");
let faviMoviesList=[]

function faviroteSlideList(faviMoviesList){
    carouselList2.textContent="";
    console.log(carouselList2);
    faviMoviesList.forEach(async each=>{
        const { genre_ids, title, poster_path, release_date, overview, id } =each;
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
        listItem2.classList.add("splide__slide");
        carouselList2.appendChild(listItem2);

        let heartEL = document.createElement("img");
        heartEL.src="./images/redliked.png"
        heartEL.classList.add("heart-icon");
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

    })
    

}



function carouselList(recommendedMoviesList) {
  recommendedMoviesList.forEach(async (Movie) => {
   
    const { genre_ids, title, poster_path, release_date, overview, id } =
      Movie;
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
    heartEL.src="./images/Favorite.png"
    heartEL.addEventListener("click",()=>{
        const faviMovie=recommendedMoviesList.filter(each=>{
            
            if(each.id===id){
                return each;
            }
        });
        faviMoviesList.push(faviMovie[0])
        faviroteSlideList(faviMoviesList);
    })
    heartEL.classList.add("heart-icon");
    listItem.appendChild(heartEL);
    let imgEl = document.createElement("img");
    imgEl.classList.add("carousel-img");
    imgEl.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
    listItem.appendChild(imgEl);
    let movieTitle = document.createElement("p");
    movieTitle.classList.add("movie-title");
    movieTitle.textContent = title;
    listItem.appendChild(movieTitle);
    let genreEl = document.createElement("p");
    genreEl.textContent = genereNames;
    listItem.appendChild(genreEl);
    splide1.mount();
  });
}
async function renderSearchMovie(movie) {
  const { genre_ids, title, poster_path, release_date, overview, id } = movie;
  const movieDetail = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=2ad18877c2ecce5382256b80fefda964`
  );
  const res = await movieDetail.json();
  console.log(res);
  const { genres } = res;
  let genereNames = "";
  genres.forEach((each) => {
    genereNames += each.name + " ";
  });
  console.log(genereNames);
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
async function getValue() {
  console.log(this.value);
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
let splide1 = new Splide("#carousel1", {
  type: "loop",
  gap:"15px",
  perPage: 4,
});

let splide2 = new Splide("#carousel2", {
    gap:"15px",
    perPage: 4,
  });

fetchData();
