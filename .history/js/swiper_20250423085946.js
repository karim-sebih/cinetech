// swiper.js
document.querySelectorAll('.swiper-wrapper').forEach((wrapper) => {
    // Crée un conteneur autour du wrapper pour les boutons
    const container = document.createElement('div');
    container.classList.add('swiper-container');
  
    const parent = wrapper.parentNode;
    parent.replaceChild(container, wrapper);
    container.appendChild(wrapper);
  
    // Style dynamique : chaque slide est un enfant direct du wrapper
    const slides = Array.from(wrapper.children);
    slides.forEach(slide => slide.classList.add('swiper-slide'));
  
    // Crée les boutons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'swiper-button prev';
    prevBtn.innerHTML = '←';
  
    const nextBtn = document.createElement('button');
    nextBtn.className = 'swiper-button next';
    nextBtn.innerHTML = '→';
  
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
  
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
  
    // Style CSS inline fallback
    wrapper.style.display = 'flex';
    wrapper.style.transition = 'transform 0.4s ease';
    slides.forEach(slide => {
      slide.style.minWidth = '100%';
      slide.style.flexShrink = '0';
    });
  });
  