import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import { TextField, Button, Box, Alert, CircularProgress } from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(MovieContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const success = login(username, password);

      if (success) {
        // Store login info in localStorage
        localStorage.setItem("movieAppUser", JSON.stringify({ username }));
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
        autoFocus
      />

      <TextField
        label="Password"
        fullWidth
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Sign In"}
      </Button>
    </Box>
  );
}

export default Login;
