const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Use DATABASE_URL if available (for production on Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Use SSL for Render PostgreSQL
});

/**
 * Initialises the database schema by executing the schema.sql file.
 */
const initialiseDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../scripts/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('Database schema initialised successfully');
  } catch (error) {
    console.error('Error initialising database schema:', error);
    throw error;
  }
};

module.exports = initialiseDatabase;
