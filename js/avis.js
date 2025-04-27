const url = `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${apiKey}&language=fr-FR`;

// Effectuer la requête GET
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Afficher les avis
    data.results.forEach(review => {
      console.log(`Auteur: ${review.author}`);
      console.log(`Contenu: ${review.content}`);
      console.log('-'.repeat(40));
    });
  })
  .catch(error => {
    console.error(error);
  });