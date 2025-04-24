// js/api.js
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTY1ZGYzMGQwNDAyOGZiODRmYjFmNTdkMDhjMjBiNiIsIm5iZiI6MTc0NTMwNTMwNS4xNDEsInN1YiI6IjY4MDczZWQ5NDIxYTMwOTc1Y2FhZWRlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lGYh-UNj4NOcQVPv6fheSInh-0FhPL5bzd-aq9rCHB8'; // Remplacez par votre clé TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
let imageBaseUrl = '';

async function fetchConfiguration() {
  try {
    const response = await fetch(`${BASE_URL}/configuration?api_key=${API_KEY}`);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    imageBaseUrl = data.images.secure_base_url; // Exemple : https://image.tmdb.org/t/p/
    return data;
  } catch (error) {
    console.error('Erreur configuration :', error);
    return null;
  }
}

async function fetchMovieGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
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
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
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
    const genreFilter = genreId ? `&with_genres=${genreId}` : '';
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}${genreFilter}`);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur films :', error);
    return [];
  }
}

async function fetchSeries(page = 1, genreId = null) {
  try {
    const genreFilter = genreId ? `&with_genres=${genreId}` : '';
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}${genreFilter}`);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur séries :', error);
    return [];
  }
}

async function searchMulti(query) {
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur recherche :', error);
    return [];
  }
}

export { fetchConfiguration, fetchMovieGenres, fetchTVGenres, fetchMovies, fetchSeries, searchMulti, imageBaseUrl };