const express = require('express');
const cors = require('cors');
const registerRouter = require('./routes/register'); // Import the register route
const mfaRoutes = require('./routes/mfa'); // Import the MFA routes
const initialiseDatabase = require('./initialiseDatabase'); // Import the initialiseDatabase function


const app = express();

// Apply CORS middleware
app.use(cors({
  //origin: 'http://localhost:3000',
  origin: 'https://secure-login-uk0e.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Parse incoming JSON requests
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Provider Registration API');
});

// Register the /api/register route
app.use('/api/register', registerRouter);

// Register the /api/mfa route
app.use('/api/mfa', mfaRoutes);

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

  //start server
  const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
