import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';

document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper('.affiche-film-serie-recent', {
    // Configuration du Swiper
    slidesPerView: 4, // Nombre de diapositives visibles à la fois
    spaceBetween: 20, // Espace entre les diapositives
    loop: true, // Boucle infinie
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      // Ajustements pour différentes tailles d'écran
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});