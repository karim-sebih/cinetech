const axios = require('axios');

const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://api.themoviedb.org/3/';

async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(`${API_URL}movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du film:', error);
    throw error;
  }}

async function getMovieCredits(movieId) {
  try {
    const response = await axios.get(`${API_URL}movie/${movieId}/credits`, {
      params: {
        api_key: API_KEY,}
      });
    return response.data;
  }
  catch (error) {
    console.error('Erreur lors de la récupération des crédits du film:', error);
    throw error;
  }}

async function getMovieReviews(movieId) {
  try {
    const response = await axios.get(`${API_URL}movie/${movieId}/reviews`, {
      params: {
        api_key: API_KEY,  
      }});
    return response.data;
  }
  catch (error) {
    console.error('Erreur lors de la récupération des critiques du film:', error);
    throw error;
  }}

async function getMovieRecommendations(movieId) {
  try {
    const response = await axios.get(`${API_URL}movie/${movieId}/recommendations`, {
      params: {
        api_key: API_KEY, 
        }});  
    return response.data;
    }
    catch (error) {
        console.error('Erreur lors de la récupération des recommandations du film:', error);
        throw error;
        }
        
async function getMovieTrailer(movieId) {
    try {
        const response = await axios.get(`${API_URL}movie/${movieId}/videos`, {
        params: {
            api_key: API_KEY,
        }});
        return response.data.results[0]; // Return the first trailer found
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la bande-annonce du film:', error);
        throw error;
    }}}   

async function displayMovieDetails(movieId) {
  try {
    const movieDetails = await getMovieDetails(movieId);
    const movieCredits = await getMovieCredits(movieId);
    const movieReviews = await getMovieReviews(movieId);
    const movieRecommendations = await getMovieRecommendations(movieId);
    const movieTrailer = await getMovieTrailer(movieId);

    // Display movie details
    document.getElementById('movie-title').innerText = movieDetails.title;
    document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
    document.getElementById('movie-plot').innerText = movieDetails.overview;
    document.getElementById('movie-rating').innerText = movieDetails.vote_average;
    document.getElementById('movie-genres').innerText = movieDetails.genres.map(genre => genre.name).join(', ');
    document.getElementById('movie-director').innerText = movieCredits.crew.find(crew => crew.job === 'Director').name;
    document.getElementById('movie-actors').innerText = movieCredits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    document.getElementById('movie-runtime').innerText = `${movieDetails.runtime} minutes`;
    document.getElementById('movie-release').innerText = movieDetails.release_date;
    document.getElementById('movie-language').innerText = movieDetails.original_language.toUpperCase();
    document.getElementById('movie-country').innerText = movieDetails.production_countries.map(country => country.name).join(', ');
    document.getElementById('movie-awards').innerText = movieDetails.awards || 'N/A';
    document.getElementById('movie-trailer').src = `https://www.youtube.com/embed/${movieTrailer.key}`;
    document.getElementById('movie-trailer').style.display = 'block';
    document.getElementById('movie-reviews').style.display = 'block';


    // Display reviews
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = ''; // Clear previous reviews
    movieReviews.results.forEach(review => {
      const reviewItem = document.createElement('li');
      reviewItem.innerHTML = `<strong>${review.author}</strong>: ${review.content}`;
      reviewsList.appendChild(reviewItem);
    });
}  catch (error) {
    console.error('Erreur lors de l\'affichage des détails du film:', error);
  }}