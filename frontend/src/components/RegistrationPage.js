import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography, Grid, Alert, Divider } from "@mui/material";
import logos from "../assets/logos.png"; // Top-left logo
import "../styles/RegistrationPage.css";


const BACKEND_URL = process.env.REACT_APP_API_URL;

const RegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role"); // "admin" or "staff"

  const [providerName, setProviderName] = useState("");
  const [providerID, setProviderID] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [numberOfSites, setNumberOfSites] = useState(1);
  const [sites, setSites] = useState([""]);
  const [errors, setErrors] = useState({});
  const [registrationError, setRegistrationError] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaMessage, setMfaMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSiteChange = (index, value) => {
    const newSites = [...sites];
    newSites[index] = value;
    setSites(newSites);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setContactEmail(email);
    let validationErrors = { ...errors };

    if (!validateEmail(email)) {
      validationErrors.contactEmail = "Invalid email format";
    } else {
      delete validationErrors.contactEmail;
    }

    if (email !== confirmEmail) {
      validationErrors.confirmEmail = "Email addresses do not match";
    } else {
      delete validationErrors.confirmEmail;
    }

    setErrors(validationErrors);
  };

  const handleConfirmEmailChange = (e) => {
    const email = e.target.value;
    setConfirmEmail(email);
    let validationErrors = { ...errors };

    if (email !== contactEmail) {
      validationErrors.confirmEmail = "Email addresses do not match";
    } else {
      delete validationErrors.confirmEmail;
    }

    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!validateEmail(contactEmail)) {
      validationErrors.contactEmail = "Invalid email format";
    }

    if (contactEmail !== confirmEmail) {
      validationErrors.confirmEmail = "Email addresses do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        provider_name: providerName,
        provider_id: providerID,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        number_of_sites: role === "admin" ? numberOfSites : undefined, // Only for admin
        sites: role === "admin" ? sites : undefined, // Only for admin
        role, // Pass the role to the backend
      };

      const response = await axios.post(`${BACKEND_URL}/api/register`, payload);

      if (response.data.message === "Provider registered successfully!") {
        const mfaResponse = await axios.post(`${BACKEND_URL}/api/mfa/generate`, {
          email: contactEmail,
        });

        if (mfaResponse.data.qrCode) {
          setQrCode(mfaResponse.data.qrCode);
          setShowMFA(true);
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error registering provider:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setRegistrationError(error.response.data.error);
      } else {
        alert("An error occurred while registering the provider.");
      }
    }
  };

  const handleVerifyMFA = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/mfa/verify`, {
        email: contactEmail,
        otp: otp,
      });

      if (response.data.message === "MFA verified successfully.") {
        setMfaMessage("MFA verified successfully.");
        navigate("/login");
      } else {
        setMfaMessage("Failed to verify MFA. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying MFA:", error);
      setMfaMessage("Failed to verify MFA. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
        <Grid item>
          <img src={logos} alt="Logo" style={{ height: "50px" }} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: "20px" }} />
      <Typography variant="h4" component="h1" gutterBottom>
        Registration Page
      </Typography>
      {registrationError && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {registrationError}
        </Alert>
      )}
      {!showMFA ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Provider Name"
                fullWidth
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Provider ID"
                fullWidth
                value={providerID}
                onChange={(e) => setProviderID(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contact Phone"
                fullWidth
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contact Email"
                fullWidth
                type="email"
                value={contactEmail}
                onChange={handleEmailChange}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Email"
                fullWidth
                type="email"
                value={confirmEmail}
                onChange={handleConfirmEmailChange}
                error={!!errors.confirmEmail}
                helperText={errors.confirmEmail}
                required
              />
            </Grid>
            {role === "admin" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Number of Sites"
                    fullWidth
                    type="number"
                    value={numberOfSites}
                    onChange={(e) => {
                      const newNumberOfSites = Math.max(1, parseInt(e.target.value, 10));
                      setNumberOfSites(newNumberOfSites);
                      setSites(Array(newNumberOfSites).fill(""));
                    }}
                    required
                  />
                </Grid>
                {sites.map((site, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label={`Site Name ${index + 1}`}
                      fullWidth
                      value={site}
                      onChange={(e) => handleSiteChange(index, e.target.value)}
                      required
                    />
                  </Grid>
                ))}
              </>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Container style={{ marginTop: "20px" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Set Up Multi-Factor Authentication
          </Typography>
          <Typography variant="body1" gutterBottom>
            Scan the QR code below with your Microsoft Authenticator app, then enter the OTP.
          </Typography>
          {qrCode && <img src={qrCode} alt="MFA QR Code" style={{ margin: "20px", width: "200px" }} />}
          <TextField
            label="Enter OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ margin: "20px 0" }}
          />
          <Button variant="contained" color="secondary" onClick={handleVerifyMFA} fullWidth>
            Verify OTP
          </Button>
          {mfaMessage && (
            <Alert severity={mfaMessage === "MFA verified successfully." ? "success" : "error"} style={{ marginTop: "20px" }}>
              {mfaMessage}
            </Alert>
          )}
        </Container>
      )}
    </Container>
  );
};

export default RegistrationPage;
