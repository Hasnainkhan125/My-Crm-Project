import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { tokens } from "../../theme";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const ViewInvoice = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const invoiceRef = useRef();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      let foundInvoice = null;
      if (location.state && location.state.invoice) {
        foundInvoice = location.state.invoice;
      } else {
        const savedInvoices = JSON.parse(localStorage.getItem("invoicesData") || "[]");
        foundInvoice = savedInvoices.find((inv) => inv.id === parseInt(id));
      }

      if (foundInvoice) {
        setInvoice(foundInvoice);

        const qrData = `Invoice #${foundInvoice.id}\nClient: ${foundInvoice.name}\nAmount: PKR ${foundInvoice.totalCost}\nDate: ${foundInvoice.date}`;
        QRCode.toDataURL(qrData, { width: 150, margin: 2 }, (err, url) => {
          if (!err) setQrCode(url);
        });
      } else {
        navigate("/invoices");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, location.state, navigate]);

  const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoice.id}.pdf`);
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: theme.palette.mode === "dark" ? "#121212" : "#f9f9f9",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={70} sx={{ color: colors.blueAccent[500] }} />
        <Typography variant="h6">Loading Invoice...</Typography>
      </Box>
    );
  }

  if (!invoice) return null;

  const totalCost = parseFloat(invoice.totalCost || invoice.cost || 0).toFixed(2);

  return (
    <Box m="40px" display="flex" justifyContent="center">
      <Paper
        ref={invoiceRef}
        elevation={6}
        sx={{
          width: "900px",
          minHeight: "85vh",
          p: 5,
          borderRadius: "16px",
          background: theme.palette.mode === "dark" ? "#1f2a40" : "#ffffff",
          color: theme.palette.mode === "dark" ? "#fff" : "#333",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* ===== HEADER ===== */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              component="img"
              src="https://cdn-icons-png.flaticon.com/512/808/808484.png"
              alt="Company Logo"
              sx={{ width: 60, height: 60 }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
              Pak Regin Estate
              </Typography>
              <Typography variant="body2">Email: info@mycompany.com</Typography>
              <Typography variant="body2">Phone: +92 314 0972575</Typography>
            </Box>
          </Box>

          <Box textAlign="right">
            <Typography variant="h4" fontWeight="bold" color={colors.blueAccent[500]}>
              INVOICE
            </Typography>
            <Typography variant="subtitle2">#INV-{invoice.id}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ===== CLIENT & INVOICE INFO ===== */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Bill To:
            </Typography>
            <Typography>{invoice.name}</Typography>
            <Typography>{invoice.email}</Typography>
            <Typography>{invoice.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Invoice Details:
            </Typography>
            <Typography>Invoice Date: {invoice.date}</Typography>
            <Typography>Status: {invoice.status}</Typography>
            <Typography>
              Amount Due:{" "}
              <span style={{ color: colors.greenAccent[500], fontWeight: "bold" }}>
                PKR {totalCost}
              </span>
            </Typography>
          </Grid>
        </Grid>

        {/* ===== ITEMS TABLE ===== */}
        <Table sx={{ mb: 4 }}>
          <TableHead sx={{ background: colors.blueAccent[700] }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Unit Price</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Service / Product</TableCell>
              <TableCell>1</TableCell>
              <TableCell>PKR {invoice.cost}</TableCell>
              <TableCell>PKR {invoice.cost}</TableCell>
            </TableRow>
            {invoice.agencyFee && (
              <TableRow>
                <TableCell>Agency Fee</TableCell>
                <TableCell>1</TableCell>
                <TableCell>PKR {invoice.agencyFee}</TableCell>
                <TableCell>PKR {invoice.agencyFee}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ===== TOTAL SECTION ===== */}
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Box
            sx={{
              p: 3,
              width: 300,
              borderRadius: "12px",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #273552, #1f2a40)"
                  : "linear-gradient(145deg, #f9f9f9, #fff)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Typography display="flex" justifyContent="space-between">
              <span>Subtotal:</span>
              <span>PKR {totalCost}</span>
            </Typography>
            <Typography display="flex" justifyContent="space-between">
              <span>Tax (0%):</span>
              <span>PKR 0.00</span>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography
              display="flex"
              justifyContent="space-between"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              <span>Total:</span>
              <span>PKR {totalCost}</span>
            </Typography>
          </Box>
        </Box>

        {/* ===== FOOTER ===== */}
        <Divider sx={{ my: 3 }} />
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2">
              Thank you for your business! <br />
              Please make payments via bank transfer within 7 days.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" textAlign="right">
              Authorized Signature:
              <br />
              ______________________
            </Typography>
          </Grid>
        </Grid>

        {/* ===== QR CODE ===== */}
        {qrCode && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Box
              component="img"
              src={qrCode}
              alt="Invoice QR"
              sx={{
                width: 100,
                height: 100,
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}

        {/* ===== BUTTONS ===== */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #007bff, #0056d9)",
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/invoices")}
          >
            Back to Invoices
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewInvoice;
