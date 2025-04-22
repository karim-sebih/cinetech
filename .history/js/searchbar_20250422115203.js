// js/searchbar.js
import { searchMulti } from './api.js';

const searchBar = document.getElementById('search-bar');
const suggestionsBox = document.getElementById('suggestions');
const clearButton = document.getElementById('clear-search');

searchBar.addEventListener('input', async () => {
  const query = searchBar.value.trim();
  clearButton.style.display = query ? 'block' : 'none';
  if (query.length < 3) {
    suggestionsBox.innerHTML = '';
    return;
  }
  const results = await searchMulti(query);
  suggestionsBox.innerHTML = results.slice(0, 5).map(item => `
    <div class="suggestion-item" data-id="${item.id}" data-type="${item.media_type}">
      ${item.title || item.name} (${item.media_type === 'movie' ? 'Film' : 'Série'})
    </div>
  `).join('');
});

suggestionsBox.addEventListener('click', (e) => {
  const suggestion = e.target.closest('.suggestion-item');
  if (suggestion) {
    const id = suggestion.dataset.id;
    const type = suggestion.dataset.type;
    window.location.href = `./pages/detail.html?id=${id}&type=${type}`;
  }
});

clearButton.addEventListener('click', () => {
  searchBar.value = '';
  suggestionsBox.innerHTML = '';
  clearButton.style.display = 'none';
});