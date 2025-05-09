import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import MovieCard from "./MovieCard";
import { Typography, Box, Grid, Alert } from "@mui/material";

function Favorites() {
  const { favorites, user } = useContext(MovieContext);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        {user?.username}'s Favorite Movies
      </Typography>

      {favorites.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't added any favorites yet. Browse movies and click the heart
          icon to add favorites.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {favorites.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard key={movie.id} movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Favorites;
