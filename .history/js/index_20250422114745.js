// js/index.js
import { fetchConfiguration, fetchMovieGenres, fetchTVGenres, fetchMovies, fetchSeries, imageBaseUrl } from './api.js';

let movieGenres = [];
let tvGenres = [];

async function init() {
  await fetchConfiguration(); // Charge l'URL de base pour les images
  movieGenres = await fetchMovieGenres();
  tvGenres = await fetchTVGenres();

  // Remplir les menus déroulants pour les genres
  const movieGenreFilter = document.getElementById('movie-genre-filter');
  movieGenreFilter.innerHTML += movieGenres.map(genre => `
    <option value="${genre.id}">${genre.name}</option>
  `).join('');

  const tvGenreFilter = document.getElementById('tv-genre-filter');
  tvGenreFilter.innerHTML += tvGenres.map(genre => `
    <option value="${genre.id}">${genre.name}</option>
  `).join('');

  await displayBoxOffice();
  await displayRecentMovies();
  await displayRecentSeries();
}

async function displayBoxOffice() {
  const movies = await fetchMovies();
  const container = document.querySelector('.affiche-film-erie-recent');
  container.innerHTML = movies.slice(0, 5).map(movie => `
    <div class="carte-film" data-id="${movie.id}" data-type="movie">
      <img src="${imageBaseUrl}w200${movie.poster_path}" alt="${movie.title}" loading="lazy">
      <h4>${movie.title}</h4>
    </div>
  `).join('');
}

async function displayRecentMovies(genreId = null) {
  const movies = await fetchMovies(1, genreId);
  const container = document.querySelector('.affiche-film-recent');
  container.innerHTML = movies.map(movie => `
    <div class="carte-film" data-id="${movie.id}" data-type="movie">
      <img src="${imageBaseUrl}w200${movie.poster_path}" alt="${movie.title}" loading="lazy">
      <h4>${movie.title}</h4>
    </div>
  `).join('');
}

async function displayRecentSeries(genreId = null) {
  const series = await fetchSeries(1, genreId);
  const container = document.querySelector('.affiche-series-recent');
  container.innerHTML = series.map(serie => `
    <div class="carte-serie" data-id="${serie.id}" data-type="tv">
      <img src="${imageBaseUrl}w200${serie.poster_path}" alt="${serie.name}" loading="lazy">
      <h4>${serie.name}</h4>
    </div>
  `).join('');
}

// Filtrer par genre
document.getElementById('movie-genre-filter').addEventListener('change', (e) => {
  const genreId = e.target.value;
  displayRecentMovies(genreId);
});

document.getElementById('tv-genre-filter').addEventListener('change', (e) => {
  const genreId = e.target.value;
  displayRecentSeries(genreId);
});

// Navigation vers les détails
document.querySelectorAll('.affiche-film-erie-recent, .affiche-film-recent, .affiche-series-recent').forEach(container => {
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.carte-film, .carte-serie');
    if (card) {
      const id = card.dataset.id;
      const type = card.dataset.type;
      window.location.href = `./pages/detail.html?id=${id}&type=${type}`;
    }
  });
});

init(); 