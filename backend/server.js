const express = require('express');
const cors = require('cors');
const registerRouter = require('./routes/register'); // Import the register route
const mfaRoutes = require('./routes/mfa'); // Import the MFA routes
const createClient = require('./config/db'); // Import the database client function
const initialiseDatabase = require('./config/initialiseDatabase'); // Import the initialiseDatabase function
const fs = require('fs');
const path = require('path');

// Path to the database schema file
const schemaPath = path.join(__dirname, 'scripts', 'schema.sql');

// Verify schema file exists
console.log('Schema file path exists:', fs.existsSync(schemaPath));

// Create the Express app
const app = express();

// Declare PORT
const PORT = process.env.PORT || 5005;

// Apply CORS middleware
app.use(cors({
  origin: 'https://secure-login-uk0e.onrender.com', // Update this with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Parse incoming JSON requests
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Provider Registration API');
});

// Register the /api/register route
app.use('/api/register', registerRouter);

// Register the /api/mfa route
app.use('/api/mfa', mfaRoutes);

// Define /api/validate-provider route
app.post('/api/validate-provider', async (req, res) => {
  const { provider_name, provider_id } = req.body;

  // Validate input
  if (!provider_name || !provider_id) {
    return res.status(400).json({ valid: false });
  }

  const client = createClient(); // Initialize database client
  await client.connect();

  try {
    const result = await client.query(
      'SELECT 1 FROM providers WHERE provider_name = $1 AND provider_id = $2',
      [provider_name, provider_id]
    );

    res.json({ valid: result.rows.length > 0 }); // Return true if a match is found
  } catch (error) {
    console.error('Error validating provider:', error);
    res.status(500).json({ valid: false });
  } finally {
    await client.end(); // Close the database connection
  }
});

// Initialise the database schema and start the server
initialiseDatabase()
  .then(() => {
    console.log('Database initialised successfully.');

    // Start the server only after the database is initialised
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialise the database:', error);
    process.exit(1); // Exit the process if the database initialisation fails
  });
