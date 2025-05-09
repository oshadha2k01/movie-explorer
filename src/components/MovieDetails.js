import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, API_KEY, IMAGE_BASE_URL } from "../constants";
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  Chip, 
  Grid, 
  Paper, 
  Rating, 
  Skeleton, 
  Fade, 
  Divider,
  IconButton,
  Card,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions 
} from "@mui/material";
import { 
  CalendarMonth, 
  AccessTime, 
  AttachMoney, 
  Language, 
  Favorite, 
  FavoriteBorder,
  PlayArrow,
  Close
} from "@mui/icons-material";

function MovieDetails({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playTrailer, setPlayTrailer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = process.env.REACT_APP_TMDB_API_KEY || API_KEY;
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
          params: { 
            api_key: apiKey, 
            append_to_response: "videos,credits",
            language: "en-US"
          },
        });
        console.log("Movie data:", response.data);
        if (response.data.videos && response.data.videos.results) {
          console.log("Available videos:", response.data.videos.results.map(v => ({type: v.type, site: v.site, name: v.name})));
        }
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details.");
        setLoading(false);
      }
    };
    fetchMovieDetails();
    
    return () => {
      setPlayTrailer(false);
    };
  }, [movieId]);

  if (loading) return (
    <Box sx={{ my: 4 }}>
      <Skeleton variant="rectangular" width="100%" height={400} animation="wave" />
      <Skeleton variant="text" height={80} width="70%" sx={{ mt: 2 }} />
      <Skeleton variant="text" height={25} width="40%" />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={30} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={30} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={30} />
        </Grid>
      </Grid>
      <Skeleton variant="text" height={120} sx={{ mt: 2 }} />
    </Box>
  );

  if (error) return (
    <Paper elevation={3} sx={{ p: 4, my: 4, textAlign: 'center', borderRadius: 2 }}>
      <Typography color="error" variant="h5" gutterBottom>{error}</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        We couldn't load the details for this movie. Please try again later.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => window.location.reload()}
        sx={{ mt: 2, borderRadius: 6 }}
      >
        Try Again
      </Button>
    </Paper>
  );

  const trailer = movie?.videos?.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  ) || movie?.videos?.results.find(
    (vid) => vid.site === "YouTube"
  );

  const director = movie?.credits?.crew.find(person => person.job === "Director");
  
  const cast = movie?.credits?.cast.slice(0, 6);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Fade in={!loading}>
      <Box sx={{ mt: 2, mb: 6 }}>
        <Box sx={{ 
          position: 'relative', 
          height: { xs: 300, sm: 400, md: 500 }, 
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 6
        }}>
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${IMAGE_BASE_URL}${movie?.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
            }
          }} />
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: { xs: 2, sm: 4 },
            color: 'white'
          }}>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
            }}>
              {movie?.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
              {movie?.genres.map((genre) => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    backdropFilter: 'blur(5px)'
                  }} 
                />
              ))}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating 
                  value={movie?.vote_average / 2} 
                  precision={0.5} 
                  readOnly 
                  size={isMobile ? 'small' : 'medium'} 
                />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                  {movie?.vote_average.toFixed(1)}/10
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                {new Date(movie?.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
              
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                {movie?.runtime} min
              </Typography>
            </Box>
            
            {trailer && (
              <Button 
                variant="contained" 
                color="error"
                startIcon={<PlayArrow />}
                onClick={() => setPlayTrailer(true)}
                sx={{ 
                  mt: 2,
                  borderRadius: 6,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1
                }}
              >
                Watch Trailer
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Trailer Dialog */}
        <Dialog
          open={playTrailer && !!trailer}
          onClose={() => setPlayTrailer(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2
          }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {trailer?.name || "Movie Trailer"}
            </Typography>
            <IconButton 
              aria-label="close" 
              onClick={() => setPlayTrailer(false)} 
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, bgcolor: 'black' }}>
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
              <iframe
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                src={`https://www.youtube.com/embed/${trailer?.key}?autoplay=1&rel=0`}
                title="YouTube trailer"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </Box>
          </DialogContent>
        </Dialog>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie?.overview || "No overview available."}
              </Typography>
              
              {director && (
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Director: <span style={{ fontWeight: 'bold' }}>{director.name}</span>
                </Typography>
              )}
            </Paper>
            
            {cast && cast.length > 0 && (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Cast
                </Typography>
                <Grid container spacing={2}>
                  {cast.map(person => (
                    <Grid item xs={6} sm={4} key={person.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                          component="img"
                          src={person.profile_path 
                            ? `${IMAGE_BASE_URL}${person.profile_path}`
                            : 'https://via.placeholder.com/50x50?text=Actor'
                          }
                          alt={person.name}
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: '50%',
                            mr: 1,
                            objectFit: 'cover'
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {person.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {person.character}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
            
            {!trailer && (
              <Paper elevation={2} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Trailer
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No trailer available for this movie.
                </Typography>
              </Paper>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Movie Info
              </Typography>
              
              <Box sx={{ '& > div': { py: 1.5, borderBottom: '1px solid', borderColor: 'divider' } }}>
                {movie?.budget > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney fontSize="small" sx={{ mr: 1 }} /> Budget
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(movie.budget)}
                    </Typography>
                  </Box>
                )}
                
                {movie?.revenue > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney fontSize="small" sx={{ mr: 1 }} /> Revenue
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(movie.revenue)}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language fontSize="small" sx={{ mr: 1 }} /> Original Language
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {movie?.original_language?.toUpperCase() || 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={movie?.status} 
                    size="small" 
                    color={movie?.status === 'Released' ? 'success' : 'default'}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Popularity</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {movie?.popularity.toFixed(1)} points
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Vote Count</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {movie?.vote_count.toLocaleString()} votes
                  </Typography>
                </Box>
              </Box>
              
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                startIcon={<FavoriteBorder />}
                sx={{ 
                  mt: 3, 
                  borderRadius: 6, 
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Add to Favorites
              </Button>
            </Paper>
            
            {movie?.production_companies?.length > 0 && (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Production
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {movie.production_companies.slice(0, 3).map(company => (
                    <Box key={company.id} sx={{ display: 'flex', alignItems: 'center' }}>
                      {company.logo_path ? (
                        <Box 
                          component="img"
                          src={`${IMAGE_BASE_URL}${company.logo_path}`}
                          alt={company.name}
                          sx={{ 
                            height: 30, 
                            maxWidth: 80, 
                            mr: 2,
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <Box sx={{ 
                          width: 60, 
                          height: 30, 
                          mr: 2, 
                          bgcolor: 'grey.200', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1
                        }}>
                          <Typography variant="caption">No logo</Typography>
                        </Box>
                      )}
                      <Typography variant="body2">{company.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

export default MovieDetails;
