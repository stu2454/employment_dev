const express = require('express');
const createClient = require('../config/db'); // Import the database client function
const router = express.Router();

router.post('/', async (req, res) => {
  const { provider_id } = req.body;

  if (!provider_id) {
    return res.status(400).json({ error: "Provider ID is required." });
  }

  const client = createClient();
  await client.connect();

  try {
    const result = await client.query(
      'SELECT site_name FROM sites WHERE provider_id = $1',
      [provider_id]
    );

    res.json({ sites: result.rows });
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: "Failed to fetch sites." });
  } finally {
    await client.end();
  }
});

module.exports = router;
