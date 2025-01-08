import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography, Grid, MenuItem, Alert, Divider } from "@mui/material";
import logos from "../assets/logos.png"; // Top-left logo
import "../styles/LoginPage.css"; // Add styles for the page

const BACKEND_URL = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const [providerID, setProviderID] = useState("");
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Fetch sites based on providerID
  useEffect(() => {
    if (providerID) {
      axios
        .post(`${BACKEND_URL}/api/sites`, { provider_id: providerID })
        .then((response) => {
          setSites(response.data.sites || []);
        })
        .catch((error) => {
          console.error("Error fetching sites:", error);
          setSites([]);
        });
    }
  }, [providerID]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      // Validate login and check MFA requirement
      const response = await axios.post(`${BACKEND_URL}/api/login`, {
        provider_id: providerID,
        site: selectedSite,
        email: contactEmail,
      });

      if (response.data.mfa_required) {
        setMfaRequired(true);
      } else {
        alert("Login successful!");
        navigate("/data-entry-start"); // Redirect to dashboard or appropriate page
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Login failed. Please check your details and try again.");
    }
  };

  const handleVerifyMFA = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/mfa/verify`, {
        email: contactEmail,
        otp: otp,
      });

      if (response.data.message === "MFA verified successfully.") {
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setLoginError("Failed to verify MFA. Please try again.");
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      setLoginError("Failed to verify MFA. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
        <Grid item>
          <img src={logos} alt="Logo" style={{ height: "50px" }} />
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: "20px" }} />
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {loginError && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {loginError}
        </Alert>
      )}
      {!mfaRequired ? (
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
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
                select
                label="Select Site"
                fullWidth
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                required
              >
                {sites.map((site) => (
                  <MenuItem key={site.site_name} value={site.site_name}>
                    {site.site_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contact Email"
                fullWidth
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Container style={{ marginTop: "20px" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Multi-Factor Authentication
          </Typography>
          <Typography variant="body1" gutterBottom>
            Enter the OTP sent to your registered email or app.
          </Typography>
          <TextField
            label="Enter OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ margin: "20px 0" }}
            required
          />
          <Button variant="contained" color="secondary" onClick={handleVerifyMFA} fullWidth>
            Verify OTP
          </Button>
        </Container>
      )}
    </Container>
  );
};

export default LoginPage;
