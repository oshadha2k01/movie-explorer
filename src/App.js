import React, { useContext, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MovieContext } from "./context/MovieContext";
import Home from "./pages/Home";
import MovieDetailPage from "./pages/MovieDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import NavBar from "./components/NavBar";
import RegisterPage from "./pages/RegisterPage";
import {
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles.css";

function App() {
  // Get authentication status and theme preference from global context
  const { isAuthenticated, themeMode } = useContext(MovieContext);

  // Create a theme instance based on the current mode
  // This theme will be applied to all components through ThemeProvider
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          // Light and dark mode colors - these will be deployed to Vercel too
          primary: {
            main: themeMode === "dark" ? "#90caf9" : "#1976d2",
          },
          background: {
            default: themeMode === "dark" ? "#121212" : "#fff",
            paper: themeMode === "dark" ? "#1e1e1e" : "#fff",
          },
        },
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <NavBar />
        <Container>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/search"
              element={
                isAuthenticated ? (
                  <SearchResultsPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/movie/:id"
              element={
                isAuthenticated ? <MovieDetailPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/favorites"
              element={
                isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </Container>
        
        {/* Toast notifications container */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={themeMode}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
