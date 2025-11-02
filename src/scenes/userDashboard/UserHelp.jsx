import React from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";

const faqs = [
  {
    question: "How do I update my profile information?",
    answer:
      "Go to the Profile page from the sidebar, edit your details, and click ‘Save Changes’. Your updates will appear instantly.",
  },
  {
    question: "How can I reset my password?",
    answer:
      "Click on 'Forgot Password' from the login page and follow the instructions. You’ll receive a reset link in your email.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Visit the Settings page and click on the Subscription tab. From there, you can manage or cancel your plan anytime.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact us using the form below or email support@myapp.com. Our team usually replies within 24 hours.",
  },
];

const UserHelp = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* 🔹 Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#FFD700" }}>
        Help & Support
      </Typography>
      <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
        We’re here to help! Browse common questions or reach out directly to our support team.
      </Typography>

      {/* 🔸 FAQ Section */}
      <Box mb={4}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "#fff",
              borderRadius: "12px !important",
              mb: 1.5,
              "&:before": { display: "none" },
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#FFD700" }} />}
              sx={{ fontWeight: "bold" }}
            >
              {faq.question}
            </AccordionSummary>
            <AccordionDetails sx={{ color: "rgba(255,255,255,0.7)" }}>
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

      {/* 🔹 Contact Support */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: "#FFD700" }}>
          Contact Support
        </Typography>
        <Typography variant="body2" mb={2} sx={{ color: "rgba(255,255,255,0.6)" }}>
          Need more help? Send us a message, and our support team will respond soon.
        </Typography>

        <Box display="grid" gap={2}>
          <TextField
            variant="outlined"
            fullWidth
            label="Your Email"
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              sx: {
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
              },
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            label="Your Message"
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              sx: {
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "#FFD700",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e6c200" },
            }}
          >
            Send Message
          </Button>
        </Box>

        <Box mt={3} display="flex" gap={2}>
          <Button
            startIcon={<EmailIcon />}
            sx={{
              color: "#FFD700",
              textTransform: "none",
              "&:hover": { color: "#fff" },
            }}
          >
            support@myapp.com
          </Button>
          <Button
            startIcon={<ChatIcon />}
            sx={{
              color: "#FFD700",
              textTransform: "none",
              "&:hover": { color: "#fff" },
            }}
          >
            Live Chat
          </Button>
        </Box>
      </Paper>

      {/* 🔻 Footer Note */}
      <Box textAlign="center" mt={4}>
        <SupportAgentIcon sx={{ color: "#FFD700", fontSize: 40 }} />
        <Typography variant="body2" color="rgba(255,255,255,0.6)" mt={1}>
          Our support team is available 24/7 to assist you.
        </Typography>
      </Box>
    </Box>
  );
};

export default UserHelp;
