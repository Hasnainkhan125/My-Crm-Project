import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Drawer,
  Divider,
  IconButton,
  Slide,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

// Slide transition for Drawer
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AddInvoice = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    cost: "",
    agencyFee: "",
    date: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.email || !form.cost || !form.date) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);

    // Simulate async save delay (e.g., API call)
    setTimeout(() => {
      const invoicesData = JSON.parse(localStorage.getItem("invoicesData")) || [];
      const id = invoicesData.length ? invoicesData[invoicesData.length - 1].id + 1 : 1;
      const totalCost = parseFloat(form.cost) + (form.agencyFee ? parseFloat(form.agencyFee) : 0);
      const newInvoice = { id, ...form, totalCost };

      invoicesData.push(newInvoice);
      localStorage.setItem("invoicesData", JSON.stringify(invoicesData));

      setLoading(false);
      setSuccess(true);

      setTimeout(() => navigate("/invoices"), 1500);
    }, 1500); // Loading delay
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => navigate("/invoices"), 300);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      transitionDuration={{ enter: 800, exit: 500 }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 500 },
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Add New Invoice</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Form Fields */}
      <Box flexGrow={1} overflow="auto">
        <Grid container spacing={2}>
          {["name", "phone", "email", "cost", "agencyFee", "date"].map((field) => (
            <Grid item xs={field === "email" ? 12 : 6} key={field}>
              <TextField
                name={field}
                label={
                  field === "agencyFee"
                    ? "Agency Fee (Optional)"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                fullWidth
                value={form[field]}
                onChange={handleChange}
                type={
                  field === "cost" || field === "agencyFee"
                    ? "number"
                    : field === "date"
                    ? "date"
                    : "text"
                }
                InputLabelProps={field === "date" ? { shrink: true } : {}}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={form.status}
              onChange={handleChange}
            >
              {["Pending", "Paid", "Overdue"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Buttons */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            background: "linear-gradient(90deg, #0478d8, #0478d8)",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: "12px",
            minWidth: "130px",
            height: "42px",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Invoice"}
        </Button>

        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>

      {/* Success Popup */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: "8px" }}>
          Invoice Added Successfully!
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default AddInvoice;
