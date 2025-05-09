import React, { useContext, useEffect } from "react";
import { MovieContext } from "../context/MovieContext";
import SearchBar from "../components/SearchBar";
import TrendingMovies from "../components/TrendingMovies";
import FilterBar from "../components/FilterBar";
import { Box, Typography } from "@mui/material";

function Home() {
  const { fetchTrending } = useContext(MovieContext);

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      {/* <Typography variant="h4" component="h1" gutterBottom>
        Movie Explorer
      </Typography> */}

      <SearchBar />
      <FilterBar />

      <TrendingMovies />

      {/* Search results section removed - now only appears on the SearchResultsPage */}
    </Box>
  );
}

export default Home;
