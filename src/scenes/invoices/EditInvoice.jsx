import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoice = location.state?.invoice;

  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    cost: "",
    date: "",
    agencyFee: "", // optional agency fee
    status: "Pending",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (invoice) {
      setForm(invoice);
    }
  }, [invoice]);

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

    setTimeout(() => {
      const invoicesData = JSON.parse(localStorage.getItem("invoicesData")) || [];
      const updatedInvoices = invoicesData.map((inv) =>
        inv.id === form.id ? { ...form, totalCost: parseFloat(form.cost) + (form.agencyFee ? parseFloat(form.agencyFee) : 0) } : inv
      );

      localStorage.setItem("invoicesData", JSON.stringify(updatedInvoices));
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
    }, 1000); // simulate loading
  };

  return (
    <Box m="20px" position="relative">
      <Typography variant="h4" mb={2}>
        Edit Invoice #{form.id}
      </Typography>

      <Grid container spacing={2}>
        {["name", "phone", "email", "cost", "agencyFee", "date"].map((field) => (
          <Grid item xs={field === "email" ? 12 : 6} key={field}>
            <TextField
              name={field}
              label={field === "agencyFee" ? "Agency Fee (Optional)" : field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              value={form[field]}
              onChange={handleChange}
              type={field === "cost" || field === "agencyFee" ? "number" : field === "date" ? "date" : "text"}
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

      <Box mt={3}>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #008cffff, #008cffff)",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: "12px",
          }}
        >
          Save Changes
        </Button>
        <Button
          onClick={() => navigate("/invoices")}
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #ff6f00ff, #ff6f00ff)",
            fontWeight: "bold",
            px: 3,
            ml: 2,
            py: 1,
            borderRadius: "12px",
          }}
        >
          Cancel
        </Button>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
        <Typography ml={2}>Updating Invoice...</Typography>
      </Backdrop>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: "8px" }}>
          Invoice Updated Successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditInvoice;
