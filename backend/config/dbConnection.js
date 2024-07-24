const { Pool } = require("pg");
const dotenv = require("dotenv");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const connectDB = async () => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error("Error acquiring client", err.stack);
    }
    console.log("Connected to PostgreSQL database");
    release();
  });
};

module.exports = { connectDB, pool };
