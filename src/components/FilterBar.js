import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { GENRES } from "../constants";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

function FilterBar() {
  const { filters, setFilters, searchMovies, lastSearch, fetchTrending } =
    useContext(MovieContext);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some((val) => val !== "");

    console.log(
      "Applying filters:",
      filters,
      "Any active filters?",
      hasActiveFilters,
      "Search term?",
      lastSearch && lastSearch.trim()
    );

    if (lastSearch && lastSearch.trim()) {
      // If there's a search term, apply filters to search results
      searchMovies(lastSearch, 1, filters);
    } else {
      // If no search term, apply filters to trending movies
      fetchTrending(filters);
    }
  };

  const resetFilters = () => {
    setFilters({
      genre: "",
      year: "",
      rating: "",
    });

    // After resetting, re-fetch with empty filters
    if (lastSearch && lastSearch.trim()) {
      searchMovies(lastSearch, 1, {});
    } else {
      fetchTrending({});
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <Box
      sx={{
        my: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-end",
      }}
    >
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Genre</InputLabel>
        <Select
          name="genre"
          value={filters.genre}
          onChange={handleFilterChange}
          label="Genre"
        >
          <MenuItem value="">All</MenuItem>
          {GENRES.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          label="Year"
        >
          <MenuItem value="">All</MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Min Rating</InputLabel>
        <Select
          name="rating"
          value={filters.rating}
          onChange={handleFilterChange}
          label="Min Rating"
        >
          <MenuItem value="">All</MenuItem>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}+
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={resetFilters}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}

export default FilterBar;
