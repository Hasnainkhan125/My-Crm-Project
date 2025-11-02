import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  Menu,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

const DashboardPro = () => {
  const [filter, setFilter] = useState("Monthly");
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElInbox, setAnchorElInbox] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const salesData = {
    Weekly: [500, 700, 800, 600, 1000, 900, 1200],
    Monthly: [1200, 1500, 1100, 1800, 2300, 1900, 2600],
    Yearly: [15000, 17000, 21000, 24000, 26000, 28000, 30000],
  };
  const salesCategories = {
    Weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    Monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    Yearly: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
  };
  const salesSeries = [{ name: "Total Sales", data: salesData[filter] }];
  const salesOptions = {
    chart: { type: "area", toolbar: { show: false }, animations: { enabled: true } },
    stroke: { curve: "smooth", width: 3, colors: ["#7c3aed"] },
    colors: ["#7c3aed"],
    xaxis: { categories: salesCategories[filter], labels: { style: { colors: "#a3a3a3" } } },
    grid: { borderColor: "rgba(255,255,255,0.05)" },
    tooltip: { theme: "dark", y: { formatter: (val) => `$${val.toLocaleString()}` } },
    fill: { type: "gradient", gradient: { opacityFrom: 0.6, opacityTo: 0.2, stops: [0, 100] } },
  };

  const columnSeries = [
    { name: "2024", data: [40, 55, 45, 70, 60, 80, 90] },
    { name: "2025", data: [50, 65, 55, 85, 75, 95, 110] },
  ];
  const columnOptions = {
    chart: { toolbar: { show: false } },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: { style: { colors: "#a3a3a3", fontSize: "12px" } },
    },
    colors: ["#7c3aed", "#a78bfa"],
    legend: { position: "top", labels: { colors: "#cbd5e1" } },
    grid: { borderColor: "rgba(255,255,255,0.08)" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    tooltip: { theme: "dark" },
  };

  const users = [
    { name: "John Carter", activity: "Purchased Pro Plan", time: "2h ago" },
    { name: "Emily Davis", activity: "Added new project", time: "4h ago" },
    { name: "Michael Lee", activity: "Updated profile", time: "6h ago" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    navigate("/login");
  };

  const handleConnect = () => {
    if (isConnected) return setIsConnected(false);
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const handleSearch = (e) => setSearchValue(e.target.value);
  const openMenu = (setter) => (e) => setter(e.currentTarget);
  const closeMenu = (setter) => () => setter(null);

  return (
    <Box sx={{ bgcolor: "#010018", minHeight: "100vh", p: { xs: 2, md: 3 }, color: "#fff" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          bgcolor: "#0f0229",
          borderRadius: 2,
          p: 2,
          boxShadow: 3,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 800, color: "#a78bfa" }}>
          Dashboard
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            mt: { xs: 1, sm: 0 },
          }}
        >
          <TextField
            placeholder="Search..."
            size="small"
            value={searchValue}
            onChange={handleSearch}
            sx={{
              bgcolor: "#1b063d",
              borderRadius: 5,
              input: { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              width: { xs: "100%", sm: 200, md: 250 },
            }}
          />

          <IconButton color="inherit" onClick={openMenu(setAnchorElSettings)}>
            <SettingsIcon />
          </IconButton>
          <Menu anchorEl={anchorElSettings} open={Boolean(anchorElSettings)} onClose={closeMenu(setAnchorElSettings)}>
            <MenuItem>Account Settings</MenuItem>
            <MenuItem>Dark Mode</MenuItem>
            <MenuItem>System Preferences</MenuItem>
          </Menu>

          <IconButton color="inherit" onClick={openMenu(setAnchorElInbox)}>
            <MailOutlineIcon />
          </IconButton>
          <Menu anchorEl={anchorElInbox} open={Boolean(anchorElInbox)} onClose={closeMenu(setAnchorElInbox)}>
            <MenuItem>
              <ListItemText primary="New message from Alex" secondary="Just now" />
            </MenuItem>
          </Menu>

          <IconButton color="inherit" onClick={openMenu(setAnchorElNotif)}>
            <NotificationsNoneIcon />
          </IconButton>
          <Menu anchorEl={anchorElNotif} open={Boolean(anchorElNotif)} onClose={closeMenu(setAnchorElNotif)}>
            <MenuItem>
              <ListItemText primary="New user registered" secondary="1h ago" />
            </MenuItem>
          </Menu>

          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={isConnecting}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              ml: 1,
              px: 3,
              fontWeight: 600,
              background: isConnected
                ? "linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)"
                : "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
              "&:hover": {
                background: isConnected
                  ? "linear-gradient(90deg, #fb7185 0%, #f43f5e 100%)"
                  : "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 2, textTransform: "none", ml: 1, px: 3, fontWeight: 600, width: { xs: "100%", sm: "auto" } }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* LOADING SCREEN */}
      {isConnecting && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress color="secondary" />
          <Typography sx={{ mt: 2, fontSize: 20, color: "#a78bfa" }}>Connecting...</Typography>
        </Box>
      )}

      {/* DASHBOARD CONTENT */}
      {isConnected && !isConnecting && (
        <>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: "#12063a", color: "#fff" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                mb: 2,
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 20 }}>Total Sales</Typography>
              <Select
                size="small"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#1e0a49",
                  color: "#fff",
                  "& .MuiSelect-icon": { color: "#fff" },
                  width: { xs: "100%", sm: 150 },
                }}
              >
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </Box>
            <Chart options={salesOptions} series={salesSeries} type="area" height={300} />
          </Paper>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#12063a", color: "#fff" }}>
                <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 20 }}>Revenue Comparison</Typography>
                <Chart options={columnOptions} series={columnSeries} type="bar" height={280} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#12063a", color: "#fff" }}>
                <Typography sx={{ mb: 2, fontSize: 20 }}>Sales by Category</Typography>
                <Chart
                  options={{
                    chart: { type: "donut" },
                    labels: ["Electronics", "Clothing", "Home Decor", "Accessories"],
                    colors: ["#9500ff", "#ff5e00", "#ffcc00", "#0055ff"],
                    legend: { position: "bottom", labels: { colors: "#cbd5e1" } },
                    dataLabels: { enabled: true, style: { colors: ["#fff"] } },
                  }}
                  series={[44, 33, 23, 15]}
                  type="donut"
                />
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#12063a", color: "#fff" }}>
            <Typography sx={{ fontWeight: 800, mb: 2, fontSize: 20 }}>Recent User Activity</Typography>
            {users.map((user, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  py: 1.5,
                  borderBottom: i !== users.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {user.activity}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#a3a3a3", fontStyle: "italic" }}>
                  {user.time}
                </Typography>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DashboardPro;
