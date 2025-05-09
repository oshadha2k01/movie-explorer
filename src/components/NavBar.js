import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import ThemeToggle from "./ThemeToggle";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useContext(MovieContext);
  const navigate = useNavigate();

  const handleFavoritesClick = () => {
    navigate("/favorites");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: "white", textDecoration: "none" }}
        >
          Movie Explorer
        </Typography>

        {isAuthenticated && (
          <>
            <Button
              color="inherit"
              onClick={handleFavoritesClick}
              startIcon={<FavoriteIcon />}
              sx={{ mr: 2 }}
            >
              Favorites
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
              <Avatar
                sx={{ width: 32, height: 32, mr: 1, bgcolor: "secondary.main" }}
              >
                {user?.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1">Hi, {user?.username}</Typography>
            </Box>

            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </>
        )}

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
