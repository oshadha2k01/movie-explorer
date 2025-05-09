import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import ThemeToggle from './ThemeToggle';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useContext(MovieContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFavoritesClick = () => {
    navigate('/favorites');
    if (isMobile) setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
    if (isMobile) setDrawerOpen(false);
  };

  const handleSearchClick = () => {
    navigate('/search');
    if (isMobile) setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Mobile drawer content
  const mobileDrawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {isAuthenticated && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'secondary.main' }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1">Hi, {user?.username?.includes('@') 
            ? user.username.split('@')[0] 
            : user?.username
          }</Typography>
        </Box>
      )}
      
      <List>
        <ListItem button onClick={handleHomeClick}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        
        <ListItem button onClick={handleSearchClick}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem>
        
        {isAuthenticated && (
          <>
            <ListItem button onClick={handleFavoritesClick}>
              <ListItemIcon><FavoriteIcon /></ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
            
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={3}
      sx={{ 
        top: 0, 
        zIndex: theme.zIndex.drawer + 1,
        mb: 2
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* App title - always visible */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}
        >
          Movie Explorer
        </Typography>

        {/* Mobile view - hamburger menu */}
        {isMobile ? (
          <Box>
            <ThemeToggle />
            {isAuthenticated && (
              <IconButton 
                color="inherit" 
                edge="end" 
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {mobileDrawer}
            </Drawer>
          </Box>
        ) : (
          /* Desktop view - horizontal buttons */
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && (
              <>
                <Button 
                  color="inherit" 
                  onClick={handleFavoritesClick}
                  startIcon={<FavoriteIcon />}
                  sx={{ 
                    mr: 2,
                    borderRadius: 6,
                    px: 2,
                    py: 0.8,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Favorites
                </Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Hi, {user?.username?.includes('@') 
                      ? user.username.split('@')[0]
                      : user?.username
                    }
                  </Typography>
                </Box>
                
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    mr: 2,
                    borderRadius: 6,
                    px: 2,
                    py: 0.8,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            )}
            <ThemeToggle />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
