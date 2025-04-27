let favoris = [];

document.addEventListener('DOMContentLoaded', () => {
  const storedFavoris = localStorage.getItem('Favoris');
  if (storedFavoris) {
    favoris = JSON.parse(storedFavoris);
    updateFavoris();
  }
  renderFavoris();
});

// ================= DISPLAY LIKED RECIPES =================
function renderFavoris() {
  document.querySelector('h1').style.display = 'none';
  document.getElementById('filter-container').style.display = 'flex';
  document.getElementById('favs').style.display = 'flex';
  updateFavoris();
}
  
// ================= UPDATE LIKED RECIPES =================
function updateFavoris() {
  const favorisList = document.getElementById('favs');
  favorisList.innerHTML = '';

  if (favoris.length === 0) {
    favorisList.innerHTML = '<p>Aucun favori pour le moment.</p>';
    return;
  }

  favoris.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.image?.src || recipe.image || 'default.jpg'}" alt="${recipe.image?.alt || 'Image de la recette'}" class="recipe-image">
      <div class="recipe-content">
        <h3>${recipe.nom}</h3>
        <p><strong>Temps de préparation:</strong> ${recipe.temps_preparation}</p>
        <button class="details-btn" data-recipe-index="${index}">Voir Détails</button>
        <button class="remove-btn" onclick="removeLikedRecipe('${recipe.nom}')">🗑️</button>
      </div>
    `;
    favorisList.appendChild(card);
  });

  // Ajouter les écouteurs d'événements pour les boutons "Voir Détails"
  document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', function () {
      const recipeIndex = this.getAttribute('data-recipe-index');
      const recipe = favoris[recipeIndex];
      showPopup(recipe);
    });
  });
}

// ================= REMOVE LIKED RECIPE =================
function removeLikedRecipe(recipeName) {
  favoris = favoris.filter(recipe => recipe.nom !== recipeName);
  localStorage.setItem('Favoris', JSON.stringify(favoris));
  updateFavoris();
}

// Navigation vers les détails
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("details-btn")) {
    const id = event.target.dataset.id;
    const type = event.target.dataset.type;
    window.location.href = `./pages/detail.html?id=${id}&type=${type}`;
  }
});