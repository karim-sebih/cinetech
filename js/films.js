
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8'
    }
};

const apiUrl = 'https://api.themoviedb.org/3/discover/movie'; // Use discover endpoint to get popular movies
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
let currentPage = 1;

// Fetch and display movies
function fetchMovies(page = 1) {
    fetch(`${apiUrl}?page=${page}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayMovies(data.results);
            setupPagination(data.page, data.total_pages);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch movies. Please try again later.');
        });
}

// Display movies in a grid
function displayMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = ''; // Clear previous movies

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : ''}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieGrid.appendChild(movieCard);
    });
}

// Show movie details in a modal
function showMovieDetails(movieId) {
    console.log('Fetching details for movie ID:', movieId); // Debugging
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Movie details:', data); // Debugging
            const modal = document.getElementById('movie-modal');
            const modalContent = document.getElementById('modal-content');
            modalContent.innerHTML = `
                <img src="${data.poster_path ? imageBaseUrl + data.poster_path : 'fallback.jpg'}" alt="${data.title}">
                <div class="movie-details">
                    <h2>${data.title}</h2>
                    <p>${data.overview}</p>
                    <p><strong>Rating:</strong> ${data.vote_average}</p>
                    <p><strong>Genre:</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>
                    <p><strong>Director:</strong> ${data.credits.crew.find(crew => crew.job === 'Director')?.name || 'N/A'}</p>
                    <p><strong>Release Date:</strong> ${data.release_date}</p>
                    <p><strong>Language:</strong> ${data.original_language}</p>
                    <p><strong>Country:</strong> ${data.production_countries.map(country => country.name).join(', ')}</p>
                </div>
            `;
            modal.style.display = 'flex';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch movie details. Please try again later.');
        });
}

// Setup pagination
function setupPagination(current, total) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (current > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            fetchMovies(currentPage);
        });
        pagination.appendChild(prevButton);
    }

    if (current < total) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            fetchMovies(currentPage);
        });
        pagination.appendChild(nextButton);
    }
}

// Close modal
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('movie-modal').style.display = 'none';
});

// window.addEventListener('click', (e) => {
//     const modal = document.getElementById('movie-modal');
//     if (e.target === modal) {
//         modal.style.display = 'none';
//     }
// });


// Initial fetch
fetchMovies();