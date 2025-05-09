import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";

const TrendingToggle = () => {
  const { timeWindow, toggleTimeWindow } = useContext(MovieContext);

  const handleChange = () => {
    toggleTimeWindow();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mr: 2 }}>
        Trending Movies
      </Typography>
      <ToggleButtonGroup
        value={timeWindow}
        exclusive
        onChange={handleChange}
        aria-label="trending time window"
        size="small"
      >
        <ToggleButton value="day" aria-label="today">
          <TodayIcon sx={{ mr: 0.5 }} />
          Today
        </ToggleButton>
        <ToggleButton value="week" aria-label="week">
          <DateRangeIcon sx={{ mr: 0.5 }} />
          This Week
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default TrendingToggle;
