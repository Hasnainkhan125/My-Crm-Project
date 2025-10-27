import { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  useTheme,
  Fade,
} from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";

const Line = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [filter, setFilter] = useState("monthly");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Fake data variations for demo
  const dataMap = {
    weekly: [
      { day: "Mon", value: 120 },
      { day: "Tue", value: 200 },
      { day: "Wed", value: 150 },
      { day: "Thu", value: 280 },
      { day: "Fri", value: 100 },
      { day: "Sat", value: 90 },
      { day: "Sun", value: 130 },
    ],
    monthly: [
      { day: "Week 1", value: 400 },
      { day: "Week 2", value: 600 },
      { day: "Week 3", value: 800 },
      { day: "Week 4", value: 500 },
    ],
    yearly: [
      { day: "Jan", value: 3200 },
      { day: "Feb", value: 4200 },
      { day: "Mar", value: 3100 },
      { day: "Apr", value: 5000 },
      { day: "May", value: 3800 },
      { day: "Jun", value: 4600 },
      { day: "Jul", value: 5400 },
      { day: "Aug", value: 6200 },
      { day: "Sep", value: 4700 },
      { day: "Oct", value: 5800 },
      { day: "Nov", value: 4900 },
      { day: "Dec", value: 7000 },
    ],
  };

  return (
    <Box m="20px">
      <Header title="LINE CHART" subtitle="Sales Growth Overview" />

      {/* Filter Dropdown */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        mt={2}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          color={colors.greenAccent[500]}
        >
          📊 Showing: {filter.charAt(0).toUpperCase() + filter.slice(1)} Data
        </Typography>

        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 150,
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
          }}
        >
          <InputLabel sx={{ color: colors.grey[100] }}>Filter</InputLabel>
          <Select
            value={filter}
            onChange={handleFilterChange}
            label="Filter"
            sx={{
              color: colors.grey[100],
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: colors.greenAccent[400],
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.greenAccent[300],
              },
              "& .MuiSvgIcon-root": {
                color: colors.greenAccent[400],
              },
            }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Line Chart */}
      <Box
        height="70vh"
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        p="20px"
      >
        <Fade in={true} timeout={800}>
          <div>
            <LineChart data={dataMap[filter]} isDashboard={false} />
          </div>
        </Fade>
      </Box>
    </Box>
  );
};

export default Line;
