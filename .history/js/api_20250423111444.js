const API_KEY = 'votre_clé_api'; // Remplacez par votre clé API TMDb (par exemple, 'abc123def456')
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const imageBaseUrl = IMAGE_BASE_URL;

export async function fetchConfiguration() {
  // Pas besoin de configuration pour TMDb, mais on garde la fonction pour compatibilité
  return Promise.resolve();
}

export async function fetchMovies(page = 1, genreId = null) {
  try {
    let url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();
    return data.results.map(item => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path ? `${IMAGE_BASE_URL}w200${item.poster_path}` : 'default.jpg',
      overview: item.overview
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des films :', error);
    return [];
  }
}

export async function fetchSeries(page = 1, genreId = null) {
  try {
    let url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();
    return data.results.map(item => ({
      id: item.id,
      name: item.name,
      poster_path: item.poster_path ? `${IMAGE_BASE_URL}w200${item.poster_path}` : 'default.jpg',
      overview: item.overview
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des séries :', error);
    return [];
  }
}

export async function searchMoviesAndSeries(query) {
  try {
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();
    return data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => ({
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path ? `${IMAGE_BASE_URL}w200${item.poster_path}` : 'default.jpg',
        overview: item.overview,
        media_type: item.media_type
      }));
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    return [];
  }
}