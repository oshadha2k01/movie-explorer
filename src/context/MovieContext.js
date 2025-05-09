import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, API_KEY } from "../constants";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrendingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });
  const [filters, setFilters] = useState({ genre: "", year: "", rating: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeWindow, setTimeWindow] = useState("week"); // 'day' or 'week'
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("movieAppUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("movieAppUser")
  );
  const [favorites, setFavorites] = useState(() => {
    // If a user is logged in, load their specific favorites
    if (user && user.username) {
      const userFavorites = localStorage.getItem(`favorites_${user.username}`);
      return userFavorites ? JSON.parse(userFavorites) : [];
    }
    return [];
  });

  // Load last search from user-specific localStorage or empty string
  const [lastSearch, setLastSearch] = useState(() => {
    if (user && user.username) {
      return localStorage.getItem(`lastSearch_${user.username}`) || '';
    }
    return '';
  });

  useEffect(() => {
    if (user && user.username) {
      localStorage.setItem(
        `favorites_${user.username}`,
        JSON.stringify(favorites)
      );
    }
  }, [favorites, user]);

  // Save last search to user-specific localStorage
  useEffect(() => {
    if (user && user.username && lastSearch) {
      localStorage.setItem(`lastSearch_${user.username}`, lastSearch);
    }
  }, [lastSearch, user]);

  const searchMovies = async (query, pageNum = 1, appliedFilters = filters) => {
    if (!query || query.trim() === "") return;

    setIsLoading(true);
    setError(null);

    try {
      // Use the same API key approach as your successful fetchTrending function
      const apiKey = process.env.REACT_APP_TMDB_API_KEY || API_KEY;

      const params = {
        api_key: apiKey,
        query: query.trim(),
        page: pageNum,
        include_adult: false,
      };

      // Only add filter params if they have values
      if (appliedFilters.genre && appliedFilters.genre !== "")
        params.with_genres = appliedFilters.genre;
      if (appliedFilters.year && appliedFilters.year !== "")
        params.primary_release_year = appliedFilters.year;
      if (appliedFilters.rating && appliedFilters.rating !== "")
        params["vote_average.gte"] = appliedFilters.rating;

      console.log(`Searching for "${query}" (page ${pageNum})`);

      // Make direct URL construction to match your working fetchTrending approach
      const url = `${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query.trim()
      )}&page=${pageNum}`;
      const response = await axios.get(url);

      if (response.data && response.data.results) {
        console.log(`Search found ${response.data.results.length} results`);
        setMovies(response.data.results);
        setLastSearch(query);
        setPage(pageNum);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error searching movies:", error);

      // Improved error messaging
      if (error.response && error.response.status === 401) {
        setError("API key authentication failed. Please check your API key.");
      } else if (error.response) {
        setError(
          `Search failed: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(`Search error: ${error.message}`);
      }

      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrending = async (
    customFilters = null,
    selectedTimeWindow = null
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const activeFilters = customFilters || filters;
      const activeTimeWindow = selectedTimeWindow || timeWindow;
      console.log(
        `Fetching trending for time window: ${activeTimeWindow} with filters:`,
        activeFilters
      );

      // First, get the trending movies without filters
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const response = await axios.get(
        `${BASE_URL}/trending/movie/${activeTimeWindow}?api_key=${apiKey}`
      );

      if (!response.data || !response.data.results) {
        throw new Error("Invalid API response");
      }

      // Log the initial results count
      let results = response.data.results;
      const totalBeforeFilter = results.length;
      console.log(
        `Retrieved ${totalBeforeFilter} trending movies before filtering`
      );

      // Apply genre filter
      if (activeFilters.genre && activeFilters.genre !== "") {
        const genreId = parseInt(activeFilters.genre, 10); // Ensure it's a number
        console.log(`Filtering by genre ID: ${genreId}`);

        results = results.filter((movie) => {
          // Make sure genre_ids exists and is an array
          if (!movie.genre_ids || !Array.isArray(movie.genre_ids)) {
            console.log(`Movie ${movie.id} has no genre_ids array`);
            return false;
          }

          const hasGenre = movie.genre_ids.includes(genreId);
          if (!hasGenre) {
            console.log(
              `Movie ${movie.id} (${
                movie.title
              }) genres [${movie.genre_ids.join(
                ","
              )}] doesn't include ${genreId}`
            );
          }
          return hasGenre;
        });

        console.log(`After genre filter: ${results.length} movies remain`);
      }

      // Apply year filter
      if (activeFilters.year && activeFilters.year !== "") {
        const year = parseInt(activeFilters.year, 10);
        console.log(`Filtering by year: ${year}`);

        results = results.filter((movie) => {
          if (!movie.release_date) {
            console.log(`Movie ${movie.id} has no release date`);
            return false;
          }

          const releaseYear = new Date(movie.release_date).getFullYear();
          const matches = releaseYear === year;
          if (!matches) {
            console.log(
              `Movie ${movie.id} (${movie.title}) year ${releaseYear} doesn't match ${year}`
            );
          }
          return matches;
        });

        console.log(`After year filter: ${results.length} movies remain`);
      }

      // Apply rating filter
      if (activeFilters.rating && activeFilters.rating !== "") {
        const minRating = parseFloat(activeFilters.rating);
        console.log(`Filtering by minimum rating: ${minRating}`);

        results = results.filter((movie) => {
          const hasMinRating = movie.vote_average >= minRating;
          if (!hasMinRating) {
            console.log(
              `Movie ${movie.id} (${movie.title}) rating ${movie.vote_average} is below ${minRating}`
            );
          }
          return hasMinRating;
        });

        console.log(`After rating filter: ${results.length} movies remain`);
      }

      console.log(
        `Filtered trending from ${totalBeforeFilter} to ${results.length} movies`
      );

      if (
        results.length === 0 &&
        Object.values(activeFilters).some((val) => val !== "")
      ) {
        setError(
          "No movies match your filter criteria. Try different filters."
        );
      }

      setTrendingMovies(results);
    } catch (error) {
      console.error("Error fetching trending:", error);
      setError(
        "Failed to fetch trending movies: " + (error.message || "Unknown error")
      );
      setTrendingMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (movie) => {
    // Only allow toggling favorites if a user is logged in
    if (!user) return;

    setFavorites((prev) =>
      prev.some((fav) => fav.id === movie.id)
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, movie]
    );
  };

  const login = (username, password) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("movieAppUsers") || "[]");
      
      // Find the user in the stored users array
      const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      
      if (user) {
        // Create user data object
        const userData = { username: user.username };
        
        // Update context state
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user data in localStorage
        localStorage.setItem("movieAppUser", JSON.stringify(userData));
        
        // Load user's favorites
        const userFavorites = localStorage.getItem(`favorites_${user.username}`);
        setFavorites(userFavorites ? JSON.parse(userFavorites) : []);
        
        // Load user-specific search history
        const userLastSearch = localStorage.getItem(`lastSearch_${username}`);
        if (userLastSearch) {
          setLastSearch(userLastSearch);
        } else {
          setLastSearch(''); // Clear last search if new user has none
        }
        
        // Log for debugging
        console.log("Login successful, user authenticated:", userData);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear user data
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("movieAppUser");

    // Clear favorites when logging out
    setFavorites([]);

    // Clear last search when logging out
    setLastSearch('');
  };

  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      console.log(`Theme changed from ${prevMode} to ${newMode}`);
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const toggleTimeWindow = () => {
    const newTimeWindow = timeWindow === "day" ? "week" : "day";
    setTimeWindow(newTimeWindow);
    fetchTrending(filters, newTimeWindow);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        trending,
        favorites,
        lastSearch,
        page,
        user,
        isAuthenticated,
        themeMode,
        filters,
        timeWindow,
        searchMovies,
        fetchTrending,
        toggleFavorite,
        login,
        logout,
        toggleTheme,
        toggleTimeWindow,
        setPage,
        setFilters,
        isLoading,
        error,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
