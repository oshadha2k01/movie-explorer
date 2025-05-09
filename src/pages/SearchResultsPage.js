import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import {
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

function SearchResultsPage() {
  const { searchMovies, movies, page, setPage, isLoading, error, filters } =
    useContext(MovieContext);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [allMovies, setAllMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (query) {
      // Reset state when query changes
      setAllMovies([]);
      setPage(1);
      setHasMore(true);
      searchMovies(query, 1, filters);
    }
  }, [query, filters]);

  useEffect(() => {
    if (movies && movies.length > 0) {
      // If we got less movies than expected, we've reached the end
      if (movies.length < 20) {
        setHasMore(false);
      }

      if (page === 1) {
        setAllMovies(movies);
      } else {
        setAllMovies((prev) => [...prev, ...movies]);
      }
    } else if (movies && movies.length === 0 && page > 1) {
      setHasMore(false);
    }
  }, [movies, page]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchMovies(query, nextPage, filters);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results for "{query}"
      </Typography>

      <FilterBar />
      <Divider sx={{ my: 2 }} />

      {isLoading && page === 1 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : allMovies.length === 0 ? (
        <Typography variant="body1" sx={{ my: 4 }}>
          No results found for "{query}". Try a different search term or adjust
          filters.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ my: 2 }}>
            {allMovies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            {isLoading && page > 1 ? (
              <CircularProgress />
            ) : hasMore ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                Load More
              </Button>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No more results to load
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default SearchResultsPage;
