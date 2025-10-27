import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNotifications } from "../../context/NotificationContext";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoicesData");
    if (savedInvoices) {
      setRows(JSON.parse(savedInvoices));
    } else {
      const dataWithTotal = mockDataInvoices.map((i) => ({
        ...i,
        totalCost: parseFloat(i.cost || 0) + parseFloat(i.agencyFee || 0),
      }));
      setRows(dataWithTotal);
      localStorage.setItem("invoicesData", JSON.stringify(dataWithTotal));
    }
  }, []);

  const saveToLocalStorage = (data) =>
    localStorage.setItem("invoicesData", JSON.stringify(data));

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedRows = rows.filter((row) => row.id !== invoiceToDelete.id);
    setRows(updatedRows);
    saveToLocalStorage(updatedRows);
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
    setSuccess(true);
    addNotification(`🗑 Invoice #${invoiceToDelete.id} deleted`);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleStatusClick = (invoice) => {
    if (invoice.status === "Pending") {
      const updatedRows = rows.map((inv) =>
        inv.id === invoice.id ? { ...inv, status: "Paid" } : inv
      );
      setRows(updatedRows);
      saveToLocalStorage(updatedRows);
      addNotification(`✅ Invoice #${invoice.id} marked as Paid`);
    }
  };

  const totalInvoices = rows.length;
  const totalRevenue = rows
    .reduce(
      (sum, i) =>
        sum + (parseFloat(i.cost || 0) + parseFloat(i.agencyFee || 0)),
      0
    )
    .toFixed(2);
  const totalPending = rows.filter((i) => i.status === "Pending").length;

  const statusColors = {
    Paid: { bg: "#209e27ff", color: "white" },
    Pending: { bg: "#e6b524ee", color: "white" },
    Overdue: { bg: "#d53403f3", color: "white" },
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "name", headerName: "Client Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 0.8 },
    { field: "email", headerName: "Email", flex: 1.2 },
    {
      field: "totalCost",
      headerName: "Amount",
      flex: 0.8,
      renderCell: (params) => {
        const total =
          parseFloat(params.row.cost || 0) + parseFloat(params.row.agencyFee || 0);
        return (
          <Typography fontWeight="bold" color={colors.greenAccent[500]}>
            PKR {total.toFixed(2)}
          </Typography>
        );
      },
    },
    { field: "date", headerName: "Date", flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;
        const isPending = status === "Pending";
        return (
          <Box
            onClick={() => handleStatusClick(params.row)}
            sx={{
              backgroundColor: statusColors[status]?.bg || "#eee",
              color: statusColors[status]?.color || "#333",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              textAlign: "center",
              cursor: isPending ? "pointer" : "default",
              "&:hover": { opacity: isPending ? 0.8 : 1 },
              transition: "0.3s",
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: isMobile ? 1.5 : 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          gap={isMobile ? 0.5 : 1}
        >
    <Button
      size="small"
      startIcon={<VisibilityIcon />}
      onClick={() =>
        navigate(`/invoices/view/${params.row.id}`, {
          state: { invoice: params.row },
        })
      }
      sx={{
        color: "RoyalBlue",
        borderColor: "RoyalBlue",
        "&:hover": {
          backgroundColor: "rgba(0, 47, 255, 0.1)",
          borderColor: "red",
        },
      }}
    >
            {isMobile ? "" : ""}
          </Button>
          <Button
            color="warning"
            size="small"
            startIcon={<EditIcon />}
            onClick={() =>
              navigate(`/invoices/edit/${params.row.id}`, {
                state: { invoice: params.row },
              })
            }
          >
            {isMobile ? "" : ""}
          </Button>
          <Button
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(params.row)}
          >
            {isMobile ? "" : ""}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="INVOICES" subtitle="Invoice Management System" />

      {/* SUMMARY CARDS */}
      <Grid container spacing={2} mt={1}>
        {[
          {
            icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 30, color: colors.greenAccent[400] }} />,
            value: totalInvoices,
            label: "Total Invoices",
          },
          {
            icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 30, color: "#FFD700" }} />,
            value: `PKR ${totalRevenue}`,
            label: "Total Revenue",
          },
          {
            icon: <PendingActionsOutlinedIcon sx={{ fontSize: 30, color: "#FFB300" }} />,
            value: totalPending,
            label: "Pending",
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={5}
              sx={{
                p: isMobile ? 1.5 : 2,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "flex-start",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(145deg, #1f2a40, #273552)"
                    : "linear-gradient(145deg, #ffffff, #f3f3f3)",
                transition: "all 0.3s ease",
              }}
            >
              {card.icon}
              <Box>
                <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography color={colors.grey[300]} fontSize={isMobile ? "0.8rem" : "1rem"}>
                  {card.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* DATA GRID */}
      <Box
        mt={2}
        height={isMobile ? "60vh" : "65vh"}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "12px",
            overflowX: "auto",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: isMobile ? "0.7rem" : "0.9rem",
            fontWeight: 600,
            background: theme.palette.mode === "dark" ? "#273552" : "#f3f3f3",
          },
          "& .MuiDataGrid-cell": {
            fontSize: isMobile ? "0.75rem" : "0.9rem",
            whiteSpace: "nowrap",
          },
        }}
      >
        <DataGrid rows={rows} columns={columns} hideFooter autoHeight={isMobile} />
      </Box>

      {/* ADD BUTTON */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          onClick={() => navigate("/invoices/add")}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(90deg, #008CFF, #0057D9)",
            fontWeight: "bold",
            px: isMobile ? 1.5 : 3,
            py: isMobile ? 0.8 : 1,
            borderRadius: "12px",
            fontSize: isMobile ? "0.75rem" : "1rem",
          }}
        >
          {isMobile ? "" : "+ New Invoice"}
        </Button>
      </Box>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: "8px" }}>
          Action completed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Invoices;
