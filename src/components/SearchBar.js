import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Box, InputAdornment, Paper, Chip, Typography, Fade } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { MovieContext } from "../context/MovieContext";

function SearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(MovieContext);

  // Initialize with URL query or user-specific search from localStorage
  const [query, setQuery] = useState(() => {
    const urlQuery = searchParams.get("query");

    // Get user-specific search history if a user is logged in
    let savedQuery = '';
    if (user && user.username) {
      savedQuery = localStorage.getItem(`lastSearch_${user.username}`);
    }

    return urlQuery || savedQuery || '';
  });

  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = user && user.username ? localStorage.getItem(`recentSearches_${user.username}`) : null;
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 3));
    }
  }, [user]);

  // Update localStorage whenever the search is performed
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Save to user-specific localStorage key if user is logged in
      if (user && user.username) {
        localStorage.setItem(`lastSearch_${user.username}`, query.trim());

        // Update recent searches
        const updatedSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 3);
        setRecentSearches(updatedSearches);
        localStorage.setItem(`recentSearches_${user.username}`, JSON.stringify(updatedSearches));
      }

      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleRecentSearch = (searchTerm) => {
    setQuery(searchTerm);
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Box sx={{ my: 3, position: 'relative' }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={isFocused ? 4 : 1}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          border: isFocused ? '2px solid' : '1px solid',
          borderColor: isFocused ? 'primary.main' : 'divider',
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <InputAdornment position="start" sx={{ ml: 1, color: isFocused ? 'primary.main' : 'action.active' }}>
          <SearchIcon fontSize="large" />
        </InputAdornment>
        
        <TextField
          fullWidth
          placeholder={
            user && user.username && localStorage.getItem(`lastSearch_${user.username}`)
              ? `Last search: ${localStorage.getItem(`lastSearch_${user.username}`)}`
              : "Search for movies..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { 
              fontSize: '1.1rem',
              ml: 1,
              '& input': {
                py: 1.5,
                transition: 'all 0.2s ease'
              }
            }
          }}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ 
            ml: 1,
            px: 3,
            py: 1.2,
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3,
              bgcolor: theme => theme.palette.primary.dark,
            },
            '&:active': {
              transform: 'translateY(1px)',
            }
          }}
          disabled={!query.trim()}
        >
          Search
        </Button>
      </Paper>

      {/* Recent searches */}
      <Fade in={recentSearches.length > 0}>
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {recentSearches.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} /> Recent:
              </Typography>
              
              {recentSearches.map((term, index) => (
                <Chip
                  key={index}
                  label={term}
                  size="small"
                  onClick={() => handleRecentSearch(term)}
                  sx={{ 
                    borderRadius: 4,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                />
              ))}
            </>
          )}
          
          <Chip
            icon={<TrendingUpIcon />}
            label="Trending"
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ 
              borderRadius: 4,
              ml: 'auto',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white',
                transform: 'translateY(-2px)'
              } 
            }}
          />
        </Box>
      </Fade>
    </Box>
  );
}

export default SearchBar;
