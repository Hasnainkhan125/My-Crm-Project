import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter state
  const [filter, setFilter] = useState("monthly");

  // Convert mock data (Nivo style) → ApexCharts format
  const rawSeries = data.map((serie) => ({
    name: serie.id,
    data: serie.data.map((point) => ({ x: point.x, y: point.y })),
  }));

  // Function to simulate filtered data
  const filteredSeries = useMemo(() => {
    switch (filter) {
      case "daily":
        return rawSeries.map((serie) => ({
          ...serie,
          data: serie.data.slice(-7), // last 7 entries
        }));
      case "weekly":
        return rawSeries.map((serie) => ({
          ...serie,
          data: serie.data.filter((_, i) => i % 4 === 0), // 1 point per 4
        }));
      case "monthly":
        return rawSeries; // full data
      case "yearly":
        return rawSeries.map((serie) => ({
          ...serie,
          data: serie.data.filter((_, i) => i % 10 === 0), // sample every 10
        }));
      default:
        return rawSeries;
    }
  }, [filter, rawSeries]);

  const categories = filteredSeries[0]?.data.map((point) => point.x) || [];

  const series = filteredSeries.map((serie) => ({
    name: serie.name,
    data: serie.data.map((p) => p.y),
  }));

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: colors.grey[100],
    },
    colors: isDashboard
      ? data.map((d) => d.color || colors.primary[500])
      : undefined,
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: colors.primary[500],
      strokeWidth: 2,
    },
    xaxis: {
      categories,
      title: {
        text: isDashboard ? undefined : "Timeline",
        style: { color: colors.grey[100] },
      },
      labels: { style: { colors: colors.grey[100] } },
      axisBorder: { show: true, color: colors.grey[100] },
      axisTicks: { show: true, color: colors.grey[100] },
    },
    yaxis: {
      title: {
        text: isDashboard ? undefined : "Count",
        style: { color: colors.grey[100] },
      },
      labels: { style: { colors: colors.grey[100] } },
    },
    grid: { show: false },
    tooltip: { theme: theme.palette.mode },
    legend: {
      position: "bottom",
      horizontalAlign: "right",
      labels: { colors: colors.grey[100] },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#0d001cff" : "#fff",
        borderRadius: 2,
        p: 2,
        boxShadow: 2,
      }}
    >
      {/* Header with filter */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Performance Overview</Typography>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Chart options={options} series={series} type="line" height={250} />
    </Box>
  );
};

export default LineChart;
