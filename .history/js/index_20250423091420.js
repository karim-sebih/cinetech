  // js/index.js
  import { fetchConfiguration, fetchMovieGenres, fetchTVGenres, fetchMovies, fetchSeries, imageBaseUrl } from './api.js';

  // Variables globales pour stocker les données JSON
  let movies = [];
  let series = [];
  let movieGenres = [];
  let tvGenres = [];

  document.addEventListener("DOMContentLoaded", async function () {
    const boxOfficeContainer = document.querySelector(".affiche-film-serie-recent"); // Correction ici
    const moviesContainer = document.querySelector(".affiche-film-recent");
    const seriesContainer = document.querySelector(".affiche-series-recent");

    try {
      // Charger la configuration et les genres
      await fetchConfiguration();
      movieGenres = await fetchMovieGenres();
      tvGenres = await fetchTVGenres();

      // Remplir les menus déroulants pour les genres
      const movieGenreFilter = document.getElementById('movie-genre-filter');
      if (movieGenreFilter) {
        movieGenreFilter.innerHTML += movieGenres.map(genre => `
          <option value="${genre.id}">${genre.name}</option>
        `).join('');
      } else {
        console.error("Élément avec l'ID 'movie-genre-filter' introuvable dans le DOM");
      }

      const tvGenreFilter = document.getElementById('tv-genre-filter');
      if (tvGenreFilter) {
        tvGenreFilter.innerHTML += tvGenres.map(genre => `
          <option value="${genre.id}">${genre.name}</option>
        `).join('');
      } else {
        console.error("Élément avec l'ID 'tv-genre-filter' introuvable dans le DOM");
      }

      // Charger les films et séries (pas de pagination avec des fichiers statiques)
      movies = await fetchMovies();
      series = await fetchSeries();

      function displayItems(container, items, count, type) {
        if (!container) {
          console.error(`Conteneur introuvable pour afficher les éléments de type ${type}`);
          return;
        }
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
      displayItems(boxOfficeContainer, movies, 8, 'movie');
      displayItems(moviesContainer, movies, movies.length, 'movie');
      displayItems(seriesContainer, series, series.length, 'tv');

      // Filtrer par genre pour les films
      if (movieGenreFilter) {
        document.getElementById('movie-genre-filter').addEventListener('change', async (e) => {
          const genreId = e.target.value;
          let filteredMovies = [];
          if (genreId) {
            filteredMovies = await fetchMovies(1, genreId);
          } else {
            filteredMovies = movies; // Revenir à la liste complète
          }
          displayItems(moviesContainer, filteredMovies, filteredMovies.length, 'movie');
        });
      }

      // Filtrer par genre pour les séries
      if (tvGenreFilter) {
        document.getElementById('tv-genre-filter').addEventListener('change', async (e) => {
          const genreId = e.target.value;
          let filteredSeries = [];
          if (genreId) {
            filteredSeries = await fetchSeries(1, genreId);
          } else {
            filteredSeries = series; // Revenir à la liste complète
          }
          displayItems(seriesContainer, filteredSeries, filteredSeries.length, 'tv');
        });
      }

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
      console.error("Erreur lors du chargement des données :", error);
    }
  });