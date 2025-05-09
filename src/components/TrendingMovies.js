import React, { useContext, useEffect } from "react";
import { MovieContext } from "../context/MovieContext";
import MovieCard from "./MovieCard";
import TrendingToggle from "./TrendingToggle";
import { Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";

function TrendingMovies() {
  const { trending, fetchTrending, isLoading, error, timeWindow } =
    useContext(MovieContext);

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="trending-container">
      <TrendingToggle />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : trending.length === 0 ? (
        <Typography variant="body1" sx={{ my: 2 }}>
          No trending movies found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {trending.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default TrendingMovies;
