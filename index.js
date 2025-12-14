let main=document.querySelector(".main");
let search=document.querySelector(".input");
let ratings=document.querySelector("#rating-select");
let genres=document.querySelector("#genre-select");

let searchValue="";
let ratingValue=0;
let genreValue="";

const URL = "https://movies-api-63ol.onrender.com/movies";

const getMovies=async (url)=>{
    try{
        const {data}=await axios.get(url);
        return data.results;
    }
    catch(error){}
};

let movies=await getMovies(URL);
console.log(movies);

function createCard(movies){
    for(let movie of movies)
    {
        let cardContainer=document.createElement("div");
        cardContainer.classList.add("card","shadow");

        let imageContainer=document.createElement("div");
        imageContainer.classList.add("card-image-container");

        let img=document.createElement("img");
        img.classList.add("card-image");
        img.setAttribute("src",movie.poster);
        imageContainer.appendChild(img);

        let moviedetailsContainer=document.createElement("div");
        moviedetailsContainer.classList.add("movie-details");

        let titleContainer=document.createElement("div");
        titleContainer.classList.add("title-container");

        let title=document.createElement("p");
        title.classList.add("title");
        title.innerText=movie.title;

        let year=document.createElement("p");
        year.classList.add("year");
        year.innerText=movie.year;

        titleContainer.appendChild(title);
        titleContainer.appendChild(year);

        let genre=document.createElement("p");
        genre.classList.add("genre");
        genre.innerText=movie.genres;

        let director=document.createElement("p");
        director.classList.add("director");
        director.innerText=`Directed By: ${movie.director}`;

        let ratingContainer=document.createElement("div");
        ratingContainer.classList.add("ratings");

        let starRatingContainer=document.createElement("div");
        starRatingContainer.classList.add("star-rating");

        let starIcon=document.createElement("span");
        starIcon.classList.add("material-icons-outlined");
        starIcon.innerText="star";
        starRatingContainer.appendChild(starIcon);

        let rating=document.createElement("span");
        rating.innerText=movie.rating;
        starRatingContainer.appendChild(rating);

        ratingContainer.appendChild(starRatingContainer);

        moviedetailsContainer.appendChild(titleContainer);
        moviedetailsContainer.appendChild(genre);
        moviedetailsContainer.appendChild(director);
        moviedetailsContainer.appendChild(ratingContainer);

        cardContainer.appendChild(imageContainer);
        cardContainer.appendChild(moviedetailsContainer);

        main.appendChild(cardContainer);
    }
}

function filterMovies(){
    let filteredMovies=searchValue?.length>0?movies.filter((movie)=>movie.title.toLowerCase().includes (searchValue)||movie.director.toLowerCase().includes(searchValue)||movie.actors.join(",").toLowerCase().includes(searchValue)):movies;

    if(ratingValue>0)
    {
        filteredMovies=filteredMovies.filter((movie)=>{
            return movie.rating>=ratingValue;
        });
    }

    if(genreValue)
    {
        filteredMovies=filteredMovies.filter((movie)=>{
            return movie.genres.includes(genreValue);
        });
    }

    return filteredMovies;
}

function searchHandler(e){
    searchValue=e.target.value.toLowerCase();
    let filteredSearchMovies=filterMovies();
    main.innerHTML="";
    createCard(filteredSearchMovies);
}

function debounce(callback,delay){
    let timerid;
    return (...args)=>{
        clearTimeout(timerid);
        timerid=setTimeout(()=>{
            callback(...args)
        },delay);
    };
}

function ratingHandler(e){
    ratingValue=e.target.value;
    let filteredRatingMovies=filterMovies();
    main.innerHTML="";
    createCard(filteredRatingMovies);
}

function collectGenres(){
    let genresArray=movies.reduce((acc,cur)=>{
        let totalGenres=[];
        let singleGenre=cur.genres;
        acc=[...acc,...singleGenre];
        for(let oneGenre of acc){
            if(!totalGenres.includes(oneGenre)){
                totalGenres=[...totalGenres,oneGenre];
            }
        }
        console.log(totalGenres);
        return totalGenres;
    },[]);
    for(let oneGenre of genresArray){
        let option=document.createElement("option");
        option.setAttribute("value",oneGenre);
        option.classList.add("option");
        option.innerHTML=oneGenre;
        genres.appendChild(option);
    }
}

function genreHandler(e){
    genreValue=e.target.value;
    let filteredGenreMovies=filterMovies();
    main.innerHTML="";
    createCard(filteredGenreMovies);
}

search.addEventListener("keyup",debounce(searchHandler,500));

ratings.addEventListener("change",ratingHandler);

collectGenres();

genres.addEventListener("change",genreHandler);

createCard(movies);