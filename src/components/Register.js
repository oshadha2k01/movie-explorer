import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Paper,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Field-specific validation states
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Track which fields have been touched
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });

  // Validate username
  const validateUsername = (value) => {
    if (!value.trim()) {
      return "Username or email is required";
    }

    // Check for special characters (only @ and . are allowed)
    const containsSpecialChars = /[^a-zA-Z0-9@.]/.test(value);
    if (containsSpecialChars) {
      return "Only letters, numbers, @, and . are allowed";
    }

    // Check if it's an email format
    const isEmail = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(value);

    if (isEmail) {
      // Email-specific validations
      if (value.length > 254) {
        return "Email is too long (max 254 characters)";
      }
      if (!/[a-zA-Z0-9]/.test(value.split("@")[0])) {
        return "Email local part must contain at least one letter or number";
      }
      return "";
    } else {
      // Username-specific validations (alphanumeric and .)
      const alphanumericAndDot = /^[a-zA-Z0-9.]+$/.test(value);
      if (!alphanumericAndDot) {
        return "Username can only contain letters, numbers, and .";
      }
      if (value.length < 3) {
        return "Username must be at least 3 characters";
      }
      if (value.length > 20) {
        return "Username must be less than 20 characters";
      }
      return "";
    }
  };

  // Validate password
  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (value) => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle key press to block special characters except @ and .
  const handleUsernameKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Enter",
      "Home",
      "End",
    ];
    const isLetterOrNumber = /[a-zA-Z0-9]/.test(e.key);
    const isAtSymbol = e.key === "@";
    const isDot = e.key === "."; // Allow dot character
    const isControlKey = allowedKeys.includes(e.key);
    const isModifierKey = e.ctrlKey || e.metaKey || e.altKey;

    if (!isLetterOrNumber && !isAtSymbol && !isDot && !isControlKey && !isModifierKey) {
      e.preventDefault();
    }
  };

  // Handle field change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update respective state
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    // Validate field
    let error = "";
    if (name === "username") error = validateUsername(value);
    if (name === "password") error = validatePassword(value);
    if (name === "confirmPassword") error = validateConfirmPassword(value);

    // Update error state
    setErrors({
      ...errors,
      [name]: error,
    });

    // Clear general error on input change
    setError("");
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // Update confirm password validation when password changes
  useEffect(() => {
    if (touched.confirmPassword && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(confirmPassword),
      }));
    }
  }, [password, confirmPassword, touched.confirmPassword]);

  // Check if form is valid
  const isFormValid = () => {
    return (
      !errors.username &&
      !errors.password &&
      !errors.confirmPassword &&
      username &&
      password &&
      confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    // Update error states
    setErrors({
      username: usernameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // Stop if any validation errors
    if (usernameError || passwordError || confirmPasswordError) {
      setError("Please correct all fields before submitting");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem("movieAppUsers") || "[]");

      // Check if username already exists
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
      if (
        existingUsers.some((user) => user.username.toLowerCase() === username.toLowerCase())
      ) {
        setError(isEmail ? "This email is already registered" : "This username is already taken");
        setIsLoading(false);
        return;
      }

      // Add new user
      const newUser = { username, password };
      existingUsers.push(newUser);
      localStorage.setItem("movieAppUsers", JSON.stringify(existingUsers));

      // Show success notification
      toast.success("Registration successful! You can now log in.", {
        position: "top-center",
        autoClose: 3000,
      });

      // Navigate to login page
      setTimeout(() => {
        navigate("/login", { state: { registeredUsername: username } });
      }, 1000);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)"
            : "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Fade in={!!error}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { fontSize: "1.2rem" },
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        <TextField
          label="Username/Email"
          name="username"
          fullWidth
          value={username}
          onChange={handleChange}
          onKeyDown={handleUsernameKeyDown}
          onBlur={handleBlur}
          margin="normal"
          required
          autoFocus
          error={touched.username && !!errors.username}
          helperText={
            touched.username && errors.username
              ? errors.username
              : username
              ? "Use letters, numbers, @, or . only, or enter a valid email"
              : "Enter a username or email (only @ and . allowed for emails)"
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color={touched.username && errors.username ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: username && !errors.username ? (
              <InputAdornment position="end">
                <CheckCircle color="success" />
              </InputAdornment>
            ) : null,
            sx: { borderRadius: 2 },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: "error.main",
                borderWidth: 2,
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) => theme.palette.primary.main,
                },
              },
            },
          }}
        />

        <TextField
          label="Password"
          name="password"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          onBlur={handleBlur}
          margin="normal"
          required
          error={touched.password && !!errors.password}
          helperText={
            touched.password && errors.password
              ? errors.password
              : "Password must be at least 6 characters"
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color={touched.password && errors.password ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {password && !errors.password && (
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                )}
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: "error.main",
                borderWidth: 2,
              },
            },
          }}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          margin="normal"
          required
          error={touched.confirmPassword && !!errors.confirmPassword}
          helperText={
            touched.confirmPassword && errors.confirmPassword
              ? errors.confirmPassword
              : "Re-enter your password to confirm"
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color={touched.confirmPassword && errors.confirmPassword ? "error" : "action"} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {confirmPassword && !errors.confirmPassword && (
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                )}
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: "error.main",
                borderWidth: 2,
              },
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            mb: 2,
            borderRadius: 8,
            py: 1.5,
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: 3,
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: 6,
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            },
            "&:active": {
              transform: "translateY(1px)",
              boxShadow: 2,
            },
            "&:disabled": {
              background: (theme) => theme.palette.action.disabledBackground,
            },
          }}
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? <CircularProgress size={24} /> : "Create Account"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{
                fontWeight: "bold",
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default Register;