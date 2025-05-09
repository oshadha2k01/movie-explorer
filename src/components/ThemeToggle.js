import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function ThemeToggle() {
  const { themeMode, toggleTheme } = useContext(MovieContext);

  const handleToggle = () => {
    console.log("Toggle theme clicked. Current theme:", themeMode);
    toggleTheme();
  };

  return (
    <Tooltip
      title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
    >
      <IconButton onClick={handleToggle} color="inherit">
        {themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
