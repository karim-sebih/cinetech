import { searchMoviesAndSeries } from './api.js';

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById('search-bar');
  const clearSearch = document.getElementById('clear-search');
  const suggestionsBox = document.getElementById('suggestions');

  if (!searchBar || !clearSearch || !suggestionsBox) {
    console.error("Éléments de la barre de recherche introuvables dans le DOM");
    return;
  }

  searchBar.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      suggestionsBox.innerHTML = '';
      clearSearch.style.display = 'none';
      return;
    }

    clearSearch.style.display = 'block';

    try {
      const results = await searchMoviesAndSeries(query);
      suggestionsBox.innerHTML = '';

      if (results.length === 0) {
        suggestionsBox.innerHTML = '<div class="suggestion-item">Aucun résultat trouvé</div>';
        return;
      }

      results.forEach(item => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = item.title;
        suggestionItem.addEventListener('click', () => {
          window.location.href = `./pages/detail.html?id=${item.id}&type=${item.media_type}`;
        });
        suggestionsBox.appendChild(suggestionItem);
      });
    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
      suggestionsBox.innerHTML = '<div class="suggestion-item">Erreur lors de la recherche</div>';
    }
  });

  clearSearch.addEventListener('click', () => {
    searchBar.value = '';
    suggestionsBox.innerHTML = '';
    clearSearch.style.display = 'none';
  });
});