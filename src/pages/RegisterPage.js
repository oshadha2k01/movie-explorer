import React from "react";
import Register from "../components/Register";
import { Box, Typography } from "@mui/material";

function RegisterPage() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        p: 2
      }}
    >
      <Box sx={{ maxWidth: 500, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Create Account
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Join Movie Explorer to discover and save your favorite movies
        </Typography>
        
        <Register />
      </Box>
    </Box>
  );
}

export default RegisterPage;
