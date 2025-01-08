const express = require('express');
const router = express.Router();
const createClient = require('../config/db'); // Import the createClient function

router.post('/', async (req, res) => {
  const { provider_name, provider_id, contact_phone, contact_email, number_of_sites, sites, role } = req.body;

  console.log('Received payload:', req.body);

  // Validate input
  if (
    !provider_name ||
    !provider_id ||
    !contact_phone ||
    !contact_email ||
    !role || // Validate role
    (role === "admin" && (!number_of_sites || !sites || sites.length !== number_of_sites))
  ) {
    console.error("Invalid input:", req.body);
    return res.status(400).json({ error: "Invalid input. Please check the fields." });
  }

  const client = createClient();
  await client.connect();

  try {
    let effective_number_of_sites = number_of_sites;

    // For staff, fetch the number_of_sites from the admin's record
    if (role === 'staff') {
      const adminResult = await client.query(
        "SELECT number_of_sites FROM providers WHERE provider_name = $1 AND provider_id = $2 AND role = 'admin'",
        [provider_name, provider_id]
      );

      if (adminResult.rows.length === 0) {
        console.error("Administrator not found for provider:", provider_name, provider_id);
        return res.status(400).json({ error: "Administrator account not found for the provided provider." });
      }

      effective_number_of_sites = adminResult.rows[0].number_of_sites;
    }

    // Check if contact_email already exists
    const checkEmailResult = await client.query(
      "SELECT contact_email FROM providers WHERE contact_email = $1 AND provider_id = $2",
      [contact_email, provider_id]
    );

    if (checkEmailResult.rows.length > 0) {
      console.log("Email already registered:", contact_email);
      return res.status(400).json({ error: "Email already registered. Please log in." });
    }

    // Insert provider details into the 'providers' table
    await client.query(
      "INSERT INTO providers (provider_name, provider_id, contact_phone, contact_email, number_of_sites, role) VALUES ($1, $2, $3, $4, $5, $6)",
      [provider_name, provider_id, contact_phone, contact_email, effective_number_of_sites || 0, role]
    );

    console.log("Inserted provider with email:", contact_email);

    // Insert site details into the 'sites' table (only for admins)
    if (role === "admin") {
      for (const site_name of sites) {
        await client.query(
          "INSERT INTO sites (provider_id, contact_email, site_name) VALUES ($1, $2, $3)",
          [provider_id, contact_email, site_name]
        );
        console.log("Inserted site:", site_name);
      }
    }

    res.status(201).json({ message: "Provider registered successfully!" });
  } catch (err) {
    console.error("Error while registering provider:", err);
    res.status(500).json({ error: "An error occurred while registering the provider." });
  } finally {
    await client.end();
  }
});

module.exports = router;
