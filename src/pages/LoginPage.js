import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import { MovieContext } from "../context/MovieContext";
import { Box, Typography, Paper } from "@mui/material";

function LoginPage() {
  const { isAuthenticated } = useContext(MovieContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already logged in
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 450, width: "100%"}}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Movie Explorer
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Sign in to explore trending movies and manage your favorites
        </Typography>
        <Login />
      </Paper>
    </Box>
  );
}

export default LoginPage;
