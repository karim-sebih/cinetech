document.querySelectorAll('.swiper-container').forEach(container => {
  const wrapper = container.querySelector('.swiper-wrapper');
  const slides = wrapper.querySelectorAll('.swiper-slide');
  const nextBtn = container.querySelector('.swiper-button.next');
  const prevBtn = container.querySelector('.swiper-button.prev');
  
  let currentIndex = 0;

  const updateSlider = () => {
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });
});
