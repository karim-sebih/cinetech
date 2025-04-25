const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN}`
  }
};

export const imageBaseUrl = IMAGE_BASE_URL;

export async function fetchConfiguration() {
  // Pas besoin de configuration pour TMDb, mais on garde la fonction pour compatibilité
  return Promise.resolve();
}

export async function fetchMovies(page = 1, genreId = null) {
  try {
    let url = `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=fr-FR&page=${page}&sort_by=popularity.desc`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();
    return data.results.map(item => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path ? `${IMAGE_BASE_URL}w200${item.poster_path}` : 'default.jpg',
      overview: item.overview,
      popularity: item.popularity, // Ajout de popularity
      vote_average: item.vote_average // Ajout de vote_average (optionnel)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des films :', error);
    return [];
  }
}

export async function fetchSeries(page = 1, genreId = null) {
  try {
    let url = `${BASE_URL}/discover/tv?include_adult=false&include_null_first_air_dates=false&language=fr-FR&page=${page}&sort_by=popularity.desc`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();
    return data.results.map(item => ({
      id: item.id,
      name: item.name,
      poster_path: item.poster_path ? `${IMAGE_BASE_URL}w200${item.poster_path}` : 'default.jpg',
      overview: item.overview,
      popularity: item.popularity, // Ajout de popularity
      vote_average: item.vote_average // Ajout de vote_average (optionnel)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des séries :', error);
    return [];
  }
}

export async function searchMoviesAndSeries(query) {
  try {
    const url = `${BASE_URL}/search/multi?language=fr-FR&query=${encodeURIComponent(query)}&include_adult=false`;
    const response = await fetch(url, options);
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
        media_type: item.media_type,
        popularity: item.popularity, // Ajout de popularity
        vote_average: item.vote_average // Ajout de vote_average (optionnel)
      }));
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    return [];
  }
}