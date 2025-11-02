import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showLoader, setShowLoader] = useState(true);

  // ✅ Show loader for 2.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!email || !newPassword || !confirmPassword) {
      setSnackbar({
        open: true,
        message: "All fields are required!",
        severity: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const stored = localStorage.getItem("team-members");
      let users = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(users)) users = [users];

      const userIndex = users.findIndex(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      );

      if (userIndex === -1) {
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Email is not registered!",
          severity: "error",
        });
        return;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem("team-members", JSON.stringify(users));

      setLoading(false);
      setSnackbar({
        open: true,
        message: "Password reset successfully!",
        severity: "success",
      });

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 1500);
    }, 1000);
  };

  // ✅ Animated Loading Screen (same as Login page)
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
        {/* Glowing circular spinner */}
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
          Loading  Please ...
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
                  Please wait while we prepare your Forgotpassword ...
                </Typography>
      </Box>
    );
  }

  // ✅ Forgot Password Main Page
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       background:
          "linear-gradient(135deg, #0d001cff 0%, #0d001cff 50%, #0d001cff 100%)",
        padding: 3,
      }}
    >
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 6,
            width: "420px",
            maxWidth: "90%",
            background: "rgba(37, 1, 49, 0.45)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(16px)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
            sx={{
              background: "linear-gradient(90deg, #ffffffff, #e5e2e2ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🔒 Reset Password
          </Typography>

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                "&:hover fieldset": { borderColor: "#ffb300" },
                "&.Mui-focused fieldset": { borderColor: "#ffb300" },
              },
              "& .MuiInputLabel-root": { color: "#ccc" },
              "& input": { color: "#fff" },
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#ffb300" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", color: "#fff" },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                "&:hover fieldset": { borderColor: "#ffb300" },
                "&.Mui-focused fieldset": { borderColor: "#ffb300" },
              },
              "& .MuiInputLabel-root": { color: "#ccc" },
              "& input": { color: "#fff" },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#ffb300" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: "12px", color: "#fff" },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                "&:hover fieldset": { borderColor: "#ffb300" },
                "&.Mui-focused fieldset": { borderColor: "#ffb300" },
              },
              "& .MuiInputLabel-root": { color: "#ccc" },
              "& input": { color: "#fff" },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.6,
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              background: "linear-gradient(90deg, #ffb300, #ffb300)",
              color: "#ffffffff",
              boxShadow: "0px 4px 15px rgba(255,179,0,0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #ffc107, #ffb300)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={26} sx={{ color: "#e5e2e2ff" }} />
            ) : (
              "Reset Password"
            )}
          </Button>

          <Button
            onClick={() => navigate("/login")}
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: "600",
              color: "#9e9e9eff",
              fontSize: "0.95rem",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            ← Back to Login
          </Button>
        </Paper>
      </Fade>

      {/* ✅ Snackbar Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
