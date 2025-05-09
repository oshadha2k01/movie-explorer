import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IMAGE_BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const { favorites, toggleFavorite } = useContext(MovieContext);
  const navigate = useNavigate();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  return (
    <Card className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <CardMedia
        component="img"
        height="300"
        image={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="h6">{movie.title}</Typography>
        <Typography variant="body2">
          {new Date(movie.release_date).getFullYear()} | ⭐{" "}
          {movie.vote_average.toFixed(1)}
        </Typography>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
