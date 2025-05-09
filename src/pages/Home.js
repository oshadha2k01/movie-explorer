import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../context/MovieContext';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import TrendingToggle from '../components/TrendingToggle';
import { Box, Typography, Grid, Button, CircularProgress, Alert } from '@mui/material';

function Home() {
  const { trending, fetchTrending, isLoading, error, timeWindow } = useContext(MovieContext);
  const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 movies (2 rows of 3)

  useEffect(() => {
    fetchTrending();
  }, []);

  // Reset visible count when trending or timeWindow changes
  useEffect(() => {
    setVisibleCount(6);
  }, [trending, timeWindow]);

  const handleLoadMore = () => {
    // Increase visible count by 6 more movies
    setVisibleCount(prevCount => prevCount + 6);
  };

  // Get only the movies to display based on current visibleCount
  const visibleMovies = trending.slice(0, visibleCount);
  const hasMoreToLoad = trending.length > visibleCount;

  return (
    <Box sx={{ py: 1 }}>  {/* Reduced top padding from 3 to 1 */}
      <Box sx={{ mt: -1 }}>  {/* Added negative margin to move content up */}
        <SearchBar />
        {/* Removed default margin between components by targeting FilterBar specifically */}
        <Box sx={{ mt: -1, mb: 2 }}>
          <FilterBar />
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>  {/* Reduced margin from 4 to 2 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TrendingToggle />
        </Box>

        {isLoading && trending.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : visibleMovies.length === 0 ? (
          <Typography variant="body1" sx={{ my: 2 }}>
            No trending movies found.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {visibleMovies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            
            {/* Load More button */}
            {hasMoreToLoad && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  sx={{ 
                    minWidth: '200px',
                    py: 1.5,
                    px: 4,
                    fontWeight: 'bold',
                    borderRadius: 8,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: 4,
                      bgcolor: theme => theme.palette.primary.dark,
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                      boxShadow: 1,
                    }
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Home;
