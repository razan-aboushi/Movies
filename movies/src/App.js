import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Make a request to your Express server endpoint to retrieve the movies list
    axios
      .get("http://localhost:4000/movies") // Update the port to match the Express server's port
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });

    // Make a request to fetch the list of genres
    axios
      .get("http://localhost:4000/genres") // Update the port to match the Express server's port
      .then((response) => {
        if (Array.isArray(response.data)) {
          setGenres(response.data);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }, []);

  function handleGenreChange(event) {
    setSelectedGenre(event.target.value);
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleMovieClick(movieId) {
    // Make a request to fetch the details of a specific movie
    axios
      .get(`http://localhost:4000/movies/${movieId}`) // Update the port to match the Express server's port
      .then((response) => {
        setSelectedMovie(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function filterMovies(movie) {
    if (!selectedGenre && !searchTerm) {
      return true; // Show all movies when no genre or search term is selected
    }
    if (
      selectedGenre &&
      movie.genre_ids.includes(parseInt(selectedGenre))
    ) {
      return true;
    }
    if (
      searchTerm &&
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    return false;
  }

  if (error) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div className="container">
      <h1 className="mb-4">Movies</h1>
      <div className="mb-3">
        <label htmlFor="genre" className="form-label">
          Filter by Genre:
        </label>
        <select
          id="genre"
          className="form-select"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All</option>
          {genres.length > 0 && (
            <>
              <option value="">All</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </>
          )}

        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="search" className="form-label">
          Search:
        </label>
        <input
          type="text"
          id="search"
          className="form-control"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <ul className="list-group">
        {movies.length > 0 ? (
          movies.filter(filterMovies).map((movie) => (
            <li
              key={movie.id}
              className="list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn"
              onClick={() => handleMovieClick(movie.id)}
            >
              {movie.title}
              <span className="badge bg-primary">Details</span>
            </li>
          ))
        ) : (
          <div>No movies found.</div>
        )}

      </ul>

      {selectedMovie && (
        <div className="mt-4">
          <h2>{selectedMovie.title}</h2>
          <p>Overview: {selectedMovie.overview}</p>
          <p>Release Date: {selectedMovie.release_date}</p>
        </div>
      )}
    </div>
  );
}

export default App;
