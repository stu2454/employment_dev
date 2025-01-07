const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Initialises the database schema by executing the schema.sql file.
 */
const initialiseDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../scripts/schema.sql'); // Adjust path if needed
    const schema = fs.readFileSync(schemaPath, 'utf-8'); // Read the SQL file
    await pool.query(schema); // Execute the SQL script
    console.log('Database schema initialised successfully');
  } catch (error) {
    console.error('Error initialising database schema:', error);
    throw error; // Re-throw the error to handle it in server.js
  }
};

module.exports = initialiseDatabase;
