const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const isTestEnv = process.env.NODE_ENV === "TEST";

const pool = new Pool({
  user: isTestEnv ? process.env.PGUSER_TEST : process.env.PGUSER,
  host: isTestEnv ? process.env.PGHOST_TEST : process.env.PGHOST,
  database: isTestEnv ? process.env.PGDATABASE_TEST : process.env.PGDATABASE,
  password: isTestEnv ? process.env.PGPASSWORD_TEST : process.env.PGPASSWORD,
  port: isTestEnv ? process.env.PGPORT_TEST : process.env.PGPORT,
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
