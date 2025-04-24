// js/api.js
let imageBaseUrl = 'https://image.tmdb.org/t/p/'; // Simuler l'URL de base pour les images (comme dans TMDB)

async function fetchConfiguration() {
  // Simuler la configuration (pas besoin de requête API)
  return { images: { secure_base_url: imageBaseUrl } };
}

async function fetchMovieGenres() {
  try {
    const response = await fetch('./json/movie_genres.json');
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Erreur genres films :', error);
    return [];
  }
}

async function fetchTVGenres() {
  try {
    const response = await fetch('./json/tv_genres.json');
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Erreur genres séries :', error);
    return [];
  }
}

async function fetchMovies(page = 1, genreId = null) {
  try {
    const response = await fetch('./json/movies.json');
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    let results = data.results;
    if (genreId) {
      results = results.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
    }
    return results;
  } catch (error) {
    console.error('Erreur films :', error);
    return [];
  }
}

async function fetchSeries(page = 1, genreId = null) {
  try {
    const response = await fetch('./json/series.json');
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    let results = data.results;
    if (genreId) {
      results = results.filter(serie => serie.genre_ids.includes(parseInt(genreId)));
    }
    return results;
  } catch (error) {
    console.error('Erreur séries :', error);
    return [];
  }
}

async function searchMulti(query) {
  try {
    const moviesResponse = await fetch('./json/movies.json');
    const seriesResponse = await fetch('./json/series.json');
    if (!moviesResponse.ok || !seriesResponse.ok) {
      throw new Error(`Erreur HTTP : ${moviesResponse.status || seriesResponse.status}`);
    }
    const moviesData = await moviesResponse.json();
    const seriesData = await seriesResponse.json();
    const allItems = [
      ...moviesData.results.map(item => ({ ...item, media_type: 'movie' })),
      ...seriesData.results.map(item => ({ ...item, media_type: 'tv' }))
    ];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item =>
      (item.title || item.name).toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Erreur recherche :', error);
    return [];
  }
}

export { fetchConfiguration, fetchMovieGenres, fetchTVGenres, fetchMovies, fetchSeries, searchMulti, imageBaseUrl };