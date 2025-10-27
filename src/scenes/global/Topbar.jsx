import {
  Box,
  IconButton,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  alpha,
  Avatar,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "../../context/NotificationContext";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Topbar = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { notifications, clearNotifications } = useNotifications();
  const navigate = useNavigate();

  // Notifications dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClear = () => {
    clearNotifications();
    handleClose();
  };

  // Profile dropdown
  const [profileAnchor, setProfileAnchor] = useState(null);
  const profileOpen = Boolean(profileAnchor);
  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleProfilePage = () => {
    navigate("/profile");
    handleProfileClose();
  };

  // Profile picture
  const [profilePic, setProfilePic] = useState(user?.dp || "../../assets/user.png");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("profileData"));
    if (storedData?.dp) setProfilePic(storedData.dp);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedData = JSON.parse(localStorage.getItem("profileData"));
      if (storedData?.dp) setProfilePic(storedData.dp);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Logout state
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    setConfirmLogout(false);
    setLoadingLogout(true);
    setTimeout(() => {
      localStorage.removeItem("loggedIn");
      setLoadingLogout(false);
      navigate("/login");
      window.location.reload();
    }, 2500);
  };

  // 🔍 Search bar
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingNav, setLoadingNav] = useState(false);

  // ✅ Memoized search map to remove ESLint warning
  const searchMap = useMemo(
    () => ({
      dashboard: "/dashboard",
      "manage team": "/team",
      "contact information": "/contacts",
      invoices: "/invoices",
      profile: "/profile",
      settings: "/settings",
    }),
    []
  );

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }
    const text = searchText.trim().toLowerCase();
    const matches = Object.keys(searchMap).filter((key) =>
      key.toLowerCase().includes(text)
    );
    setSuggestions(matches);
  }, [searchText, searchMap]); // ✅ fixed dependency array

  const handleSelectSuggestion = (key) => {
    setLoadingNav(true);
    setSuggestions([]);
    setSearchText("");
    setTimeout(() => {
      setLoadingNav(false);
      navigate(searchMap[key]);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  return (
    <>
      {/* Logout Confirmation Dialog */}
      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)} color="primary">
            No
          </Button>
          <Button onClick={handleLogout} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fullscreen Loading Overlay */}
<Fade in={loadingLogout || loadingNav}>
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #120126ff, #120126ff, #120126ff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 9999,
      overflow: "hidden",
    }}
  >
    {/* Logo with smooth pulse */}
    <Box
      component="img"
      src="/assets/loading-logo.png"
      alt="Loading Logo"
      sx={{
        width: 120,
        height: 120,
        objectFit: "contain",
        mb: 3,
        animation: "pulseRotate 2s infinite",
      }}
    />

    {/* Loading Text */}
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
        mb: 1,
        textAlign: "center",
      }}
    >
      Loading...
    </Typography>
    <Typography
      sx={{
        color: "#ccc",
        fontSize: "0.95rem",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        maxWidth: 300,
      }}
    >
      Preparing your dashboard. Please wait.
    </Typography>

    {/* Keyframes for subtle rotation & pulse */}
    <style>
      {`
        @keyframes pulseRotate {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.05) rotate(15deg); opacity: 0.85; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}
    </style>
  </Box>
</Fade>


      {/* Topbar Content */}
      <Box display="flex" justifyContent="space-between" p={2} position="relative">
        {/* Search Bar */}
        <Box
          display="flex"
          flexDirection="column"
          width={{ xs: "100%", sm: "250px" }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? `linear-gradient(145deg, ${alpha(
                      colors.primary[400],
                      0.9
                    )}, ${alpha(colors.primary[400], 0.7)})`
                  : `linear-gradient(145deg, ${alpha(
                      colors.primary[400],
                      0.6
                    )}, ${alpha(colors.primary[400], 0.8)})`,
              borderRadius: "50px",
              border: "1px solid black",
              px: 2,
              py: 0.5,
            }}
          >
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                color: colors.grey[100],
                "& input::placeholder": {
                  color: colors.grey[100],
                  opacity: 0.9,
                },
              }}
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton
              type="button"
              sx={{ p: 1, color: colors.grey[100] }}
              onClick={() =>
                suggestions.length > 0 && handleSelectSuggestion(suggestions[0])
              }
            >
              <SearchIcon />
            </IconButton>
          </Box>
          {suggestions.length > 0 && (
            <Paper
              sx={{
                mt: 0.5,
                maxHeight: 200,
                overflowY: "auto",
                borderRadius: 1,
              }}
            >
              <List dense>
                {suggestions.map((s) => (
                  <ListItem key={s} disablePadding>
                    <ListItemButton onClick={() => handleSelectSuggestion(s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Right-side Icons */}
        <Box display="flex" alignItems="center" ml={2}>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          <IconButton onClick={handleClick}>
            <Badge
              badgeContent={notifications.length}
              color="error"
              overlap="circular"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handleProfileClick}>
            <Avatar
              src={profilePic}
              alt={user?.name || "User"}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: { mt: 1.5, minWidth: 250, backgroundColor: colors.primary[400] },
          }}
        >
          {notifications.length === 0 ? (
            <MenuItem disabled>No new notifications</MenuItem>
          ) : (
            <>
              {notifications.map((n) => (
                <MenuItem key={n.id}>{n.message}</MenuItem>
              ))}
              <MenuItem
                onClick={handleClear}
                sx={{ color: "red", fontWeight: 600 }}
              >
                Clear all
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={profileOpen}
          onClose={handleProfileClose}
          PaperProps={{
            sx: { mt: 1.5, minWidth: 180, backgroundColor: colors.primary[400] },
          }}
        >
          <MenuItem onClick={handleProfilePage}>
            <PersonOutlineIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleProfileClose}>
            <SettingsOutlinedIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <MenuItem
            onClick={() => setConfirmLogout(true)}
            sx={{
              color: "#e53935",
              "& svg": { color: "#e53935" },
              "&:hover": { backgroundColor: "rgba(229, 57, 53, 0.1)" },
            }}
          >
            <LogoutOutlinedIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default Topbar;
