import {
  Box,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [question, setQuestion] = useState("");
  const [ setSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { addNotification } = useNotifications();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSubmit = () => {
    if (question.trim()) {
      addNotification(`New FAQ Question: "${question}"`);
      setSubmitted(true);
      setQuestion("");
      setOpenSnackbar(true);
      setTimeout(() => setSubmitted(false), 2500);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const faqs = [
    {
      q: "How can I reset my account password?",
      a: "Go to settings → security → reset password. You’ll receive a reset link on your registered email.",
    },
    {
      q: "Can I access the dashboard on mobile?",
      a: "Yes! Our dashboard is fully responsive and optimized for both iOS and Android devices.",
    },
    {
      q: "How do I contact support?",
      a: "Use the contact form in the footer or email us directly at support@reginestate.com.",
    },
    {
      q: "Is there a premium plan available?",
      a: "Yes, we offer multiple plans. Check our pricing page for the latest packages and benefits.",
    },
    {
      q: "How do I delete my account?",
      a: "Navigate to Account Settings → Delete Account. Your data will be permanently removed.",
    },
  ];

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="FAQ" subtitle="Frequently Asked Questions" />

      <Paper
        elevation={4}
        sx={{
          p: isMobile ? 2 : 3,
          mb: 4,
          borderRadius: "16px",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #061701ff, #061701ff)"
              : "linear-gradient(145deg, #ffffff, #f5f5f5)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          mb={2}
          color={colors.greenAccent[400]}
          textAlign={isMobile ? "center" : "left"}
        >
          Have a Question? Ask Below 👇
        </Typography>

        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <TextField
            fullWidth
            label="Type your question..."
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#141b2d" : "#fff",
              borderRadius: "8px",
            }}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #FFD700, #FFB300)",
              color: "#000",
              fontWeight: "bold",
              px: 3,
              py: isMobile ? 1.5 : 1,
              borderRadius: "8px",
              textTransform: "none",
              width: isMobile ? "100%" : "auto",
              "&:hover": {
                background: "linear-gradient(90deg, #FFB300, #FFD700)",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Snackbar Popup */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          ✅ Your question has been sent!
        </Alert>
      </Snackbar>

      {/* FAQ List */}
      <Box>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            defaultExpanded={index === 0}
            sx={{
              mb: 2,
              borderRadius: "12px !important",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #1f2a40, #273552)"
                  : "linear-gradient(145deg, #ffffff, #f5f5f5)",
              boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
              "&:before": { display: "none" },
              "&:hover": {
                transform: "translateY(-3px)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: colors.greenAccent[400] }} />
              }
            >
              <Typography
                color={colors.greenAccent[400]}
                variant={isMobile ? "subtitle1" : "h5"}
                fontWeight="600"
              >
                {faq.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color={colors.grey[100]}>
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQ;
