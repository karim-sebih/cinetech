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

    // Combiner les films et séries pour le Box Office
    const boxOfficeItems = [
      ...movies.map(item => ({ ...item, type: 'movie' })),
      ...series.map(item => ({ ...item, type: 'tv' }))
    ];

    // Trier par popularité
    boxOfficeItems.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    // Fonction pour afficher les éléments dans le Swiper
    function displaySwiperItems(wrapper, items, count, isBoxOffice = false) {
      if (!wrapper) {
        console.error(`Conteneur Swiper introuvable pour afficher les éléments`);
        return;
      }
      wrapper.innerHTML = "";
      const limitedItems = items.slice(0, count);
      limitedItems.forEach(item => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        const imageSrc = item.poster_path || "default.jpg";
        let title;
        if (isBoxOffice) {
          // Pour le Box Office, on gère films et séries
          title = (item.type === 'movie' ? item.title : item.name) || 'Titre non disponible';
        } else {
          // Pour les sections Films ou Séries, on sait si ce sont des films ou des séries
          title = item.title || item.name || 'Titre non disponible';
        }
        const cardClass = item.type === 'movie' ? 'carte-film' : 'carte-serie';
        slide.innerHTML = `
          <div class="${cardClass}">
            <h3>${title}</h3>
            <img src="${imageSrc}" alt="${title}" loading="lazy">
            <button class="details-btn" data-id="${item.id}" data-type="${item.type || (item.title ? 'movie' : 'tv')}">Voir Détails</button>
          </div>
        `;
        wrapper.appendChild(slide);
      });
    }

    // Afficher les sections dans les Swipers
    displaySwiperItems(boxOfficeWrapper, boxOfficeItems, 8, true); // Box Office (films + séries)
    console.log('Films à afficher dans .affiche-film-recent :', movies.slice(0, 3)); // Log des films avant affichage
    displaySwiperItems(moviesWrapper, movies, movies.length); // Films
    displaySwiperItems(seriesWrapper, series, series.length); // Séries

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
    console.log(`Nombre total d'éléments dans le Box Office : ${boxOfficeItems.length}`);

  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});