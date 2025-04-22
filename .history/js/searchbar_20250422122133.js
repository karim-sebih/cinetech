// js/searchbar.js
import { searchMulti } from './api.js';

const searchBar = document.getElementById('search-bar');
const suggestionsBox = document.getElementById('suggestions');
const clearButton = document.getElementById('clear-search');

// Vérifications des éléments DOM
if (!searchBar) {
  console.error("Élément '#search-bar' introuvable dans le DOM");
}
if (!suggestionsBox) {
  console.error("Élément '#suggestions' introuvable dans le DOM");
}
if (!clearButton) {
  console.error("Élément '#clear-search' introuvable dans le DOM");
}

if (searchBar && suggestionsBox && clearButton) {
  searchBar.addEventListener('input', async () => {
    const query = searchBar.value.trim();
    clearButton.style.display = query ? 'block' : 'none';
    if (query.length < 3) {
      suggestionsBox.innerHTML = '';
      return;
    }
    const results = await searchMulti(query);
    console.log('Suggestions affichées :', results); // Ajout pour débogage
    if (results.length === 0) {
      suggestionsBox.innerHTML = '<div class="suggestion-item">Aucun résultat trouvé</div>';
    } else {
      suggestionsBox.innerHTML = results.slice(0, 5).map(item => `
        <div class="suggestion-item" data-id="${item.id}" data-type="${item.media_type}">
          ${item.title || item.name} (${item.media_type === 'movie' ? 'Film' : 'Série'})
        </div>
      `).join('');
    }
  });

  suggestionsBox.addEventListener('click', (e) => {
    const suggestion = e.target.closest('.suggestion-item');
    if (suggestion) {
      const id = suggestion.dataset.id;
      const type = suggestion.dataset.type;
      console.log('Redirection vers détail :', { id, type }); // Ajout pour débogage
      window.location.href = `./pages/detail.html?id=${id}&type=${type}`;
    }
  });

  clearButton.addEventListener('click', () => {
    searchBar.value = '';
    suggestionsBox.innerHTML = '';
    clearButton.style.display = 'none';
  });
}