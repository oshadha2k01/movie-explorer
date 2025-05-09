import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MovieProvider } from './context/MovieContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <MovieProvider>
      <App />
    </MovieProvider>
  </ThemeProvider>
);