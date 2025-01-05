const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const createClient = require('../config/db');

router.post('/generate', async (req, res) => {
  const { email } = req.body;

  console.log('MFA /generate route hit with payload:', req.body);

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }



  try {
    const secret = speakeasy.generateSecret({ length: 20, name: 'Registration App' });
    const otpauthURL = secret.otpauth_url;
    const qrCodeData = await qrcode.toDataURL(otpauthURL);

    console.log('Generated Secret:', secret.base32);
    console.log('OTP Auth URL:', secret.otpauth_url);
    console.log('Generated QR Code Data:', qrCodeData);


    const client = createClient();
    await client.connect();
    await client.query(
      'INSERT INTO mfa_secrets (email, secret) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET secret = $2',
      [email, secret.base32]
    );
    await client.end();

    res.status(200).json({ qrCode: qrCodeData, secret: secret.base32 });
  } catch (error) {
    console.error('Error generating MFA:', error);
    res.status(500).json({ error: 'Failed to generate MFA. Please try again.' });
  }
});

router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
  
    console.log('MFA /verify route hit with payload:', req.body);
  
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }
  
    try {
      const client = createClient();
      await client.connect();
      const result = await client.query('SELECT secret FROM mfa_secrets WHERE email = $1', [email]);
      await client.end();
  
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'No MFA secret found for this email.' });
      }
  
      const secret = result.rows[0].secret;
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: otp,
      });
  
      if (verified) {
        res.status(200).json({ message: 'MFA verified successfully.' });
      } else {
        res.status(400).json({ error: 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Error verifying MFA:', error);
      res.status(500).json({ error: 'Failed to verify MFA. Please try again.' });
    }
  });
  
module.exports = router;
