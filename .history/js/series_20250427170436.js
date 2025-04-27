const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8';
const API_BASE_URL = 'https://api.themoviedb.org/3'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 
let currentPage = 1; // Ajout de currentPage pour la pagination

async function fetchTvSeries(page = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}/discover/tv?page=${page}&language=en-US&sort_by=popularity.desc`, {
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
        console.log('API Response:', data);

        if (data.results && Array.isArray(data.results)) {
            displaytvSeries(data.results);
            setupPagination(data.page, data.total_pages);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching TV Series:', error);
        document.getElementById('error-message').textContent = 
            `Failed to load TV Series: ${error.message}. Please try again later.`;
    }
}

// Display TV Series in grid
function displaytvSeries(tvSeries) {
    const tvSeriesGrid = document.getElementById('tvSeries-grid');
    tvSeriesGrid.innerHTML = '';

    tvSeries.forEach(series => {
        const tvSeriesCard = document.createElement('div');
        tvSeriesCard.classList.add('tvSeries-card');
        tvSeriesCard.innerHTML = `
            <img src="${series.poster_path ? IMAGE_BASE_URL + series.poster_path : 'fallback.jpg'}" alt="${series.name}">
            <h3>${series.name}</h3>
            <div class="tvSeries-rating">${generateStars(series.vote_average)}</div>
        `;
        tvSeriesCard.addEventListener('click', () => showTvSeriesDetails(series.id));
        tvSeriesGrid.appendChild(tvSeriesCard);
    });
}

// Show TV Series details in modal
function showTvSeriesDetails(tvSeriesId) {
    window.location.href = `detail.html?id=${tvSeriesId}&type=tv`; // Ajout du type
}

// Set up pagination
function setupPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => fetchTvSeries(currentPage - 1);
        pagination.appendChild(prevButton);
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.onclick = () => fetchTvSeries(i);
        pagination.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => fetchTvSeries(currentPage + 1);
        pagination.appendChild(nextButton);
    }
}

// Half Star rating
function generateStars(rating) {
    const maxStars = 5;
    const stars = (rating / 10) * maxStars;
    let starHtml = '';

    for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(stars)) {
            starHtml += '<span class="star full-star">&#9733;</span>'; 
        } else if (i - stars < 1) {
            starHtml += '<span class="star half-star">&#9733;</span>'; 
        } else {
            starHtml += '<span class="star empty-star">&#9734;</span>';
        }
    }
    return starHtml;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchTvSeries(1);
});