import { imageBaseUrl } from './api.js';

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN}`
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // Récupérer les paramètres de l'URL (id et type)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const type = urlParams.get('type'); // 'movie' ou 'tv'

  if (!id || !type) {
    displayError('ID ou type manquant dans l\'URL.');
    return;
  }

  try {
    // Déterminer l'endpoint en fonction du type (film ou série)
    const endpoint = type === 'movie' 
      ? `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits&language=fr-FR`
      : `https://api.themoviedb.org/3/tv/${id}?append_to_response=credits&language=fr-FR`;

    // Récupérer les détails
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();

    // Afficher les détails
    displayDetails(data, type);

    // Récupérer et afficher les avis
    await fetchAndDisplayReviews(id, type);

    // Récupérer et afficher les suggestions similaires
    await fetchAndDisplaySimilar(id, type);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails :', error);
    displayError('Impossible de charger les détails. Veuillez réessayer plus tard.');
  }
});

function displayDetails(data, type) {
  const container = document.getElementById('details-container');
  if (!container) {
    console.error('Conteneur de détails introuvable.');
    return;
  }

  // Préparer les données à afficher
  const title = type === 'movie' ? data.title : data.name;
  const releaseDate = type === 'movie' ? data.release_date : data.first_air_date;
  const director = type === 'movie'
    ? (data.credits?.crew?.find(crew => crew.job === 'Director')?.name || 'N/A')
    : (data.created_by?.map(creator => creator.name).join(', ') || 'N/A');
  const directorLabel = type === 'movie' ? 'Réalisateur' : 'Créateur(s)';
  const genres = data.genres?.map(genre => genre.name).join(', ') || 'N/A';
  const countries = data.production_countries?.map(country => country.name).join(', ') || 'N/A';
  const imageSrc = data.poster_path ? `${imageBaseUrl}w500${data.poster_path}` : 'default.jpg';

  // Construire le HTML pour les détails
  container.innerHTML = `
    <div class="details-content">
      <img src="${imageSrc}" alt="${title}" class="details-poster">
      <div class="details-text">
        <h2>${title}</h2>
        <p class="overview">${data.overview || 'Synopsis non disponible.'}</p>
        <p><strong>Note :</strong> ${data.vote_average?.toFixed(1) || 'N/A'} / 10</p>
        <p><strong>Genre :</strong> ${genres}</p>
        <p><strong>${directorLabel} :</strong> ${director}</p>
        <p><strong>Date de sortie :</strong> ${releaseDate || 'N/A'}</p>
        <p><strong>Langue :</strong> ${data.original_language?.toUpperCase() || 'N/A'}</p>
        <p><strong>Pays :</strong> ${countries}</p>
        <button id="add-to-favorites" class="favorite-btn">Ajouter aux favoris</button>
      </div>
    </div>
  `;

  // Ajouter un événement pour le bouton "Ajouter aux favoris"
  const favoriteBtn = document.getElementById('add-to-favorites');
  favoriteBtn.addEventListener('click', () => {
    addToFavorites({ id: data.id, title, type, poster_path: data.poster_path });
  });
}

async function fetchAndDisplayReviews(id, type) {
  try {
    // Déterminer l'endpoint pour les avis
    const reviewsEndpoint = type === 'movie'
      ? `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`
      : `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US&page=1`;

    // Récupérer les avis
    const response = await fetch(reviewsEndpoint, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const reviewsData = await response.json();
    const reviews = reviewsData.results.slice(0, 3); // Limiter à 3 avis

    // Afficher les avis
    displayReviews(reviews);
  } catch (error) {
    console.error(`Erreur lors de la récupération des avis pour ${type} (ID: ${id}):`, error);
    const reviewsContainer = document.getElementById('reviews-list');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = `<p class="error-message">Aucun avis disponible pour le moment.</p>`;
    }
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-list');
  if (!container) {
    console.error('Conteneur des avis introuvable.');
    return;
  }

  container.innerHTML = ''; // Vider le conteneur

  if (reviews.length === 0) {
    container.innerHTML = `<p class="no-reviews">Aucun avis disponible pour le moment.</p>`;
    return;
  }

  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    const author = review.author || 'Anonyme';
    const content = review.content || 'Aucun commentaire.';
    const rating = review.author_details?.rating ? `${review.author_details.rating}/10` : 'Non noté';
    const createdAt = review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR') : 'Date inconnue';
    const trailer = detail.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    reviewElement.innerHTML = `
      <div class="review-header">
        <h3>${author}</h3>
        <p class="review-rating">Note : ${rating}</p>
        <p class="review-date">Publié le : ${createdAt}</p>
      </div>
      $(trai)
      <p class="review-content">${content}</p>
    `;
    container.appendChild(reviewElement);
  });
}

async function fetchAndDisplaySimilar(id, type) {
  try {
    // Déterminer l'endpoint pour les suggestions similaires
    const similarEndpoint = type === 'movie'
      ? `https://api.themoviedb.org/3/movie/${id}/similar?language=fr-FR&page=1`
      : `https://api.themoviedb.org/3/tv/${id}/similar?language=fr-FR&page=1`;

    // Récupérer les suggestions similaires
    const response = await fetch(similarEndpoint, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const similarData = await response.json();
    const similarItems = similarData.results.slice(0, 5); // Limiter à 5 suggestions

    // Afficher les suggestions
    displaySimilarItems(similarItems, type);
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions similaires :', error);
    const similarContainer = document.getElementById('similar-items');
    if (similarContainer) {
      similarContainer.innerHTML = `<p class="error-message">Impossible de charger les suggestions similaires.</p>`;
    }
  }
}

function displaySimilarItems(items, type) {
  const container = document.getElementById('similar-items');
  if (!container) {
    console.error('Conteneur de suggestions similaires introuvable.');
    return;
  }

  container.innerHTML = ''; // Vider le conteneur

  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'similar-item';
    const imageSrc = item.poster_path ? `${imageBaseUrl}w200${item.poster_path}` : 'default.jpg';
    const title = type === 'movie' ? item.title : item.name;
    itemElement.innerHTML = `
      <img src="${imageSrc}" alt="${title}" class="similar-poster">
      <h3>${title}</h3>
      <button class="details-btn" data-id="${item.id}" data-type="${type}">Voir Détails</button>
    `;
    container.appendChild(itemElement);
  });

  // Ajouter des écouteurs d'événements pour les boutons "Voir Détails"
  container.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const newType = button.dataset.type;
      window.location.href = `./detail.html?id=${id}&type=${newType}`;
    });
  });
}

function displayError(message) {
  const container = document.getElementById('details-container');
  if (container) {
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }
}

function addToFavorites(item) {
  // Récupérer les favoris existants dans localStorage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Vérifier si l'élément est déjà dans les favoris
  const exists = favorites.some(fav => fav.id === item.id && fav.type === item.type);
  if (exists) {
    alert('Cet élément est déjà dans vos favoris !');
    return;
  }

  // Ajouter l'élément aux favoris
  favorites.push(item);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert(`${item.title} a été ajouté aux favoris !`);
}