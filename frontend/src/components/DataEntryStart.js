import React from "react";
import { Container, Grid, Divider } from "@mui/material";
import logos from "../assets/logos.png"; // Top-left logo
import underConstruction from "../assets/under_construction.png"; // Centered image
import "../styles/DataEntryStart.css"; // Add consistent styles

const DataEntryStart = () => {
  return (
    <div className="data-entry-container">
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" className="data-entry-header">
        <Grid item>
          <img src={logos} alt="Logo" className="data-entry-logo" />
        </Grid>
      </Grid>
      <Divider className="data-entry-divider" />
      {/* Main Content */}
      <div className="data-entry-content">
      <img src={underConstruction} alt="Under Construction" loading="lazy" className="data-entry-image" />

      </div>
    </div>
  );
};

export default DataEntryStart;
