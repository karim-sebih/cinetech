// js/index.js
import { fetchConfiguration, fetchMovieGenres, fetchTVGenres, fetchMovies, fetchSeries, imageBaseUrl } from './api.js';

// Variables globales pour stocker les données JSON récupérées
let movies = []; // Données JSON de /discover/movie
let series = []; // Données JSON de /discover/tv
let movieGenres = []; // Données JSON de /genre/movie/list
let tvGenres = []; // Données JSON de /genre/tv/list

document.addEventListener("DOMContentLoaded", async function () {
  const boxOfficeContainer = document.querySelector(".affiche-film-erie-recent");
  const moviesContainer = document.querySelector(".affiche-film-recent");
  const seriesContainer = document.querySelector(".affiche-series-recent");

  try {
    // Charger la configuration et les genres
    await fetchConfiguration();
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

    // Charger les films et séries (les 30 premiers, sur plusieurs pages si nécessaire)
    movies = [];
    series = [];
    for (let page = 1; movies.length < 30; page++) {
      const newMovies = await fetchMovies(page);
      movies = movies.concat(newMovies);
    }
    for (let page = 1; series.length < 30; page++) {
      const newSeries = await fetchSeries(page);
      series = series.concat(newSeries);
    }
    movies = movies.slice(0, 30); // S'assurer qu'on a exactement 30 films
    series = series.slice(0, 30); // S'assurer qu'on a exactement 30 séries

    function displayItems(container, items, count, type) {
      container.innerHTML = "";
      const limitedItems = items.slice(0, count);
      limitedItems.forEach(item => {
        const card = document.createElement("div");
        card.className = type === 'movie' ? "carte-film" : "carte-serie";
        const imageSrc = item.poster_path ? `${imageBaseUrl}w200${item.poster_path}` : "default.jpg";
        card.innerHTML = `
          <h3>${item.title || item.name}</h3>
          <img src="${imageSrc}" alt="${item.title || item.name}" loading="lazy">
          <button class="details-btn" data-id="${item.id}" data-type="${type}">Voir Détails</button>
        `;
        container.appendChild(card);
      });
    }

    // Afficher les sections
    displayItems(boxOfficeContainer, movies, 8, 'movie'); // 8 films pour le Box Office
    displayItems(moviesContainer, movies, 30, 'movie'); // 30 films
    displayItems(seriesContainer, series, 30, 'tv'); // 30 séries

    // Filtrer par genre pour les films
    document.getElementById('movie-genre-filter').addEventListener('change', async (e) => {
      const genreId = e.target.value;
      let filteredMovies = [];
      if (genreId) {
        for (let page = 1; filteredMovies.length < 30; page++) {
          const newMovies = await fetchMovies(page, genreId);
          filteredMovies = filteredMovies.concat(newMovies);
        }
        filteredMovies = filteredMovies.slice(0, 30);
      } else {
        filteredMovies = movies; // Revenir à la liste complète
      }
      displayItems(moviesContainer, filteredMovies, 30, 'movie');
    });

    // Filtrer par genre pour les séries
    document.getElementById('tv-genre-filter').addEventListener('change', async (e) => {
      const genreId = e.target.value;
      let filteredSeries = [];
      if (genreId) {
        for (let page = 1; filteredSeries.length < 30; page++) {
          const newSeries = await fetchSeries(page, genreId);
          filteredSeries = filteredSeries.concat(newSeries);
        }
        filteredSeries = filteredSeries.slice(0, 30);
      } else {
        filteredSeries = series; // Revenir à la liste complète
      }
      displayItems(seriesContainer, filteredSeries, 30, 'tv');
    });

    // Navigation vers les détails
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("details-btn")) {
        const id = event.target.dataset.id;
        const type = event.target.dataset.type;
        window.location.href = `./pages/detail.html?id=${id}&type=${type}`;
      }
    });

    console.log(`Nombre total de films chargés : ${movies.length}`);
    console.log(`Nombre total de séries chargées : ${series.length}`);

  } catch (error) {
    console.error("Erreur lors du chargement des données TMDB :", error);
  }
});