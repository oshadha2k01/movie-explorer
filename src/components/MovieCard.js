import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IMAGE_BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const { favorites, toggleFavorite } = useContext(MovieContext);
  const navigate = useNavigate();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      className="movie-card" 
      onClick={() => navigate(`/movie/${movie.id}`)}
      sx={{
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        },
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardMedia
        component="img"
        height="360"
        image={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/no-poster.png'}
        alt={movie.title}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <Typography 
          variant="h6"
          sx={{
            fontWeight: '600',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            minHeight: '2.6em'
          }}
        >
          {movie.title}
        </Typography>
        <Typography 
          variant="body2"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'text.secondary',
            alignItems: 'center'
          }}
        >
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span style={{ fontWeight: 'bold' }}>⭐ {movie.vote_average.toFixed(1)}</span>
        </Typography>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
          sx={{
            position: 'absolute',
            top: -20,
            right: 8,
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.9)',
            color: isDarkMode ? (isFavorite ? 'error.main' : 'text.primary') : 'inherit',
            boxShadow: theme => theme.shadows[3],
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.15) rotate(5deg)',
              bgcolor: 'rgba(255,255,255,1)',
              boxShadow: theme => theme.shadows[5],
            }
          }}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
