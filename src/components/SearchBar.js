import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize with current URL query or last search from localStorage
  const [query, setQuery] = useState(() => {
    const urlQuery = searchParams.get("query");
    const savedQuery = localStorage.getItem("lastSearchedMovie");
    return urlQuery || savedQuery || "";
  });

  // Update localStorage whenever the search is performed
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Save to localStorage
      localStorage.setItem("lastSearchedMovie", query.trim());
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{ my: 2, display: "flex", gap: 1 }}
    >
      <TextField
        fullWidth
        label="Search Movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        variant="outlined"
        placeholder={
          localStorage.getItem("lastSearchedMovie")
            ? `Last search: ${localStorage.getItem("lastSearchedMovie")}`
            : "Search for movies..."
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ px: 3 }}
        disabled={!query.trim()}
      >
        Search
      </Button>
    </Box>
  );
}

export default SearchBar;
