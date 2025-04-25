const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
let currentPage = 1;

// Fetch movies from API
async function fetchMovies(page = 1) {
  try {
      const response = await fetch(`${API_BASE_URL}/discover/movie?page=${page}&language=en-US&sort_by=popularity.desc`, {
          method: 'GET',
          headers: {
              'Authorization': API_KEY,
              'accept': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (data.results && Array.isArray(data.results)) {
          displayMovies(data.results);
          setupPagination(data.page, data.total_pages);
      } else {
          throw new Error('Invalid response format');
      }

  } catch (error) {
      console.error('Error fetching movies:', error);
      document.getElementById('error-message').textContent = 
          `Failed to load movies: ${error.message}. Please try again later.`;
  }
}
// Display movies in grid
function displayMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'fallback.jpg'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <div class="movie-rating">${generateStars(movie.vote_average)}</div>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieGrid.appendChild(movieCard);
    });
}

// Show movie details in modal
// Replace the showMovieDetails function with this:
function showMovieDetails(movieId) {
  window.location.href = `detail.html?id=${movieId}`;
}

// Remove the modal-related code and event listeners

// Setup pagination
function setupPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => fetchMovies(currentPage - 1);
        pagination.appendChild(prevButton);
    }

    // Add page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.onclick = () => fetchMovies(i);
        pagination.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => fetchMovies(currentPage + 1);
        pagination.appendChild(nextButton);
    }
}

// Close modal when clicking the close button
// document.getElementById('modal-close').addEventListener('click', () => {
//     document.getElementById('movie-modal').style.display = 'none';
// });


// Half star rating
function generateStars(rating) {
  const maxStars = 5; // Maximum number of stars
  const stars = (rating / 10) * maxStars; // Convert rating (out of 10) to stars (out of 5)
  let starHtml = '';

  for (let i = 1; i <= maxStars; i++) {
      if (i <= Math.floor(stars)) {
          starHtml += '<span class="star full-star">&#9733;</span>'; // Full star
      } else if (i - stars < 1) {
          starHtml += '<span class="star half-star">&#9733;</span>'; // Half star
      } else {
          starHtml += '<span class="star empty-star">&#9734;</span>'; // Empty star
      }
  }
  return starHtml;
}


// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies(1);
});