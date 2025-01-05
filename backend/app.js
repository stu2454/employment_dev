const express = require('express');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
app.use(bodyParser.json());

// Route setup
app.use('/register', registerRoute);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
