import React from "react";
import logos from "../assets/logos.png"; // Top-left logo
import landingImage from "../assets/landing_image.png"; // Central image
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
        {/* Left: Logos */}
        <img src={logos} alt="Australian Government and NDIS Logos" style={{ height: "60px" }} />

        {/* Right: Action Buttons */}
        <div>
          <Link to="/login">
            <button style={{ margin: "0 10px", padding: "10px 20px", border: "2px solid #000", background: "white", borderRadius: "5px", cursor: "pointer" }}>
              Login
            </button>
          </Link>
          <Link to="/role-selection">
            <button style={{ margin: "0 10px", padding: "10px 20px", border: "none", background: "#4CAF50", color: "white", borderRadius: "5px", cursor: "pointer" }}>
              Register
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ textAlign: "center", padding: "50px" }}>
        {/* Title */}
        <h1 style={{ marginBottom: "30px", fontSize: "2em" }}>Disability Employment Outcomes Reporting</h1>

        {/* Central Image */}
        <img src={landingImage} alt="Central Illustration" style={{ width: "80%", maxWidth: "600px", borderRadius: "10px" }} />
      </div>
    </div>
  );
};

export default LandingPage;
