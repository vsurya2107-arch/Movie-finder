import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const searchMovies = async () => {
    if (!search.trim()) {
      setError("Enter a movie name");
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://www.omdbapi.com/?s=${search}&apikey=6dbbf2d1`
      );

      const data = await response.json();

      if (data.Response === "False") {
        setError(data.Error);
        setMovies([]);
      } else {
        setMovies(data.Search);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getMovieDetails = async (id) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=6dbbf2d1`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setSelectedMovie(data);
        setShowModal(true);
      } else {
        setError(data.Error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load movie details");
    }
  };

  return (
    <div className="app">
      <h1>🎬 Movie Search App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchMovies}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="error">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onClick={() => getMovieDetails(movie.imdbID)}
          />
        ))}
      </div>

      {showModal && selectedMovie && (
        <div
          className="modal"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <h2>{selectedMovie.Title}</h2>

            <img
              src={selectedMovie.Poster}
              alt={selectedMovie.Title}
            />

            <p>
              <strong>Year:</strong> {selectedMovie.Year}
            </p>

            <p>
              <strong>Genre:</strong> {selectedMovie.Genre}
            </p>

            <p>
              <strong>Actors:</strong> {selectedMovie.Actors}
            </p>

            <p>
              <strong>IMDb Rating:</strong> {selectedMovie.imdbRating}
            </p>

            <p>
              <strong>Plot:</strong> {selectedMovie.Plot}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;