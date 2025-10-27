import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const TEAM_STORAGE_KEY = "team-members";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [rememberError, setRememberError] = useState(false);
  const [, setUsers] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // 🗣️ Voice feedback function
  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Show loader
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Load admin and saved users
  useEffect(() => {
    let savedUsers = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)) || [];
    const adminExists = savedUsers.some((u) => u.email === "admin@gmail.com");
    if (!adminExists) {
      savedUsers.push({
        id: savedUsers.length ? savedUsers[savedUsers.length - 1].id + 1 : 1,
        name: "Admin User",
        age: 30,
        email: "admin@gmail.com",
        password: "admin123",
        access: "admin",
      });
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(savedUsers));
    }
    setUsers(savedUsers);

    const rememberedData = JSON.parse(localStorage.getItem("rememberedUser"));
    const savedVoice = localStorage.getItem("voiceEnabled");
    if (rememberedData) {
      setFormData(rememberedData);
      setRememberMe(true);
    }
    if (savedVoice !== null) {
      setVoiceEnabled(savedVoice === "true");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Login logic
  const handleLogin = () => {
    if (!rememberMe) {
      speak("Please check Remember Me!");
      setRememberError(true);
      return;
    }

    const { email, password } = formData;
    const savedUsers = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)) || [];
    const foundUser = savedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      setLoading(true);
      speak("Login successful!");

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(formData));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      setTimeout(() => {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        setSuccessSnackbar(true);
        setTimeout(() => navigate("/"), 1000);
      }, 2000);
    } else {
      speak("Invalid email or password!");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSuccessSnackbar(false);
    setRememberError(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 🎤 Voice login
  const startVoiceLogin = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      speak("Sorry, your browser does not support voice recognition.");
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    speak("Listening Enabled...");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log("Recognized:", transcript);

      if (transcript.includes("hi")) {
        speak("Voice command recognized. Logging you in...");
        handleLogin();
      } else {
        speak("Voice command not recognized.");
      }
    };

    recognition.onerror = (err) => {
      console.error("Voice recognition error:", err);
      speak("There was an error recognizing your voice.");
    };
  };

  // ✅ Loader UI
  if (showLoader) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
         ckground:
            "radial-gradient(circle at top left, #120126ff, #16012eff, #120126ff)",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{
            opacity: 1,
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "9px solid rgba(255,255,255,0.15)",
            borderTop: "9px solid #ffb300",
            marginBottom: 30,
          }}
        />

        <motion.h2
          style={{
            color: "#fff",
            fontSize: "1.8rem",
            letterSpacing: "2px",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Loading Please ...
        </motion.h2>

        <motion.div
          style={{
            width: "200px",
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "3px",
            marginTop: 20,
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              width: "100%",
              background: "linear-gradient(90deg, #ffb300, #ff9e00)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>

        <Typography
          sx={{
            mt: 3,
            color: "#ccc",
            fontSize: "0.95rem",
            letterSpacing: "1px",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Please wait while we prepare your LoginPage ...
        </Typography>
      </Box>
    );
  }

  // ✅ Main UI
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0d001cff 0%, #0d001cff 50%, #0d001cff 100%)",
        padding: 3,
        position: "relative",
      }}
    >
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 6,
            width: "520px",
            maxWidth: "90%",
            background: "rgba(37, 1, 49, 0.45)", // Black background
            backdropFilter: "blur(16px)",
            color: "#fff", // Text white
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
            sx={{ color: "#fff" }}
          >
            SIGN IN 👋
          </Typography>

          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "#ffb300" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", color: "#fff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "#ffb300" },
                "&:hover fieldset": { borderColor: "#ffb300" },
                "&.Mui-focused fieldset": { borderColor: "#ffb300" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& input": { color: "#fff" },
            }}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#ffb300" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    sx={{ color: "#ffffffff" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", color: "#fff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "#ffb300" },
                "&:hover fieldset": { borderColor: "#ffb300" },
                "&.Mui-focused fieldset": { borderColor: "#ffb300" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& input": { color: "#fff" },
            }}
          />

          {/* 🔊 Small Voice Login Icon */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <IconButton
              onClick={startVoiceLogin}
              sx={{
                position: "fixed",
                right: 20,
                bottom: 40,
                color: "#00d5ffff",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" },
                zIndex: 9999,
              }}
            >
              <VolumeUpIcon />
            </IconButton>
          </Box>

          {/* Remember Me + Forgot Password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
              mb: 3,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: "#ffb300",
                    "&.Mui-checked": { color: "#ffb300" },
                  }}
                />
              }
              label={<Typography sx={{ color: "#fff" }}>Remember Me</Typography>}
            />

            <Typography
              sx={{
                color: "#d1d1d1ff",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline", color: "#fff" },
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Sign In Button */}
          <Button
            fullWidth
            disabled={loading}
            onClick={handleLogin}
            sx={{
              py: 1.6,
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              background: "#ffb300", // Yellow button
              color: "#000",
              "&:hover": {
                background: "#ffc107",
              },
            }}
          >
            {loading ? <CircularProgress size={26} sx={{ color: "#000" }} /> : "Sign In"}
          </Button>

          {/* Social Login */}
          <Typography sx={{ mt: 4, mb: 2, color: "#fff" }}>
            Or continue with
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              startIcon={<GoogleIcon sx={{ color: "#ffffffff" }} />}
              sx={{
                textTransform: "none",
                backgroundColor: "#DB4437",
                width: "120px",
                color: "#fff",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#c33d2e" },
              }}
            >
              Google
            </Button>
            <Button
              startIcon={<GitHubIcon sx={{ color: "#ffffffff" }} />}
              sx={{
                textTransform: "none",
                backgroundColor: "#24292F",
                width: "120px",
                color: "#fff",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#1b1f23" },
              }}
            >
              GitHub
            </Button>
            <Button
              startIcon={<FacebookIcon sx={{ color: "#ffffffff" }} />}
              sx={{
                textTransform: "none",
                backgroundColor: "#1877F2",
                width: "120px",
                color: "#fff",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#145dbf" },
              }}
            >
              Facebook
            </Button>
          </Box>

          {/* Register Link */}
          <Button
            onClick={() => {
              speak("Opening registration page");
              navigate("/register");
            }}
            sx={{
              mt: 3,
              textTransform: "none",
              color: "#d1d1d1ff",
              fontWeight: "600",
              fontSize: "0.95rem",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Don’t have an account? Create one
          </Button>
        </Paper>
      </Fade>

      {/* Snackbars */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          Invalid email or password!
        </Alert>
      </Snackbar>

      <Snackbar
        open={rememberError}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={handleCloseSnackbar}>
          Please check "Remember Me" before login!
        </Alert>
      </Snackbar>

      <Snackbar
        open={successSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
