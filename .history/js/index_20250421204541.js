// Array of movies and series
const suggestions = [
    { title: "Inception", type: "movie", genre: "Sci-Fi" },
    { title: "Breaking Bad", type: "series", genre: "Crime" },
    { title: "The Dark Knight", type: "movie", genre: "Action" },
    { title: "Stranger Things", type: "series", genre: "Sci-Fi" },
    { title: "The Godfather", type: "movie", genre: "Crime" },
    { title: "The Office", type: "series", genre: "Comedy" }
];

// Function to get suggestions based on type and genre
function getSuggestions(type, genre) {
    return suggestions.filter(item => item.type === type && item.genre === genre);
}

// Example usage
const movieSuggestions = getSuggestions("movie", "Sci-Fi");
console.log("Movie Suggestions:", movieSuggestions);

const seriesSuggestions = getSuggestions("series", "Crime");
console.log("Series