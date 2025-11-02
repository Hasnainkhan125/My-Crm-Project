import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";

// ✅ Make sure these components are default exports
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import ContactEmailForm from "../../components/ContactEmailForm";

const TEAM_STORAGE_KEY = "team-members";
const ADMIN_SESSION_KEY = "admin-access-granted";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  const [recentUsers, setRecentUsers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [adminAccess, setAdminAccess] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoicesData")) || [];
    const revenue = savedInvoices.reduce(
      (sum, invoice) => sum + parseFloat(invoice.cost || 0),
      0
    );
    setTotalRevenue(revenue.toFixed(2));

    const sessionAccess = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (sessionAccess === "true") setAdminAccess(true);
  }, []);

  useEffect(() => {
    const savedTeam = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)) || [];
    setRecentUsers(savedTeam);
  }, []);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleAdminAccess = () => {
    setLoading(true);
    setTimeout(() => {
      if (passwordInput === ADMIN_PASSWORD) {
        setAdminAccess(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
        setOpenSnackbar(true);
      } else {
        alert("❌ Incorrect password! Only admin can view this section.");
      }
      setPasswordInput("");
      setLoading(false);
    }, 2000);
  };

  if (loadingPage) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "80vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary[400],
        }}
      >
        <CircularProgress color="secondary" size={80} thickness={5} />
        <Typography
          variant="h5"
          sx={{
            mt: 3,
            fontWeight: "bold",
            animation: "scroll 1.5s infinite",
          }}
        >
          Loading Dashboard...
        </Typography>
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateY(0); opacity: 0.3; }
              50% { transform: translateY(-10px); opacity: 1; }
              100% { transform: translateY(0); opacity: 0.3; }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: isMobile ? 2 : 3, position: "relative" }}>
      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        mb={isMobile ? 3 : 2}
        gap={2}
      >
        <Header title="DASHBOARD" subtitle="REGIN ESTATE" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: isMobile ? "8px 16px" : "10px 20px",
            width: isMobile ? "100%" : "auto",
          }}
          onClick={() => {
            const profile = JSON.parse(localStorage.getItem("profileData"));
            if (profile && profile.resume && profile.resume.data) {
              const link = document.createElement("a");
              link.href = profile.resume.data;
              link.download = profile.resume.name || "resume.pdf";
              link.click();
            } else {
              alert("❌ No resume uploaded! Please upload one in your profile first.");
            }
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Resume
        </Button>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : isTablet ? "repeat(6, 1fr)" : "repeat(12, 1fr)"}
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Stat Boxes */}
        <Box
          gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={recentUsers.length.toLocaleString()}
            subtitle="Total Users"
            progress="0.75"
            increase="+14%"
            icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`PK ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Total Revenue"
            progress="0.50"
            increase="+21%"
            icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn={isMobile ? "span 1" : isTablet ? "span 3" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* ROW 2 - Revenue Chart */}
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 8"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box mt="10px" p="10px 20px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                $59,342.32
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
            </IconButton>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 2 - Recent Users/Admin Access */}
        <Box gridColumn={isMobile ? "span 1" : isTablet ? "span 6" : "span 4"} gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Added Users
            </Typography>
          </Box>

          {!adminAccess ? (
            <Fade in={!adminAccess}>
              <Box p="30px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography variant="h6" color={colors.grey[500]} fontWeight="600" mb={2}>
                  🔒 Admin Access Required
                </Typography>

                <TextField
                  type="password"
                  label="Enter Admin Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoComplete="new-password"
                  sx={{ mb: 3, width: "75%" }}
                />

                {!loading ? (
                  <Button variant="contained" onClick={handleAdminAccess}>
                    Submit
                  </Button>
                ) : (
                  <CircularProgress color="secondary" size={40} thickness={5} sx={{ mt: 2 }} />
                )}
              </Box>
            </Fade>
          ) : recentUsers.length === 0 ? (
            <Typography color={colors.grey[100]} p="15px">
              No recent users
            </Typography>
          ) : (
            [...recentUsers].reverse().map((user) => (
              <Box
                key={user.id || user.email}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography color={colors.greenAccent[600]} variant="h8" fontWeight="600">
                    {user.email}
                  </Typography>
                  <Typography color={colors.grey[100]}>Password: {user.password}</Typography>
                  <Typography color={colors.redAccent[300]} sx={{ textTransform: "uppercase" }}>
                    Name: {user.name}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={
                    user.access === "admin"
                      ? colors.blueAccent[500]
                      : user.access === "manager"
                      ? colors.redAccent[500]
                      : colors.greenAccent[500]
                  }
                  p="5px 10px"
                  borderRadius="4px"
                >
                  {user.access === "admin" && <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />}
                  {user.access === "manager" && <SecurityOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />}
                  {user.access === "user" && <LockOpenOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />}
                  <Typography color={colors.grey[100]} sx={{ textTransform: "uppercase", fontWeight: "600" }}>
                    {user.access}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: "100%" }}>
          ✅ Admin password successful!
        </Alert>
      </Snackbar>

      {/* Email Chat Widget */}
      <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <ContactEmailForm />
      </Box>
    </Box>
  );
};

export default Dashboard;
