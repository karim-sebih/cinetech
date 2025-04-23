import { fetchConfiguration, fetchMovies, fetchSeries, imageBaseUrl } from './api.js';

// Variables globales pour stocker les données JSON
let movies = [];
let series = [];

document.addEventListener("DOMContentLoaded", async function () {
  const boxOfficeWrapper = document.querySelector(".affiche-film-serie-recent .swiper-wrapper");
  const moviesContainer = document.querySelector(".affiche-film-recent");
  const seriesContainer = document.querySelector(".affiche-series-recent");

  try {
    // Charger la configuration
    await fetchConfiguration();

    // Charger les films et séries (pas de pagination avec des fichiers statiques)
    movies = await fetchMovies();
    series = await fetchSeries();

    // Fonction pour afficher les éléments dans un conteneur normal
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

    // Fonction pour afficher les éléments dans le Swiper (Box Office)
    function displaySwiperItems(wrapper, items, count, type) {
      if (!wrapper) {
        console.error(`Conteneur Swiper introuvable pour afficher les éléments de type ${type}`);
        return;
      }
      wrapper.innerHTML = "";
      const limitedItems = items.slice(0, count);
      limitedItems.forEach(item => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        const imageSrc = item.poster_path ? `${imageBaseUrl}w200${item.poster_path}` : "default.jpg";
        slide.innerHTML = `
          <div class="carte-film">
            <h3>${item.title || item.name}</h3>
            <img src="${imageSrc}" alt="${item.title || item.name}" loading="lazy">
            <button class="details-btn" data-id="${item.id}" data-type="${type}">Voir Détails</button>
          </div>
        `;
        wrapper.appendChild(slide);
      });
    }

    // Afficher les sections
    displaySwiperItems(boxOfficeWrapper, movies, 8, 'movie'); // Box Office dans le Swiper
    displayItems(moviesContainer, movies, movies.length, 'movie'); // Films normaux
    displayItems(seriesContainer, series, series.length, 'tv'); // Séries normales

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