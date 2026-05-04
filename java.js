

const API_KEY = " "; // replace with your actual key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Your original hard-coded movies as fallback
const fallbackMovies = {
  trending: [
    { title: "Movie 1", image: "Images/Avengers.jpg" },
    { title: "Movie 2", image: "Images/Inception.jfif" },
    { title: "Movie 3", image: "Images/Iron man 3.jpg" },
    { title: "Movie 4", image: "Images/Matrix.jfif" }
  ],
  topRated: [
    { title: "Movie 5", image: "Images/Star trek.jfif" },
    { title: "Movie 6", image: "images/the mechanic.jfif" },
    { title: "Movie 7", image: "Images/Triple frontier.jfif" },
    { title: "Movie 8", image: "Images/Carry on.jfif" }
  ],
  dramaSeries: [
    { title: "Movie 9", image: "Images/Star trek.jfif" },
    { title: "Movie 10", image: "images/the mechanic.jfif" },
    { title: "Movie 11", image: "Images/Triple frontier.jfif" },
    { title: "Movie 12", image: "Images/Carry on.jfif" }
  ],
  action: [
    { title: "Movie 13", image: "Images/Absolute dominion.jfif" },
    { title: "Movie 14", image: "Images/Anaconda.jfif" },
    { title: "Movie 15", image: "Images/Beast of war.jfif" },
    { title: "Movie 16", image: "Images/Dracula.jfif" }
  ],
  horror: [
    { title: "Movie 17", image: "Images/Absolute dominion.jfif" },
    { title: "Movie 18", image: "Images/Anaconda.jfif" },
    { title: "Movie 19", image: "Images/Beast of war.jfif" },
    { title: "Movie 20", image: "Images/Dracula.jfif" }
  ]
};

// Function to display movies ( for both API and fallback)
function displayMovies(movies, elementId) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <div class="movie-info">${movie.title}</div>
    `;

    // Click to fetch trailer
    movieCard.addEventListener("click", () => {
      fetchTrailer(movie.id);
    });
  
    container.appendChild(movieCard);
  });
}

// Trailer from youtube preview....Used AI
async function fetchTrailer(movieId) {
  const player = document.getElementById("trailerPlayer");
  player.innerHTML = "";

  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();

    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    if (trailer) {
      player.innerHTML = `
        <iframe width="560" height="315"
          src="https://www.youtube.com/embed/${trailer.key}"
          frameborder="0" allowfullscreen>
        </iframe>
      `;
    } else {
      player.innerHTML = "<p>No trailer available.</p>";
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    player.innerHTML = "<p>Error loading trailer.</p>";
  }
}


// Function to fetch movies from TMDb with fallback
async function fetchMovies(endpoint, elementId, fallbackCategory) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";

  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await fetch(`${BASE_URL}/${endpoint}${separator}api_key=${API_KEY}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movies = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: IMAGE_BASE_URL + movie.poster_path 
      }));
      displayMovies(movies, elementId);
    } else {
      // fallback if API returns empty
      displayMovies(fallbackMovies[fallbackCategory], elementId);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    // fallback if API fails
    displayMovies(fallbackMovies[fallbackCategory], elementId);
  }
}

// Load movies with API + fallback
fetchMovies("trending/movie/day", "trending", "trending");
fetchMovies("movie/top_rated", "topRated", "topRated");
fetchMovies("movie/popular", "popular", "popular");
fetchMovies("discover/movie?with_genres=18", "dramaSeries", "dramaSeries");
fetchMovies("discover/movie?with_genres=28", "action", "action");
fetchMovies("discover/movie?with_genres=27", "horror", "horror");



//Scroll buttons styling
function scrollRow(rowId, distance) {
  const row = document.getElementById(rowId);
  row.scrollBy({
    left: distance,
    behavior: 'smooth'
  });
}


// Search bar functionality

async function searchMovies(query) {
  const container = document.getElementById("searchResults");
  container.innerHTML = "";

  if (!query) return; // do nothing if empty

  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movies = data.results.map(movie => ({
        title: movie.title,
        image: movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : "Images/fallback.jpg"
      }));
      displayMovies(movies, "searchResults");
    } else {
      container.innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    console.error("Error searching movies:", error);
    container.innerHTML = "<p>Error fetching search results.</p>";
  }
}

// Get input and icon
const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");

// Search on Enter key
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchMovies(searchInput.value);
  }
});

// Search on icon click
searchIcon.addEventListener("click", () => {
  searchMovies(searchInput.value);
});

