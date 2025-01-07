//const { reject } = require('bcrypt/promises');
const { Client } = require('pg');

const createClient = () => {

  const connectionString = process.env.DATABASE_URL;

  //return new Client({
    //user: process.env.DB_USER,
    //host: process.env.DB_HOST,
    //database: process.env.DB_NAME,
    //password: process.env.DB_PASSWORD,
    //port: process.env.DB_PORT,
  //});
 return new Client({
  connectionString: connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false, //Use SSL for Render
});
};

module.exports = createClient;
