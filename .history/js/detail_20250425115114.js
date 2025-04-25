const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN}`
  }
};

// Récupérer les paramètres de l'URL (id et type)
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type'); // 'movie' ou 'tv'

if (!id || !type) {
  console.error('ID ou type manquant dans l\'URL.');
} else {
  // Déterminer l'endpoint en fonction du type (film ou série)
  const reviewsEndpoint = type === 'movie'
    ? `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`
    : `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US&page=1`;

  // Récupérer les avis
  fetch(reviewsEndpoint, options)
    .then(res => res.json())
    .then(res => {
      console.log('Avis récupérés :', res);
      // Afficher les avis dans la page (par exemple, dans #reviews-list)
      const container = document.getElementById('reviews-list');
      if (!container) {
        console.error('Conteneur des avis introuvable.');
        return;
      }

      container.innerHTML = ''; // Vider le conteneur

      const reviews = res.results.slice(0, 3); // Limiter à 3 avis
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

        reviewElement.innerHTML = `
          <div class="review-header">
            <h3>${author}</h3>
            <p class="review-rating">Note : ${rating}</p>
            <p class="review-date">Publié le : ${createdAt}</p>
          </div>
          <p class="review-content">${content}</p>
        `;
        container.appendChild(reviewElement);
      });
    })
    .catch(err => console.error('Erreur lors de la récupération des avis :', err));
}