import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, API_KEY, IMAGE_BASE_URL } from "../constants";
import { Typography, Box, CircularProgress, Button } from "@mui/material";

function MovieDetails({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
          params: { api_key: API_KEY, append_to_response: "videos" },
        });
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load movie details.");
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const trailer = movie.videos.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  return (
    <Box sx={{ my: 4 }}>
      <img
        src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
        alt={movie.title}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
      />
      <Typography variant="h4">{movie.title}</Typography>
      <Typography variant="body1">{movie.overview}</Typography>
      <Typography variant="body2">
        Genres: {movie.genres.map((g) => g.name).join(", ")}
      </Typography>
      <Typography variant="body2">
        Rating: ⭐ {movie.vote_average.toFixed(1)}
      </Typography>
      <Typography variant="body2">
        Release: {new Date(movie.release_date).getFullYear()}
      </Typography>
      {trailer && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Trailer</Typography>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="YouTube trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Box>
      )}
    </Box>
  );
}

export default MovieDetails;
