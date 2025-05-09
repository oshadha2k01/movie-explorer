import React, { useContext, useState } from "react";
import { MovieContext } from "../context/MovieContext";
import { GENRES } from "../constants";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  Chip,
  Collapse,
  IconButton,
  useTheme,
  Divider,
  Tooltip
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import DateRangeIcon from '@mui/icons-material/DateRange';

function FilterBar() {
  const { filters, setFilters, searchMovies, lastSearch, fetchTrending } =
    useContext(MovieContext);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const hasActiveFilters = Object.values(filters).some((val) => val !== "");

    if (lastSearch && lastSearch.trim()) {
      searchMovies(lastSearch, 1, filters);
    } else {
      fetchTrending(filters);
    }
  };

  const resetFilters = () => {
    setFilters({
      genre: "",
      year: "",
      rating: "",
    });

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

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  const getSelectedGenreName = () => {
    if (!filters.genre) return null;
    const genre = GENRES.find(g => g.id.toString() === filters.genre.toString());
    return genre ? genre.name : null;
  };

  return (
    <Paper
      elevation={expanded ? 3 : 1}
      sx={{
        my: 3,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: hasActiveFilters ? 'primary.main' : 'divider',
      }}
    >
      {/* Filter Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          cursor: 'pointer',
          bgcolor: hasActiveFilters ? 'primary.light' : 'background.paper',
          color: hasActiveFilters ? 'primary.contrastText' : 'text.primary',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: hasActiveFilters ? 'primary.main' : 'action.hover'
          }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
            {hasActiveFilters ? 'Active Filters' : 'Filter Movies'}
          </Typography>
          
          {/* Show active filter chips */}
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', ml: 2, gap: 1, flexWrap: 'wrap' }}>
              {filters.genre && (
                <Chip 
                  icon={<MovieFilterIcon />}
                  label={getSelectedGenreName()} 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    fontWeight: 'bold'
                  }} 
                />
              )}
              {filters.year && (
                <Chip 
                  icon={<DateRangeIcon />}
                  label={filters.year} 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    fontWeight: 'bold'
                  }} 
                />
              )}
              {filters.rating && (
                <Chip 
                  icon={<StarIcon />}
                  label={`${filters.rating}+ Rating`} 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    fontWeight: 'bold'
                  }} 
                />
              )}
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  resetFilters();
                }}
                sx={{ 
                  mr: 1,
                  color: 'inherit',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <ClearAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Box>
      
      {/* Filter Controls */}
      <Collapse in={expanded}>
        <Divider />
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-end",
            bgcolor: isDarkMode ? 'background.paper' : 'grey.50'
          }}
        >
          <FormControl 
            sx={{ 
              minWidth: 160,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 1
                },
                '&.Mui-focused': {
                  boxShadow: 2
                }
              }
            }}
          >
            <InputLabel>Genre</InputLabel>
            <Select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              label="Genre"
            >
              <MenuItem value="">All Genres</MenuItem>
              {GENRES.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl 
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 1
                },
                '&.Mui-focused': {
                  boxShadow: 2
                }
              }
            }}
          >
            <InputLabel>Year</InputLabel>
            <Select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              label="Year"
            >
              <MenuItem value="">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl 
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 1
                },
                '&.Mui-focused': {
                  boxShadow: 2
                }
              }
            }}
          >
            <InputLabel>Min Rating</InputLabel>
            <Select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              label="Min Rating"
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }
                }
              }}
            >
              <MenuItem value="">Any Rating</MenuItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>{rating}+ </Typography>
                    <StarIcon sx={{ color: 'gold', ml: 0.5, fontSize: '1rem' }} />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ display: "flex", gap: 1, ml: { xs: 0, sm: 'auto' }, mt: { xs: 2, sm: 0 } }}>
            <Button 
              variant="contained" 
              onClick={applyFilters}
              sx={{ 
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                boxShadow: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  bgcolor: theme => theme.palette.primary.dark,
                }
              }}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outlined" 
              onClick={resetFilters}
              sx={{ 
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderWidth: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

export default FilterBar;
