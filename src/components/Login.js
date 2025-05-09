import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from "@mui/icons-material";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const { login } = useContext(MovieContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registeredUsername) {
      setUsername(location.state.registeredUsername);
    }
  }, [location]);

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

  const validatePassword = (value) => {
    if (!value.trim()) {
      return "Password is required";
    }
    return "";
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);

    let errorMessage = "";
    if (name === "username") errorMessage = validateUsername(value);
    if (name === "password") errorMessage = validatePassword(value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const isFormValid = () => {
    return !errors.username && !errors.password && username && password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      username: true,
      password: true,
    });

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    setErrors({
      username: usernameError,
      password: passwordError,
    });

    if (usernameError || passwordError) {
      setError("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem("movieAppUsers") || "[]");
      const user = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password === password
      );

      if (user) {
        const loginSuccess = login(username, password);

        if (loginSuccess) {
          toast.success(`Welcome back, ${user.username}!`, {
            position: "top-center",
            autoClose: 2000,
          });

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        } else {
          setError("Login failed. Please try again.");
          toast.error("Login failed. Something went wrong.", {
            position: "top-center",
          });
        }
      } else {
        setError("Invalid username or password");
        toast.error("Login failed. Please check your credentials.", {
          position: "top-center",
        });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
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
                "& .MuiAlert-icon": {
                  fontSize: "1.5rem",
                },
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
              : "Enter a username or email (only @ and . allowed)"
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person
                  color={touched.username && errors.username ? "error" : "action"}
                />
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
              : "Enter your password"
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock
                  color={touched.password && errors.password ? "error" : "action"}
                />
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
          {isLoading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
              sx={{
                fontWeight: "bold",
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default Login;