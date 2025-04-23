

document.addEventListener("DOMContentLoaded", function () {
    // Configuration commune pour tous les Swipers
    const swiperConfig = {
      slidesPerView: 4 ,
      spaceBetween: 5,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
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
          spaceBetween: 5,
        },
      },

       {
  --swiper-navigation-size: 44px;
  --swiper-navigation-top-offset: 50%;
  --swiper-navigation-sides-offset: 10px;
  --swiper-navigation-color: var(--swiper-theme-color);
}
    };
  
    // Initialiser un Swiper pour chaque section
    const boxOfficeSwiper = new Swiper('.affiche-film-serie-recent', swiperConfig);
    const moviesSwiper = new Swiper('.affiche-film-recent', swiperConfig);
    const seriesSwiper = new Swiper('.affiche-series-recent', swiperConfig);


    
  });