import { fetchConfiguration, fetchMovies, fetchSeries } from './api.js';

// Variables globales pour stocker les données
let movies = [];
let series = [];

document.addEventListener("DOMContentLoaded", async function () {
  const boxOfficeWrapper = document.querySelector(".affiche-film-serie-recent .swiper-wrapper");
  const moviesWrapper = document.querySelector(".affiche-film-recent .swiper-wrapper");
  const seriesWrapper = document.querySelector(".affiche-series-recent .swiper-wrapper");

  try {
    // Charger la configuration
    await fetchConfiguration();

    // Charger les films et séries
    movies = await fetchMovies();
    series = await fetchSeries();

    // Fonction pour afficher les éléments dans le Swiper
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
        const imageSrc = item.poster_path || "default.jpg"; // Gestion des images manquantes
        slide.innerHTML = `
          <div class="${type === 'movie' ? 'carte-film' : 'carte-serie'}">
            <h3>${item.title || item.name}</h3>
            <img src="${imageSrc}" alt="${item.title || item.name}" loading="lazy">
            <button class="details-btn" data-id="${item.id}" data-type="${type}">Voir Détails</button>
          </div>
        `;
        wrapper.appendChild(slide);
      });
    }

    // Afficher les sections dans les Swipers
    displaySwiperItems(boxOfficeWrapper, series, movies, 8, 'movie','tv'); // Box Office
    displaySwiperItems(moviesWrapper, movies, movies.length, 'movie'); // Films
    displaySwiperItems(seriesWrapper, series, series.length, 'tv'); // Séries

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