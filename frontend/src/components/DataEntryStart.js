import React from "react";
import { Container, Grid, Divider, Typography } from "@mui/material";
import logos from "../assets/logos.png"; // Top-left logo
import underConstruction from "../assets/under_construction.png"; // Image for the center of the page
import "../styles/DataEntryStart.css"; // Add a consistent style

const DataEntryStart = () => {
  return (
    <Container maxWidth="sm" className="data-entry-container">
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" style={{ marginBottom: "20px" }}>
        <Grid item>
          <img src={logos} alt="Logo" style={{ height: "50px" }} />
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: "20px" }} />
      <Typography variant="h4" component="h1" gutterBottom>
        Data Entry Coming Soon
      </Typography>
      {/* Main Content */}
      <div className="data-entry-image-container">
        <img src={underConstruction} alt="Under Construction" className="data-entry-image" />
      </div>
    </Container>
  );
};

export default DataEntryStart;
