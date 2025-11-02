import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import emailjs from "emailjs-com";

/**
 * PaymentManagementPage with WhatsApp integration
 * - Notify via WhatsApp after payment
 * - Pre-filled WhatsApp messages
 * - Chat on WhatsApp from history
 * - Persists to localStorage
 */

// helper to generate readable transaction ids
const genTxId = () => {
  return `TX-${Date.now().toString().slice(-8)}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
};

// Payment method metadata (label, fee percent, icon)
const PAYMENT_METHODS = [
  { id: "visa", label: "Visa / MasterCard", feePercent: 1.5, icon: <CreditCardIcon /> },
  { id: "easypaisa", label: "EasyPaisa", feePercent: 0.5, icon: <AccountBalanceWalletIcon /> },
  { id: "jazzcash", label: "JazzCash", feePercent: 0.5, icon: <AccountBalanceIcon /> },
];

// initial demo users (persisted to localStorage) — added phone fields
const DEMO_USERS = {
  "user_me@example.com": { name: "You", balance: 10000, phone: "+923001111111" },
  "merchant_1@example.com": { name: "Coffee Shop", balance: 2500, phone: "+923004445555" },
  "friend_1@example.com": { name: "Ali", balance: 300, phone: "+923006667777" },
  "+923001234567": { name: "Mobile: 0300-1234567", balance: 1500, phone: "+923001234567" },
};

const PaymentManagementPage = () => {
  const currentUser = "user_me@example.com";

  const [tab, setTab] = useState(0); // 0 = pay, 1 = history
  const [method, setMethod] = useState("visa");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobile, setMobile] = useState("");
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State for last payment (to show Notify via WhatsApp)
  const [lastPayment, setLastPayment] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // payments persisted
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem("crm_payments");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("crm_payments", JSON.stringify(payments));
  }, [payments]);

  // balances/users persisted
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("user_balances_v2");
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  useEffect(() => {
    localStorage.setItem("user_balances_v2", JSON.stringify(users));
  }, [users]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Email sending (replace service/template/user ids with your own)
  const sendPaymentEmail = (payment) => {
    const templateParams = {
      sender_email: payment.sender,
      receiver_email: payment.receiver,
      amount: payment.amount,
      method: payment.method.toUpperCase(),
      date: payment.date,
      status: payment.status,
      tx_id: payment.id,
    };

    // NOTE: Replace the IDs below with your EmailJS service/template/user IDs if you want emails
    emailjs
      .send("service_jwh38si", "template_vlbkhhm", templateParams, "aPjV4dkExrQsHVJLV")
      .then(
        () => showSnackbar("📧 Email notification sent.", "success"),
        () => showSnackbar("⚠️ Failed to send email notification.", "warning")
      );
  };

  // Derived values: selected method meta, fee, total
  const selectedMethod = useMemo(() => PAYMENT_METHODS.find((m) => m.id === method), [method]);
  const fee = useMemo(() => {
    const amt = Number(amount) || 0;
    return +(amt * (selectedMethod?.feePercent || 0) / 100).toFixed(2);
  }, [amount, selectedMethod]);
  const totalDebit = useMemo(() => +(Number(amount || 0) + fee).toFixed(2), [amount, fee]);

  const currentBalance = users[currentUser]?.balance ?? 0;

  // Basic validation before opening confirmation
  const handlePayment = () => {
    if (!amount || Number(amount) <= 0) return showSnackbar("Please enter a valid amount.", "warning");

    // if visa: require card details & receiver or receiver email
    if (method === "visa") {
      if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 12) return showSnackbar("Enter a valid card number.", "warning");
      if (!expiry) return showSnackbar("Enter card expiry.", "warning");
      if (!cvv || cvv.length < 3) return showSnackbar("Enter CVV.", "warning");
      if (!receiver) return showSnackbar("Enter receiver email/ID.", "warning");
    } else {
      // wallet transfers need mobile or receiver field
      if (!mobile && !receiver) return showSnackbar("Enter receiver mobile or select a saved contact.", "warning");
    }

    if (totalDebit > currentBalance) return showSnackbar("❌ Insufficient balance.", "error");

    setOpenConfirm(true);
  };

  // Confirm payment: simulate processing, update payments and balances
  const confirmPayment = () => {
    setOpenConfirm(false);
    setLoading(true);

    setTimeout(() => {
      const tx = {
        id: genTxId(),
        sender: currentUser,
        receiver: receiver || mobile,
        method,
        amount: Number(amount),
        fee,
        total: totalDebit,
        date: new Date().toLocaleString(),
        status: "Success",
      };

      setPayments((prev) => [tx, ...prev]);

      setUsers((prev) => {
        const prevSenderBal = prev[currentUser]?.balance ?? 0;
        const recipientId = tx.receiver;
        const prevRecipientBal = prev[recipientId]?.balance ?? 0;

        return {
          ...prev,
          [currentUser]: { ...(prev[currentUser] || {}), balance: +(prevSenderBal - tx.total).toFixed(2) },
          [recipientId]: { ...(prev[recipientId] || {}), balance: +(prevRecipientBal + tx.amount).toFixed(2) },
        };
      });

      setLoading(false);
      setLastPayment(tx); // store last payment for quick notify
      showSnackbar(`✅ Rs ${tx.amount} sent to ${tx.receiver}`, "success");

      // send email (optional)
      sendPaymentEmail(tx);

      // clear form
      setAmount("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setMobile("");
      setReceiver("");
    }, 1400);
  };

  // Resolve phone for a receiver:
  // - Check users map for a phone field
  // - Otherwise try to extract a phone-like substring from receiver string
  const resolvePhoneForReceiver = (receiverId) => {
    if (!receiverId) return null;
    // if receiver exists in users and has phone field
    if (users[receiverId] && users[receiverId].phone) return users[receiverId].phone;
    // if receiver looks like a phone number already (+92..., 0300..., digits)
    const match = receiverId.toString().match(/(\+?\d{9,15})/);
    if (match) return match[1];
    return null;
  };

  // Open WhatsApp with pre-filled message for a payment
  const handleWhatsappNotify = (payment) => {
    if (!payment) return showSnackbar("No payment selected for WhatsApp notification.", "warning");

    const phone = resolvePhoneForReceiver(payment.receiver);
    if (!phone) return showSnackbar("Receiver has no WhatsApp number available.", "warning");

    const message = `💳 Payment Confirmation\n\nAmount: Rs ${payment.amount}\nMethod: ${payment.method.toUpperCase()}\nTransaction ID: ${payment.id}\nDate: ${payment.date}\nStatus: ${payment.status}\n\nThank you!`;

    const encoded = encodeURIComponent(message);
    // remove + for wa.me link
    const normalized = phone.replace(/\D+/g, "");
    const waUrl = `https://wa.me/${normalized}?text=${encoded}`;
    window.open(waUrl, "_blank");
  };

  // Filtered payments for history search
  const filteredPayments = payments.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.method.toLowerCase().includes(q) ||
      p.receiver?.toString().toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  // Top-up helper (demo)
  const handleTopUp = (val) => {
    const value = Number(val);
    if (!value || value <= 0) return showSnackbar("Invalid top-up amount", "warning");

    setUsers((prev) => ({
      ...prev,
      [currentUser]: { ...(prev[currentUser] || {}), balance: +(prev[currentUser].balance + value).toFixed(2) },
    }));

    const topUpTx = {
      id: genTxId(),
      sender: "TOP-UP",
      receiver: currentUser,
      method: "topup",
      amount: value,
      fee: 0,
      total: value,
      date: new Date().toLocaleString(),
      status: "Success",
    };

    setPayments((p) => [topUpTx, ...p]);
    showSnackbar(`Top-up Rs ${value} successful`, "success");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center", p: 2 }}>
      <Paper elevation={6} sx={{ width: "100%", maxWidth: 980, borderRadius: 3, p: 3 }}>
        {/* Top: Show quick notify area if there's a lastPayment */}
        {lastPayment && (
          <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Last payment: Rs {lastPayment.amount} → {lastPayment.receiver}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lastPayment.method.toUpperCase()} • {lastPayment.date} • {lastPayment.id}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                startIcon={<WhatsAppIcon />}
                variant="contained"
                onClick={() => handleWhatsappNotify(lastPayment)}
              >
                Notify via WhatsApp
              </Button>
              <Button
                variant="outlined"
                onClick={() => setLastPayment(null)}
                startIcon={<CloseIcon />}
              >
                Dismiss
              </Button>
            </Box>
          </Box>
        )}

        <Grid container spacing={2}>
          {/* Left column: Payment form */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" fontWeight={700} color="primary">QuickPay</Typography>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2">Balance</Typography>
                <Typography variant="h6" fontWeight={800}>Rs {currentBalance.toFixed(2)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select value={method} label="Payment Method" onChange={(e) => setMethod(e.target.value)}>
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{m.icon} {m.label}</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Receiver field changes based on method */}
            <TextField
              fullWidth
              label={method === "visa" ? "Receiver Email / Merchant ID" : "Receiver Mobile Number"}
              placeholder={method === "visa" ? "merchant@example.com" : "+92300XXXXXXXX"}
              value={method === "visa" ? receiver : mobile}
              onChange={(e) => (method === "visa" ? setReceiver(e.target.value) : setMobile(e.target.value))}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{method === "visa" ? <MonetizationOnIcon /> : <AccountBalanceWalletIcon />}</InputAdornment>,
              }}
            />

            {/* Visa extra fields */}
            {method === "visa" && (
              <>
                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CreditCardIcon /></InputAdornment> }}
                />
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Expiry (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} type="password" />
                  </Grid>
                </Grid>
              </>
            )}

            {/* If not visa, an optional receiver field */}
            {method !== "visa" && (
              <TextField fullWidth label="Receiver (optional saved contact)" placeholder="or leave mobile above" value={receiver} onChange={(e) => setReceiver(e.target.value)} sx={{ mb: 2 }} />
            )}

            <TextField fullWidth label="Amount (PKR)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ mb: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2">Fee: Rs {fee.toFixed(2)}</Typography>
              <Typography variant="body2">Total debit: Rs {totalDebit.toFixed(2)}</Typography>
            </Box>

            <Button variant="contained" size="large" fullWidth onClick={handlePayment} disabled={loading} startIcon={<PaymentIcon />} sx={{ mb: 1 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : "Pay Securely"}
            </Button>

            <Button variant="outlined" fullWidth startIcon={<HistoryIcon />} onClick={() => setTab(1)}>
              View Transactions
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Top-ups</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={() => handleTopUp(500)}>+Rs 500</Button>
              <Button onClick={() => handleTopUp(1000)}>+Rs 1000</Button>
              <Button onClick={() => handleTopUp(5000)}>+Rs 5000</Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Saved Contacts</Typography>
            <Box>
              {Object.keys(users).map((id) => (
                id === currentUser ? null : (
                  <Button
                    key={id}
                    fullWidth
                    sx={{ justifyContent: "space-between", mb: 1 }}
                    onClick={() => {
                      if (id.startsWith("+92") || id.match(/^\+?\d{9,15}$/)) {
                        setMobile(id);
                        setReceiver("");
                      } else {
                        setReceiver(id);
                        setMobile("");
                      }
                    }}
                  >
                    <span>{users[id].name}</span>
                    <small>Rs {users[id].balance}</small>
                  </Button>
                )
              ))}
            </Box>
          </Grid>

          {/* Right column: History / Recent transactions */}
          <Grid item xs={12} md={7}>
            {tab === 0 ? (
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>Recent Transactions</Typography>
                <Box sx={{ maxHeight: 540, overflowY: "auto" }}>
                  {payments.length === 0 && <Typography color="text.secondary">No transactions yet — make your first transfer.</Typography>}
                  {payments.map((p) => (
                    <Card key={p.id} sx={{ mb: 1 }}>
                      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>{p.method.toUpperCase()}</Typography>
                          <Typography variant="body2">To: {p.receiver}</Typography>
                          <Typography variant="body2">Amount: Rs {p.amount} | Fee: Rs {p.fee}</Typography>
                          <Typography variant="caption">{p.date}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="subtitle1" fontWeight={800}>Rs {p.total}</Typography>
                          <Typography variant="body2" color={p.status === "Success" ? "green" : "orange"}>{p.status}</Typography>
                          <Typography variant="caption" display="block" sx={{ mb: 1 }}>{p.id}</Typography>
                          <Button
                            size="small"
                            startIcon={<WhatsAppIcon />}
                            onClick={() => handleWhatsappNotify(p)}
                            sx={{ mt: 0.5 }}
                          >
                            Chat
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    fullWidth
                  />
                  <IconButton onClick={() => { setPayments([]); showSnackbar("Cleared history (demo)", "info"); }} title="Clear demo history">
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Typography variant="h6" sx={{ mb: 1 }}>All Transactions</Typography>
                <Box sx={{ maxHeight: 520, overflowY: "auto" }}>
                  {filteredPayments.length === 0 && <Typography color="text.secondary">No transactions match your search.</Typography>}
                  {filteredPayments.map((p) => (
                    <Card key={p.id} sx={{ mb: 1 }}>
                      <CardContent>
                        <Grid container>
                          <Grid item xs={8}>
                            <Typography variant="subtitle1" fontWeight={700}>{p.method.toUpperCase()}</Typography>
                            <Typography variant="body2">To: {p.receiver}</Typography>
                            <Typography variant="body2">Date: {p.date}</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: "right" }}>
                            <Typography variant="subtitle1" fontWeight={800}>Rs {p.total}</Typography>
                            <Typography variant="body2" color={p.status === "Success" ? "green" : "orange"}>{p.status}</Typography>
                            <Typography variant="caption" display="block">{p.id}</Typography>
                            <Button
                              size="small"
                              startIcon={<WhatsAppIcon />}
                              onClick={() => handleWhatsappNotify(p)}
                              sx={{ mt: 1 }}
                            >
                              Notify
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Button variant="contained" startIcon={<PaymentIcon />} sx={{ mt: 2 }} onClick={() => setTab(0)}>Back to Pay</Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Confirm Dialog */}
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogContent>
            <Typography>
              Send <b>Rs {amount}</b> (fee Rs {fee.toFixed(2)}) via <b>{method.toUpperCase()}</b> to <b>{receiver || mobile}</b>?
            </Typography>
            <Typography variant="caption" color="text.secondary">Total debit: Rs {totalDebit.toFixed(2)}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="error" startIcon={<CloseIcon />}>Cancel</Button>
            <Button onClick={confirmPayment} variant="contained" startIcon={<CheckCircleIcon />} color="success">Confirm</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={snackbar.severity} sx={{ width: "100%" }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default PaymentManagementPage;
