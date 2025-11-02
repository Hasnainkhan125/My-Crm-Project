import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  useTheme,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Tooltip,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Profile = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const storedData = JSON.parse(localStorage.getItem("profileData")) || {};
  const [formData, setFormData] = useState({
    name: storedData.name || user?.name || "HK",
    email: storedData.email || user?.email || "johndoe@example.com",
    role: storedData.role || user?.role || "Admin",
  });
  const [profilePic, setProfilePic] = useState(
    storedData.dp || user?.dp || "../../assets/user.png"
  );
  const [resumeFile, setResumeFile] = useState(storedData.resume || null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const verified = !!resumeFile; // ✅ Verified if resume uploaded

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeFile({ name: file.name, data: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      const newProfile = { ...formData, dp: profilePic, resume: resumeFile };
      localStorage.setItem("profileData", JSON.stringify(newProfile));
      setLoading(false);
      setOpenSnackbar(true);
      window.dispatchEvent(new Event("profileUpdated"));
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem("profileData");
    setFormData({
      name: "HK",
      email: "johndoe@example.com",
      role: "Unverified",
    });
    setProfilePic("../../assets/user.png");
    setResumeFile(null);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // 🎨 Role-based color mapping
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "#e90606ff";
      case "Manager":
        return "#42A5F5";
      case "Controller":
        return "#FFB300";
      case "User":
        return "#66BB6A";
      default:
        return colors.grey[300];
    }
  };

  const roleColor = getRoleColor(formData.role);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[400]})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: isMobile ? 2 : 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          minHeight: "75vh",
          borderRadius: 4,
          display: "flex",
          flexDirection: isTablet ? "column" : "row",
          gap: 4,
          p: isMobile ? 2 : 4,
          background: "#071d01ffx",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            flex: isTablet ? "1" : "0 0 300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            position="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{ mb: 2 }}
          >
            <Avatar
              src={profilePic}
              alt={formData.name}
              sx={{
                width: isMobile ? 100 : 140,
                height: isMobile ? 100 : 140,
                border: `4px solid ${verified ? roleColor : colors.redAccent[400]}`,
                boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
              }}
            />
            <Fade in={hover}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="Change Profile Picture" arrow>
                  <IconButton component="label">
                    <PhotoCameraIcon sx={{ color: "white", fontSize: 26 }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          </Box>

          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color={colors.grey[100]}>
            {formData.name}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: verified ? roleColor : colors.redAccent[400], fontWeight: "bold" }}
          >
            {verified ? formData.role : "Unverified"}
          </Typography>

          {/* Verified Badge */}
          <Box
            sx={{
              mt: 2,
              px: 3,
              py: 1,
              borderRadius: "30px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
              color: verified ? "#fff" : colors.redAccent[400],
              background: verified ? roleColor : "rgba(255,255,255,0.1)",
              border: verified ? "none" : `1px solid ${colors.redAccent[400]}`,
            }}
          >
            {verified ? (
              <>
                <CheckCircleIcon sx={{ color: "#fff", fontSize: 20 }} />
                Verified User
              </>
            ) : (
              <>
                <ErrorIcon sx={{ color: colors.redAccent[400], fontSize: 20 }} />
                Unverified User
              </>
            )}
          </Box>

          <Divider sx={{ my: 3, width: "80%", borderColor: "rgba(255,255,255,0.1)" }} />
   
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={3}>
            Edit Profile
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" name="name" variant="filled" value={formData.name} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Email" name="email" variant="filled" value={formData.email} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Role</InputLabel>
                <Select name="role" value={formData.role} onChange={handleChange}>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Controller">Controller</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload Resume
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              </Button>
              {resumeFile && (
                <Typography sx={{ mt: 1, color: colors.greenAccent[400] }}>
                  Uploaded: {resumeFile.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClear} color="error">
              Reset
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          ✅ Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
