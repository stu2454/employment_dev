const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file that exports your database pool

router.post('/register', async (req, res) => {
  const { provider_name, provider_id, contact_phone, contact_email, number_of_sites, sites } = req.body;

  console.log('Received payload:', req.body);

  try {
    // Insert into providers table
    const providerInsertResult = await pool.query(
      'INSERT INTO providers (provider_id, provider_name, contact_phone, contact_email, number_of_sites) VALUES ($1, $2, $3, $4, $5) RETURNING provider_id',
      [provider_id, provider_name, contact_phone, contact_email, number_of_sites]
    );

    console.log('Provider insert result:', providerInsertResult);

    // Insert into sites table
    for (let i = 0; i < sites.length; i++) {
      const siteInsertResult = await pool.query(
        'INSERT INTO sites (provider_id, site_name) VALUES ($1, $2)',
        [provider_id, sites[i]]
      );
      console.log(`Site insert result for site ${i + 1}:`, siteInsertResult);
    }

    res.status(200).json({ message: 'Provider registered successfully' });
  } catch (error) {
    console.error('Error registering provider:', error);
    res.status(500).json({ message: 'An error occurred while registering the provider' });
  }
});

module.exports = router;