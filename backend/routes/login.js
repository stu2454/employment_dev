const express = require('express');
const createClient = require('../config/db'); // Import the database client function
const router = express.Router();

router.post('/', async (req, res) => {
  const { provider_id, site, email } = req.body;

  if (!provider_id || !site || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const client = createClient();
  await client.connect();

  try {
    const userResult = await client.query(
      'SELECT * FROM providers WHERE provider_id = $1 AND contact_email = $2',
      [provider_id, email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const mfaRequired = Boolean(userResult.rows[0].mfa_secret);
    res.json({ mfa_required: mfaRequired });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed." });
  } finally {
    await client.end();
  }
});

module.exports = router;
