import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

const UserSettings = () => {
  const [settings, setSettings] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    notifications: true,
    darkMode: localStorage.getItem("darkMode") === "true" || false,
    language: "English",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Apply background color based on darkMode
  useEffect(() => {
    document.body.style.backgroundColor = settings.darkMode ? "#121212" : "#f5f5f5";
    document.body.style.color = settings.darkMode ? "#fff" : "#000";
  }, [settings.darkMode]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    // Save darkMode in localStorage to persist
    if (key === "darkMode") {
      localStorage.setItem("darkMode", updated.darkMode);
    }
  };

  const handleSave = () => {
    console.log("✅ Updated Settings:", settings);
    setOpenSnackbar(true);
    localStorage.setItem("userSettings", JSON.stringify(settings));
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "0 auto", mt: 4, p: 2 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#FFD700",
          mb: 3,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        ⚙️ User Settings
      </Typography>

      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          background: settings.darkMode
            ? "rgba(30,30,30,0.7)"
            : "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          transition: "0.3s all",
          "&:hover": { transform: "scale(1.01)" },
        }}
      >
        {/* Account Info */}
        <Typography
          variant="h6"
          sx={{ mb: 2, borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 1 }}
        >
          Account Information
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={settings.fullName}
          onChange={handleChange}
          variant="outlined"
          sx={{
            mb: 2,
            input: { color: "#fff" },
            "& label": { color: "#aaa" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "#FFD700" },
              "&.Mui-focused fieldset": { borderColor: "#FFD700" },
            },
          }}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={settings.email}
          onChange={handleChange}
          variant="outlined"
          sx={{
            mb: 3,
            input: { color: "#fff" },
            "& label": { color: "#aaa" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "#FFD700" },
              "&.Mui-focused fieldset": { borderColor: "#FFD700" },
            },
          }}
        />

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 3 }} />

        {/* Preferences */}
        <Typography
          variant="h6"
          sx={{ mb: 2, borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 1 }}
        >
          Preferences
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications}
              onChange={() => handleToggle("notifications")}
              sx={{
                "& .MuiSwitch-thumb": { backgroundColor: "#FFD700" },
                "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
            />
          }
          label="Enable Notifications"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.darkMode}
              onChange={() => handleToggle("darkMode")}
              sx={{
                "& .MuiSwitch-thumb": { backgroundColor: "#FFD700" },
                "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
            />
          }
          label="Dark Mode"
        />

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 3 }} />

        {/* Language */}
        <Typography
          variant="h6"
          sx={{ mb: 2, borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 1 }}
        >
          Language
        </Typography>

        <TextField
          fullWidth
          select
          label="Preferred Language"
          name="language"
          value={settings.language}
          onChange={handleChange}
          SelectProps={{ native: true }}
          sx={{
            mb: 3,
            color: "#fff",
            "& select": { color: "#fff", backgroundColor: "rgba(255,255,255,0.05)" },
            "& label": { color: "#aaa" },
            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
            "&:hover fieldset": { borderColor: "#FFD700" },
          }}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </TextField>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: "#FFD700",
            color: "#000",
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": { backgroundColor: "#FFC300" },
          }}
        >
          Save Settings
        </Button>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          ✅ Settings updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSettings;
